using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using backend.Dominio.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidoController : ControllerBase
    {
        private readonly IPedidoRepositorio context;

        public PedidoController(IPedidoRepositorio context)
        {
            this.context = context;
        }

        // GET: api/Pedido
        [HttpGet]
        public async Task<IActionResult> GetPedido()
        {
            return Ok(await context.GetPedido());
        }

        // GET: api/Pedido/5
        [HttpGet("{CodigoPedido}")]
        public async Task<IActionResult> GetPedidoByCodigo(string CodigoPedido)
        {
            return Ok(await context.GetPedidoByCodigo(CodigoPedido));
        }

        // POST: api/Pedido
        [HttpPost]
        public async Task<IActionResult> PostPedido(PedidoDTO pedido)
        {
            return Ok(await context.PostPedido(pedido));
        }

        // PUT: api/Pedido/5
        [HttpPut("{CodigoPedido}")]
        public async Task<IActionResult> PutPedido(string CodigoPedido, PedidoDTO pedido)
        {
            return Ok(await context.PutPedido(CodigoPedido, pedido));
        }

        // DELETE: api/Pedido/5
        [HttpDelete("{CodigoPedido}")]
        public async Task<IActionResult> DeletePedido(string CodigoPedido)
        {
            return Ok(await context.DeletePedido(CodigoPedido));
        }

        [HttpGet("recibidos/{codigoVendedor}")]
        public async Task<IActionResult> GetPedidosRecibidos(string codigoVendedor)
        {
            var pedidos = await context.ObtenerPedidosPorVendedor(codigoVendedor);

            if (pedidos == null || !pedidos.Any())
            {
                return Ok(new List<PedidoRecibidoDTO>());
            }

            return Ok(pedidos);
        }
    }
}
