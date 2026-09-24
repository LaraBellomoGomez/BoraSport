import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();
    if (!token) {
      return json({ error: "Falta el código de pedido" }, 400);
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: order, error } = await admin
      .from("orders")
      .select(
        "id, items, total, status, status_history, tracking_number, shipped_at, delivered_at, shipping_name, shipping_address, shipping_city, shipping_province, shipping_postal_code, created_at"
      )
      .eq("access_token", token)
      .single();

    if (error || !order) {
      return json({ error: "No encontramos ese pedido" }, 404);
    }

    return json({ order });
  } catch (err) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    console.error("get-order-status error:", err);
    return json({ error: message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
