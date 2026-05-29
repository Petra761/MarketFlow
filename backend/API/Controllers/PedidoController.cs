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

        // GET: api/Pedido/Historial/5
        [HttpGet("Historial/{codigoUsuario}")]
        public async Task<IActionResult> GetHistorial(string codigoUsuario)
        {
            return Ok(await context.GetHistorial(codigoUsuario));
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
        public async Task<IActionResult> PostPedido(CreatePedidoDTO pedido)
        {
            return Ok(await context.PostPedido(pedido));
        }

        // PUT: api/Pedido/5
        [HttpPut("{CodigoPedido}")]
        public async Task<IActionResult> PutPedido(string CodigoPedido, UpdatePedidoDTO pedido)
        {
            return Ok(await context.PutPedido(CodigoPedido, pedido));
        }

        // PUT: api/Pedido/Confirmar/5
        [HttpPut("Confirmar/{CodigoPedido}")]
        public async Task<IActionResult> ConfirmarPedido(string CodigoPedido)
        {
            await context.ConfirmarPedido(CodigoPedido);
            return Ok();
        }

        // PUT: api/Pedido/Cancelar/5
        [HttpPut("Cancelar/{CodigoPedido}")]
        public async Task<IActionResult> CancelarPedido(string CodigoPedido)
        {
            await context.CancelarPedido(CodigoPedido);
            return Ok();
        }

        // PUT: api/Pedido/Pagar/5
        [HttpPut("Pagar/{CodigoPedido}")]
        public async Task<IActionResult> PagarPedido(string CodigoPedido)
        {
            await context.PagarPedido(CodigoPedido);
            return Ok();
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

        [HttpPatch("{codigoPedido}/entregar")]
        public async Task<IActionResult> EntregarPedido(string codigoPedido)
        {
            var response = await context.PedidoRecibido(codigoPedido);
            if (response == "")
                return NotFound("No se encontro");

            return Ok(response);
        }
    }
}
