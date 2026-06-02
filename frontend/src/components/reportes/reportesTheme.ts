export const CATEGORIA_COLORS: Record<string, string> = {
  Electrónica: "#366179",
  Hogar: "#066945",
  Deportes: "#0061D5",
};

export const CATEGORIA_COLOR_DEFAULT = "#94a3b8";

export function colorPorCategoria(categoria: string): string {
  return CATEGORIA_COLORS[categoria] ?? CATEGORIA_COLOR_DEFAULT;
}

export function formatMontoCompacto(monto: number): string {
  if (monto >= 1_000_000) {
    return `Bs. ${(monto / 1_000_000).toFixed(1)}M`;
  }
  if (monto >= 1_000) {
    const miles = monto / 1_000;
    const texto = miles >= 100 ? miles.toFixed(0) : miles.toFixed(1);
    return `Bs. ${texto}k`;
  }
  return `Bs. ${monto.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function porcentaje(parte: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((parte / total) * 100);
}

export function formatMonto(monto: number): string {
  const tieneDecimales = Math.round(monto * 100) % 100 !== 0;
  return "Bs. " + monto.toLocaleString("en-US", {
    minimumFractionDigits: tieneDecimales ? 2 : 0,
    maximumFractionDigits: 2,
  });
}
