import type { VentasCategoria } from "../../types/reportes";
import { ReportCard } from "./ReportCard";
import {
  colorPorCategoria,
  formatMontoCompacto,
  porcentaje,
} from "./reportesTheme";

interface VentasPorCategoriaChartProps {
  data: VentasCategoria[];
  loading?: boolean;
}

const SIZE = 200;
const STROKE = 24;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function DonutRing({
  segments,
}: {
  segments: { color: string; length: number }[];
}) {
  let offset = 0;

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto"
      role="img"
      aria-label="Gráfica de ventas por categoría"
    >
      <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
        {segments.map((segment, index) => {
          const dash = segment.length * CIRCUMFERENCE;
          const gap = CIRCUMFERENCE - dash;
          const circle = (
            <circle
              key={index}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={segment.color}
              strokeWidth={STROKE}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset * CIRCUMFERENCE}
              strokeLinecap="butt"
            />
          );
          offset += segment.length;
          return circle;
        })}
      </g>
    </svg>
  );
}

export function VentasPorCategoriaChart({
  data,
  loading = false,
}: VentasPorCategoriaChartProps) {
  const totalVentas = data.reduce((sum, item) => sum + item.totalVentas, 0);

  const segments =
    totalVentas > 0
      ? data.map((item) => ({
          color: colorPorCategoria(item.categoria),
          length: item.totalVentas / totalVentas,
          categoria: item.categoria,
          total: item.totalVentas,
        }))
      : [];

  return (
    <ReportCard title="Ventas por Categoría" menu>
      {loading ? (
        <p className="py-16 text-center text-sm text-gray-400">Cargando…</p>
      ) : data.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">
          Sin datos de ventas
        </p>
      ) : (
        <div className="flex flex-col justify-between h-full min-h-[300px]">
          {/* Gráfico */}
          <div className="relative mx-auto w-fit mt-4">
            <DonutRing
              segments={segments.map((s) => ({
                color: s.color,
                length: s.length,
              }))}
            />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</span>
              <span className="text-2xl font-black text-[#1A535C]">
                {formatMontoCompacto(totalVentas)}
              </span>
            </div>
          </div>

          {/* Leyenda en flex wrap */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-medium px-2">
            {segments.map((item) => (
              <div
                key={item.categoria}
                className="flex items-center gap-1.5 text-gray-600"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>
                  {item.categoria} ({porcentaje(item.total, totalVentas)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ReportCard>
  );
}
