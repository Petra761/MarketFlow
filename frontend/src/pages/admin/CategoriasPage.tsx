import { useState } from "react";
import { useCategorias } from "../../hooks/useCategorias";
import { CategoriaTable } from "../../components/categorias/CategoriaTable";
import { CategoriaModal } from "../../components/categorias/CategoriaModal";
import { CategoriaDeleteDialog } from "../../components/categorias/CategoriaDeleteDialog";
import type { CategoriaDTO, mCategoriaDTO, CategoriaModalMode } from "../../types/categoria";

interface ModalState {
  open: boolean;
  mode: CategoriaModalMode;
  categoria: CategoriaDTO | null;
}

interface DeleteState {
  open: boolean;
  codigo: string;
  nombre: string;
  loading: boolean;
}

export function CategoriasPage() {
  const { data, loading, error, refetch, crear, editar, eliminar } = useCategorias();

  const [searchTerm, setSearchTerm] = useState("");

  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "crear",
    categoria: null,
  });

  const [deleteState, setDeleteState] = useState<DeleteState>({
    open: false,
    codigo: "",
    nombre: "",
    loading: false,
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // ── Helpers ────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const openCrear = () =>
    setModal({ open: true, mode: "crear", categoria: null });

  const openEditar = (cat: CategoriaDTO) =>
    setModal({ open: true, mode: "editar", categoria: cat });

  const closeModal = () =>
    setModal((prev) => ({ ...prev, open: false }));

  const openDelete = (codigo: string) => {
    const cat = data.find((c) => c.codigoCategoria === codigo);
    if (!cat) return;
    setDeleteState({ open: true, codigo, nombre: cat.nombre, loading: false });
  };

  const closeDelete = () =>
    setDeleteState((prev) => ({ ...prev, open: false }));

  // ── Handlers ───────────────────────────────────────────
  const handleSubmit = async (formData: mCategoriaDTO, codigo?: string) => {
    if (codigo) {
      await editar(codigo, { ...formData, codigoCategoria: codigo });
      showToast(`Categoría "${formData.nombre}" actualizada correctamente.`);
    } else {
      await crear(formData);
      showToast(`Categoría "${formData.nombre}" creada correctamente.`);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteState((prev) => ({ ...prev, loading: true }));
    try {
      await eliminar(deleteState.codigo);
      closeDelete();
      showToast(`Categoría "${deleteState.nombre}" eliminada.`);
    } catch (err) {
      setDeleteState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="mx-auto max-w-5xl text-left space-y-6">

      {/* ── Toast ── */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-2xl bg-[#0b333b] px-5 py-3.5 text-sm font-medium text-white shadow-xl shadow-black/20 animate-fade-in">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2be1a4] text-[#0b333b]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          {toastMsg}
        </div>
      )}

      {/* ── Encabezado ── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-500 mb-1">
            Workspace
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Gestión de Categorías
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra las categorías de productos del sistema
          </p>
        </div>

        <button
          id="btn-nueva-categoria"
          onClick={openCrear}
          className="mt-3 sm:mt-0 flex items-center gap-2 self-start rounded-xl bg-[#0b333b] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#154650] hover:shadow-md active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nueva Categoría
        </button>
      </div>

      {/* ── Error global ── */}
      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-red-800 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {error}
          </div>
          <button
            id="btn-reintentar-categorias"
            type="button"
            onClick={refetch}
            className="rounded-xl bg-red-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-900"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* ── Buscador ── */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          id="input-buscar-categoria"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar categoría específica..."
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 placeholder-gray-400 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Tabla ── */}
      <CategoriaTable
        categorias={data}
        loading={loading}
        searchTerm={searchTerm}
        onEdit={openEditar}
        onDelete={openDelete}
      />

      {/* ── Modal Crear / Editar ── */}
      <CategoriaModal
        open={modal.open}
        mode={modal.mode}
        initialData={modal.categoria}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      {/* ── Dialog Eliminar ── */}
      <CategoriaDeleteDialog
        open={deleteState.open}
        codigo={deleteState.codigo}
        nombre={deleteState.nombre}
        onCancel={closeDelete}
        onConfirm={handleConfirmDelete}
        loading={deleteState.loading}
      />
    </div>
  );
}
