using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using Microsoft.AspNetCore.Mvc;
namespace backend.Dominio.Interfaces
{
    public interface IDetalle_PedidoRepositorio
    {
        Task<List<Detalle_PedidoDTO>> GetDetalle_Pedido();
        Task<Detalle_PedidoDTO> GetDetalle_PedidoByCodigo(string CodigoPedido, string CodigoProducto);
        Task<Detalle_PedidoDTO> PostDetalle_Pedido([FromBody] Detalle_PedidoDTO dto);
        Task<Detalle_PedidoDTO> PutDetalle_Pedido(string CodigoPedido, string CodigoProducto, [FromBody] Detalle_PedidoDTO dto);
        Task<Detalle_PedidoDTO> DeleteDetalle_Pedido(string CodigoPedido, string CodigoProducto);
        Task<List<DetallePedidoClienteDTO>> GetDetallesPorPedido(string codigoPedido);
    }
}