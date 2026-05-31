import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useMisProductos } from "../../hooks/useMisProductos";
import { useVentasRecibidas } from "../../hooks/useVentasRecibidas";

const STOCK_BAJO = 5;

export default function DashboardVendedorPage() {
  const { user } = useAuth();
  const codigo = user?.codigoUsuario;
  const { productos, loading: loadingProd } = useMisProductos(codigo);
  const { ventasCobradas, totalIngresos, loading: loadingVentas } =
    useVentasRecibidas(codigo);

  const activos = productos.length;
  const stockBajo = productos.filter(
    (p) => p.stockActual > 0 && p.stockActual <= STOCK_BAJO
  ).length;
  const agotados = productos.filter((p) => p.stockActual <= 0).length;
  const unidades = productos.reduce((s, p) => s + p.stockActual, 0);
  const loading = loadingProd || loadingVentas;

  const cards = [
    {
      label: "Ventas cobradas",
      value: loading ? "…" : String(ventasCobradas.length),
      hint: "Compradores que ya pagaron",
    },
    {
      label: "Ingresos",
      value: loading ? "…" : `${totalIngresos.toLocaleString("es-BO")} Bs`,
      hint: "Total de tus productos vendidos",
    },
    {
      label: "Productos activos",
      value: loading ? "…" : String(activos),
      hint: "En tu inventario",
    },
    {
      label: "Stock bajo",
      value: loading ? "…" : String(stockBajo),
      hint: `≤ ${STOCK_BAJO} unidades`,
      warn: stockBajo > 0,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a4c] to-[#30718d] p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Resumen de ventas</h1>
        <p className="mt-2 max-w-xl text-sm text-blue-100">
          Hola{user?.name ? `, ${user.name}` : ""}. Aquí ves tus ventas pagadas
          y el estado de tu inventario.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/vendedor/ventas"
            className="rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold backdrop-blur hover:bg-white/25"
          >
            Ver ventas recibidas
          </Link>
          <Link
            to="/vendedor/inventario/nuevo"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#1e3a4c] hover:bg-blue-50"
          >
            + Nuevo producto
          </Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {c.label}
            </p>
            <p
              className={`mt-2 text-2xl font-bold ${
                c.warn ? "text-amber-600" : "text-slate-800"
              }`}
            >
              {c.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{c.hint}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">Estado de mi inventario</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <p className="text-2xl font-bold text-slate-800">
              {loading ? "…" : Math.max(0, activos - stockBajo - agotados)}
            </p>
            <p className="text-xs text-slate-500">Con stock OK</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4 text-center">
            <p className="text-2xl font-bold text-amber-700">
              {loading ? "…" : stockBajo}
            </p>
            <p className="text-xs text-amber-800">Bajo stock</p>
          </div>
          <div className="rounded-xl bg-rose-50 p-4 text-center">
            <p className="text-2xl font-bold text-rose-700">
              {loading ? "…" : agotados}
            </p>
            <p className="text-xs text-rose-800">Agotados</p>
          </div>
          <div className="rounded-xl bg-[#30718d] p-4 text-center text-white">
            <p className="text-2xl font-bold">{loading ? "…" : unidades}</p>
            <p className="text-xs text-blue-100">Unidades totales</p>
          </div>
        </div>
      </section>
    </div>
  );
}
