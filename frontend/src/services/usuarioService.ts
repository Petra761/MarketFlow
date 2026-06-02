import { API_BASE_URL } from "../config/api";
import type { UsuarioGetDTO, UsuarioDTO, UsuarioPutDTO, RolDTO } from "../types/usuario";

const BASE = `${API_BASE_URL}/Usuarios`;
const ROLES_BASE = `${API_BASE_URL}/Roles`;

// ── Usuarios ────────────────────────────────────────────────────────────────

/** GET /api/Usuarios/ObtenerUsuarios */
export async function fetchUsuarios(): Promise<UsuarioGetDTO[]> {
  const response = await fetch(`${BASE}/ObtenerUsuarios`);
  if (!response.ok) {
    throw new Error("No se pudieron cargar los usuarios");
  }
  return response.json() as Promise<UsuarioGetDTO[]>;
}

/** GET /api/Usuarios/ObtenerUsuario/{codigo} */
export async function fetchUsuario(codigo: string): Promise<UsuarioGetDTO> {
  const response = await fetch(`${BASE}/ObtenerUsuario/${codigo}`);
  if (!response.ok) {
    throw new Error(`No se encontró el usuario con código: ${codigo}`);
  }
  return response.json() as Promise<UsuarioGetDTO>;
}

/** POST /api/Usuarios — crear nuevo usuario */
export async function postUsuario(data: UsuarioDTO): Promise<void> {
  const response = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const text = await response.text();
    let msg = "No se pudo crear el usuario";
    try {
      const json = JSON.parse(text) as { mensaje?: string };
      msg = json.mensaje ?? msg;
    } catch {
      if (text) msg = text.replace(/^"|"$/g, "");
    }
    throw new Error(msg);
  }
}

/** PUT /api/Usuarios/ActualizarUsuario/{codigo} */
export async function putUsuario(codigo: string, data: UsuarioPutDTO): Promise<void> {
  const response = await fetch(`${BASE}/ActualizarUsuario/${codigo}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("No se pudo actualizar el usuario");
  }
}

/** PATCH /api/Usuarios/Bloquear/{codigo} */
export async function bloquearUsuario(codigo: string): Promise<void> {
  const response = await fetch(`${BASE}/Bloquear/${codigo}`, {
    method: "PATCH",
  });
  if (!response.ok) {
    throw new Error("No se pudo bloquear el usuario");
  }
}

/** PATCH /api/Usuarios/Desbloquear/{codigo} */
export async function desbloquearUsuario(codigo: string): Promise<void> {
  const response = await fetch(`${BASE}/Desbloquear/${codigo}`, {
    method: "PATCH",
  });
  if (!response.ok) {
    throw new Error("No se pudo desbloquear el usuario");
  }
}

/** DELETE /api/Usuarios/EliminarUsuario/{codigo} */
export async function deleteUsuario(codigo: string): Promise<void> {
  const response = await fetch(`${BASE}/EliminarUsuario/${codigo}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("No se pudo eliminar el usuario");
  }
}

// ── Roles ────────────────────────────────────────────────────────────────────

/** GET /api/Roles/ObtenerRoles */
export async function fetchRoles(): Promise<RolDTO[]> {
  const response = await fetch(`${ROLES_BASE}/ObtenerRoles`);
  if (!response.ok) {
    throw new Error("No se pudieron cargar los roles");
  }
  return response.json() as Promise<RolDTO[]>;
}
