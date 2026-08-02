import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN")!;

const STATUS_MAP: Record<string, string> = {
  approved: "paid",
  rejected: "failed",
  cancelled: "cancelled",
  refunded: "cancelled",
  pending: "pending",
  in_process: "pending",
};

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const paymentId =
      url.searchParams.get("data.id") ?? url.searchParams.get("id");
    const type = url.searchParams.get("type") ?? url.searchParams.get("topic");

    if (type !== "payment" || !paymentId) {
      // Mercado Pago also pings with other topics (merchant_order, etc.) —
      // acknowledge and ignore anything that isn't a payment update.
      return new Response("ok", { status: 200 });
    }

    const paymentRes = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      { headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` } }
    );
    if (!paymentRes.ok) return new Response("ok", { status: 200 });

    const payment = await paymentRes.json();
    const orderId = payment.external_reference;
    const mpStatus = payment.status as string;
    const status = STATUS_MAP[mpStatus] ?? "pending";

    if (!orderId) return new Response("ok", { status: 200 });

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: order } = await admin
      .from("orders")
      .update({ status, mp_payment_id: String(payment.id) })
      .eq("id", orderId)
      .select("user_id")
      .single();

    if (status === "paid" && order?.user_id) {
      await admin.from("cart_items").delete().eq("user_id", order.user_id);
    }

    return new Response("ok", { status: 200 });
  } catch {
    // Mercado Pago retries on non-2xx, but we don't want to leak internals.
    return new Response("ok", { status: 200 });
  }
});
