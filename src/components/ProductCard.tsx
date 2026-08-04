"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check, Heart } from "lucide-react";
import { formatARS, installmentPrice } from "@/lib/format";
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
  originalPrice: number;
  finalPrice: number;
  offPercent: number;
  badgeStyle?: "dark" | "bronze";
  freeShipping?: "none" | "bottom-white" | "top-dark";
  showInstallments?: boolean;
  imageFit?: "cover" | "contain";
  swatch?: string;
  sizes?: string[];
}

export default function ProductCard({
  slug,
  productType,
  name,
  image,
  originalPrice,
  finalPrice,
  offPercent,
  badgeStyle = "bronze",
  freeShipping = "none",
  showInstallments = false,
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
    setTimeout(() => setStatus("idle"), 1600);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="relative mb-2.5 w-full overflow-hidden rounded bg-bora-card-bg pt-[133.33%]">
        <Image
          src={assetPath(image)}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={imageFit === "contain" ? "object-contain p-4" : "object-cover"}
        />
        <div
          className={`absolute top-2.5 left-2.5 rounded px-2 py-1 text-[11px] font-bold ${
            badgeStyle === "dark"
              ? "bg-bora-dark text-white"
              : "bg-bora-bronze text-bora-dark"
          }`}
        >
          {offPercent}% OFF
        </div>
        {freeShipping === "top-dark" && (
          <div className="absolute top-11 left-2.5 bg-bora-dark px-2 py-[3px] text-[10px] font-semibold text-white">
            Envío gratis
          </div>
        )}
        {freeShipping === "bottom-white" && (
          <div className="absolute bottom-2.5 left-2.5 bg-white px-2 py-[3px] text-[10px] font-semibold text-bora-text-body">
            Envío gratis
          </div>
        )}
        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={favLoading}
          aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 disabled:opacity-60"
        >
          <Heart
            size={16}
            color={favorite ? "#e0455c" : "#404040"}
            fill={favorite ? "#e0455c" : "none"}
          />
        </button>
      </div>

      <div className="mb-1 line-clamp-2 min-h-[2.6em] text-[13px] font-medium text-bora-text-dark md:text-sm">
        {name}
      </div>

      <div className="mb-1 flex items-baseline gap-2 text-[13px]">
        <span className="text-bora-text-body/70 line-through">
          {formatARS(originalPrice)}
        </span>
        <span className="text-base font-bold text-bora-text-dark">
          {formatARS(finalPrice)}
        </span>
      </div>

      {showInstallments && (
        <div className="mt-0.5 text-[11px] text-bora-text-body">
          3 cuotas sin interés de {formatARS(installmentPrice(finalPrice))}
        </div>
      )}

      {swatch && (
        <div className="mt-2.5 mb-2.5 flex gap-2">
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
              className="cursor-pointer rounded border px-2.5 py-1 text-xs font-medium transition-colors"
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

      <div className="flex-1" />

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={status === "adding"}
        className="flex w-full items-center justify-center gap-1.5 rounded bg-bora-dark py-2.5 text-xs font-bold tracking-wide text-white uppercase transition-opacity hover:opacity-85 disabled:opacity-60"
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
