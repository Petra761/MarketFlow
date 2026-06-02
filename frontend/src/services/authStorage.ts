import type { AuthUser } from "../types/auth";

const AUTH_USER_KEY = "authUser";

const SESSION_KEYS = [
  AUTH_USER_KEY,
  "marketflow_pedido_activo",
  "marketflow_cart_items_sync",
  "marketflow_cart",
] as const;

let cachedRaw: string | null | undefined;
let cachedUser: AuthUser | null = null;

export function saveAuthUser(user: AuthUser): void {
  const serialized = JSON.stringify(user);
  localStorage.setItem(AUTH_USER_KEY, serialized);
  cachedRaw = serialized;
  cachedUser = user;
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_USER_KEY);

  if (raw === cachedRaw) {
    return cachedUser;
  }

  cachedRaw = raw;

  if (!raw) {
    cachedUser = null;
    return null;
  }

  try {
    cachedUser = JSON.parse(raw) as AuthUser;
    return cachedUser;
  } catch {
    cachedUser = null;
    return null;
  }
}

export function clearAuthUser(): void {
  localStorage.removeItem(AUTH_USER_KEY);
  cachedRaw = null;
  cachedUser = null;
}

/** Elimina sesión y datos locales del usuario (carrito, pedido activo, etc.). */
export function clearSession(): void {
  SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
  cachedRaw = null;
  cachedUser = null;
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("cart_sync"));
}

export function isUserAuthenticated(): boolean {
  return !!getStoredUser();
}
