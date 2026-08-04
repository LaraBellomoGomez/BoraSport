// Authoritative prices, mirrored from src/lib/products.ts. The frontend's
// prices aren't trusted here since a client could tamper with them before
// calling create-preference — this map is what actually gets charged.
// Keep in sync with src/lib/products.ts when prices or products change.
export const PRICES: Record<string, { name: string; price: number }> = {
  "wild-leopard": { name: "Jersey de Ciclismo Mujer — Wild Leopard", price: 40900 },
  "fenix-areia": { name: "Jersey de Ciclismo Mujer — Fénix Areia", price: 35600 },
  "fenix-dourada": { name: "Jersey de Ciclismo Mujer — Fénix Dourada", price: 35600 },
  "tropical-toucan": { name: "Jersey de Ciclismo Mujer — Tropical Toucan", price: 40900 },
  "leoa": { name: "Bermuda de Ciclismo Mujer — Leoa", price: 39000 },
  "calca-preta": { name: "Bermuda de Ciclismo Mujer — Calça Preta", price: 39000 },
  "calca-arena": { name: "Bermuda de Ciclismo Mujer — Calça Arena", price: 39000 },
  "fenix-preto": { name: "Jersey de Ciclismo Hombre — Fénix Preto", price: 1 }, // TEMP: precio de $1 para prueba real de pago — revertir a 37500
  "fenix-verde": { name: "Jersey de Ciclismo Hombre — Fénix Verde", price: 37500 },
  "selva": { name: "Bermuda de Ciclismo Hombre — Selva", price: 39000 },
  "amarela": { name: "Bermuda de Ciclismo Hombre — Amarela", price: 39000 },
  "full-protection": {
    name: "Funda Full Protection — Cobertor Completo para Bicicleta",
    price: 45900,
  },
  "wild-spectrum": {
    name: "Funda Wild Spectrum — Cubre Ruedas para Bicicleta",
    price: 41500,
  },
  "jungle-velocity": {
    name: "Funda Jungle Velocity — Cubre Ruedas para Bicicleta",
    price: 41500,
  },
};
