"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

interface HistoryEntry {
  status: string;
  label: string;
  at: string;
}

interface OrderStatus {
  id: number;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "failed" | "cancelled";
  status_history: HistoryEntry[];
  tracking_number: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  shipping_name: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_province: string | null;
  shipping_postal_code: string | null;
  created_at: string;
}

function itemLabel(item: OrderItem) {
  const product = findAnyProduct(item.product_slug)?.product;
  const name = product?.name ?? item.product_slug;
  return `${item.quantity} x ${name}${item.size ? ` — Talle ${item.size}` : ""}`;
}

function SeguimientoContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("pedido");
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("Falta el código de pedido en el link.");
      setLoading(false);
      return;
    }
    supabase.functions.invoke("get-order-status", { body: { token } }).then(({ data, error: fnError }) => {
      if (fnError || data?.error) {
        setError(data?.error ?? "No pudimos encontrar tu pedido.");
      } else {
        setOrder(data.order);
      }
      setLoading(false);
    });
  }, [token]);

  if (loading) return <p className="text-center text-bora-text-body">Cargando…</p>;
  if (error || !order) {
    return <p className="text-center text-bora-text-body">{error ?? "Pedido no encontrado."}</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-bora-text-dark md:text-[32px]">
        Pedido #{order.id}
      </h1>

      <div className="mb-6 rounded border border-bora-border p-5">
        <h2 className="mb-3 text-sm font-bold tracking-wide text-bora-text-dark uppercase">
          Estado
        </h2>
        <div className="flex flex-col gap-2">
          {order.status_history.map((entry, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="font-semibold text-bora-text-dark">{entry.label}</span>
              <span className="text-xs text-bora-text-body">
                {new Date(entry.at).toLocaleString("es-AR")}
              </span>
            </div>
          ))}
        </div>
        {order.tracking_number && (
          <p className="mt-4 text-sm font-bold text-[#25d366]">
            Número de seguimiento (Correo Argentino): {order.tracking_number}
          </p>
        )}
      </div>

      <div className="mb-6 rounded border border-bora-border p-5">
        <h2 className="mb-3 text-sm font-bold tracking-wide text-bora-text-dark uppercase">
          Productos
        </h2>
        {order.items.map((item, i) => (
          <div key={i} className="text-sm text-bora-text-dark">
            {itemLabel(item)}
          </div>
        ))}
        <div className="mt-2 font-bold text-bora-text-dark">Total: {formatARS(order.total)}</div>
      </div>

      <div className="rounded border border-bora-border p-5">
        <h2 className="mb-3 text-sm font-bold tracking-wide text-bora-text-dark uppercase">
          Envío a
        </h2>
        <p className="text-sm text-bora-text-dark">{order.shipping_name}</p>
        <p className="text-sm text-bora-text-body">
          {order.shipping_address}, {order.shipping_city}, {order.shipping_province} (CP{" "}
          {order.shipping_postal_code})
        </p>
      </div>
    </div>
  );
}

export default function SeguimientoPage() {
  return (
    <>
      <Header />
      <section className="mx-auto max-w-[600px] px-5 py-12 md:py-16">
        <Suspense fallback={<p className="text-center text-bora-text-body">Cargando…</p>}>
          <SeguimientoContent />
        </Suspense>
      </section>
      <Footer />
    </>
  );
}
