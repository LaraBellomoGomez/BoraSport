import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contacto — Bora Sports",
};

export default function ContactoPage() {
  return (
    <>
      <Header />

      <section className="mx-auto max-w-[900px] px-5 py-16 text-center md:py-24">
        <div className="mb-4 text-xs font-medium tracking-[0.12em] text-bora-bronze uppercase">
          Contacto
        </div>
        <h1 className="mb-5 text-3xl leading-[1.1] font-extrabold tracking-tight text-bora-text-dark md:text-[38px]">
          Hablemos
        </h1>
        <p className="mx-auto mb-10 max-w-[560px] text-base leading-relaxed text-bora-text-body">
          ¿Tenés dudas sobre un producto, un pedido o querés conocer más
          sobre Bora Sports? Escribinos, te respondemos a la brevedad.
        </p>

        <div className="mx-auto mb-12 grid max-w-[640px] grid-cols-1 gap-5 sm:grid-cols-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-2.5 rounded-lg border border-neutral-200 px-5 py-8 transition-colors hover:border-neutral-300"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp text-lg font-bold text-white">
              W
            </span>
            <span className="text-sm font-bold text-bora-text-dark">WhatsApp</span>
            <span className="text-[13px] text-neutral-500">011 3899 0252</span>
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="flex flex-col items-center gap-2.5 rounded-lg border border-neutral-200 px-5 py-8 transition-colors hover:border-neutral-300"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bora-bronze text-base font-bold text-bora-dark">
              @
            </span>
            <span className="text-sm font-bold text-bora-text-dark">Email</span>
            <span className="text-[13px] text-neutral-500">{EMAIL}</span>
          </a>
        </div>

        <div className="flex justify-center gap-8 text-[13px] text-neutral-500">
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-bora-bronze">
            Instagram: {INSTAGRAM_HANDLE}
          </a>
          <span>Ubicación: próximamente</span>
        </div>
      </section>

      <Footer />
    </>
  );
}
