import type { PrecioResponseDTO } from "../types/compras";

const API_BASE = "/api/Precio";

export const precioService = {
  // GET: api/Precio
  getAll: async (): Promise<PrecioResponseDTO[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Error al obtener precios");
    return res.json();
  },

  // GET: api/Precio/{codigoPrecio}
  getByCodigo: async (codigoPrecio: string): Promise<PrecioResponseDTO> => {
    const res = await fetch(`${API_BASE}/${codigoPrecio}`);
    if (!res.ok) throw new Error("Error al obtener precio");
    return res.json();
  },

  // GET: api/Precio/producto/{codigoProducto}
  getByProducto: async (codigoProducto: string): Promise<PrecioResponseDTO[]> => {
    const res = await fetch(`${API_BASE}/producto/${codigoProducto}`);
    if (!res.ok) throw new Error("Error al obtener precios del producto");
    return res.json();
  },
};
