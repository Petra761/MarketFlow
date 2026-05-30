export function isSellerRole(role: string | undefined): boolean {
  return (role ?? "").toLowerCase().includes("vend");
}

export function isBuyerRole(role: string | undefined): boolean {
  const r = (role ?? "").toLowerCase();
  return r.includes("compr") || r.includes("buyer") || r.includes("client");
}

export function isAdminRole(role: string | undefined): boolean {
  return (role ?? "").toLowerCase().includes("admin");
}
