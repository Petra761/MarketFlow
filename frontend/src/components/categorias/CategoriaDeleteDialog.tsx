interface Props {
  open: boolean;
  codigo: string;
  nombre: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function CategoriaDeleteDialog({ open, nombre, onCancel, onConfirm, loading }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 mx-4 overflow-hidden">
        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-rose-400 to-rose-500" />

        <div className="px-6 py-5 space-y-4">
          {/* Icono + título */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Eliminar Categoría</h3>
              <p className="text-xs text-gray-400 mt-0.5">Esta acción no se puede deshacer</p>
            </div>
          </div>

          {/* Mensaje */}
          <p className="text-sm text-gray-600">
            ¿Estás seguro que deseas eliminar la categoría{" "}
            <span className="font-semibold text-gray-800">&ldquo;{nombre}&rdquo;</span>?
          </p>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              id="btn-cancelar-eliminar"
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              id="btn-confirmar-eliminar"
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-rose-600 disabled:opacity-60"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
