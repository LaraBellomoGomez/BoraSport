"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { formatARS } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { lines, subtotal } = useCart();

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) return null;

  return (
    <>
      <Header />
      <section className="mx-auto max-w-[600px] px-5 py-16 text-center md:py-24">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-bora-text-dark">
          Finalizar compra
        </h1>
        <p className="mb-8 text-bora-text-body">
          El pago con Mercado Pago está en camino — todavía no está conectado.
          Por ahora podés revisar tu pedido: {lines.length}{" "}
          {lines.length === 1 ? "producto" : "productos"} por{" "}
          <strong>{formatARS(subtotal)}</strong>.
        </p>
        <Link
          href="/carrito"
          className="inline-block border border-bora-text-dark px-7 py-3.5 text-[13px] font-bold tracking-wider text-bora-text-dark uppercase"
        >
          Volver al carrito
        </Link>
      </section>
      <Footer />
    </>
  );
}
