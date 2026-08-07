// Authoritative prices, mirrored from src/lib/products.ts. The frontend's
// prices aren't trusted here since a client could tamper with them before
// calling create-preference — this map is what actually gets charged.
// Keep in sync with src/lib/products.ts when prices or products change.
export const PRICES: Record<string, { name: string; price: number }> = {
  "wild-leopard": { name: "Jersey de Ciclismo Mujer — Wild Leopard", price: 64900 },
  "fenix-areia": { name: "Jersey de Ciclismo Mujer — Fénix Areia", price: 59900 },
  "fenix-dourada": { name: "Jersey de Ciclismo Mujer — Fénix Dourada", price: 59900 },
  "tropical-toucan": { name: "Jersey de Ciclismo Mujer — Tropical Toucan", price: 54900 },
  "leoa": { name: "Bermuda de Ciclismo Mujer — Leoa", price: 54900 },
  "calca-preta": { name: "Bermuda de Ciclismo Mujer — Calça Preta", price: 54900 },
  "calca-arena": { name: "Bermuda de Ciclismo Mujer — Calça Arena", price: 54900 },
  "fenix-preto": { name: "Jersey de Ciclismo Hombre — Fénix Preto", price: 1 }, // TEMP: precio de $1 para prueba real de pago — revertir a 59900
  "fenix-verde": { name: "Jersey de Ciclismo Hombre — Fénix Verde", price: 59900 },
  "selva": { name: "Bermuda de Ciclismo Hombre — Selva", price: 54900 },
  "amarela": { name: "Bermuda de Ciclismo Hombre — Amarela", price: 54900 },
  "full-protection": {
    name: "Funda Full Protection — Cobertor Completo para Bicicleta",
    price: 59900,
  },
  "wild-spectrum": {
    name: "Funda Wild Spectrum — Cubre Ruedas para Bicicleta",
    price: 44900,
  },
  "jungle-velocity": {
    name: "Funda Jungle Velocity — Cubre Ruedas para Bicicleta",
    price: 44900,
  },
};
