"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check, Heart } from "lucide-react";
import { formatARS } from "@/lib/format";
import { assetPath } from "@/lib/basePath";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { useFavorites } from "@/lib/FavoritesContext";
import type { ProductType } from "@/lib/products";

interface ProductCardProps {
  slug: string;
  productType: ProductType;
  name: string;
  image: string;
  listPrice: number;
  transferPrice: number;
  freeShipping?: boolean;
  imageFit?: "cover" | "contain";
  swatch?: string;
  sizes?: string[];
}

export default function ProductCard({
  slug,
  productType,
  name,
  image,
  listPrice,
  transferPrice,
  freeShipping = false,
  imageFit = "cover",
  swatch,
  sizes,
}: ProductCardProps) {
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
    <div className="group flex h-full flex-col">
      <div className="relative mb-2.5 w-full overflow-hidden rounded bg-bora-card-bg pt-[133.33%] transition-shadow duration-200 ease-out-strong group-hover:shadow-lg">
        <Link href={`/producto/${slug}`} className="absolute inset-0 z-0" aria-label={name}>
          <Image
            src={assetPath(image)}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`transition-transform duration-300 ease-out-strong group-hover:scale-105 ${
              imageFit === "contain" ? "object-contain p-4" : "object-cover"
            }`}
          />
        </Link>
        {freeShipping && (
          <div className="absolute top-2.5 left-2.5 bg-bora-dark px-2 py-[3px] text-[10px] font-semibold text-white">
            Envío gratis
          </div>
        )}
        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={favLoading}
          aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="absolute top-2.5 right-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 transition-transform duration-150 ease-out-strong hover:scale-110 active:scale-90 disabled:opacity-60"
        >
          <Heart
            size={18}
            color={favorite ? "#e0455c" : "#404040"}
            fill={favorite ? "#e0455c" : "none"}
          />
        </button>
      </div>

      <Link
        href={`/producto/${slug}`}
        className="mb-1 line-clamp-2 min-h-[2.6em] text-[13px] font-medium text-bora-text-dark hover:underline md:text-sm"
      >
        {name}
      </Link>

      {swatch && (
        <div className="mt-1 mb-2 flex gap-2">
          <span
            className="h-[22px] w-[22px] rounded-full border border-neutral-300"
            style={{ background: swatch }}
          />
        </div>
      )}

      {sizes && (
        <div className="mb-3 flex gap-1.5">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => {
                setSelectedSize(size);
                setMessage(null);
              }}
              className="cursor-pointer rounded border px-2.5 py-1 text-xs font-medium transition-[color,background-color,border-color,transform] duration-150 ease-out-strong active:scale-90"
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
      )}

      <div className="mb-1 text-base font-bold text-bora-text-dark">
        {formatARS(listPrice)}
      </div>
      <div className="mb-1 text-[11px] font-bold text-[#e0455c]">
        10% OFF por transferencia: {formatARS(transferPrice)}
      </div>

      <div className="flex-1" />

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={status === "adding"}
        className="flex w-full items-center justify-center gap-1.5 rounded bg-bora-dark py-2.5 text-xs font-bold tracking-wide text-white uppercase transition-[opacity,transform] duration-150 ease-out-strong hover:opacity-85 active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100"
      >
        {status === "added" ? (
          <>
            <Check size={14} /> Agregado
          </>
        ) : (
          <>
            <ShoppingBag size={14} />
            {status === "adding" ? "Agregando…" : "Agregar al carrito"}
          </>
        )}
      </button>
      {message && <p className="mt-1.5 text-[11px] text-red-600">{message}</p>}
    </div>
  );
}
