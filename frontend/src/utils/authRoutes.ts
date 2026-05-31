/** Determina la ruta de redirección según el rol del usuario autenticado. */
export function getRedirectPathForRole(rolNombre: string): string {
  const r = rolNombre.toLowerCase();
  if (r.includes("admin")) return "/admin/resumen";
  if (r.includes("vend")) return "/vendedor/dashboard";
  if (r.includes("compr") || r.includes("client")) return "/catalogo";
  return "/perfil";
}
