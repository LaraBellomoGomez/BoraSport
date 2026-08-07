"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Heart, ShoppingBag } from "lucide-react";
import { formatARS } from "@/lib/format";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { useFavorites } from "@/lib/FavoritesContext";
import type { ProductType } from "@/lib/products";

interface ProductDetailPanelProps {
  slug: string;
  productType: ProductType;
  name: string;
  listPrice: number;
  transferPrice: number;
  freeShipping?: boolean;
  swatch?: string;
  sizes?: string[];
}

export default function ProductDetailPanel({
  slug,
  productType,
  name,
  listPrice,
  transferPrice,
  freeShipping = false,
  swatch,
  sizes,
}: ProductDetailPanelProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "adding" | "added" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [favLoading, setFavLoading] = useState(false);
  const favorite = isFavorite(slug);

  async function handleToggleFavorite() {
    if (!user) {
      router.push("/login");
      return;
    }
    setFavLoading(true);
    await toggleFavorite(slug, productType);
    setFavLoading(false);
  }

  async function handleAddToCart() {
    setMessage(null);

    if (!user) {
      router.push("/login");
      return;
    }
    if (sizes && !selectedSize) {
      setMessage("Elegí un talle");
      return;
    }

    setStatus("adding");
    const { error } = await addToCart(slug, productType, selectedSize, 1);
    if (error) {
      setStatus("error");
      setMessage("No se pudo agregar. Probá de nuevo.");
      return;
    }
    setStatus("added");
    setSelectedSize(null);
    setTimeout(() => setStatus("idle"), 1600);
  }

  return (
    <div>
      {freeShipping && (
        <div className="mb-3 inline-block bg-bora-dark px-2 py-[3px] text-[10px] font-semibold text-white">
          Envío gratis
        </div>
      )}

      <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-bora-text-dark md:text-[28px]">
        {name}
      </h1>

      <div className="mb-1 text-2xl font-bold text-bora-text-dark">{formatARS(listPrice)}</div>
      <div className="mb-5 text-sm font-bold text-[#e0455c]">
        10% OFF por transferencia: {formatARS(transferPrice)}
      </div>

      {swatch && (
        <div className="mb-5 flex items-center gap-2">
          <span className="text-xs font-semibold text-bora-text-body uppercase">Color</span>
          <span
            className="h-[26px] w-[26px] rounded-full border border-neutral-300"
            style={{ background: swatch }}
          />
        </div>
      )}

      {sizes && (
        <div className="mb-6">
          <div className="mb-2 text-xs font-semibold text-bora-text-body uppercase">Talle</div>
          <div className="flex gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setSelectedSize(size);
                  setMessage(null);
                }}
                className="cursor-pointer rounded border px-4 py-2 text-sm font-medium transition-[color,background-color,border-color,transform] duration-150 ease-out-strong active:scale-90"
                style={
                  selectedSize === size
                    ? {
                        borderColor: "var(--color-bora-dark)",
                        background: "var(--color-bora-dark)",
                        color: "#fff",
                      }
                    : { borderColor: "var(--color-bora-border)", color: "var(--color-bora-text-dark)" }
                }
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={status === "adding"}
          className="flex flex-1 items-center justify-center gap-1.5 rounded bg-bora-dark py-3.5 text-xs font-bold tracking-wide text-white uppercase transition-[opacity,transform] duration-150 ease-out-strong hover:opacity-85 active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100"
        >
          {status === "added" ? (
            <>
              <Check size={16} /> Agregado
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              {status === "adding" ? "Agregando…" : "Agregar al carrito"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={favLoading}
          aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="flex h-12 w-12 flex-none items-center justify-center rounded border border-bora-border transition-transform duration-150 ease-out-strong hover:scale-110 active:scale-90 disabled:opacity-60"
        >
          <Heart
            size={20}
            color={favorite ? "#e0455c" : "#404040"}
            fill={favorite ? "#e0455c" : "none"}
          />
        </button>
      </div>
      {message && <p className="mt-2 text-xs text-red-600">{message}</p>}
    </div>
  );
}
