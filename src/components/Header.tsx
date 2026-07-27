"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/contact";
import { assetPath } from "@/lib/basePath";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bora-dark">
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex-none" onClick={() => setOpen(false)}>
          <Image
            src={assetPath("/assets/bora-logo-2.png")}
            alt="Bora Sports"
            width={160}
            height={52}
            className="h-11 w-auto object-contain md:h-[52px]"
            priority
          />
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 overflow-x-auto text-xs font-semibold tracking-wide text-bora-on-dark uppercase md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex-none transition-colors hover:text-bora-bronze"
                style={active ? { color: "var(--color-bora-bronze)" } : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden flex-none items-center gap-4 text-[11px] font-medium text-bora-on-dark md:flex">
          <span className="flex items-center gap-1.5">
            <Search size={15} strokeWidth={2} />
            Buscar
          </span>
          <span className="flex items-center gap-1.5">
            <User size={15} strokeWidth={2} />
            Ingresá
          </span>
        </div>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
          className="flex-none text-bora-on-dark md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 md:hidden">
          <nav className="flex flex-col gap-1 px-5 py-4 text-sm font-semibold tracking-wide text-bora-on-dark uppercase">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-2.5"
                  style={active ? { color: "var(--color-bora-bronze)" } : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-6 border-t border-white/10 px-5 py-4 text-xs font-medium text-bora-on-dark">
            <span className="flex items-center gap-1.5">
              <Search size={15} strokeWidth={2} />
              Buscar
            </span>
            <span className="flex items-center gap-1.5">
              <User size={15} strokeWidth={2} />
              Ingresá
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
