"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { formatARS } from "@/lib/format";
import { findAnyProduct } from "@/lib/products";

interface OrderItem {
  product_slug: string;
  size: string | null;
  quantity: number;
}

interface Order {
  id: number;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "failed" | "cancelled";
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_province: string | null;
  shipping_postal_code: string | null;
  tracking_number: string | null;
  shipped_at: string | null;
  created_at: string;
  buyer_email: string | null;
}

const STORAGE_KEY = "bora_admin_password";

const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "Pendiente",
  paid: "Pagado",
  failed: "Rechazado",
  cancelled: "Cancelado",
};

const STATUS_COLOR: Record<Order["status"], string> = {
  pending: "#a3811f",
  paid: "#25d366",
  failed: "#e0455c",
  cancelled: "#6b6b6b",
};

function itemLabel(item: OrderItem) {
  const product = findAnyProduct(item.product_slug)?.product;
  const name = product?.name ?? item.product_slug;
  return `${item.quantity} x ${name}${item.size ? ` — Talle ${item.size}` : ""}`;
}

export default function PedidosPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [filter, setFilter] = useState<"pendientes" | "todos">("pendientes");
  const [trackingInputs, setTrackingInputs] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setPassword(saved);
      void loadOrders(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadOrders(pwd: string) {
    setChecking(true);
    setAuthError(null);
    const { data, error } = await supabase.functions.invoke("list-orders", {
      body: { password: pwd },
    });

    if (error || data?.error) {
      setChecking(false);
      setAuthError(data?.error ?? "No se pudo verificar la contraseña.");
      return;
    }

    sessionStorage.setItem(STORAGE_KEY, pwd);
    setOrders(data.orders);
    setAuthed(true);
    setChecking(false);
  }

  async function handleSetTracking(orderId: number) {
    const trackingNumber = trackingInputs[orderId]?.trim();
    if (!trackingNumber) return;

    setSavingId(orderId);
    setSaveError(null);
    const { data, error } = await supabase.functions.invoke("set-tracking", {
      body: { password, orderId, trackingNumber },
    });

    if (error || data?.error) {
      setSaveError(data?.error ?? "No se pudo guardar el número de seguimiento.");
      setSavingId(null);
      return;
    }

    setOrders(
      (prev) =>
        prev?.map((o) =>
          o.id === orderId
            ? { ...o, tracking_number: trackingNumber, shipped_at: new Date().toISOString() }
            : o
        ) ?? null
    );
    setSavingId(null);
  }

  if (!authed) {
    return (
      <>
        <Header />
        <section className="mx-auto max-w-[400px] px-5 py-16 md:py-24">
          <h1 className="mb-6 text-center text-2xl font-extrabold tracking-tight text-bora-text-dark">
            Pedidos
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void loadOrders(password);
            }}
            className="flex flex-col gap-3"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="rounded border border-bora-border px-3 py-2.5 text-sm text-bora-text-dark"
            />
            {authError && <p className="text-xs text-red-600">{authError}</p>}
            <button
              type="submit"
              disabled={checking || !password}
              className="rounded bg-bora-dark py-3 text-xs font-bold tracking-wide text-white uppercase disabled:opacity-60"
            >
              {checking ? "Verificando…" : "Ingresar"}
            </button>
          </form>
        </section>
        <Footer />
      </>
    );
  }

  const visibleOrders =
    orders?.filter((o) => (filter === "pendientes" ? o.status === "paid" && !o.tracking_number : true)) ?? [];

  return (
    <>
      <Header />
      <section className="mx-auto max-w-[900px] px-5 py-12 md:py-16">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-bora-text-dark md:text-[32px]">
          Pedidos
        </h1>

        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => setFilter("pendientes")}
            className={`rounded px-4 py-2 text-xs font-bold tracking-wide uppercase ${
              filter === "pendientes" ? "bg-bora-dark text-white" : "border border-bora-border text-bora-text-dark"
            }`}
          >
            Pagados sin enviar
          </button>
          <button
            type="button"
            onClick={() => setFilter("todos")}
            className={`rounded px-4 py-2 text-xs font-bold tracking-wide uppercase ${
              filter === "todos" ? "bg-bora-dark text-white" : "border border-bora-border text-bora-text-dark"
            }`}
          >
            Todos
          </button>
        </div>

        {visibleOrders.length === 0 ? (
          <p className="text-bora-text-body">No hay pedidos para mostrar.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {visibleOrders.map((order) => (
              <div key={order.id} className="rounded border border-bora-border p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-bold text-bora-text-dark">
                    Pedido #{order.id} —{" "}
                    <span style={{ color: STATUS_COLOR[order.status] }}>
                      {STATUS_LABEL[order.status]}
                    </span>
                  </div>
                  <div className="text-xs text-bora-text-body">
                    {new Date(order.created_at).toLocaleString("es-AR")}
                  </div>
                </div>

                <div className="mb-3 text-sm text-bora-text-dark">
                  {order.items.map((item, i) => (
                    <div key={i}>{itemLabel(item)}</div>
                  ))}
                  <div className="mt-1 font-bold">Total: {formatARS(order.total)}</div>
                </div>

                <div className="mb-3 text-xs text-bora-text-body">
                  <div>
                    <strong className="text-bora-text-dark">Comprador:</strong>{" "}
                    {order.buyer_email ?? "-"}
                  </div>
                  <div>
                    <strong className="text-bora-text-dark">Envío a:</strong>{" "}
                    {order.shipping_name} — {order.shipping_phone}
                  </div>
                  <div>
                    {order.shipping_address}, {order.shipping_city}, {order.shipping_province}{" "}
                    (CP {order.shipping_postal_code})
                  </div>
                </div>

                {order.status === "paid" &&
                  (order.tracking_number ? (
                    <p className="text-sm font-bold text-[#25d366]">
                      Enviado — seguimiento: {order.tracking_number}
                    </p>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        value={trackingInputs[order.id] ?? ""}
                        onChange={(e) =>
                          setTrackingInputs((prev) => ({ ...prev, [order.id]: e.target.value }))
                        }
                        placeholder="Número de seguimiento"
                        className="rounded border border-bora-border px-3 py-2 text-sm text-bora-text-dark"
                      />
                      <button
                        type="button"
                        onClick={() => handleSetTracking(order.id)}
                        disabled={savingId === order.id || !trackingInputs[order.id]?.trim()}
                        className="rounded bg-bora-dark px-4 py-2 text-xs font-bold tracking-wide text-white uppercase disabled:opacity-60"
                      >
                        {savingId === order.id ? "Guardando…" : "Marcar como enviado"}
                      </button>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}
        {saveError && <p className="mt-4 text-sm text-red-600">{saveError}</p>}
      </section>
      <Footer />
    </>
  );
}
