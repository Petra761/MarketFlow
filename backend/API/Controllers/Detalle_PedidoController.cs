using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using backend.Dominio.Interfaces;
using backend.Dominio.DTOs;

namespace backend.API.Controllers
{
    [Route("api/[controller]")]
    public class Detalle_PedidoController : ControllerBase
    {
        private readonly IDetalle_PedidoRepositorio context;
        public Detalle_PedidoController(IDetalle_PedidoRepositorio context)
        {
            this.context = context;
        }
        // GET: api/Detalle_Pedido
        [HttpGet]
        public async Task<IActionResult> GetDetalle_Pedido()
        {
            return Ok(await context.GetDetalle_Pedido());
        }
        // GET: api/Detalle_Pedido/5
        [HttpGet("{CodigoPedido}/{CodigoProducto}")]
        public async Task<IActionResult> GetDetalle_PedidoByCodigo(string CodigoPedido, string CodigoProducto)
        {
            return Ok(await context.GetDetalle_PedidoByCodigo(CodigoPedido, CodigoProducto));
        }
        // POST: api/Detalle_Pedido
        [HttpPost]
        public async Task<IActionResult> PostDetalle_Pedido([FromBody] Detalle_PedidoDTO dto)
        {
            return Ok(await context.PostDetalle_Pedido(dto));
        }
        // PUT: api/Detalle_Pedido/5
        [HttpPut("{CodigoPedido}/{CodigoProducto}")]
        public async Task<IActionResult> PutDetalle_Pedido(string CodigoPedido, string CodigoProducto, [FromBody] Detalle_PedidoDTO dto)
        {
            return Ok(await context.PutDetalle_Pedido(CodigoPedido, CodigoProducto, dto));
        }
        // DELETE: api/Detalle_Pedido/5
        [HttpDelete("{CodigoPedido}/{CodigoProducto}")]
        public async Task<IActionResult> DeleteDetalle_Pedido(string CodigoPedido, string CodigoProducto)
        {
            return Ok(await context.DeleteDetalle_Pedido(CodigoPedido, CodigoProducto));
        }

    }
}