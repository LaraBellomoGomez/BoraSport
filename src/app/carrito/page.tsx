"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { assetPath } from "@/lib/basePath";
import { formatARS } from "@/lib/format";

export default function CarritoPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { lines, subtotal, loading, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <>
        <Header />
        <div className="px-5 py-24 text-center text-bora-text-body">Cargando…</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="mx-auto max-w-[900px] px-5 py-12 md:py-16">
        <h1 className="mb-8 text-2xl font-extrabold tracking-tight text-bora-text-dark md:text-[32px]">
          Tu carrito
        </h1>

        {loading ? (
          <p className="text-bora-text-body">Cargando…</p>
        ) : lines.length === 0 ? (
          <div className="py-12 text-center">
            <p className="mb-6 text-bora-text-body">Todavía no agregaste productos.</p>
            <Link
              href="/verano-2026"
              className="inline-block bg-bora-dark px-7 py-3.5 text-[13px] font-bold tracking-wider text-white uppercase"
            >
              Ver colección
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col divide-y divide-neutral-200">
              {lines.map((line) => (
                <div key={line.id} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 flex-none overflow-hidden bg-bora-card-bg">
                    <Image
                      src={assetPath(line.image)}
                      alt={line.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="text-sm font-medium text-bora-text-dark">{line.name}</div>
                      {line.size && (
                        <div className="mt-1 text-xs text-bora-text-body">Talle: {line.size}</div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, line.quantity - 1)}
                          aria-label="Restar"
                          className="flex h-7 w-7 items-center justify-center border border-neutral-300"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-5 text-center text-sm">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                          aria-label="Sumar"
                          className="flex h-7 w-7 items-center justify-center border border-neutral-300"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-bora-text-dark">
                        {formatARS(line.listPrice * line.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(line.id)}
                    aria-label="Quitar del carrito"
                    className="flex-none self-start text-neutral-400 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6">
              <span className="text-base font-semibold text-bora-text-dark">Subtotal</span>
              <span className="text-xl font-extrabold text-bora-text-dark">
                {formatARS(subtotal)}
              </span>
            </div>
            <p className="mt-2 text-right text-xs font-bold text-[#e0455c]">
              Abonando por transferencia bancaria obtenés un 10% de descuento sobre el precio
              publicado.
            </p>

            <Link
              href="/checkout"
              className="mt-6 block w-full bg-bora-dark py-4 text-center text-[13px] font-bold tracking-wider text-white uppercase"
            >
              Finalizar compra
            </Link>
          </>
        )}
      </section>
      <Footer />
    </>
  );
}
