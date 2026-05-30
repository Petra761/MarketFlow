import type { VentasCategoria } from "../../types/reportes";
import { ReportCard } from "./ReportCard";
import { colorPorCategoria } from "./reportesTheme";

interface CantidadVendidaChartProps {
  data: VentasCategoria[];
  loading?: boolean;
}

const CHART_HEIGHT = 160;

export function CantidadVendidaChart({
  data,
  loading = false,
}: CantidadVendidaChartProps) {
  const maxCantidad = Math.max(...data.map((d) => d.cantidadVendida), 1);

  return (
    <ReportCard title="Cantidad Vendida">
      {loading ? (
        <p className="py-16 text-center text-sm text-gray-400">Cargando…</p>
      ) : data.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">
          Sin datos de cantidad
        </p>
      ) : (
        <div className="flex flex-col justify-end h-full min-h-[300px] pb-2">
          <div
            className="flex items-end justify-center gap-8 sm:gap-12 px-2"
            role="img"
            aria-label="Gráfica de cantidad vendida por categoría"
          >
            {data.map((item) => {
              const barHeight = Math.max(
                (item.cantidadVendida / maxCantidad) * CHART_HEIGHT,
                12
              );
              const color = colorPorCategoria(item.categoria);

              return (
                <div
                  key={item.categoria}
                  className="flex flex-col items-center flex-1 max-w-[64px]"
                >
                  {/* Etiqueta con el valor encima de la barra */}
                  <span
                    className="mb-2 text-sm font-bold transition-colors duration-300"
                    style={{ color }}
                  >
                    {item.cantidadVendida}
                  </span>

                  {/* Barra con bordes superiores redondeados */}
                  <div
                    className="w-full rounded-t-xl transition-all duration-500 ease-out hover:opacity-90"
                    style={{
                      height: barHeight,
                      backgroundColor: color,
                    }}
                  />

                  {/* Nombre de la categoría */}
                  <span className="mt-3 text-center text-[10px] font-bold tracking-wider text-gray-400 uppercase truncate w-full">
                    {item.categoria}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ReportCard>
  );
}
