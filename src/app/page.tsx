import Image from "next/image";
import Link from "next/link";
import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { featuredProducts } from "@/lib/products";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/contact";
import { assetPath } from "@/lib/basePath";

const QUICK_LINKS = [
  { href: "/mujer", label: "Mujer", image: "/assets/jersey-bermuda-leoa.webp" },
  { href: "/hombre", label: "Hombre", image: "/assets/jersey-fenix-verde.webp" },
  { href: "/accesorios", label: "Accesorios", image: "/assets/funda-full-protection.webp" },
  { href: "/verano-2026", label: "Verano 2026", image: "/assets/hero-2.webp" },
];

const INSTAGRAM_IMAGES = [
  "/assets/duo-modelos-1.jpg",
  "/assets/duo-modelos-2.jpg",
  "/assets/leoa-back-1.jpg",
  "/assets/leoa-back-2.jpg",
  "/assets/calza-arena-back.jpg",
  "/assets/accion-ciclista.jpg",
];

const PAYMENT_LOGOS = [
  ["pago-visa.png", "Visa"],
  ["pago-mastercard.png", "Mastercard"],
  ["pago-amex.png", "American Express"],
  ["pago-diners.png", "Diners Club"],
  ["pago-banelco.png", "Banelco"],
  ["pago-cabal.png", "Cabal"],
  ["pago-link.png", "Link"],
  ["pago-nx.png", "NX"],
  ["pago-tarjeta-shopping.png", "Tarjeta Shopping"],
  ["pago-nativa.png", "Nativa"],
  ["pago-cencosud.png", "Cencosud"],
  ["pago-argencard.png", "Argencard"],
  ["pago-cabal-debito.png", "Cabal Débito"],
  ["pago-provincia-net.png", "Provincia NET"],
  ["pago-maestro.png", "Maestro"],
  ["pago-visa-debito.png", "Visa Débito"],
  ["pago-pago-facil.png", "Pago Fácil"],
  ["pago-rapipago.png", "Rapipago"],
] as const;

export default function HomePage() {
  return (
    <>
      <PromoBar />
      <Header />

      <section className="mx-auto max-w-[1400px] px-5 pt-6 md:px-10">
        <div className="relative w-full overflow-hidden pt-[42.86%] md:pt-[38.1%]">
          <Image
            src={assetPath("/assets/hero-3.webp")}
            alt="Colección Verano 2026 Bora Sports"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.1 0.015 45 / 0.72), oklch(0.1 0.015 45 / 0.15) 55%, transparent 75%)",
            }}
          />
          <div className="absolute top-1/2 left-[5%] max-w-[440px] -translate-y-1/2">
            <div className="mb-3 text-xs font-bold tracking-[0.1em] text-bora-bronze uppercase">
              Colección Verano 2026
            </div>
            <div
              className="mb-5 text-3xl leading-[1.05] font-extrabold tracking-tight text-white md:text-[44px]"
              style={{ textShadow: "0 2px 14px rgba(0,0,0,.5)" }}
            >
              Tecnología + confort
            </div>
            <Link
              href="/verano-2026"
              className="inline-block bg-bora-bronze px-7 py-3.5 text-[13px] font-bold tracking-wider text-bora-dark uppercase"
            >
              Ver colección
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] grid-cols-2 gap-3.5 px-5 pt-5 pb-2 md:grid-cols-4 md:px-10">
        {QUICK_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative w-full overflow-hidden pt-[100%]"
          >
            <Image
              src={assetPath(item.image)}
              alt={item.label}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(0deg, oklch(0.14 0.015 45 / 0.55), transparent 55%)",
              }}
            />
            <div className="absolute bottom-3 left-3.5 text-[15px] font-bold text-white">
              {item.label}
            </div>
          </Link>
        ))}
      </section>

      <section id="destacados" className="mx-auto max-w-[1400px] px-5 pt-14 pb-4 md:px-10">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-bora-text-dark md:text-[26px]">
          ¡Los favoritos de Bora! 🚴
        </h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-[22px]">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.slug}
              slug={product.slug}
              productType="apparel"
              name={product.name}
              image={product.image}
              originalPrice={product.originalPrice}
              finalPrice={product.finalPrice}
              offPercent={product.offPercent}
              badgeStyle="dark"
              freeShipping="bottom-white"
              showInstallments
              sizes={product.sizes}
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/mujer"
            className="inline-block border border-bora-text-dark px-8 py-3.5 text-xs font-bold tracking-wider text-bora-text-dark uppercase"
          >
            Ver todos los productos
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-14 text-center md:px-10">
        <h2 className="mb-1.5 text-2xl font-extrabold tracking-tight text-bora-text-dark md:text-[26px]">
          Seguinos
        </h2>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="mb-7 inline-block text-[15px] font-semibold text-bora-bronze"
        >
          {INSTAGRAM_HANDLE} en Instagram
        </a>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {INSTAGRAM_IMAGES.map((src, i) => (
            <div key={i} className="relative w-full overflow-hidden pt-[100%]">
              <Image
                src={assetPath(src)}
                alt={`Instagram ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bora-light-gray px-5 py-12 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-4 text-[13px] font-bold tracking-wider text-neutral-600 uppercase">
            Medios de pago
          </div>
          <div className="mb-8 flex flex-wrap gap-2.5">
            {PAYMENT_LOGOS.map(([file, alt]) => (
              <Image
                key={file}
                src={assetPath(`/assets/${file}`)}
                alt={alt}
                width={64}
                height={32}
                className="h-8 w-auto object-contain"
              />
            ))}
          </div>
          <div className="mb-4 text-[13px] font-bold tracking-wider text-neutral-600 uppercase">
            Medios de envío
          </div>
          <Image
            src={assetPath("/assets/envio-correo-argentino.png")}
            alt="Correo Argentino"
            width={100}
            height={32}
            className="h-8 w-auto object-contain"
          />
        </div>
      </section>

      <section className="bg-bora-dark px-5 py-12 text-center md:px-10">
        <div className="mb-2.5 text-[11px] font-medium tracking-[0.1em] text-bora-bronze/80 uppercase">
          Newsletter
        </div>
        <h2 className="mb-5 text-2xl font-extrabold text-neutral-50">
          Suscribite y recibí todas las ofertas
        </h2>
        <form className="mx-auto flex max-w-[420px] overflow-hidden rounded-sm bg-white">
          <input
            type="email"
            placeholder="Tu email"
            className="flex-1 px-4 py-3.5 text-sm text-neutral-700 outline-none"
          />
          <button
            type="submit"
            className="bg-bora-bronze px-6 py-3.5 text-[13px] font-bold whitespace-nowrap text-black"
          >
            Enviar →
          </button>
        </form>
      </section>

      <Footer />
    </>
  );
}
