import type { ProductoMasVendido } from "../../types/reportes";
import { ReportCard } from "./ReportCard";

// Definición extendida para soportar campos futuros de imagen de manera segura
interface ProductoMasVendidoConImagen extends ProductoMasVendido {
  imagenUrl?: string;
  urlImagen?: string;
}

interface MasVendidosListProps {
  data: ProductoMasVendidoConImagen[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

function inicialesProducto(nombre: string): string {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return "?";
  if (palabras.length === 1) return palabras[0].slice(0, 2).toUpperCase();
  return (palabras[0][0] + palabras[1][0]).toUpperCase();
}

function formatMonedaCompacta(valor: number): string {
  return "Bs. " + new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
}

function ProductoItem({ item }: { item: ProductoMasVendidoConImagen }) {
  const imageUrl = item.imagenUrl || item.urlImagen;

  const renderThumbnail = () => {
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={item.producto}
          className="h-12 w-12 rounded-xl object-cover border border-gray-100 bg-gray-50 shadow-sm"
        />
      );
    }

    // Fallbacks inteligentes basados en el nombre
    const nameLower = item.producto.toLowerCase();
    let bgGradient = "from-slate-100 to-slate-200";
    let iconContent = null;

    if (
      nameLower.includes("audifono") ||
      nameLower.includes("headphone") ||
      nameLower.includes("sonido")
    ) {
      bgGradient = "from-zinc-700 to-zinc-950 text-white";
      iconContent = <span className="text-xl">🎧</span>;
    } else if (
      nameLower.includes("watch") ||
      nameLower.includes("reloj") ||
      nameLower.includes("smartwatch")
    ) {
      bgGradient = "from-amber-50 to-orange-100 text-orange-600";
      iconContent = <span className="text-xl">⌚</span>;
    } else if (
      nameLower.includes("zapatilla") ||
      nameLower.includes("shoe") ||
      nameLower.includes("tenis") ||
      nameLower.includes("calzado") ||
      nameLower.includes("runner")
    ) {
      bgGradient = "from-rose-50 to-rose-100 text-rose-500";
      iconContent = <span className="text-xl">👟</span>;
    } else {
      // Valor por defecto usando iniciales
      bgGradient = "from-cyan-50 to-blue-100 text-cyan-700";
      iconContent = (
        <span className="text-xs font-bold uppercase">
          {inicialesProducto(item.producto)}
        </span>
      );
    }

    return (
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${bgGradient} border border-gray-50 shadow-sm`}
        aria-hidden
      >
        {iconContent}
      </div>
    );
  };

  return (
    <li className="flex items-center gap-3 py-3.5 first:pt-1 last:pb-1">
      {renderThumbnail()}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-800">
          {item.producto}
        </p>
        <p className="text-xs font-medium text-gray-400 mt-0.5">
          {item.cantidadVendida}{" "}
          {item.cantidadVendida === 1 ? "unidad" : "unidades"}
        </p>
      </div>
      <p className="shrink-0 text-right text-sm font-bold text-gray-900">
        {formatMonedaCompacta(item.totalGenerado)}
      </p>
    </li>
  );
}

export function MasVendidosList({
  data,
  loading = false,
  error = null,
  onRetry,
}: MasVendidosListProps) {
  // Limitar a los 3 productos más vendidos para coincidir con la altura de los gráficos
  const topData = data.slice(0, 3);

  return (
    <ReportCard title="Más Vendidos">
      {loading ? (
        <p className="py-12 text-center text-sm text-gray-400">Cargando…</p>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-sm text-red-600">{error}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 text-sm font-semibold text-red-800 underline hover:no-underline"
            >
              Reintentar
            </button>
          )}
        </div>
      ) : topData.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-400">
          Sin productos vendidos
        </p>
      ) : (
        <div className="flex flex-col justify-between h-full min-h-[300px]">
          <ul className="divide-y divide-gray-100">
            {topData.map((item) => (
              <ProductoItem key={item.producto} item={item} />
            ))}
          </ul>
        </div>
      )}
    </ReportCard>
  );
}
