"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import { byGender, type Gender } from "@/lib/products";

type Tab = "todos" | "jerseys" | "bermudas" | "coleccion";

const TABS: { key: Tab; label: (gender: string) => string }[] = [
  { key: "todos", label: () => "Ver Todo" },
  { key: "jerseys", label: (g) => `Jerseys ${g}` },
  { key: "bermudas", label: (g) => `Bermudas ${g}` },
  { key: "coleccion", label: (g) => `Colección Verano 2026 ${g}` },
];

export default function GenderListing({ gender, title }: { gender: Gender; title: string }) {
  const [tab, setTab] = useState<Tab>("todos");
  const products = useMemo(() => byGender(gender), [gender]);

  const filtered = useMemo(() => {
    switch (tab) {
      case "jerseys":
        return products.filter((p) => p.sub === "jerseys");
      case "bermudas":
        return products.filter((p) => p.sub === "bermudas");
      case "coleccion":
        return products.filter((p) => p.coleccionTab);
      default:
        return products;
    }
  }, [products, tab]);

  const counts = useMemo(
    () => ({
      todos: products.length,
      jerseys: products.filter((p) => p.sub === "jerseys").length,
      bermudas: products.filter((p) => p.sub === "bermudas").length,
      coleccion: products.filter((p) => p.coleccionTab).length,
    }),
    [products]
  );

  const sectionHeader =
    tab === "jerseys"
      ? `Jerseys ${title}`
      : tab === "bermudas"
        ? `Bermudas ${title}`
        : tab === "coleccion"
          ? `Colección Verano 2026 ${title}`
          : null;

  return (
    <>
      <Header />

      <div className="mx-auto max-w-[1400px] px-5 pt-7 md:px-10">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: title }]} />
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-bora-text-dark md:text-[32px]">
          {title}
        </h1>

        <div className="mb-5 flex flex-wrap gap-7 border-b border-neutral-200 pb-3.5">
          {TABS.map(({ key, label }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="cursor-pointer border-none bg-transparent pb-3.5 text-sm"
                style={{
                  fontWeight: active ? 700 : 600,
                  color: active ? "var(--color-bora-text-dark)" : "oklch(0.5 0.02 45)",
                  borderBottom: `2px solid ${active ? "var(--color-bora-bronze)" : "transparent"}`,
                  marginBottom: "-15px",
                }}
              >
                {label(title)}
              </button>
            );
          })}
        </div>

        <div className="mb-7 flex items-center justify-end">
          <span className="text-xs text-neutral-500">
            {counts[tab]} {counts[tab] === 1 ? "producto" : "productos"}
          </span>
        </div>

        {sectionHeader && (
          <div className="mb-[18px] text-lg font-bold text-bora-text-dark">{sectionHeader}</div>
        )}

        <div className="mb-16 grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.slug}
              slug={product.slug}
              productType="apparel"
              name={product.name}
              image={product.image}
              originalPrice={product.originalPrice}
              finalPrice={product.finalPrice}
              offPercent={product.offPercent}
              badgeStyle="bronze"
              freeShipping="top-dark"
              swatch={product.swatch}
              sizes={product.sizes}
            />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
