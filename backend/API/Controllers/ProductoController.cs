using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Marketflow.Infraestructura.Data;
using backend.Dominio.DTOs;

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
        public async Task<IActionResult> PostProducto([FromBody] ProductoDTO producto)
        {
            return Ok(await context1.PostProducto(producto));
        }

        [HttpPut("{codigo}/{codigoUsuario}")]
        public async Task<IActionResult> PutProducto(string codigo, string codigoUsuario, [FromBody] ProductoDTO producto)
        {
            return Ok(await context1.PutProducto(codigo, codigoUsuario, producto));
        }

        [HttpDelete("{codigo}/{codigoUsuario}")]
        public async Task<IActionResult> Delete(string codigo, string codigoUsuario)
        {
            return Ok(await context1.DeleteProducto(codigo, codigoUsuario));
        }
    }
}
