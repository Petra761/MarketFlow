import { useState } from "react";
import type { VentaRangoDTO } from "../../types/reportes";

interface VentasDetalleChartProps {
  type: "dia" | "semana" | "mes" | "anual";
  data: VentaRangoDTO[];
  onClose: () => void;
}

function formatMoneda(valor: number): string {
  return "Bs. " + new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

function formatLabel(periodo: string, type: string): string {
  if (type === "semana") {
    const parts = periodo.split("/");
    if (parts.length === 3) {
      const meses = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      return `${d} ${meses[m - 1]}`;
    }
  }
  if (type === "mes") {
    if (periodo.length > 3) {
      return periodo.charAt(0).toUpperCase() + periodo.slice(1, 3);
    }
  }
  return periodo;
}

export function VentasDetalleChart({
  type,
  data,
  onClose,
}: VentasDetalleChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Titulo y descripción dinámicos
  const titles = {
    dia: "Detalle de Ventas - Diario (Hoy)",
    semana: "Detalle de Ventas - Últimos 7 Días",
    mes: "Detalle de Ventas - Mensual (Año Actual)",
    anual: "Detalle de Ventas - Anual",
  };

  const descriptions = {
    dia: "Ingresos acumulados del día de hoy en tiempo real.",
    semana: "Ingresos diarios detallados de la última semana.",
    mes: "Ingresos agrupados por meses del año actual.",
    anual: "Ingresos anuales históricos acumulados.",
  };

  // Dimensiones del gráfico
  const width = 800;
  const height = 240;
  const paddingLeft = 60;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 45;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  const maxVal = data.length > 0 ? Math.max(...data.map((d) => d.totalVentas)) : 1;
  const yMax = Math.ceil(maxVal * 1.2);

  // Coordenadas de los puntos
  const points = data.map((d, i) => {
    const x =
      data.length > 1
        ? paddingLeft + (i / (data.length - 1)) * innerWidth
        : paddingLeft + innerWidth / 2;
    const y = height - paddingBottom - (d.totalVentas / yMax) * innerHeight;
    return {
      x,
      y,
      value: d.totalVentas,
      cantidad: d.cantidadVentas,
      label: formatLabel(d.periodo, type),
    };
  });

  // Generar paths del SVG
  let linePath = "";
  let areaPath = "";

  if (points.length > 1) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    areaPath = `${linePath} L ${points[points.length - 1].x} ${
      height - paddingBottom
    } L ${points[0].x} ${height - paddingBottom} Z`;
  } else if (points.length === 1) {
    linePath = `M ${paddingLeft} ${points[0].y} L ${
      width - paddingRight
    } ${points[0].y}`;
    areaPath = `M ${paddingLeft} ${points[0].y} L ${
      width - paddingRight
    } ${points[0].y} L ${width - paddingRight} ${
      height - paddingBottom
    } L ${paddingLeft} ${height - paddingBottom} Z`;
  }

  // Grillas horizontales del eje Y
  const gridLines = [];
  const gridTicksCount = 4;
  for (let i = 0; i <= gridTicksCount; i++) {
    const val = (yMax / gridTicksCount) * i;
    const y = height - paddingBottom - (val / yMax) * innerHeight;
    gridLines.push({ y, val });
  }

  return (
    <article className="mb-6 rounded-2xl border border-[#2be1a4]/20 bg-white p-6 shadow-md transition-all duration-300 relative overflow-hidden animate-fadeIn">
      {/* Línea decorativa superior */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 to-[#2be1a4]" />

      <header className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{titles[type]}</h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            {descriptions[type]}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          aria-label="Cerrar detalle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </header>

      {data.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">
          Sin datos de ventas para este periodo
        </p>
      ) : (
        <div className="relative w-full">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible"
            role="img"
          >
            <defs>
              <linearGradient id="detailAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#0b333b" stopOpacity="0.25" offset="0%" />
                <stop stopColor="#0b333b" stopOpacity="0.00" offset="100%" />
              </linearGradient>
            </defs>

            {/* Grillas Horizontales */}
            <g className="stroke-gray-100" strokeWidth={1} strokeDasharray="4 6">
              {gridLines.map((line, index) => (
                <line
                  key={index}
                  x1={paddingLeft}
                  y1={line.y}
                  x2={width - paddingRight}
                  y2={line.y}
                />
              ))}
            </g>

            {/* Etiquetas Y */}
            <g className="fill-gray-400 text-[10px] font-semibold text-right">
              {gridLines.map((line, index) => (
                <text
                  key={index}
                  x={paddingLeft - 12}
                  y={line.y + 4}
                  textAnchor="end"
                >
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(line.val)}
                </text>
              ))}
            </g>

            {/* Área Rellena */}
            {areaPath && (
              <path
                d={areaPath}
                fill="url(#detailAreaGradient)"
                className="transition-all duration-500"
              />
            )}

            {/* Línea Principal */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#0b333b"
                strokeWidth={3.5}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            )}

            {/* Puntos y Etiquetas X */}
            {points.map((pt, index) => (
              <g key={index} className="cursor-pointer">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredIndex === index ? 7 : 5}
                  fill="#FFFFFF"
                  stroke="#0b333b"
                  strokeWidth={hoveredIndex === index ? 3.5 : 2.5}
                  className="transition-all duration-200"
                />

                <text
                  x={pt.x}
                  y={height - 12}
                  textAnchor="middle"
                  className="fill-gray-400 text-[10px] font-bold"
                >
                  {pt.label}
                </text>

                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={24}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            ))}
          </svg>

          {/* Tooltip Absoluto Flotante */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <div
              className="absolute pointer-events-none rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-bold text-white shadow-lg transition-all duration-150 -translate-x-1/2 -translate-y-full"
              style={{
                left: `${(points[hoveredIndex].x / width) * 100}%`,
                top: `${(points[hoveredIndex].y / height) * 100 - 4}%`,
              }}
            >
              <div className="text-[10px] text-gray-400 font-medium leading-none">
                {points[hoveredIndex].label}
              </div>
              <div className="mt-1 text-sm font-extrabold text-[#2be1a4] leading-none">
                {formatMoneda(points[hoveredIndex].value)}
              </div>
              <div className="mt-1 text-[10px] text-gray-300 font-medium leading-none">
                {points[hoveredIndex].cantidad}{" "}
                {points[hoveredIndex].cantidad === 1 ? "venta" : "ventas"}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
