import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_ADDRESS = "Bora Sports <onboarding@resend.dev>";
const TRACKING_URL = "https://www.correoargentino.com.ar/seguimiento";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { password, orderId, trackingNumber } = await req.json();
    if (!password || password !== ADMIN_PASSWORD) {
      return json({ error: "Contraseña incorrecta" }, 401);
    }
    if (!orderId || !trackingNumber || !String(trackingNumber).trim()) {
      return json({ error: "Faltan datos" }, 400);
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: existing } = await admin
      .from("orders")
      .select("status_history")
      .eq("id", orderId)
      .single<{ status_history: Array<{ status: string; label: string; at: string }> }>();

    const updatedHistory = [
      ...(existing?.status_history ?? []),
      { status: "shipped", label: "Pedido despachado", at: new Date().toISOString() },
    ];

    const { data: order, error } = await admin
      .from("orders")
      .update({
        tracking_number: trackingNumber,
        shipped_at: new Date().toISOString(),
        status_history: updatedHistory,
      })
      .eq("id", orderId)
      .select("id, user_id")
      .single();

    if (error) throw error;

    const { data: userData } = await admin.auth.admin.getUserById(order.user_id);
    const buyerEmail = userData?.user?.email;

    if (buyerEmail) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_ADDRESS,
          to: [buyerEmail],
          subject: `Tu pedido #${order.id} ya fue despachado`,
          html: `
            <p>¡Tu pedido #${order.id} ya está en camino!</p>
            <p>Lo enviamos por Correo Argentino con el siguiente número de seguimiento:</p>
            <p style="font-size:18px;font-weight:bold;">${escapeHtml(String(trackingNumber))}</p>
            <p>Podés rastrearlo en <a href="${TRACKING_URL}">${TRACKING_URL}</a> ingresando ese número.</p>
            <p>Cualquier consulta, escribinos por WhatsApp.</p>
          `,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        console.error("Resend rejected the shipping email:", res.status, data);
      }
    }

    return json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    console.error("set-tracking error:", err);
    return json({ error: message }, 500);
  }
});

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
