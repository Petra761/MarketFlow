import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { UsuarioGetDTO, UsuarioDTO, UsuarioPutDTO, RolDTO } from "../../types/usuario";

interface Props {
  open: boolean;
  mode: "crear" | "editar";
  initialData?: UsuarioGetDTO | null;
  roles: RolDTO[];
  onClose: () => void;
  onSubmit: (data: UsuarioDTO | UsuarioPutDTO, codigo?: string) => Promise<void>;
}

interface CrearForm extends UsuarioDTO {}
interface EditarForm extends UsuarioPutDTO {}

const emptyCrear: CrearForm = {
  codigoRol: "",
  nombre: "",
  apellido: "",
  nickname: "",
  correo: "",
  contrasenia: "",
  numero: "",
};

export function UsuarioModal({ open, mode, initialData, roles, onClose, onSubmit }: Props) {
  const [crearForm, setCrearForm] = useState<CrearForm>(emptyCrear);
  const [editarForm, setEditarForm] = useState<EditarForm>({
    nombre: "",
    apellido: "",
    nickname: "",
    correo: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (mode === "editar" && initialData) {
      setEditarForm({
        nombre: initialData.nombre,
        apellido: initialData.apellido,
        nickname: initialData.nickname,
        correo: initialData.correo,
      });
    } else {
      setCrearForm({ ...emptyCrear, codigoRol: roles[0]?.codigoRol ?? "" });
    }
  }, [open, mode, initialData, roles]);

  if (!open) return null;

  const handleChangeCrear = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCrearForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeEditar = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditarForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (mode === "crear") {
      if (!crearForm.nombre.trim() || !crearForm.correo.trim() || !crearForm.contrasenia.trim()) {
        setError("Nombre, correo y contraseña son obligatorios.");
        return;
      }
    } else {
      if (!editarForm.nombre.trim() || !editarForm.correo.trim()) {
        setError("Nombre y correo son obligatorios.");
        return;
      }
    }

    setSubmitting(true);
    setError(null);
    try {
      if (mode === "crear") {
        await onSubmit(crearForm);
      } else {
        await onSubmit(editarForm, initialData?.codigoUsuario);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al guardar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl shadow-black/10 ring-1 ring-gray-200 mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              {mode === "crear" ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">
                {mode === "crear" ? "Crear Usuario" : "Editar Usuario"}
              </h2>
              {mode === "editar" && initialData && (
                <p className="text-xs text-gray-400">#{initialData.codigoUsuario}</p>
              )}
            </div>
          </div>
          <button
            id="btn-cerrar-modal-usuario"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form id="form-usuario" onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          {mode === "crear" ? (
            /* ── CREAR ── */
            <>
              {/* Rol */}
              <div className="space-y-1.5">
                <label htmlFor="select-rol-usuario" className="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Rol <span className="text-rose-500">*</span>
                </label>
                <select
                  id="select-rol-usuario"
                  name="codigoRol"
                  value={crearForm.codigoRol}
                  onChange={handleChangeCrear}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
                >
                  {roles.map((r) => (
                    <option key={r.codigoRol} value={r.codigoRol}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nombre + Apellido */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="input-nombre-usuario" className="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Nombre <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-nombre-usuario"
                    name="nombre"
                    type="text"
                    value={crearForm.nombre}
                    onChange={handleChangeCrear}
                    placeholder="Ana"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="input-apellido-usuario" className="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Apellido
                  </label>
                  <input
                    id="input-apellido-usuario"
                    name="apellido"
                    type="text"
                    value={crearForm.apellido}
                    onChange={handleChangeCrear}
                    placeholder="Martínez"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
                  />
                </div>
              </div>

              {/* Nickname */}
              <div className="space-y-1.5">
                <label htmlFor="input-nickname-usuario" className="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Nickname
                </label>
                <input
                  id="input-nickname-usuario"
                  name="nickname"
                  type="text"
                  value={crearForm.nickname}
                  onChange={handleChangeCrear}
                  placeholder="@anamartinez"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
                />
              </div>

              {/* Correo */}
              <div className="space-y-1.5">
                <label htmlFor="input-correo-usuario" className="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Correo <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-correo-usuario"
                  name="correo"
                  type="email"
                  value={crearForm.correo}
                  onChange={handleChangeCrear}
                  placeholder="ana@marketflow.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
                />
              </div>

              {/* Contraseña */}
              <div className="space-y-1.5">
                <label htmlFor="input-contrasenia-usuario" className="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Contraseña <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-contrasenia-usuario"
                  name="contrasenia"
                  type="password"
                  value={crearForm.contrasenia}
                  onChange={handleChangeCrear}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
                />
              </div>

              {/* Teléfono */}
              <div className="space-y-1.5">
                <label htmlFor="input-numero-usuario" className="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Teléfono
                </label>
                <input
                  id="input-numero-usuario"
                  name="numero"
                  type="tel"
                  value={crearForm.numero}
                  onChange={handleChangeCrear}
                  placeholder="+506 8888-1234"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
                />
              </div>
            </>
          ) : (
            /* ── EDITAR ── */
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="input-edit-nombre" className="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Nombre <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-edit-nombre"
                    name="nombre"
                    type="text"
                    value={editarForm.nombre}
                    onChange={handleChangeEditar}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="input-edit-apellido" className="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Apellido
                  </label>
                  <input
                    id="input-edit-apellido"
                    name="apellido"
                    type="text"
                    value={editarForm.apellido}
                    onChange={handleChangeEditar}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="input-edit-nickname" className="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Nickname
                </label>
                <input
                  id="input-edit-nickname"
                  name="nickname"
                  type="text"
                  value={editarForm.nickname}
                  onChange={handleChangeEditar}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="input-edit-correo" className="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Correo <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-edit-correo"
                  name="correo"
                  type="email"
                  value={editarForm.correo}
                  onChange={handleChangeEditar}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
                />
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              id="btn-cancelar-usuario"
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              id="btn-guardar-usuario"
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
              {mode === "crear" ? "Crear usuario" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
