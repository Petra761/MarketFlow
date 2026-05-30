import type { StockSumarioDTO } from "../types/compras";

const API_BASE = "/api/Stock";

export const stockService = {
  // GET: api/Stock/producto/{codigoProducto}
  getByProducto: async (codigoProducto: string): Promise<StockSumarioDTO> => {
    const res = await fetch(`${API_BASE}/producto/${codigoProducto}`);
    if (!res.ok) throw new Error("Error al obtener stock del producto");
    return res.json();
  },
};
