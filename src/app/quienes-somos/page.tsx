import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WHATSAPP_URL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Quiénes Somos — Bora Sports",
};

export default function QuienesSomosPage() {
  return (
    <>
      <Header />

      <section className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:px-10 md:py-24">
        <div className="relative w-full overflow-hidden rounded-md pt-[100%]">
          <Image
            src="/assets/duo-modelos-2.jpg"
            alt="Foto de marca: equipo Bora Sports"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
        <div>
          <div className="mb-4 text-xs font-medium tracking-[0.12em] text-bora-bronze uppercase">
            Quiénes Somos
          </div>
          <h1 className="mb-5 text-3xl leading-[1.1] font-extrabold tracking-tight text-bora-text-dark md:text-[38px]">
            No sigas tendencias, créalas.
          </h1>
          <p className="mb-4 max-w-[520px] text-base leading-relaxed text-bora-text-body">
            En Bora Sports creemos en el poder de la pasión y la autenticidad.
            Nacimos para fusionar el rendimiento deportivo con un estilo
            propio, con indumentaria que refleja personalidad, energía y
            determinación en cada pedaleada.
          </p>
          <p className="mb-6 max-w-[520px] text-base leading-relaxed text-bora-text-body">
            Inspirados en la fuerza de la naturaleza, nuestros diseños
            capturan la esencia de la velocidad, la resistencia y el
            instinto: piezas que no solo te acompañan en el camino, sino que
            cuentan tu historia. Cada producto está pensado para quienes
            buscan algo más que ropa deportiva — construimos una comunidad
            donde la actitud, la calidad y el diseño van de la mano.
          </p>
          <p className="mb-7 max-w-[480px] text-[17px] leading-snug font-bold text-bora-text-dark">
            Sé parte de la evolución con Bora Sports.
          </p>
          <a
            href={`${WHATSAPP_URL}?text=Hola%2C%20quiero%20conocer%20m%C3%A1s%20sobre%20Bora%20Sports`}
            className="inline-block bg-bora-dark px-7 py-4 text-[13px] font-bold tracking-wider text-white uppercase"
          >
            Conocenos más / Consultas por WhatsApp
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-5 pb-16 sm:grid-cols-3 md:px-10 md:pb-24">
        {[
          ["/assets/duo-modelos-1.jpg", "Foto: equipo Bora en entrenamiento"],
          ["/assets/accion-ciclista.jpg", "Foto: detalle producto Bora Sports"],
          ["/assets/calza-arena-back.jpg", "Foto: comunidad Bora Sports"],
        ].map(([src, alt]) => (
          <div key={src} className="relative w-full overflow-hidden rounded-md pt-[125%]">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </section>

      <Footer />
    </>
  );
}
