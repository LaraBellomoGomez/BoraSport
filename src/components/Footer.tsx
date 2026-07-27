import Image from "next/image";
import Link from "next/link";
import { EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/contact";
import { assetPath } from "@/lib/basePath";

export default function Footer() {
  return (
    <footer className="bg-bora-dark-alt px-5 pt-14 pb-7 md:px-10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 border-b border-white/10 pb-9 sm:grid-cols-3">
        <div>
          <Image
            src={assetPath("/assets/bora-logo-2.png")}
            alt="Bora Sports"
            width={160}
            height={52}
            className="mb-3.5 h-[52px] w-auto object-contain"
          />
          <p className="max-w-[250px] text-[13px] leading-relaxed text-bora-on-dark/70">
            Indumentaria técnica de ciclismo, diseñada para quienes pedalean con actitud.
          </p>
        </div>

        <div>
          <div className="mb-3.5 text-xs font-bold tracking-wider text-bora-bronze uppercase">
            Colección
          </div>
          <div className="flex flex-col gap-2.5 text-[13px] text-bora-on-dark/80">
            <Link href="/verano-2026" className="hover:text-bora-bronze">
              Colección Verano 2026
            </Link>
            <Link href="/hombre" className="hover:text-bora-bronze">
              Hombre
            </Link>
            <Link href="/mujer" className="hover:text-bora-bronze">
              Mujer
            </Link>
            <Link href="/accesorios" className="hover:text-bora-bronze">
              Accesorios
            </Link>
          </div>
        </div>

        <div>
          <div className="mb-3.5 text-xs font-bold tracking-wider text-bora-bronze uppercase">
            Contactános
          </div>
          <div className="flex flex-col gap-2.5 text-[13px] text-bora-on-dark/80">
            <a href={WHATSAPP_URL} className="hover:text-bora-bronze">
              WhatsApp 011 3899 0252
            </a>
            <a href={`mailto:${EMAIL}`} className="hover:text-bora-bronze">
              {EMAIL}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-bora-bronze"
            >
              Instagram: {INSTAGRAM_HANDLE}
            </a>
            <span>Ubicación: próximamente</span>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1400px] pt-5 text-[11px] text-bora-on-dark/50">
        Copyright Bora Sports · 2026. Todos los derechos reservados.
      </div>
    </footer>
  );
}
