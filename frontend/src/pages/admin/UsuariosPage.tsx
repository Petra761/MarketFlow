import { useState } from "react";
import { useUsuarios } from "../../hooks/useUsuarios";
import { UsuarioStatsCards } from "../../components/usuarios/UsuarioStatsCards";
import { UsuarioTable } from "../../components/usuarios/UsuarioTable";
import { UsuarioModal } from "../../components/usuarios/UsuarioModal";
import { UsuarioDeleteDialog } from "../../components/usuarios/UsuarioDeleteDialog";
import type { UsuarioGetDTO, UsuarioDTO, UsuarioPutDTO } from "../../types/usuario";

interface ModalState {
  open: boolean;
  mode: "crear" | "editar";
  usuario: UsuarioGetDTO | null;
}

interface DeleteState {
  open: boolean;
  codigo: string;
  nombre: string;
  loading: boolean;
}

export function UsuariosPage() {
  const {
    data,
    roles,
    stats,
    loading,
    error,
    refetch,
    crear,
    editar,
    bloquear,
    desbloquear,
    eliminar,
  } = useUsuarios();

  const [searchTerm, setSearchTerm] = useState("");

  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "crear",
    usuario: null,
  });

  const [deleteState, setDeleteState] = useState<DeleteState>({
    open: false,
    codigo: "",
    nombre: "",
    loading: false,
  });

  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "warning" } | null>(null);

  // ── Helpers ────────────────────────────────────────────
  const showToast = (text: string, type: "success" | "warning" = "success") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const openCrear = () =>
    setModal({ open: true, mode: "crear", usuario: null });

  const openEditar = (usuario: UsuarioGetDTO) =>
    setModal({ open: true, mode: "editar", usuario });

  const closeModal = () =>
    setModal((prev) => ({ ...prev, open: false }));

  const openDelete = (codigo: string, nombre: string) =>
    setDeleteState({ open: true, codigo, nombre, loading: false });

  const closeDelete = () =>
    setDeleteState((prev) => ({ ...prev, open: false }));

  // ── Handlers ───────────────────────────────────────────
  const handleSubmit = async (
    formData: UsuarioDTO | UsuarioPutDTO,
    codigo?: string
  ) => {
    if (codigo) {
      await editar(codigo, formData as UsuarioPutDTO);
      showToast("Usuario actualizado correctamente.");
    } else {
      await crear(formData as UsuarioDTO);
      showToast("Usuario creado correctamente.");
    }
  };

  const handleBloquear = async (codigo: string) => {
    try {
      const usuario = data.find((u) => u.codigoUsuario === codigo);
      await bloquear(codigo);
      showToast(`"${usuario?.nombre ?? "Usuario"}" bloqueado.`, "warning");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al bloquear.", "warning");
    }
  };

  const handleDesbloquear = async (codigo: string) => {
    try {
      const usuario = data.find((u) => u.codigoUsuario === codigo);
      await desbloquear(codigo);
      showToast(`"${usuario?.nombre ?? "Usuario"}" desbloqueado.`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al desbloquear.", "warning");
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteState((prev) => ({ ...prev, loading: true }));
    try {
      await eliminar(deleteState.codigo);
      closeDelete();
      showToast(`Usuario "${deleteState.nombre}" eliminado.`);
    } catch {
      setDeleteState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="mx-auto max-w-6xl text-left space-y-6">

      {/* ── Toast ── */}
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium text-white shadow-xl shadow-black/20 animate-fade-in ${
            toastMsg.type === "warning"
              ? "bg-amber-600"
              : "bg-[#0b333b]"
          }`}
        >
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              toastMsg.type === "warning" ? "bg-amber-200 text-amber-800" : "bg-[#2be1a4] text-[#0b333b]"
            }`}
          >
            {toastMsg.type === "warning" ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
          </div>
          {toastMsg.text}
        </div>
      )}

      {/* ── Encabezado ── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-500 mb-1">
            Workspace
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra los accesos y el estado de los usuarios
          </p>
        </div>
        <button
          id="btn-crear-usuario"
          onClick={openCrear}
          className="mt-3 sm:mt-0 flex items-center gap-2 self-start rounded-xl bg-[#0b333b] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#154650] hover:shadow-md active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
          Crear Usuario
        </button>
      </div>

      {/* ── Tarjetas de resumen ── */}
      <UsuarioStatsCards stats={stats} loading={loading} />

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
            id="btn-reintentar-usuarios"
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
          id="input-buscar-usuario"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar usuarios o roles..."
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
      <UsuarioTable
        usuarios={data}
        loading={loading}
        searchTerm={searchTerm}
        onEdit={openEditar}
        onDelete={openDelete}
        onBloquear={handleBloquear}
        onDesbloquear={handleDesbloquear}
      />

      {/* ── Modal Crear / Editar ── */}
      <UsuarioModal
        open={modal.open}
        mode={modal.mode}
        initialData={modal.usuario}
        roles={roles}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      {/* ── Dialog Eliminar ── */}
      <UsuarioDeleteDialog
        open={deleteState.open}
        nombre={deleteState.nombre}
        onCancel={closeDelete}
        onConfirm={handleConfirmDelete}
        loading={deleteState.loading}
      />
    </div>
  );
}
