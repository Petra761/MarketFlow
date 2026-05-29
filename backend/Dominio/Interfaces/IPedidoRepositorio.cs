using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace backend.Dominio.Interfaces
{
    public interface IPedidoRepositorio
    {
        Task ConfirmarPedido(string codigoPedido);
        Task CancelarPedido(string codigoPedido);
        Task PagarPedido(string codigoPedido);
        Task<List<PedidoDTO>> GetHistorial(string codigoUsuario);
        Task<List<PedidoDTO>> GetPedido();
        Task<PedidoDTO> GetPedidoByCodigo(string CodigoPedido);
        Task<PedidoDTO> PostPedido([FromBody] CreatePedidoDTO dto);
        Task<PedidoDTO> PutPedido(string CodigoPedido, [FromBody] UpdatePedidoDTO dto);
        Task<PedidoDTO> DeletePedido(string CodigoPedido);

        Task<List<PedidoRecibidoDTO>> ObtenerPedidosPorVendedor(string codigoVendedor);
    }
}
