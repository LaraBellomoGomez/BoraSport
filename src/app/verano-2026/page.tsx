import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import { veranoProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Colección Verano 2026 — Bora Sports",
};

export default function VeranoPage() {
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

        <div className="mb-7 flex items-center justify-between border-b border-neutral-200 pb-5">
          <span className="flex items-center gap-2 text-[13px] font-semibold text-neutral-700">
            ☰ Filtrar por talle
          </span>
          <span className="text-xs text-neutral-500">
            {veranoProducts.length} productos
          </span>
        </div>

        <div className="mb-16 grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-4">
          {veranoProducts.map((product) => (
            <ProductCard
              key={product.slug}
              name={`${product.name} (Colección Verano 2026)`}
              image={product.image}
              originalPrice={product.originalPrice}
              finalPrice={product.finalPrice}
              offPercent={product.offPercent}
              badgeStyle="bronze"
              freeShipping="top-dark"
            />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
