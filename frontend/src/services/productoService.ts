import type {
  MisProductosDTO,
  Producto,
  ProductoStock,
} from "../types/compras";

const API_BASE = "/api/Producto";

export interface CrearProductoPayload {
  codigoUsuario: string;
  codigoCategoria: string;
  nombre: string;
  descripcion: string;
  marca: string;
  estadoProducto: string;
  precio: number;
  cantidadInicial: number;
  imagen?: string | null;
}

export interface ActualizarProductoPayload {
  codigoProducto: string;
  codigoUsuario: string;
  codigoCategoria: string;
  nombre: string;
  descripcion: string;
  marca: string;
  estadoProducto: string;
  imagen?: string | null;
  precio?: number;
  stockActual?: number;
}

async function parseError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const json = JSON.parse(text) as { error?: string; mensaje?: string };
    return json.error ?? json.mensaje ?? text;
  } catch {
    return text || `Error ${res.status}`;
  }
}

export const productoService = {
  getAll: async (): Promise<Producto[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Error al obtener productos");
    return res.json();
  },

  getProductosDisponibles: async () => {
    const res = await fetch(`${API_BASE}/productos-disponibles`);
    if (!res.ok) throw new Error("Error al obtener productos disponibles");
    return res.json();
  },

  getByCodigo: async (codigo: string): Promise<Producto> => {
    const res = await fetch(`${API_BASE}/${codigo}`);
    if (!res.ok) throw new Error("Error al obtener producto");
    return res.json();
  },

  getMisProductos: async (codigoUsuario: string): Promise<MisProductosDTO[]> => {
    const res = await fetch(`${API_BASE}/mis-productos/${codigoUsuario}`);
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  getStockCritico: async (
    codigoVendedor: string,
    cantidad: number
  ): Promise<ProductoStock[]> => {
    const res = await fetch(
      `${API_BASE}/stock-critico/${codigoVendedor}/${cantidad}`
    );
    if (!res.ok) throw new Error("Error al obtener stock crítico");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  crear: async (payload: CrearProductoPayload) => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  actualizar: async (
    codigo: string,
    codigoUsuario: string,
    payload: ActualizarProductoPayload
  ) => {
    const res = await fetch(`${API_BASE}/${codigo}/${codigoUsuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  eliminar: async (codigo: string, codigoUsuario: string) => {
    const res = await fetch(`${API_BASE}/${codigo}/${codigoUsuario}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },
};
