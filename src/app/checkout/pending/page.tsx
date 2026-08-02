"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CheckoutPendingPage() {
  return (
    <>
      <Header />
      <section className="mx-auto max-w-[520px] px-5 py-16 text-center md:py-24">
        <Clock size={56} className="mx-auto mb-5 text-bora-bronze" />
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-bora-text-dark">
          Tu pago está siendo procesado
        </h1>
        <p className="mb-8 text-bora-text-body">
          Algunos medios de pago tardan un poco en confirmarse. Te avisamos
          apenas se acredite — no hace falta que hagas nada más.
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
