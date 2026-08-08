export type Gender = "mujer" | "hombre";
export type Subcategory = "jerseys" | "bermudas";

export interface ApparelProduct {
  slug: string;
  name: string;
  image: string;
  /** Fotos adicionales para la galería de producto. Si falta, la galería usa solo `image`. */
  gallery?: string[];
  gender: Gender;
  sub: Subcategory;
  /** Precio de lista, el precio real publicado (sin descuentos ficticios). */
  listPrice: number;
  /** Precio final abonando por transferencia bancaria (10% off), informativo. */
  transferPrice: number;
  freeShipping: boolean;
  swatch: string;
  sizes: string[];
  /** Shows under the gender page's "Colección Verano 2026 {Género}" tab. Intentionally asymmetric: Mujer only shows a subset, Hombre shows everything — matches the live site. */
  coleccionTab: boolean;
  /** Appears in the standalone /verano-2026 listing (9 products total, a different set than coleccionTab). */
  inVerano: boolean;
}

export interface AccessoryProduct {
  slug: string;
  name: string;
  image: string;
  gallery?: string[];
  listPrice: number;
  transferPrice: number;
  freeShipping: boolean;
}

export const apparelProducts: ApparelProduct[] = [
  {
    slug: "wild-leopard",
    name: "Jersey de Ciclismo Mujer — Wild Leopard",
    image: "/assets/jersey-wild-leopard.webp",
    gender: "mujer",
    sub: "jerseys",
    listPrice: 64900,
    transferPrice: 58400,
    freeShipping: true,
    swatch: "linear-gradient(135deg,#c9922f,#151515)",
    sizes: ["S", "M", "L", "XL"],
    coleccionTab: false,
    inVerano: false,
  },
  {
    slug: "fenix-areia",
    name: "Jersey de Ciclismo Mujer — Fénix Areia",
    image: "/assets/jersey-fenix-areia.webp",
    gallery: [
      "/assets/jersey-fenix-areia.webp",
      "/assets/calza-arena-1.jpg",
      "/assets/calza-arena-3.jpg",
      "/assets/calza-arena-4.jpg",
      "/assets/calza-arena-5.jpg",
      "/assets/calza-arena-back.jpg",
    ],
    gender: "mujer",
    sub: "jerseys",
    listPrice: 59900,
    transferPrice: 53900,
    freeShipping: true,
    swatch: "#a89a95",
    sizes: ["S", "M", "L", "XL"],
    coleccionTab: true,
    inVerano: true,
  },
  {
    slug: "fenix-dourada",
    name: "Jersey de Ciclismo Mujer — Fénix Dourada",
    image: "/assets/jersey-fenix-dourada.webp",
    gender: "mujer",
    sub: "jerseys",
    listPrice: 59900,
    transferPrice: 53900,
    freeShipping: true,
    swatch: "#c9922f",
    sizes: ["S", "M", "L", "XL"],
    coleccionTab: false,
    inVerano: true,
  },
  {
    slug: "tropical-toucan",
    name: "Jersey de Ciclismo Mujer — Tropical Toucan",
    image: "/assets/jersey-tropical-toucan.webp",
    gender: "mujer",
    sub: "jerseys",
    listPrice: 54900,
    transferPrice: 49400,
    freeShipping: true,
    swatch: "#151515",
    sizes: ["S", "M", "L", "XL"],
    coleccionTab: false,
    inVerano: false,
  },
  {
    slug: "leoa",
    name: "Bermuda de Ciclismo Mujer — Leoa",
    image: "/assets/jersey-bermuda-leoa.webp",
    gallery: [
      "/assets/jersey-bermuda-leoa.webp",
      "/assets/leoa-bermuda-1.jpg",
      "/assets/leoa-bermuda-2.jpg",
      "/assets/leoa-bermuda-3.jpg",
      "/assets/leoa-back-1.jpg",
      "/assets/leoa-back-2.jpg",
      "/assets/accion-ciclista.jpg",
      "/assets/duo-modelos-1.jpg",
    ],
    gender: "mujer",
    sub: "bermudas",
    listPrice: 54900,
    transferPrice: 49400,
    freeShipping: true,
    swatch: "linear-gradient(135deg,#8a6d3b,#3d2f1a)",
    sizes: ["S", "M", "L", "XL"],
    coleccionTab: false,
    inVerano: true,
  },
  {
    slug: "calca-preta",
    name: "Bermuda de Ciclismo Mujer — Calça Preta",
    image: "/assets/bermuda-calca-preta.webp",
    gallery: ["/assets/bermuda-calca-preta.webp", "/assets/jersey-tropical-toucan.webp"],
    gender: "mujer",
    sub: "bermudas",
    listPrice: 54900,
    transferPrice: 49400,
    freeShipping: true,
    swatch: "#141414",
    sizes: ["S", "M", "L", "XL"],
    coleccionTab: false,
    inVerano: true,
  },
  {
    slug: "calca-arena",
    name: "Bermuda de Ciclismo Mujer — Calça Arena",
    image: "/assets/bermuda-calca-arena.webp",
    gallery: [
      "/assets/bermuda-calca-arena.webp",
      "/assets/calza-arena-1.jpg",
      "/assets/calza-arena-2.jpg",
      "/assets/calza-arena-3.jpg",
      "/assets/calza-arena-4.jpg",
      "/assets/calza-arena-5.jpg",
      "/assets/calza-arena-back.jpg",
      "/assets/duo-modelos-2.jpg",
    ],
    gender: "mujer",
    sub: "bermudas",
    listPrice: 54900,
    transferPrice: 49400,
    freeShipping: true,
    swatch: "#d9c6a5",
    sizes: ["S", "M", "L", "XL"],
    coleccionTab: true,
    inVerano: true,
  },
  {
    slug: "fenix-preto",
    name: "Jersey de Ciclismo Hombre — Fénix Preto",
    image: "/assets/jersey-fenix-preto.webp",
    gender: "hombre",
    sub: "jerseys",
    listPrice: 59900,
    transferPrice: 53900,
    freeShipping: true,
    swatch: "#151515",
    sizes: ["S", "M", "L", "XL"],
    coleccionTab: true,
    inVerano: true,
  },
  {
    slug: "fenix-verde",
    name: "Jersey de Ciclismo Hombre — Fénix Verde",
    image: "/assets/jersey-fenix-verde.webp",
    gallery: [
      "/assets/jersey-fenix-verde.webp",
      "/assets/duo-modelos-1.jpg",
      "/assets/duo-modelos-3.jpg",
    ],
    gender: "hombre",
    sub: "jerseys",
    listPrice: 59900,
    transferPrice: 53900,
    freeShipping: true,
    swatch: "#5a6b5f",
    sizes: ["S", "M", "L", "XL"],
    coleccionTab: true,
    inVerano: true,
  },
  {
    slug: "selva",
    name: "Bermuda de Ciclismo Hombre — Selva",
    image: "/assets/bermuda-selva.webp",
    gender: "hombre",
    sub: "bermudas",
    listPrice: 54900,
    transferPrice: 49400,
    freeShipping: true,
    swatch: "linear-gradient(135deg,#3d5a2d,#1c2b12)",
    sizes: ["S", "M", "L", "XL"],
    coleccionTab: true,
    inVerano: true,
  },
  {
    slug: "amarela",
    name: "Bermuda de Ciclismo Hombre — Amarela",
    image: "/assets/bermuda-amarela.webp",
    gallery: [
      "/assets/bermuda-amarela.webp",
      "/assets/duo-modelos-1.jpg",
      "/assets/duo-modelos-2.jpg",
      "/assets/duo-modelos-3.jpg",
    ],
    gender: "hombre",
    sub: "bermudas",
    listPrice: 54900,
    transferPrice: 49400,
    freeShipping: true,
    swatch: "#e0b323",
    sizes: ["S", "M", "L", "XL"],
    coleccionTab: true,
    inVerano: true,
  },
];

export const accessoryProducts: AccessoryProduct[] = [
  {
    slug: "full-protection",
    name: "Funda Full Protection — Cobertor Completo para Bicicleta",
    image: "/assets/funda-full-protection.webp",
    listPrice: 59900,
    transferPrice: 53900,
    freeShipping: false,
  },
  {
    slug: "wild-spectrum",
    name: "Funda Wild Spectrum — Cubre Ruedas para Bicicleta",
    image: "/assets/funda-wild-spectrum.webp",
    listPrice: 44900,
    transferPrice: 40400,
    freeShipping: true,
  },
  {
    slug: "jungle-velocity",
    name: "Funda Jungle Velocity — Cubre Ruedas para Bicicleta",
    image: "/assets/funda-jungle-velocity.webp",
    listPrice: 44900,
    transferPrice: 40400,
    freeShipping: true,
  },
];

export function byGender(gender: Gender): ApparelProduct[] {
  return apparelProducts.filter((p) => p.gender === gender);
}

export const veranoProducts: ApparelProduct[] = apparelProducts.filter(
  (p) => p.inVerano
);

export const featuredHomeSlugs = ["wild-leopard", "fenix-preto", "leoa", "selva"];
export const featuredProducts: ApparelProduct[] = featuredHomeSlugs.map(
  (slug) => apparelProducts.find((p) => p.slug === slug)!
);

export type ProductType = "apparel" | "accessory";

export function findProduct(
  slug: string,
  type: ProductType
): ApparelProduct | AccessoryProduct | undefined {
  return type === "apparel"
    ? apparelProducts.find((p) => p.slug === slug)
    : accessoryProducts.find((p) => p.slug === slug);
}

export function findAnyProduct(
  slug: string
): { product: ApparelProduct | AccessoryProduct; type: ProductType } | undefined {
  const apparel = apparelProducts.find((p) => p.slug === slug);
  if (apparel) return { product: apparel, type: "apparel" };
  const accessory = accessoryProducts.find((p) => p.slug === slug);
  if (accessory) return { product: accessory, type: "accessory" };
  return undefined;
}

export const allProductSlugs = [
  ...apparelProducts.map((p) => p.slug),
  ...accessoryProducts.map((p) => p.slug),
];
