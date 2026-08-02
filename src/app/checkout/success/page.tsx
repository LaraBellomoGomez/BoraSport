"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <section className="mx-auto max-w-[520px] px-5 py-16 text-center md:py-24">
        <CheckCircle2 size={56} className="mx-auto mb-5 text-green-600" />
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-bora-text-dark">
          ¡Gracias por tu compra!
        </h1>
        <p className="mb-8 text-bora-text-body">
          Tu pago fue aprobado. En unos minutos vas a ver tu pedido confirmado
          y tu carrito se vacía automáticamente.
        </p>
        <Link
          href="/"
          className="inline-block bg-bora-dark px-7 py-3.5 text-[13px] font-bold tracking-wider text-white uppercase"
        >
          Volver al inicio
        </Link>
      </section>
      <Footer />
    </>
  );
}
