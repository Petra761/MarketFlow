import type { ProductoMasVendido, VentaRangoDTO, VentasCategoria, UsuarioEstadisticaDTO } from "../types/reportes";

const API_BASE = "/api/ReportesAdmin";

export async function fetchVentasCategoria(): Promise<VentasCategoria[]> {
  const response = await fetch(`${API_BASE}/ventasCategoria`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar las ventas por categoría");
  }

  return response.json() as Promise<VentasCategoria[]>;
}

export async function fetchProductosMasVendidos(): Promise<ProductoMasVendido[]> {
  const response = await fetch(`${API_BASE}/productosMasVendidos`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar los productos más vendidos");
  }

  return response.json() as Promise<ProductoMasVendido[]>;
}

export async function fetchVentasRango(
  fechaInicio: string,
  fechaFin: string
): Promise<VentaRangoDTO[]> {

  const response = await fetch(
    `${API_BASE}/ventasRango?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
  );

  if (!response.ok) {
    throw new Error(
      "No se pudieron cargar las ventas por rango"
    );
  }

  return response.json() as Promise<VentaRangoDTO[]>;
}

export async function fetchEstadisticasUsuarios(): Promise<UsuarioEstadisticaDTO[]> {
  const response = await fetch(
    `${API_BASE}/EstadisticasUsuarios`
  );

  if (!response.ok) {
    throw new Error(
      "No se pudieron cargar las estadísticas de usuarios"
    );
  }

  return response.json() as Promise<UsuarioEstadisticaDTO[]>;
}

export async function fetchVentasDia(): Promise<VentaRangoDTO[]> {
  const response = await fetch(`${API_BASE}/VentasDia`);
  if (!response.ok) {
    throw new Error("No se pudieron cargar las ventas del día");
  }
  return response.json() as Promise<VentaRangoDTO[]>;
}

export async function fetchVentasSemana(): Promise<VentaRangoDTO[]> {
  const response = await fetch(`${API_BASE}/VentasSemana`);
  if (!response.ok) {
    throw new Error("No se pudieron cargar las ventas de la semana");
  }
  return response.json() as Promise<VentaRangoDTO[]>;
}

export async function fetchVentasMes(): Promise<VentaRangoDTO[]> {
  const response = await fetch(`${API_BASE}/VentasMes`);
  if (!response.ok) {
    throw new Error("No se pudieron cargar las ventas del mes");
  }
  return response.json() as Promise<VentaRangoDTO[]>;
}

export async function fetchVentasAnual(): Promise<VentaRangoDTO[]> {
  const response = await fetch(`${API_BASE}/VentasAnual`);
  if (!response.ok) {
    throw new Error("No se pudieron cargar las ventas anuales");
  }
  return response.json() as Promise<VentaRangoDTO[]>;
}