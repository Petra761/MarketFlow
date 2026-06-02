import { Link } from "react-router-dom";
import type { MisProductosDTO } from "../types/compras";

interface SellerProductCardProps {
  producto: MisProductosDTO;
  editPath: string;
  onDelete: (codigo: string) => void;
  deleting?: boolean;
}

export default function SellerProductCard({
  producto,
  editPath,
  onDelete,
  deleting,
}: SellerProductCardProps) {
  const sinStock = producto.stockActual <= 0;
  const stockBajo = producto.stockActual > 0 && producto.stockActual <= 5;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-slate-100">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Sin imagen
          </div>
        )}
        {producto.precioActual != null && (
          <span className="absolute right-3 top-3 rounded-lg bg-[#30718d] px-2 py-1 text-xs font-bold text-white">
            {producto.precioActual} Bs
          </span>
        )}
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-800">{producto.nombre}</h3>
          {sinStock ? (
            <span className="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
              Agotado
            </span>
          ) : stockBajo ? (
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
              Stock: {producto.stockActual}
            </span>
          ) : (
            <span className="shrink-0 text-[10px] font-medium text-slate-500">
              Stock: {producto.stockActual}
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-sm text-slate-500">{producto.descripcion}</p>
        <p className="text-xs text-slate-400">{producto.nombreCategoria}</p>

        <div className="flex gap-2 pt-2">
          <Link
            to={editPath}
            className="flex-1 rounded-full border border-slate-200 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Editar
          </Link>
          <button
            type="button"
            disabled={deleting}
            onClick={() => onDelete(producto.codigoProducto)}
            className="flex-1 rounded-full border border-slate-200 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
          >
            {deleting ? "..." : "Eliminar"}
          </button>
        </div>
      </div>
    </article>
  );
}
