import type { CategoriaDTO, CategoriaAdminDTO } from "../../types/categoria";

interface Props {
  categorias: CategoriaAdminDTO[];
  loading: boolean;
  searchTerm: string;
  onEdit: (categoria: CategoriaDTO) => void;
  onDelete: (codigo: string) => void;
}

// Íconos SVG inline por categoría
const CategoryIcon = ({ index }: { index: number }) => {
  const icons = [
    <svg key="tag" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.44 1.44 0 002.036 0l4.318-4.318a1.44 1.44 0 000-2.036L10.01 3.659A2.25 2.25 0 008.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>,

    <svg key="cube" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>,

    <svg key="bag" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
    </svg>,

    <svg key="star" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>,
  ];

  return icons[index % icons.length];
};

export function CategoriaTable({
  categorias = [],
  loading,
  searchTerm,
  onEdit,
  onDelete,
}: Props) {
  const filtered = categorias.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.codigoCategoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 text-center">
        Cargando categorías...
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No se encontraron categorías.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="grid grid-cols-[2fr_1fr_auto] gap-4 border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Nombre de Categoría
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Productos
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 text-right">
          Acciones
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {filtered.map((cat, index) => (
          <div
            key={cat.codigoCategoria}
            className="grid grid-cols-[2fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#0a4f66]">
                <CategoryIcon index={index} />
              </div>

              <p className="font-semibold text-[#334155]">
                {cat.nombre}
              </p>
            </div>

            <div>
              <span className="rounded-full bg-[#5ee2a0] px-3 py-1 text-xs font-bold text-white">
                {cat.cantidadProductos} Items
              </span>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => onEdit(cat)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-500 transition-colors hover:bg-blue-50"
                title="Editar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zM16.862 4.487L19.5 7.125"
                  />
                </svg>
              </button>

              <button
                onClick={() => onDelete(cat.codigoCategoria)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50"
                title="Eliminar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 bg-[#f8fafc] px-6 py-4">
        <p className="text-sm text-gray-500">
          Mostrando {filtered.length} de {categorias.length} categorías
        </p>
      </div>
    </div>
  );
}
