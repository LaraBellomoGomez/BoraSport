export function formatARS(value: number): string {
  return `$${value.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function installmentPrice(finalPrice: number): number {
  return finalPrice / 3;
}
