import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ProductGallery from "@/components/ProductGallery";
import ProductDetailPanel from "@/components/ProductDetailPanel";
import { allProductSlugs, findAnyProduct } from "@/lib/products";

export function generateStaticParams() {
  return allProductSlugs.map((slug) => ({ slug }));
}

const CATEGORY_CRUMB: Record<string, { label: string; href: string }> = {
  mujer: { label: "Mujer", href: "/mujer" },
  hombre: { label: "Hombre", href: "/hombre" },
  accessory: { label: "Accesorios", href: "/accesorios" },
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = findAnyProduct(slug);
  if (!found) notFound();

  const { product, type } = found;
  const isApparel = "sizes" in product;
  const categoryKey = isApparel ? product.gender : "accessory";
  const category = CATEGORY_CRUMB[categoryKey];
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  return (
    <>
      <Header />
      <div className="mx-auto max-w-[1200px] px-5 pt-7 pb-16 md:px-10">
        <Breadcrumb
          items={[{ label: "Inicio", href: "/" }, category, { label: product.name }]}
        />

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <ProductGallery images={images} alt={product.name} />
          <ProductDetailPanel
            slug={product.slug}
            productType={type}
            name={product.name}
            listPrice={product.listPrice}
            transferPrice={product.transferPrice}
            freeShipping={product.freeShipping}
            swatch={isApparel ? product.swatch : undefined}
            sizes={isApparel ? product.sizes : undefined}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
