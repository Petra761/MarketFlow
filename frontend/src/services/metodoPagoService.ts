import type { MetodoPagoDTO } from "../types/compras";

const API_BASE = "/api/Metodo_Pago";

export const metodoPagoService = {
  // GET: api/Metodo_Pago
  getAll: async (): Promise<MetodoPagoDTO[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Error al obtener métodos de pago");
    return res.json();
  },

  // GET: api/Metodo_Pago/{CodigoMetodoPago}
  getByCodigo: async (codigoMetodoPago: string): Promise<MetodoPagoDTO> => {
    const res = await fetch(`${API_BASE}/${codigoMetodoPago}`);
    if (!res.ok) throw new Error("Error al obtener método de pago");
    return res.json();
  },
};
