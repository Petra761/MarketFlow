import type { Producto } from "../types/compras";

const API_BASE = "/api/Producto";

export const productoService = {
  // GET: api/Producto
  getAll: async (): Promise<Producto[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Error al obtener productos");
    return res.json();
  },

  // GET: api/Producto/productos-disponibles
  getProductosDisponibles: async () => {
    const res = await fetch(`${API_BASE}/productos-disponibles`);
    if (!res.ok) throw new Error("Error al obtener productos disponibles");
    return res.json();
  },

  // GET: api/Producto/{codigo}
  getByCodigo: async (codigo: string): Promise<Producto> => {
    const res = await fetch(`${API_BASE}/${codigo}`);
    if (!res.ok) throw new Error("Error al obtener producto");
    return res.json();
  },
};
