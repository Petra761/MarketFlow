// ===== USUARIO =====

/** DTO de respuesta: lo que devuelve GET /api/Usuarios/ObtenerUsuarios */
export interface UsuarioGetDTO {
  codigoUsuario: string;
  nombre: string;
  apellido: string;
  nickname: string;
  correo: string;
  codigoRol: string;
  nombreRol: string;
  estado: string; // "Activo" | "Bloqueado" | "Eliminado"
}

/** DTO para crear: POST /api/Usuarios */
export interface UsuarioDTO {
  codigoRol: string;
  nombre: string;
  apellido: string;
  nickname: string;
  correo: string;
  contrasenia: string;
  numero: string;
}

/** DTO para actualizar: PUT /api/Usuarios/ActualizarUsuario/{codigo} */
export interface UsuarioPutDTO {
  nombre: string;
  apellido: string;
  nickname: string;
  correo: string;
}

// ===== ROL =====
export interface RolDTO {
  codigoRol: string;
  nombre: string;
}

// ===== STATS RESUMEN =====
export interface UsuarioStats {
  total: number;
  activos: number;
  bloqueados: number;
  admins: number;
}

// ===== ESTADO MODAL =====
export type UsuarioModalMode = "crear" | "editar";
