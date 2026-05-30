import { useCallback, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthUser } from "../types/auth";
import {
  clearAuthUser,
  getStoredUser,
} from "../services/authStorage";

function subscribeAuth(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

/** Hook global para leer sesión y cerrar sesión desde cualquier componente. */
export function useAuth() {
  const navigate = useNavigate();

  const user = useSyncExternalStore(
    subscribeAuth,
    () => getStoredUser(),
    () => null
  );

  const logout = useCallback(() => {
    clearAuthUser();
    window.dispatchEvent(new Event("storage"));
    navigate("/iniciar-sesion");
  }, [navigate]);

  return {
    user: user as AuthUser | null,
    isAuthenticated: !!user,
    logout,
  };
}
