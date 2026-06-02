import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isAdminRole, isBuyerRole, isSellerRole } from "../utils/roles";

type AllowedRole = "seller" | "buyer" | "admin";

interface RequireRoleProps {
  allowed: AllowedRole[];
  children: React.ReactNode;
}

export default function RequireRole({ allowed, children }: RequireRoleProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  const ok =
    (allowed.includes("seller") && isSellerRole(user.role)) ||
    (allowed.includes("buyer") && isBuyerRole(user.role)) ||
    (allowed.includes("admin") && isAdminRole(user.role));

  if (!ok) {
    if (isSellerRole(user.role)) return <Navigate to="/vendedor/inventario" replace />;
    if (isBuyerRole(user.role)) return <Navigate to="/catalogo" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
