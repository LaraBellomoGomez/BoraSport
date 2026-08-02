"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CheckoutFailurePage() {
  return (
    <>
      <Header />
      <section className="mx-auto max-w-[520px] px-5 py-16 text-center md:py-24">
        <XCircle size={56} className="mx-auto mb-5 text-red-600" />
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-bora-text-dark">
          El pago no se pudo completar
        </h1>
        <p className="mb-8 text-bora-text-body">
          Algo falló al procesar tu pago. No se te realizó ningún cargo. Podés
          volver al carrito e intentarlo de nuevo.
        </p>
        <Link
          href="/carrito"
          className="inline-block bg-bora-dark px-7 py-3.5 text-[13px] font-bold tracking-wider text-white uppercase"
        >
          Volver al carrito
        </Link>
      </section>
      <Footer />
    </>
  );
}
