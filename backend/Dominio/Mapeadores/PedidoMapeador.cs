using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Marketflow.Dominio.Entidades;
using backend.Dominio.DTOs;
namespace backend.Dominio.Mapeadores
{
    public static class PedidoMapeador
    {
        public static PedidoDTO toPedidoDTO(this Pedido pedido)
        {
            if (pedido == null) return null;

            return new PedidoDTO
            {
                CodigoUsuario = pedido.Usuario.CodigoUsuario,

                CodigoMetodoPago = pedido.MetodoPago.CodigoMetodoPago,

                CodigoPedido = pedido.CodigoPedido,

                Fecha = pedido.Fecha,

                Total = pedido.Total,

                EstadoPedido = pedido.EstadoPedido,

                Productos = pedido.DetallesPedido?.Select(d => new DetallePedidoRecibidoDTO
                {
                    NombreProducto = d.Producto?.Nombre ?? "Producto Desconocido",
                    Cantidad = d.Cantidad,
                    Subtotal = d.Subtotal,
                    ImagenProducto = d.Producto?.Imagen
                }).ToList() ?? new List<DetallePedidoRecibidoDTO>()
            };
        }
    }
}