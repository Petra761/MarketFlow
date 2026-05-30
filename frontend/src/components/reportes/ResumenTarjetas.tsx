import type { ReactNode } from "react";
import type { VentasResumen, MetricaResumen } from "../../hooks/useVentasResumen";

interface CardProps {
  title: string;
  metric: MetricaResumen;
  iconBg: string;
  iconColor: string;
  icon: ReactNode;
  loading: boolean;
  isActive: boolean;
  onClick: () => void;
}

function formatMoneda(valor: number): string {
  return "Bs. " + new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

function TarjetaMetrica({
  title,
  metric,
  iconBg,
  iconColor,
  icon,
  loading,
  isActive,
  onClick,
}: CardProps) {
  const isPositive = metric.tendencia >= 0;
  const trendColor = isPositive ? "text-emerald-500" : "text-rose-500";
  const trendBg = isPositive ? "bg-emerald-50" : "bg-rose-50";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`flex flex-col w-full text-left justify-between rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
        isActive
          ? "border-[#0b333b] bg-teal-50/10 ring-2 ring-[#0b333b]/10 shadow-md"
          : "border-gray-100 bg-white"
      }`}
    >
      {/* Fila superior: Icono y Tendencia */}
      <div className="flex items-center justify-between mb-4 w-full">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        {!loading && (
          <div
            className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${trendBg} ${trendColor}`}
          >
            <span>{isPositive ? "↑" : "↓"}</span>
            <span>{Math.abs(metric.tendencia).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {/* Fila central: Etiqueta y Valor */}
      <div className="mt-2 text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {title}
        </span>
        {loading ? (
          <div className="mt-1 h-8 w-28 animate-pulse rounded bg-gray-100" />
        ) : (
          <div className="mt-1 text-2xl font-extrabold text-gray-900 leading-none break-all">
            {formatMoneda(metric.valor)}
          </div>
        )}
      </div>

      {/* Fila inferior: Comparativa */}
      <div className="mt-3 text-left">
        {loading ? (
          <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
        ) : (
          <span className="text-xs font-medium text-gray-400">
            {metric.subtext}
          </span>
        )}
      </div>
    </button>
  );
}

interface ResumenTarjetasProps {
  data: VentasResumen;
  loading: boolean;
  activePeriod: "dia" | "semana" | "mes" | "anual" | null;
  onSelectPeriod: (period: "dia" | "semana" | "mes" | "anual") => void;
}

export function ResumenTarjetas({
  data,
  loading,
  activePeriod,
  onSelectPeriod,
}: ResumenTarjetasProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Tarjeta 1: Ventas Día */}
      <TarjetaMetrica
        title="Ventas Día"
        metric={data.ventasDia}
        iconBg="bg-sky-50"
        iconColor="text-sky-500"
        loading={loading}
        isActive={activePeriod === "dia"}
        onClick={() => onSelectPeriod("dia")}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3m-3-6h10.5m-12 9h13.5A2.25 2.25 0 0021 15.75V8.25A2.25 2.25 0 0018.75 6H5.25A2.25 2.25 0 003 8.25v7.5A2.25 2.25 0 005.25 18z"
            />
          </svg>
        }
      />

      {/* Tarjeta 2: Ventas Semana */}
      <TarjetaMetrica
        title="Ventas Semana"
        metric={data.ventasSemana}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-500"
        loading={loading}
        isActive={activePeriod === "semana"}
        onClick={() => onSelectPeriod("semana")}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
        }
      />

      {/* Tarjeta 3: Ventas Mes */}
      <TarjetaMetrica
        title="Ventas Mes"
        metric={data.ventasMes}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-500"
        loading={loading}
        isActive={activePeriod === "mes"}
        onClick={() => onSelectPeriod("mes")}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h10.5m-9.75 3h9.75M9 21h6a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0015 4.5H9a2.25 2.25 0 00-2.25 2.25v12A2.25 2.25 0 009 21z"
            />
          </svg>
        }
      />

      {/* Tarjeta 4: Ventas Anual */}
      <TarjetaMetrica
        title="Ventas Anual"
        metric={data.ventasAnual}
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
        loading={loading}
        isActive={activePeriod === "anual"}
        onClick={() => onSelectPeriod("anual")}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
            />
          </svg>
        }
      />
    </div>
  );
}
