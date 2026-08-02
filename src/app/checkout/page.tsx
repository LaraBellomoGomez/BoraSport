"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { formatARS } from "@/lib/format";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { lines, subtotal, loading: cartLoading } = useCart();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  async function handlePay() {
    setError(null);
    setPaying(true);

    const { data, error: fnError } = await supabase.functions.invoke("create-preference");

    if (fnError || !data?.init_point) {
      setPaying(false);
      let detail: string | null = null;
      const context = (fnError as { context?: Response })?.context;
      if (context) {
        try {
          const body = await context.clone().json();
          detail = body?.error ?? null;
        } catch {
          // response wasn't JSON — fall through to generic message
        }
      }
      setError(
        detail ?? data?.error ?? "No se pudo iniciar el pago. Probá de nuevo en un momento."
      );
      return;
    }

    window.location.href = data.init_point;
  }

  if (authLoading || !user) return null;

  return (
    <>
      <Header />
      <section className="mx-auto max-w-[600px] px-5 py-16 text-center md:py-24">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-bora-text-dark">
          Finalizar compra
        </h1>

        {cartLoading ? (
          <p className="text-bora-text-body">Cargando…</p>
        ) : lines.length === 0 ? (
          <>
            <p className="mb-8 text-bora-text-body">Tu carrito está vacío.</p>
            <Link
              href="/verano-2026"
              className="inline-block bg-bora-dark px-7 py-3.5 text-[13px] font-bold tracking-wider text-white uppercase"
            >
              Ver colección
            </Link>
          </>
        ) : (
          <>
            <p className="mb-8 text-bora-text-body">
              {lines.length} {lines.length === 1 ? "producto" : "productos"} por{" "}
              <strong className="text-bora-text-dark">{formatARS(subtotal)}</strong>
            </p>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="mb-4 inline-block w-full bg-bora-dark py-4 text-[13px] font-bold tracking-wider text-white uppercase disabled:opacity-60"
            >
              {paying ? "Redirigiendo…" : "Pagar con Mercado Pago"}
            </button>

            <Link
              href="/carrito"
              className="inline-block text-sm text-bora-text-body hover:text-bora-bronze"
            >
              Volver al carrito
            </Link>
          </>
        )}
      </section>
      <Footer />
    </>
  );
}
