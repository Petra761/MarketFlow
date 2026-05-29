using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using Marketflow.Dominio.Entidades;

namespace backend.Dominio.Mapeadores
{
    public static class Detalle_PedidoMapeador
    {
        public static Detalle_PedidoDTO toDetalle_PedidoDTO(this Detalle_Pedido detalle_Pedido)
        {
            if (detalle_Pedido == null) return null;
            return new Detalle_PedidoDTO
            {
                CodigoPedido = detalle_Pedido.Pedido?.CodigoPedido ?? "N/A",
                CodigoProducto = detalle_Pedido.Producto?.CodigoProducto ??"N/A",
                Cantidad = detalle_Pedido.Cantidad
            };
        }
    }
}