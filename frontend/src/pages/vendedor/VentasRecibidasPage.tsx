import { useAuth } from "../../hooks/useAuth";
import { useVentasRecibidas } from "../../hooks/useVentasRecibidas";

function formatFecha(fecha: string) {
  try {
    return new Date(fecha).toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return fecha;
  }
}

function badgeEstado(estado: string) {
  const base = "rounded-full px-2.5 py-0.5 text-xs font-semibold";
  if (estado === "Pagado" || estado === "Confirmado" || estado === "Entregado") {
    return `${base} bg-emerald-100 text-emerald-800`;
  }
  if (estado === "Pendiente") {
    return `${base} bg-amber-100 text-amber-800`;
  }
  return `${base} bg-slate-100 text-slate-600`;
}

export default function VentasRecibidasPage() {
  const { user } = useAuth();
  const { ventasCobradas, loading, error } = useVentasRecibidas(
    user?.codigoUsuario
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-[#1e3a4c] to-[#30718d] p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Ventas recibidas</h1>
        <p className="mt-2 text-sm text-blue-100">
          Cuando un comprador paga en el carrito, la venta aparece aquí con el
          total cobrado por tus productos.
        </p>
        {!loading && (
          <p className="mt-4 text-sm font-semibold text-white/90">
            {ventasCobradas.length} venta{ventasCobradas.length !== 1 ? "s" : ""}{" "}
            registrada{ventasCobradas.length !== 1 ? "s" : ""}
          </p>
        )}
      </section>

      {loading && (
        <p className="text-center text-slate-500">Cargando ventas…</p>
      )}
      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {!loading && !error && ventasCobradas.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Aún no tienes ventas pagadas.</p>
          <p className="mt-2 text-sm text-slate-400">
            Cuando alguien compre y pague tus productos, verás el registro aquí.
          </p>
        </div>
      )}

      {!loading && !error && ventasCobradas.length > 0 && (
        <ul className="space-y-3">
          {ventasCobradas.map((v) => {
            const primerProducto = v.productos?.[0]?.nombreProducto;
            const extra = (v.productos?.length ?? 0) - 1;
            const resumenProductos =
              primerProducto && extra > 0
                ? `${primerProducto} y ${extra} más`
                : primerProducto ?? "—";

            return (
              <li
                key={v.codigoPedido}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-800">
                      Pedido #{v.codigoPedido}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {v.comprador} · {formatFecha(v.fecha)}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {resumenProductos}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#30718d]">
                      {v.total.toLocaleString("es-BO")} Bs
                    </p>
                    <span className={`mt-2 inline-block ${badgeEstado(v.estadoPedido)}`}>
                      {v.estadoPedido}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
