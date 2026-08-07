"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, Menu, X, LogOut, ShoppingBag, Heart } from "lucide-react";
import { NAV_LINKS } from "@/lib/contact";
import { assetPath } from "@/lib/basePath";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { useFavorites } from "@/lib/FavoritesContext";
import PromoBar from "@/components/PromoBar";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { count } = useCart();
  const { lines: favoriteLines } = useFavorites();
  const [open, setOpen] = useState(false);
  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "";

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    router.push("/");
  }

  return (
    <>
      <PromoBar />
      <header className="sticky top-0 z-50 border-b border-bora-border bg-[color:var(--color-bora-on-dark)]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-2">
          <Link
            href="/"
            className="relative inline-block aspect-[1536/665] h-9 flex-none justify-self-start overflow-hidden md:h-11"
            onClick={() => setOpen(false)}
          >
            <Image
              src={assetPath("/assets/logo.definitivo.png")}
              alt="Bora Sports"
              fill
              sizes="150px"
              className="object-cover object-top"
              priority
            />
          </Link>

          <nav className="hidden min-w-0 items-center justify-center gap-5 overflow-x-auto text-xs font-semibold tracking-wide text-bora-text-dark uppercase md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex-none transition-colors hover:underline ${active ? "underline" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden flex-none items-center gap-4 justify-self-end text-[11px] font-medium text-bora-text-dark md:flex">
            <Link href="/buscar" className="flex items-center gap-1.5 hover:underline">
              <Search size={15} strokeWidth={2} />
              Buscar
            </Link>
            {user ? (
              <>
                <Link href="/favoritos" className="flex items-center gap-1.5 hover:underline">
                  <Heart size={15} strokeWidth={2} />
                  Favoritos ({favoriteLines.length})
                </Link>
                <Link
                  href="/carrito"
                  className="flex items-center gap-1.5 rounded bg-bora-dark px-3 py-2 font-bold text-white hover:opacity-90"
                >
                  <ShoppingBag size={14} strokeWidth={2.5} />
                  Carrito ({count})
                </Link>
                <span className="max-w-[110px] truncate">{displayName}</span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <LogOut size={15} strokeWidth={2} />
                  Salir
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 font-bold text-bora-text-dark hover:underline"
              >
                <User size={15} strokeWidth={2} />
                Ingresá
              </Link>
            )}
          </div>

          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
            className="col-start-3 flex-none justify-self-end text-bora-text-dark md:hidden"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="border-t border-bora-border md:hidden">
            <nav className="flex flex-col gap-1 px-5 py-4 text-sm font-semibold tracking-wide text-bora-text-dark uppercase">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`py-2.5 ${active ? "underline" : ""}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-bora-border px-5 py-4 text-xs font-medium text-bora-text-dark">
            <Link
              href="/buscar"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5"
            >
              <Search size={15} strokeWidth={2} />
              Buscar
            </Link>
            {user ? (
              <>
                <Link
                  href="/favoritos"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5"
                >
                  <Heart size={15} strokeWidth={2} />
                  Favoritos ({favoriteLines.length})
                </Link>
                <Link
                  href="/carrito"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5"
                >
                  <ShoppingBag size={15} strokeWidth={2} />
                  Carrito ({count})
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5"
                >
                  <LogOut size={15} strokeWidth={2} />
                  Salir
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 font-bold text-bora-text-dark"
              >
                <User size={15} strokeWidth={2} />
                Ingresá
              </Link>
            )}
          </div>
        </div>
        )}
      </header>
    </>
  );
}
