import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const CONTACT_EMAIL = Deno.env.get("CONTACT_EMAIL") ?? "borasportsinfo@gmail.com";
const FROM_ADDRESS = "Bora Sports <onboarding@resend.dev>";
// TODO: switch to the custom domain once www.borasports.com.ar is repointed
// away from the old Tiendanube store.
const SITE_URL = "https://larabellomogomez.github.io/BoraSport";

const STATUS_MAP: Record<string, string> = {
  approved: "paid",
  rejected: "failed",
  cancelled: "cancelled",
  refunded: "cancelled",
  pending: "pending",
  in_process: "pending",
};

const STATUS_LABEL: Record<string, string> = {
  paid: "Pago recibido",
  failed: "Pago rechazado",
  cancelled: "Pedido cancelado",
  pending: "Pago pendiente",
};

interface OrderItem {
  product_slug: string;
  size: string | null;
  quantity: number;
}

interface OrderRow {
  id: number;
  user_id: string;
  items: OrderItem[];
  total: number;
  status_history: Array<{ status: string; label: string; at: string }>;
  access_token: string;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_province: string | null;
  shipping_postal_code: string | null;
}

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

    const { data: existing } = await admin
      .from("orders")
      .select("status_history")
      .eq("id", orderId)
      .single<{ status_history: OrderRow["status_history"] }>();

    const history = existing?.status_history ?? [];
    const updatedHistory = [
      ...history,
      { status, label: STATUS_LABEL[status] ?? status, at: new Date().toISOString() },
    ];

    const { data: order } = await admin
      .from("orders")
      .update({ status, mp_payment_id: String(payment.id), status_history: updatedHistory })
      .eq("id", orderId)
      .select(
        "id, user_id, items, total, status_history, access_token, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_province, shipping_postal_code"
      )
      .single<OrderRow>();

    if (status === "paid" && order) {
      await admin.from("cart_items").delete().eq("user_id", order.user_id);
      await sendOrderEmails(admin, order).catch((err) =>
        console.error("Failed to send order emails:", err)
      );
    }

    return new Response("ok", { status: 200 });
  } catch {
    // Mercado Pago retries on non-2xx, but we don't want to leak internals.
    return new Response("ok", { status: 200 });
  }
});

async function sendOrderEmails(
  admin: ReturnType<typeof createClient>,
  order: OrderRow
) {
  const { data: userData } = await admin.auth.admin.getUserById(order.user_id);
  const buyerEmail = userData?.user?.email ?? null;

  // Product names aren't stored on the order row (only slug/size/qty), so
  // pull the current catalog to render readable item lines. If a product
  // was since removed, fall back to the slug itself.
  const { PRICES } = await import("../_shared/prices.ts");

  const itemLines = order.items
    .map((item) => {
      const product = PRICES[item.product_slug];
      const name = product?.name ?? item.product_slug;
      const sizeLabel = item.size ? ` — Talle ${item.size}` : "";
      return `<li>${item.quantity} x ${escapeHtml(name)}${escapeHtml(sizeLabel)}</li>`;
    })
    .join("");

  const shippingBlock = `
    <p><strong>Nombre:</strong> ${escapeHtml(order.shipping_name ?? "-")}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(order.shipping_phone ?? "-")}</p>
    <p><strong>Dirección:</strong> ${escapeHtml(order.shipping_address ?? "-")}</p>
    <p><strong>Localidad:</strong> ${escapeHtml(order.shipping_city ?? "-")}, ${escapeHtml(order.shipping_province ?? "-")}</p>
    <p><strong>Código postal:</strong> ${escapeHtml(order.shipping_postal_code ?? "-")}</p>
  `;

  const totalLabel = formatARS(order.total);
  const trackingPageUrl = `${SITE_URL}/seguimiento?pedido=${order.access_token}`;

  // Email to the buyer — confirms the order, no tracking number yet (that
  // goes out separately from /pedidos once the package is dispatched).
  if (buyerEmail) {
    await sendEmail({
      to: buyerEmail,
      subject: `Confirmamos tu pedido #${order.id} — Bora Sports`,
      html: `
        <p>¡Gracias por tu compra!</p>
        <p>Confirmamos tu pedido <strong>#${order.id}</strong> por un total de <strong>${totalLabel}</strong>.</p>
        <p><strong>Productos:</strong></p>
        <ul>${itemLines}</ul>
        <p><strong>Enviamos a:</strong></p>
        ${shippingBlock}
        <p>Te vamos a mandar otro mail con el número de seguimiento de Correo Argentino apenas despachemos tu pedido.</p>
        <p>Podés seguir el estado de tu pedido en cualquier momento acá: <a href="${trackingPageUrl}">${trackingPageUrl}</a></p>
        <p>Cualquier consulta, escribinos por WhatsApp.</p>
      `,
    });
  }

  // Email to the business — full order detail so it can be prepared/shipped.
  await sendEmail({
    to: CONTACT_EMAIL,
    subject: `Nuevo pedido pago #${order.id}`,
    html: `
      <p>Nuevo pedido pago por <strong>${totalLabel}</strong>.</p>
      <p><strong>Comprador:</strong> ${escapeHtml(buyerEmail ?? "sin email")}</p>
      <p><strong>Productos:</strong></p>
      <ul>${itemLines}</ul>
      <p><strong>Enviar a:</strong></p>
      ${shippingBlock}
      <p>Cuando despaches el pedido, cargá el número de seguimiento en la sección "Pedidos" del sitio para avisarle al comprador.</p>
    `,
  });
}

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    console.error("Resend rejected an order email:", res.status, data);
  }
}

function formatARS(value: number): string {
  return `$${value.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
