import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { password } = await req.json();
    if (!password || password !== ADMIN_PASSWORD) {
      return json({ error: "Contraseña incorrecta" }, 401);
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: orders, error } = await admin
      .from("orders")
      .select(
        "id, items, total, status, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_province, shipping_postal_code, tracking_number, shipped_at, created_at, user_id"
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Attach the buyer's email (not stored on the order row itself).
    const ordersWithEmail = await Promise.all(
      (orders ?? []).map(async (order) => {
        const { data: userData } = await admin.auth.admin.getUserById(order.user_id);
        return { ...order, buyer_email: userData?.user?.email ?? null };
      })
    );

    return json({ orders: ordersWithEmail });
  } catch (err) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    console.error("list-orders error:", err);
    return json({ error: message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
