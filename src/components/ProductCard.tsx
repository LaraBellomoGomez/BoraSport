"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { formatARS, installmentPrice } from "@/lib/format";

interface ProductCardProps {
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative mb-2.5 w-full overflow-hidden bg-bora-card-bg pt-[133.33%]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={imageFit === "contain" ? "object-contain p-4" : "object-cover"}
        />
        <div
          className={`absolute top-2.5 left-2.5 px-2 py-1 text-[11px] font-bold ${
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
      </div>

      <div className="mb-1 text-[13px] font-medium text-bora-text-dark md:text-sm">
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
        <div className="flex gap-1.5">
          {sizes.map((size) => (
            <span
              key={size}
              className="border border-neutral-300 px-2.5 py-1 text-xs font-medium text-neutral-700"
            >
              {size}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
