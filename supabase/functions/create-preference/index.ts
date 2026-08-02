import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { PRICES } from "../_shared/prices.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN")!;
const FALLBACK_SITE_URL = "https://www.borasports.com.ar";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "No autenticado" }, 401);
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
    } = await userClient.auth.getUser();

    if (!user) {
      return json({ error: "No autenticado" }, 401);
    }

    const { data: cartItems, error: cartError } = await userClient
      .from("cart_items")
      .select("product_slug, size, quantity")
      .eq("user_id", user.id);

    if (cartError) throw cartError;
    if (!cartItems || cartItems.length === 0) {
      return json({ error: "El carrito está vacío" }, 400);
    }

    const items = cartItems.map((row) => {
      const product = PRICES[row.product_slug];
      if (!product) {
        throw new Error(`Producto desconocido: ${row.product_slug}`);
      }
      return {
        title: row.size ? `${product.name} (Talle ${row.size})` : product.name,
        quantity: row.quantity,
        unit_price: product.price,
        currency_id: "ARS",
      };
    });

    const total = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: order, error: orderError } = await adminClient
      .from("orders")
      .insert({
        user_id: user.id,
        items: cartItems,
        total,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError) throw orderError;

    const siteUrl = req.headers.get("origin") || FALLBACK_SITE_URL;

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
        external_reference: String(order.id),
        back_urls: {
          success: `${siteUrl}/checkout/success`,
          failure: `${siteUrl}/checkout/failure`,
          pending: `${siteUrl}/checkout/pending`,
        },
        auto_return: "approved",
        notification_url: `${SUPABASE_URL}/functions/v1/mp-webhook`,
      }),
    });

    const preference = await mpResponse.json();

    if (!mpResponse.ok) {
      await adminClient.from("orders").update({ status: "failed" }).eq("id", order.id);
      return json({ error: "No se pudo crear la preferencia de pago", detail: preference }, 502);
    }

    await adminClient
      .from("orders")
      .update({ mp_preference_id: preference.id })
      .eq("id", order.id);

    // Prefer sandbox_init_point since we're using TEST credentials — it's
    // only populated when the preference was created with a test token.
    return json({
      init_point: preference.sandbox_init_point ?? preference.init_point,
    });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : (err as { message?: string })?.message ?? JSON.stringify(err);
    console.error("create-preference error:", err);
    return json({ error: message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
