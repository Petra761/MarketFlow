using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using backend.Dominio.Interfaces;
using Marketflow.Infraestructura.Data;
using Microsoft.AspNetCore.Mvc;

namespace backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductoController : ControllerBase
    {
        private readonly IProductoRepositorio context1;

        public ProductoController(IProductoRepositorio context)
        {
            this.context1 = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTodosProductos()
        {
            return Ok(await context1.GetProductos());
        }

        [HttpGet("productos-disponibles")]
        public async Task<IActionResult> ObtenerProductosDisponibles()
        {
            var resultado = await context1.ObtenerProductosDisponibles();

            return Ok(resultado);
        }

        [HttpGet("{codigo}")]
        public async Task<IActionResult> GetProducto(string codigo)
        {
            return Ok(await context1.GetProducto(codigo));
        }

        [HttpGet("mis-productos/{codigoUsuario}")]
        public async Task<IActionResult> GetMisProductos(string codigoUsuario)
        {
            return Ok(await context1.GetMisProductos(codigoUsuario));
        }

        [HttpPost]
        public async Task<IActionResult> PostProducto([FromBody] mProductoDTO producto)
        {
            try
            {
                return Ok(await context1.PostProducto(producto));
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message, innerError = ex.InnerException?.Message });
            }
        }

        [HttpPut("{codigo}/{codigoUsuario}")]
        public async Task<IActionResult> PutProducto(
            string codigo,
            string codigoUsuario,
            [FromBody] ProductoDTO producto
        )
        {
            try
            {
                return Ok(await context1.PutProducto(codigo, codigoUsuario, producto));
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message, innerError = ex.InnerException?.Message });
            }
        }

        [HttpDelete("{codigo}/{codigoUsuario}")]
        public async Task<IActionResult> Delete(string codigo, string codigoUsuario)
        {
            return Ok(await context1.DeleteProducto(codigo, codigoUsuario));
        }

        [HttpGet("stock-critico/{codigoVendedor}/{cantidad}")]
        public async Task<IActionResult> StockCritico(string codigoVendedor, int cantidad)
        {
            var response = await context1.GetBajoStock(codigoVendedor, cantidad);

            if (response is null)
                return Ok($"Nada Por debajo de {cantidad}");

            return Ok(response);
        }

        [HttpPatch("actualizar-precio")]
        public async Task<IActionResult> UpdateMonto([FromBody] ActualizarPrecioDTO dto)
        {
            var resultado = await context1.ActualizarPrecio(dto);

            if (resultado == "OK")
                return Ok(new { mensaje = "Precio actualizado exitosamente" });

            if (resultado.Contains("no encontrado"))
                return NotFound(resultado);

            return BadRequest(resultado);
        }
    }
}
