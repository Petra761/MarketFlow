import type { CategoriaDTO, CategoriaAdminDTO } from "../../types/categoria";

interface Props {
  categorias: CategoriaAdminDTO[];
  loading: boolean;
  searchTerm: string;
  onEdit: (categoria: CategoriaDTO) => void;
  onDelete: (codigo: string) => void;
}

// Íconos SVG inline por categoría (decorativo)
const CategoryIcon = ({ index }: { index: number }) => {
  const icons = [
    // Tag
    <svg key="tag" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.44 1.44 0 002.036 0l4.318-4.318a1.44 1.44 0 000-2.036L10.01 3.659A2.25 2.25 0 008.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>,
    // Cube
    <svg key="cube" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>,
    // ShoppingBag
    <svg key="bag" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
    </svg>,
    // Star
    <svg key="star" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>,
  ];
  return icons[index % icons.length];
};

const iconColors = [
  "bg-teal-100 text-teal-600",
  "bg-violet-100 text-violet-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
  "bg-sky-100 text-sky-600",
  "bg-emerald-100 text-emerald-600",
];

export function CategoriaTable({ categorias, loading, searchTerm, onEdit, onDelete }: Props) {
  const filtered = (categorias ?? []).filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.codigoCategoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.44 1.44 0 002.036 0l4.318-4.318a1.44 1.44 0 000-2.036L10.01 3.659A2.25 2.25 0 008.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
        </div>
        <p className="text-base font-semibold text-gray-700">
          {searchTerm ? "Sin resultados para tu búsqueda" : "No hay categorías registradas"}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          {searchTerm ? "Intenta con otro término" : "Crea la primera categoría usando el botón superior"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Encabezado de tabla */}
      <div className="grid grid-cols-[2fr_3fr_auto] gap-4 border-b border-gray-100 bg-gray-50/70 px-6 py-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Nombre de categoría
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Cant. Productos
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 text-right">
          Acciones
        </span>
      </div>

      {/* Filas */}
      <div className="divide-y divide-gray-100">
        {filtered.map((cat, index) => (
          <div
            key={cat.codigoCategoria}
            className="grid grid-cols-[2fr_3fr_auto] gap-4 items-center px-6 py-4 transition-colors duration-150 hover:bg-gray-50/50"
          >
            {/* Nombre + Código */}
            <div className="flex items-center gap-3 min-w-0">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconColors[index % iconColors.length]}`}>
                <CategoryIcon index={index} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {cat.nombre}
                </p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  #{cat.codigoCategoria}
                </p>
              </div>
            </div>

            {/* Cantidad Productos */}
            <p className="text-sm text-gray-600 font-medium">
              {cat.cantidadProductos} {cat.cantidadProductos === 1 ? 'producto' : 'productos'}
            </p>

            {/* Acciones */}
            <div className="flex items-center gap-2 justify-end">
              <button
                id={`btn-editar-${cat.codigoCategoria}`}
                onClick={() => onEdit(cat)}
                title="Editar categoría"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-teal-50 hover:text-teal-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              <button
                id={`btn-eliminar-${cat.codigoCategoria}`}
                onClick={() => onDelete(cat.codigoCategoria)}
                title="Eliminar categoría"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-rose-50 hover:text-rose-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer con conteo */}
      <div className="border-t border-gray-100 bg-gray-50/40 px-6 py-3">
        <p className="text-xs text-gray-400">
          Mostrando <span className="font-semibold text-gray-600">{filtered.length}</span> de{" "}
          <span className="font-semibold text-gray-600">{categorias.length}</span> categorías
        </p>
      </div>
    </div>
  );
}
