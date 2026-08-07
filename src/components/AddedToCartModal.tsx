"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { assetPath } from "@/lib/basePath";
import { formatARS } from "@/lib/format";
import { useCart } from "@/lib/CartContext";

export default function AddedToCartModal() {
  const { lastAdded, clearLastAdded } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastAdded) return;
    const showTimer = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(showTimer);
      setVisible(false);
    };
  }, [lastAdded]);

  if (!lastAdded) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-5 transition-opacity duration-200 ease-out-strong ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={clearLastAdded}
    >
      <div
        className={`w-full max-w-sm rounded bg-white p-6 shadow-xl transition-[transform,opacity] duration-200 ease-out-strong ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mb-5">
          <h2 className="text-center text-sm font-bold tracking-wide text-bora-text-dark uppercase">
            ¡Agregado al carrito!
          </h2>
          <button
            type="button"
            onClick={clearLastAdded}
            aria-label="Cerrar"
            className="absolute top-1/2 right-0 -translate-y-1/2 text-bora-text-body transition-transform duration-150 ease-out-strong hover:scale-110 active:scale-90"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-3">
          <div className="relative h-20 w-16 flex-none overflow-hidden rounded bg-bora-card-bg">
            <Image
              src={assetPath(lastAdded.image)}
              alt={lastAdded.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <div className="line-clamp-2 text-sm font-medium text-bora-text-dark">
              {lastAdded.name}
            </div>
            {lastAdded.size && (
              <div className="mt-0.5 text-xs text-bora-text-body">Talle: {lastAdded.size}</div>
            )}
            <div className="mt-1 text-sm font-bold text-bora-text-dark">
              {formatARS(lastAdded.listPrice * lastAdded.quantity)}
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={clearLastAdded}
            className="flex-1 rounded border border-bora-border py-2.5 text-xs font-bold tracking-wide text-bora-text-dark uppercase transition-transform duration-150 ease-out-strong active:scale-[0.97]"
          >
            Seguir comprando
          </button>
          <Link
            href="/carrito"
            onClick={clearLastAdded}
            className="flex-1 rounded bg-bora-dark py-2.5 text-center text-xs font-bold tracking-wide text-white uppercase transition-transform duration-150 ease-out-strong active:scale-[0.97]"
          >
            Ver carrito
          </Link>
        </div>
      </div>
    </div>
  );
}
