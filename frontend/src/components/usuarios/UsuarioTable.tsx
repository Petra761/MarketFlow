import type { UsuarioGetDTO } from "../../types/usuario";

interface Props {
  usuarios: UsuarioGetDTO[];
  loading: boolean;
  searchTerm: string;
  onEdit: (usuario: UsuarioGetDTO) => void;
  onDelete: (codigo: string, nombre: string) => void;
  onBloquear: (codigo: string) => void;
  onDesbloquear: (codigo: string) => void;
}

/** Genera iniciales para el avatar */
function getInitials(nombre: string, apellido: string) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

/** Colores de avatar basados en el índice */
const avatarColors = [
  "bg-teal-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-sky-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-orange-500",
];

/** Badge de rol */
function RolBadge({ rol }: { rol: string }) {
  const lower = rol.toLowerCase();
  let classes = "bg-gray-100 text-gray-600";
  if (lower.includes("admin") || lower.includes("super")) {
    classes = "bg-violet-100 text-violet-700";
  } else if (lower.includes("vend") || lower.includes("seller")) {
    classes = "bg-amber-100 text-amber-700";
  } else if (lower.includes("compr") || lower.includes("buyer") || lower.includes("client")) {
    classes = "bg-sky-100 text-sky-700";
  }
  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${classes}`}>
      {rol}
    </span>
  );
}

/** Badge de estado */
function EstadoBadge({ estado }: { estado: string }) {
  const isActive = estado === "Activo";
  const isBlocked = estado === "Bloqueado";
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={`h-2 w-2 rounded-full ${
          isActive ? "bg-teal-400" : isBlocked ? "bg-rose-400" : "bg-gray-300"
        }`}
      />
      <span
        className={`text-sm font-medium ${
          isActive ? "text-teal-600" : isBlocked ? "text-rose-500" : "text-gray-400"
        }`}
      >
        {estado}
      </span>
    </span>
  );
}

export function UsuarioTable({
  usuarios,
  loading,
  searchTerm,
  onEdit,
  onDelete,
  onBloquear,
  onDesbloquear,
}: Props) {
  const filtered = usuarios.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(term) ||
      u.apellido.toLowerCase().includes(term) ||
      u.correo.toLowerCase().includes(term) ||
      u.nickname.toLowerCase().includes(term) ||
      u.nombreRol.toLowerCase().includes(term) ||
      u.estado.toLowerCase().includes(term)
    );
  });

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
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <p className="text-base font-semibold text-gray-700">
          {searchTerm ? "Sin resultados" : "No hay usuarios registrados"}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          {searchTerm ? "Intenta con otro término de búsqueda" : "Crea el primer usuario usando el botón superior"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Encabezado */}
      <div className="hidden md:grid md:grid-cols-[2.5fr_2fr_1.5fr_1fr_auto] gap-4 border-b border-gray-100 bg-gray-50/70 px-6 py-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Usuario</span>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Email</span>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Rol</span>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Estado</span>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Acciones</span>
      </div>

      {/* Filas */}
      <div className="divide-y divide-gray-100">
        {filtered.map((usuario, index) => {
          const isBlocked = usuario.estado === "Bloqueado";
          return (
            <div
              key={usuario.codigoUsuario}
              className="grid grid-cols-1 md:grid-cols-[2.5fr_2fr_1.5fr_1fr_auto] gap-3 md:gap-4 items-center px-6 py-4 transition-colors duration-150 hover:bg-gray-50/50"
            >
              {/* Avatar + nombre */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${
                    avatarColors[index % avatarColors.length]
                  }`}
                >
                  {getInitials(usuario.nombre, usuario.apellido)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {usuario.nombre} {usuario.apellido}
                  </p>
                  <p className="text-xs text-gray-400">@{usuario.nickname}</p>
                </div>
              </div>

              {/* Correo */}
              <p className="truncate text-sm text-teal-600 hover:text-teal-700 transition-colors">
                {usuario.correo}
              </p>

              {/* Rol */}
              <div>
                <RolBadge rol={usuario.nombreRol || usuario.codigoRol} />
              </div>

              {/* Estado */}
              <div>
                <EstadoBadge estado={usuario.estado} />
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-1.5 justify-end flex-wrap">
                {/* Bloquear / Desbloquear */}
                {isBlocked ? (
                  <button
                    id={`btn-desbloquear-${usuario.codigoUsuario}`}
                    onClick={() => onDesbloquear(usuario.codigoUsuario)}
                    className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
                  >
                    Desbloquear
                  </button>
                ) : (
                  <button
                    id={`btn-bloquear-${usuario.codigoUsuario}`}
                    onClick={() => onBloquear(usuario.codigoUsuario)}
                    className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                  >
                    Bloquear
                  </button>
                )}

                {/* Editar */}
                <button
                  id={`btn-editar-usuario-${usuario.codigoUsuario}`}
                  onClick={() => onEdit(usuario)}
                  title="Editar usuario"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-teal-50 hover:text-teal-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                  </svg>
                </button>

                {/* Eliminar */}
                <button
                  id={`btn-eliminar-usuario-${usuario.codigoUsuario}`}
                  onClick={() => onDelete(usuario.codigoUsuario, `${usuario.nombre} ${usuario.apellido}`)}
                  title="Eliminar usuario"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-rose-50 hover:text-rose-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-gray-50/40 px-6 py-3">
        <p className="text-xs text-gray-400">
          Mostrando{" "}
          <span className="font-semibold text-gray-600">{filtered.length}</span>{" "}
          de{" "}
          <span className="font-semibold text-gray-600">{usuarios.length}</span>{" "}
          usuarios
        </p>
      </div>
    </div>
  );
}
