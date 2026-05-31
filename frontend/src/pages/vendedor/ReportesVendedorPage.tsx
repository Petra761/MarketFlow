import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useMisProductos } from "../../hooks/useMisProductos";
import { useVentasRecibidas } from "../../hooks/useVentasRecibidas";

export default function ReportesVendedorPage() {
  const { user } = useAuth();
  const codigo = user?.codigoUsuario;
  const { ventasCobradas, totalIngresos, productosMasVendidos, loading, error } =
    useVentasRecibidas(codigo);
  const { productos } = useMisProductos(codigo);

  const ticketPromedio =
    ventasCobradas.length > 0 ? totalIngresos / ventasCobradas.length : 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-slate-800">Reportes y analíticas</h1>
        <p className="mt-2 text-slate-500">
          Resumen calculado desde tus ventas pagadas y tu inventario actual.
        </p>
      </section>

      {loading && <p className="text-slate-500">Calculando reportes…</p>}
      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase text-slate-500">
                Ventas cobradas
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">
                {ventasCobradas.length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase text-slate-500">
                Ingresos totales
              </p>
              <p className="mt-2 text-3xl font-bold text-[#30718d]">
                {totalIngresos.toLocaleString("es-BO")} Bs
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase text-slate-500">
                Ticket promedio
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">
                {ticketPromedio.toLocaleString("es-BO", {
                  maximumFractionDigits: 0,
                })}{" "}
                Bs
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase text-slate-500">
                Productos activos
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">
                {productos.length}
              </p>
            </div>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">
              Productos más vendidos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Unidades vendidas en pedidos ya pagados.
            </p>
            {productosMasVendidos.length === 0 ? (
              <p className="mt-6 text-sm text-slate-400">
                Sin ventas pagadas todavía.
              </p>
            ) : (
              <ul className="mt-6 space-y-3">
                {productosMasVendidos.map((p, i) => {
                  const max = productosMasVendidos[0]?.cantidad ?? 1;
                  const pct = Math.round((p.cantidad / max) * 100);
                  return (
                    <li key={p.nombre}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          {i + 1}. {p.nombre}
                        </span>
                        <span className="shrink-0 text-slate-500">
                          {p.cantidad === 1
                            ? "1 unidad"
                            : `${p.cantidad} unidades`}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#30718d]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <p className="text-center text-xs text-slate-400">
            Los reportes se actualizan con cada venta que el comprador marca como
            pagada en{" "}
            <Link to="/vendedor/ventas" className="text-[#30718d] hover:underline">
              Ventas recibidas
            </Link>
            .
          </p>
        </>
      )}
    </div>
  );
}
