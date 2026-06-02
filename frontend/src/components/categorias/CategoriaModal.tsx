import { useEffect, useState } from "react";
import type { CategoriaDTO, mCategoriaDTO } from "../../types/categoria";

interface Props {
  open: boolean;
  mode: "crear" | "editar";
  initialData?: CategoriaDTO | null;
  onClose: () => void;
  onSubmit: (data: mCategoriaDTO, codigo?: string) => Promise<void>;
}

const emptyForm: mCategoriaDTO = {
  nombre: "",
};

export function CategoriaModal({ open, mode, initialData, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<mCategoriaDTO>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar formulario cuando cambia el modo / dato inicial
  useEffect(() => {
    if (!open) return;
    if (mode === "editar" && initialData) {
      setForm({
        nombre: initialData.nombre,
      });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [open, mode, initialData]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(form, mode === "editar" ? initialData?.codigoCategoria : undefined);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al guardar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-black/10 ring-1 ring-gray-200 animate-fade-in mx-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              {mode === "crear" ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">
                {mode === "crear" ? "Nueva Categoría" : "Editar Categoría"}
              </h2>
              {mode === "editar" && initialData && (
                <p className="text-xs text-gray-400 font-mono">#{initialData.codigoCategoria}</p>
              )}
            </div>
          </div>
          <button
            id="btn-cerrar-modal-categoria"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form id="form-categoria" onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75h.007v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          {/* Campo Nombre */}
          <div className="space-y-1.5">
            <label htmlFor="input-nombre-categoria" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Nombre <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-nombre-categoria"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. Electrónica, Ropa, Hogar..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
            />
          </div>


          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              id="btn-cancelar-categoria"
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              id="btn-guardar-categoria"
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-[#2be1a4] px-5 py-2 text-sm font-bold text-[#0b333b] shadow-sm transition hover:bg-[#22c991] disabled:opacity-60"
            >
              {submitting && (
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {mode === "crear" ? "Crear categoría" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
