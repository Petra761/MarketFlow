import { API_BASE_URL } from "../config/api";
import type {
  AuthUser,
  LoginCredentials,
  ProfileData,
  RegisterData,
  ServiceResult,
  UpdateProfileData,
} from "../types/auth";

interface BackendLoginResponse {
  mensaje: string;
  rol?: string;
  usuario?: string;
  codigoUsuario?: string;
}

interface BackendMessageResponse {
  mensaje: string;
}

interface RolDto {
  codigoRol: string;
  nombre: string;
}

const CONNECTION_ERROR =
  "No se pudo establecer conexión con el servidor. Verifica que el backend esté en ejecución y VITE_API_URL en .env.";

async function parseErrorMessage(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) return `Error del servidor: ${response.status}`;

  const trimmed = text.trim();
  if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html")) {
    return "Ocurrió un error en el servidor. Intenta de nuevo.";
  }

  try {
    const json = JSON.parse(text) as { mensaje?: string; title?: string };
    return json.mensaje ?? json.title ?? text;
  } catch {
    return text.replace(/^"|"$/g, "");
  }
}

async function fetchRoles(): Promise<RolDto[]> {
  const response = await fetch(`${API_BASE_URL}/Roles/ObtenerRoles`);
  if (!response.ok) {
    throw new Error("No se pudieron cargar los roles del servidor.");
  }
  return response.json();
}

async function resolveRoleCode(role: "buyer" | "seller"): Promise<string> {
  const fromEnv =
    role === "seller"
      ? import.meta.env.VITE_ROL_VENDEDOR
      : import.meta.env.VITE_ROL_COMPRADOR;

  if (fromEnv) return fromEnv;

  const roles = await fetchRoles();
  const keyword = role === "seller" ? "vend" : "compr";
  const match = roles.find((r) => r.nombre.toLowerCase().includes(keyword));

  if (!match) {
    throw new Error(
      `No se encontró un rol de ${role === "seller" ? "vendedor" : "comprador"}. Configura VITE_ROL_${role === "seller" ? "VENDEDOR" : "COMPRADOR"} en .env.`
    );
  }

  return match.codigoRol;
}

/** POST /api/Usuarios/Login */
export async function loginApi(
  credentials: LoginCredentials
): Promise<ServiceResult<AuthUser>> {
  try {
    const response = await fetch(`${API_BASE_URL}/Usuarios/Login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        correo: credentials.email,
        contrasenia: credentials.password,
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      let message = `Error del servidor: ${response.status}`;
      try {
        const json = JSON.parse(text) as { mensaje?: string };
        message = json.mensaje ?? text.replace(/^"|"$/g, "") ?? message;
      } catch {
        if (text) message = text.replace(/^"|"$/g, "");
      }
      return { success: false, message };
    }

    const data: BackendLoginResponse = JSON.parse(text);
    const user: AuthUser = {
      codigoUsuario: data.codigoUsuario ?? "",
      name: data.usuario ?? "",
      email: credentials.email,
      role: data.rol ?? "",
      codigoUsuario: data.codigoUsuario ?? "",
    };

    return { success: true, data: user, message: data.mensaje };
  } catch (error) {
    console.error("loginApi:", error);
    return { success: false, message: CONNECTION_ERROR };
  }
}

/** POST /api/Usuarios */
export async function registerApi(
  data: RegisterData
): Promise<ServiceResult<AuthUser>> {
  try {
    const codigoRol = await resolveRoleCode(data.role);

    const response = await fetch(`${API_BASE_URL}/Usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        codigoRol,
        nombre: data.nombre,
        apellido: data.apellido,
        nickname: data.username,
        correo: data.email,
        contrasenia: data.password,
        numero: data.telefono,
      }),
    });

    if (!response.ok) {
      return { success: false, message: await parseErrorMessage(response) };
    }

    const resData: BackendMessageResponse = await response.json();
    const user: AuthUser = {
      codigoUsuario: "",
      name: data.nombre,
      email: data.email,
      role: data.role === "seller" ? "Vendedor" : "Comprador",
    };

    return { success: true, data: user, message: resData.mensaje };
  } catch (error) {
    console.error("registerApi:", error);
    const message =
      error instanceof Error && error.message.includes("rol")
        ? error.message
        : CONNECTION_ERROR;
    return { success: false, message };
  }
}

/** POST /api/Usuarios/recuperar-cuenta{correo} */
export async function recoverAccountApi(
  email: string
): Promise<ServiceResult> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Usuarios/recuperar-cuenta${encodeURIComponent(email)}`,
      { method: "POST" }
    );

    const text = await response.text();

    if (!response.ok) {
      let message = `Error del servidor: ${response.status}`;
      try {
        const json = JSON.parse(text) as { mensaje?: string };
        message = json.mensaje ?? message;
      } catch {
        if (text) message = text.replace(/^"|"$/g, "");
      }
      return { success: false, message };
    }

    const data: BackendMessageResponse = JSON.parse(text);
    return { success: true, message: data.mensaje };
  } catch (error) {
    console.error("recoverAccountApi:", error);
    return { success: false, message: CONNECTION_ERROR };
  }
}

/** POST /api/Usuarios/CambiarPassword */
export async function changePasswordApi(
  email: string,
  newPassword: string
): Promise<ServiceResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/Usuarios/CambiarPassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        correo: email,
        nuevaPassword: newPassword,
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      let message = `Error del servidor: ${response.status}`;
      try {
        const json = JSON.parse(text) as { mensaje?: string };
        message = json.mensaje ?? message;
      } catch {
        if (text) message = text.replace(/^"|"$/g, "");
      }
      return { success: false, message };
    }

    const data: BackendMessageResponse = JSON.parse(text);
    return { success: true, message: data.mensaje?.trim() };
  } catch (error) {
    console.error("changePasswordApi:", error);
    return { success: false, message: CONNECTION_ERROR };
  }
}

/** GET /api/Usuarios/ObtenerUsuario/{codigo} */
export async function getProfileApi(
  codigoUsuario: string
): Promise<ServiceResult<ProfileData>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Usuarios/ObtenerUsuario/${encodeURIComponent(codigoUsuario)}`,
      { headers: { Accept: "application/json" } }
    );

    if (!response.ok) {
      return { success: false, message: await parseErrorMessage(response) };
    }

    const data = (await response.json()) as ProfileData;
    return { success: true, data };
  } catch (error) {
    console.error("getProfileApi:", error);
    return { success: false, message: CONNECTION_ERROR };
  }
}

/** PUT /api/Usuarios/ActualizarPerfil/{codigo} */
export async function updateProfileApi(
  codigoUsuario: string,
  data: UpdateProfileData
): Promise<ServiceResult> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Usuarios/ActualizarPerfil/${encodeURIComponent(codigoUsuario)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nombre: data.nombre,
          apellido: data.apellido,
          nickname: data.nickname,
          correo: data.correo,
          numero: data.numero,
        }),
      }
    );

    if (!response.ok) {
      return { success: false, message: await parseErrorMessage(response) };
    }

    const resData: BackendMessageResponse = await response.json();
    return { success: true, message: resData.mensaje?.trim() };
  } catch (error) {
    console.error("updateProfileApi:", error);
    return { success: false, message: CONNECTION_ERROR };
  }
}
