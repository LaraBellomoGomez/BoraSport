"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import { veranoProducts } from "@/lib/products";

type Tab = "todos" | "jerseys-mujer" | "jerseys-hombre" | "bermudas-mujer" | "bermudas-hombre";

const TABS: { key: Tab; label: string }[] = [
  { key: "todos", label: "Ver Todo" },
  { key: "jerseys-mujer", label: "Jerseys Mujer" },
  { key: "jerseys-hombre", label: "Jerseys Hombre" },
  { key: "bermudas-mujer", label: "Bermudas Mujer" },
  { key: "bermudas-hombre", label: "Bermudas Hombre" },
];

export default function VeranoPage() {
  const [tab, setTab] = useState<Tab>("todos");

  const filtered = useMemo(() => {
    switch (tab) {
      case "jerseys-mujer":
        return veranoProducts.filter((p) => p.sub === "jerseys" && p.gender === "mujer");
      case "jerseys-hombre":
        return veranoProducts.filter((p) => p.sub === "jerseys" && p.gender === "hombre");
      case "bermudas-mujer":
        return veranoProducts.filter((p) => p.sub === "bermudas" && p.gender === "mujer");
      case "bermudas-hombre":
        return veranoProducts.filter((p) => p.sub === "bermudas" && p.gender === "hombre");
      default:
        return veranoProducts;
    }
  }, [tab]);

  return (
    <>
      <Header />

      <div className="mx-auto max-w-[1400px] px-5 pt-7 md:px-10">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Colecciones", href: "/verano-2026" },
            { label: "Verano 2026" },
          ]}
        />
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-bora-text-dark md:text-[32px]">
          Colección Verano 2026
        </h1>

        <div className="mb-7 flex flex-wrap items-center justify-between gap-y-3 border-b border-bora-border pb-3.5">
          <div className="flex flex-wrap gap-7">
            {TABS.map(({ key, label }) => {
              const active = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className="cursor-pointer border-none bg-transparent pb-3.5 text-sm"
                  style={{
                    fontWeight: active ? 700 : 600,
                    color: active ? "var(--color-bora-text-dark)" : "oklch(0.5 0.02 45)",
                    borderBottom: `2px solid ${active ? "var(--color-bora-bronze)" : "transparent"}`,
                    marginBottom: "-15px",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <span className="text-xs text-bora-text-body">
            {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
          </span>
        </div>

        <div className="mb-16 grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.slug}
              slug={product.slug}
              productType="apparel"
              name={`${product.name} (Colección Verano 2026)`}
              image={product.image}
              originalPrice={product.originalPrice}
              finalPrice={product.finalPrice}
              offPercent={product.offPercent}
              badgeStyle="bronze"
              freeShipping="top-dark"
              showInstallments
              sizes={product.sizes}
            />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
