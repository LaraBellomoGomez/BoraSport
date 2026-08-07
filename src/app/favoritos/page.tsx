"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/lib/AuthContext";
import { useFavorites } from "@/lib/FavoritesContext";
import { findProduct } from "@/lib/products";

export default function FavoritosPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { lines, loading } = useFavorites();

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) return null;

  return (
    <>
      <Header />
      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
        <h1 className="mb-8 text-2xl font-extrabold tracking-tight text-bora-text-dark md:text-[32px]">
          Tus favoritos
        </h1>

        {loading ? (
          <p className="text-bora-text-body">Cargando…</p>
        ) : lines.length === 0 ? (
          <div className="py-12 text-center">
            <p className="mb-6 text-bora-text-body">
              Todavía no marcaste ningún producto como favorito.
            </p>
            <Link
              href="/verano-2026"
              className="inline-block bg-bora-dark px-7 py-3.5 text-[13px] font-bold tracking-wider text-white uppercase"
            >
              Ver colección
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-4">
            {lines.map((line) => {
              const product = findProduct(line.product_slug, line.product_type);
              if (!product) return null;
              const isApparel = "sizes" in product;
              return (
                <ProductCard
                  key={line.id}
                  slug={line.product_slug}
                  productType={line.product_type}
                  name={product.name}
                  image={product.image}
                  listPrice={product.listPrice}
                  transferPrice={product.transferPrice}
                  freeShipping={product.freeShipping}
                  imageFit={isApparel ? "cover" : "contain"}
                  swatch={isApparel ? product.swatch : undefined}
                  sizes={isApparel ? product.sizes : undefined}
                />
              );
            })}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
