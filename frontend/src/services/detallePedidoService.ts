import type { Detalle_PedidoDTO, DetallePedidoFull } from "../types/compras";

const API_BASE = "/api/Detalle_Pedido";

export const detallePedidoService = {
  // GET: api/Detalle_Pedido
  getAll: async (): Promise<DetallePedidoFull[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Error al obtener detalles de pedido");
    return res.json();
  },

  // GET: api/Detalle_Pedido/{CodigoPedido}/{CodigoProducto}
  getByCodigos: async (
    codigoPedido: string,
    codigoProducto: string
  ): Promise<DetallePedidoFull> => {
    const res = await fetch(`${API_BASE}/${codigoPedido}/${codigoProducto}`);
    if (!res.ok) throw new Error("Error al obtener detalle");
    return res.json();
  },

  // POST: api/Detalle_Pedido
  create: async (detalle: Detalle_PedidoDTO): Promise<string> => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(detalle),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Error al crear detalle de pedido");
    }
    return res.json();
  },

  // PUT: api/Detalle_Pedido/{CodigoPedido}/{CodigoProducto}
  update: async (
    codigoPedido: string,
    codigoProducto: string,
    detalle: Detalle_PedidoDTO
  ): Promise<string> => {
    const res = await fetch(`${API_BASE}/${codigoPedido}/${codigoProducto}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(detalle),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Error al actualizar detalle");
    }
    return res.json();
  },

  // DELETE: api/Detalle_Pedido/{CodigoPedido}/{CodigoProducto}
  delete: async (codigoPedido: string, codigoProducto: string): Promise<string> => {
    const res = await fetch(`${API_BASE}/${codigoPedido}/${codigoProducto}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Error al eliminar detalle");
    }
    return res.json();
  },
};
