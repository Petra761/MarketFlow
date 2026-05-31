export function getRedirectPathForRole(rolNombre: string): string {
  const r = rolNombre.toLowerCase();

  if (r.includes("admin")) return "/admin/reportes";
  if (r.includes("vend")) return "/vendedor/inventario";
  if (r.includes("compr") || r.includes("client")) return "/catalogo";

  return "/perfil";
}