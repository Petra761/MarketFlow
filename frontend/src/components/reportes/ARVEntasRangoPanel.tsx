import { useState } from "react";
import { useVentasRango } from "../../hooks/useVentasRango";

function formatMoneda(valor: number): string {
  return "Bs. " + new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

export function VentasRangoPanel() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const { data, loading, error, buscar } = useVentasRango();

  return (
    <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Encabezado */}
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
            Ventas por Rango de Fechas
          </h2>
        </div>

        {/* Formulario */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <button
            onClick={() => buscar(fechaInicio, fechaFin)}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1A535C] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#154249] focus:outline-none disabled:opacity-75"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
              />
            </svg>
            <span>{loading ? "Filtrando..." : "Filtrar"}</span>
          </button>
        </div>
      </div>

      {/* Estados y Tabla */}
      {error && (
        <div className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">Periodo</th>
                <th className="px-6 py-3 text-right">Total Ventas</th>
                <th className="px-6 py-3 text-right">Cantidad Ventas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {data.map((item) => (
                <tr
                  key={item.periodo}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.periodo}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    {formatMoneda(item.totalVentas)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500">
                    {item.cantidadVentas}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}