import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import { accessoryProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Accesorios — Bora Sports",
};

export default function AccesoriosPage() {
  return (
    <>
      <Header />

      <div className="mx-auto max-w-[1400px] px-5 pt-7 md:px-10">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Accesorios" }]} />
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-bora-text-dark md:text-[32px]">
          Accesorios
        </h1>

        <div className="mb-5 flex gap-9 border-b border-neutral-200 pb-3.5">
          <span
            className="text-sm font-bold text-bora-text-dark"
            style={{
              borderBottom: "2px solid var(--color-bora-bronze)",
              paddingBottom: "14px",
              marginBottom: "-15px",
            }}
          >
            Fundas Ciclismo
          </span>
        </div>

        <div className="mb-7 flex items-center justify-end">
          <span className="text-xs text-neutral-500">
            {accessoryProducts.length} productos
          </span>
        </div>

        <div className="mb-16 grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-3">
          {accessoryProducts.map((product) => (
            <ProductCard
              key={product.slug}
              slug={product.slug}
              productType="accessory"
              name={product.name}
              image={product.image}
              listPrice={product.listPrice}
              transferPrice={product.transferPrice}
              freeShipping={product.freeShipping}
              imageFit="contain"
            />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
