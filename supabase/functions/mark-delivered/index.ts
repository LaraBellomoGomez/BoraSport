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
    const { password, orderId } = await req.json();
    if (!password || password !== ADMIN_PASSWORD) {
      return json({ error: "Contraseña incorrecta" }, 401);
    }
    if (!orderId) {
      return json({ error: "Falta el pedido" }, 400);
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: existing } = await admin
      .from("orders")
      .select("status_history")
      .eq("id", orderId)
      .single<{ status_history: Array<{ status: string; label: string; at: string }> }>();

    const updatedHistory = [
      ...(existing?.status_history ?? []),
      { status: "delivered", label: "Pedido entregado", at: new Date().toISOString() },
    ];

    const { error } = await admin
      .from("orders")
      .update({ delivered_at: new Date().toISOString(), status_history: updatedHistory })
      .eq("id", orderId);

    if (error) throw error;

    return json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    console.error("mark-delivered error:", err);
    return json({ error: message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
