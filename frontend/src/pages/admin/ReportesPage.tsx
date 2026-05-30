import { useState } from "react";
import { CantidadVendidaChart } from "../../components/reportes/CantidadVendidaChart";
import { MasVendidosList } from "../../components/reportes/MasVendidosList";
import { VentasPorCategoriaChart } from "../../components/reportes/VentasPorCategoriaChart";
import { VentasRangoPanel } from "../../components/reportes/ARVEntasRangoPanel";
import { UsuarioRegistradoChart } from "../../components/reportes/ARUsuarioRegistradoChart";
import { ResumenTarjetas } from "../../components/reportes/ResumenTarjetas";
import { VentasDetalleChart } from "../../components/reportes/VentasDetalleChart";

import { useProductosMasVendidos } from "../../hooks/useProductosMasVendidos";
import { useVentasCategoria } from "../../hooks/useVentasCategoria";
import { useEstadisticasUsuarios } from "../../hooks/useEstadisticasUsuarios";
import { useVentasResumen } from "../../hooks/useVentasResumen";

export function ReportesPage() {
  const [activePeriod, setActivePeriod] = useState<"dia" | "semana" | "mes" | "anual" | null>(null);

  const { data, loading, error, refetch } = useVentasCategoria();

  const {
    data: masVendidos,
    loading: loadingMasVendidos,
    error: errorMasVendidos,
    refetch: refetchMasVendidos,
  } = useProductosMasVendidos();

  const {
    data: usuarios,
    loading: loadingUsuarios,
    error: errorUsuarios,
    refetch: refetchUsuarios,
  } = useEstadisticasUsuarios();

  const {
    data: resumenData,
    loading: resumenLoading,
    error: resumenError,
    refetch: refetchResumen,
  } = useVentasResumen();

  const hasAnyError = error || errorUsuarios || errorMasVendidos || resumenError;

  return (
    <div className="mx-auto max-w-7xl text-left space-y-6">
      {/* Título de la Sección */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Panel de Reportes
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Visualiza el rendimiento de MarketFlow en tiempo real.
        </p>
      </div>

      {/* Alerta de Error y Botón de Reintento */}
      {hasAnyError && (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-red-800 shadow-sm"
          role="alert"
        >
          <span className="text-sm font-medium">
            {error || errorUsuarios || errorMasVendidos || resumenError}
          </span>

          <button
            type="button"
            onClick={() => {
              refetch();
              refetchUsuarios();
              refetchMasVendidos();
              refetchResumen();
            }}
            className="rounded-xl bg-red-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-900"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Fila Superior: Tarjetas de resumen */}
      <ResumenTarjetas
        data={resumenData}
        loading={resumenLoading}
        activePeriod={activePeriod}
        onSelectPeriod={(period) => {
          setActivePeriod((prev) => (prev === period ? null : period));
        }}
      />

      {/* Gráfico Detallado Interactivo (se genera al presionar un cuadro superior) */}
      {activePeriod && (
        <VentasDetalleChart
          type={activePeriod}
          data={
            activePeriod === "dia"
              ? resumenData.ventasDia.rawData
              : activePeriod === "semana"
              ? resumenData.ventasSemana.rawData
              : activePeriod === "mes"
              ? resumenData.ventasMes.rawData
              : resumenData.ventasAnual.rawData
          }
          onClose={() => setActivePeriod(null)}
        />
      )}

      {/* Rango de Fechas */}
      <VentasRangoPanel />

      {/* Grilla Central de 3 Columnas: Categoria, Cantidad y Productos Destacados */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <VentasPorCategoriaChart data={data} loading={loading} />
        <CantidadVendidaChart data={data} loading={loading} />
        <MasVendidosList
          data={masVendidos}
          loading={loadingMasVendidos}
          error={errorMasVendidos}
          onRetry={refetchMasVendidos}
        />
      </div>

      {/* Sección Inferior de Crecimiento de Usuarios a ancho completo */}
      <UsuarioRegistradoChart data={usuarios} loading={loadingUsuarios} />
    </div>
  );
}