import type { PedidoDTO, CreatePedidoDTO, UpdatePedidoDTO, PedidoRecibidoDTO } from "../types/compras";

const API_BASE = "/api/Pedido";

export const pedidoService = {
  // GET: api/Pedido
  getAll: async (): Promise<PedidoDTO[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Error al obtener pedidos");
    return res.json();
  },

  // GET: api/Pedido/{CodigoPedido}
  getByCodigo: async (codigoPedido: string): Promise<PedidoDTO> => {
    const res = await fetch(`${API_BASE}/${codigoPedido}`);
    if (!res.ok) throw new Error("Error al obtener pedido");
    return res.json();
  },

  // GET: api/Pedido/Historial/{codigoUsuario}
  getHistorial: async (codigoUsuario: string): Promise<PedidoDTO[]> => {
    const res = await fetch(`${API_BASE}/Historial/${codigoUsuario}`);
    if (!res.ok) throw new Error("Error al obtener historial");
    return res.json();
  },

  // POST: api/Pedido — devuelve PedidoDTO completo
  create: async (pedido: CreatePedidoDTO): Promise<PedidoDTO> => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Error al crear pedido");
    }
    return res.json();
  },

  // PUT: api/Pedido/{CodigoPedido}
  update: async (codigoPedido: string, pedido: UpdatePedidoDTO): Promise<string> => {
    const res = await fetch(`${API_BASE}/${codigoPedido}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Error al actualizar pedido");
    }
    return res.json();
  },

  // PUT: api/Pedido/Confirmar/{CodigoPedido}
  confirmar: async (codigoPedido: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/Confirmar/${codigoPedido}`, {
      method: "PUT",
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Error al confirmar pedido");
    }
  },

  // PUT: api/Pedido/Cancelar/{CodigoPedido}
  cancelar: async (codigoPedido: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/Cancelar/${codigoPedido}`, {
      method: "PUT",
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Error al cancelar pedido");
    }
  },

  // PUT: api/Pedido/Pagar/{CodigoPedido}
  pagar: async (codigoPedido: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/Pagar/${codigoPedido}`, {
      method: "PUT",
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Error al pagar pedido");
    }
  },

  // GET: api/Pedido/recibidos/{codigoVendedor}
  getRecibidos: async (codigoVendedor: string): Promise<PedidoRecibidoDTO[]> => {
    const res = await fetch(`${API_BASE}/recibidos/${codigoVendedor}`);
    if (!res.ok) throw new Error("Error al obtener ventas recibidas");
    return res.json();
  },

  // DELETE: api/Pedido/{CodigoPedido}
  delete: async (codigoPedido: string): Promise<string> => {
    const res = await fetch(`${API_BASE}/${codigoPedido}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar pedido");
    return res.json();
  },
};
