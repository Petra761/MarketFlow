import { useState } from "react";
import type { UsuarioEstadisticaDTO } from "../../types/reportes";
import { ReportCard } from "./ReportCard";

interface Props {
  data: UsuarioEstadisticaDTO[];
  loading?: boolean;
}

function formatPeriodo(periodo: string): string {
  const parts = periodo.split("/");
  if (parts.length === 2) {
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
    const m = parseInt(parts[0], 10);
    if (m >= 1 && m <= 12) {
      return `${meses[m - 1]} ${parts[1].slice(-2)}`;
    }
  }
  return periodo;
}

export function UsuarioRegistradoChart({ data, loading = false }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Dimensiones del SVG
  const width = 800;
  const height = 240;
  const paddingLeft = 40;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 45;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  // Filtrar y validar datos
  const activeData = data && data.length > 0 ? data : [];

  const maxVal =
    activeData.length > 0
      ? Math.max(...activeData.map((d) => d.cantidadUsuarios))
      : 1;

  // Ajustar el máximo de Y para tener un espacio superior (redondear hacia arriba)
  const yMax = Math.ceil(maxVal * 1.25);

  // Coordenadas de los puntos
  const points = activeData.map((d, i) => {
    const x =
      activeData.length > 1
        ? paddingLeft + (i / (activeData.length - 1)) * innerWidth
        : paddingLeft + innerWidth / 2;
    const y = height - paddingBottom - (d.cantidadUsuarios / yMax) * innerHeight;
    return { x, y, value: d.cantidadUsuarios, label: formatPeriodo(d.periodo) };
  });

  // Generar la cadena del path para la línea
  let linePath = "";
  let areaPath = "";

  if (points.length > 1) {
    // Generar línea suavizada con curvas Bezier (Cubic Splines) o segmentos limpios
    // Usaremos segmentos de línea limpios para exactitud y estética moderna, o curvas.
    // Generemos una spline simple o curva Catmull-Rom para dar el efecto de la imagen.
    // Vamos a generar una línea continua limpia con curvas bezier cuadráticas sencillas para suavizarla
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

    // El área debajo de la línea debe cerrarse en el eje X
    areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom
      } L ${points[0].x} ${height - paddingBottom} Z`;
  } else if (points.length === 1) {
    linePath = `M ${paddingLeft} ${points[0].y} L ${width - paddingRight
      } ${points[0].y}`;
    areaPath = `M ${paddingLeft} ${points[0].y} L ${width - paddingRight
      } ${points[0].y} L ${width - paddingRight} ${height - paddingBottom
      } L ${paddingLeft} ${height - paddingBottom} Z`;
  }

  // Líneas de cuadrícula horizontales
  const gridLines = [];
  const gridTicksCount = 4;
  for (let i = 0; i <= gridTicksCount; i++) {
    const val = (yMax / gridTicksCount) * i;
    const y = height - paddingBottom - (val / yMax) * innerHeight;
    gridLines.push({ y, val: Math.round(val) });
  }

  return (
    <ReportCard title="Crecimiento de Usuarios Activos">
      <div className="text-left mb-6">
        <p className="text-xs text-gray-400 font-medium">
          Tendencia de registros (Mes/Año)
        </p>
      </div>

      {loading ? (
        <p className="py-16 text-center text-sm text-gray-400 animate-pulse">
          Cargando gráfico de crecimiento…
        </p>
      ) : activeData.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">
          Sin registros de usuarios en el periodo
        </p>
      ) : (
        <div className="relative w-full">
          {/* SVG Responsivo */}
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible"
            role="img"
            aria-label="Gráfica de crecimiento de usuarios"
          >
            <defs>
              {/* Degradado para el área bajo la curva */}
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A535C" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#1A535C" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Líneas de cuadrícula horizontales */}
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

            {/* Etiquetas del eje Y (a la izquierda) */}
            <g className="fill-gray-400 text-[10px] font-semibold text-right">
              {gridLines.map((line, index) => (
                <text
                  key={index}
                  x={paddingLeft - 10}
                  y={line.y + 4}
                  textAnchor="end"
                >
                  {line.val}
                </text>
              ))}
            </g>

            {/* Área rellena */}
            {areaPath && (
              <path
                d={areaPath}
                fill="url(#areaGradient)"
                className="transition-all duration-500"
              />
            )}

            {/* Línea principal del gráfico */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#1A535C"
                strokeWidth={3.5}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            )}

            {/* Puntos y Hover Interactivos */}
            {points.map((pt, index) => (
              <g key={index} className="cursor-pointer">
                {/* Punto exterior blanco y borde de color */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredIndex === index ? 7 : 5}
                  fill="#FFFFFF"
                  stroke="#1A535C"
                  strokeWidth={hoveredIndex === index ? 3.5 : 2.5}
                  className="transition-all duration-200"
                />

                {/* Etiquetas de fechas en el eje X */}
                <text
                  x={pt.x}
                  y={height - 12}
                  textAnchor="middle"
                  className="fill-gray-400 text-[10px] font-bold"
                >
                  {pt.label}
                </text>

                {/* Círculo invisible más grande para facilitar el hover */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={20}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            ))}
          </svg>

          {/* Tooltip flotante interactivo en HTML absoluto */}
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
              <div className="mt-1 text-sm font-extrabold text-teal-400 leading-none">
                {points[hoveredIndex].value}{" "}
                {points[hoveredIndex].value === 1 ? "usuario" : "usuarios"}
              </div>
            </div>
          )}
        </div>
      )}
    </ReportCard>
  );
}