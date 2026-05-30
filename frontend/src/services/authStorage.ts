import type { AuthUser } from "../types/auth";

const AUTH_USER_KEY = "authUser";

export function saveAuthUser(user: AuthUser): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearAuthUser(): void {
  localStorage.removeItem(AUTH_USER_KEY);
}

export function isUserAuthenticated(): boolean {
  return !!getStoredUser();
}
