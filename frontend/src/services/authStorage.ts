import type { AuthUser } from "../types/auth";

const AUTH_USER_KEY = "authUser";

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

export function isUserAuthenticated(): boolean {
  return !!getStoredUser();
}
