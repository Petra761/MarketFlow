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
        Task<List<PedidoDTO>> GetPedido();
        Task<PedidoDTO> GetPedidoByCodigo(string CodigoPedido);
        Task<PedidoDTO> PostPedido([FromBody] PedidoDTO dto);
        Task<PedidoDTO> PutPedido(string CodigoPedido, [FromBody] PedidoDTO dto);
        Task<PedidoDTO> DeletePedido(string CodigoPedido);
    }
}