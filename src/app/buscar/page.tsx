"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { apparelProducts, accessoryProducts } from "@/lib/products";

const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(DIACRITICS, "");
}

const ALL_PRODUCTS = [
  ...apparelProducts.map((p) => ({ ...p, productType: "apparel" as const })),
  ...accessoryProducts.map((p) => ({ ...p, productType: "accessory" as const })),
];

export default function BuscarPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    return ALL_PRODUCTS.filter((p) => normalize(p.name).includes(q));
  }, [query]);

  return (
    <>
      <Header />
      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-bora-text-dark md:text-[32px]">
          Buscar
        </h1>

        <div className="mb-10 flex max-w-[520px] items-center gap-3 border-b-2 border-bora-text-dark pb-3">
          <Search size={20} className="flex-none text-bora-text-body" />
          <input
            type="text"
            autoFocus
            placeholder="Buscá por nombre — ej. Fénix, Bermuda, Funda…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base text-bora-text-dark outline-none"
          />
        </div>

        {query.trim() === "" ? (
          <p className="text-bora-text-body">Empezá a escribir para buscar productos.</p>
        ) : results.length === 0 ? (
          <p className="text-bora-text-body">
            No encontramos productos que coincidan con &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <>
            <p className="mb-6 text-xs text-neutral-500">
              {results.length} {results.length === 1 ? "resultado" : "resultados"}
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-4">
              {results.map((product) => (
                <ProductCard
                  key={`${product.productType}-${product.slug}`}
                  slug={product.slug}
                  productType={product.productType}
                  name={product.name}
                  image={product.image}
                  listPrice={product.listPrice}
                  transferPrice={product.transferPrice}
                  freeShipping={product.freeShipping}
                  imageFit={product.productType === "accessory" ? "contain" : "cover"}
                  swatch={"swatch" in product ? product.swatch : undefined}
                  sizes={"sizes" in product ? product.sizes : undefined}
                />
              ))}
            </div>
          </>
        )}
      </section>
      <Footer />
    </>
  );
}
