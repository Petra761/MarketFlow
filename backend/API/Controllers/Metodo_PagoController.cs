using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using backend.Dominio.Interfaces;
using Marketflow.Dominio.Entidades;
using backend.Dominio.DTOs;
namespace backend.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Metodo_PagoController : ControllerBase
    {
        private readonly IMetodo_PagoRepositorio context;

        public Metodo_PagoController(IMetodo_PagoRepositorio context)
        {
            this.context = context;
        }
        // GET: api/Metodo_Pago
        [HttpGet]
        public async Task<IActionResult> GetMetodo_Pago()
        {
            return Ok(await context.GetMetodo_Pago());
        }
        // GET: api/Metodo_Pago/5
        [HttpGet("{CodigoMetodoPago}")]
        public async Task<IActionResult> GetMetodo_PagoByCodigo(string CodigoMetodoPago)
        {
            return Ok(await context.GetMetodo_PagoByCodigo(CodigoMetodoPago));
        }
        // POST: api/Metodo_Pago
        [HttpPost]
        public async Task<IActionResult> PostMetodo_Pago(Metodo_PagoDTO metodo_Pago)
        {
            return Ok(await context.PostMetodo_Pago(metodo_Pago));
        }
         // PUT: api/Metodo_Pago/5
        [HttpPut("{CodigoMetodoPago}")]
        public async Task<IActionResult> PutMetodo_Pago(string CodigoMetodoPago, Metodo_PagoDTO metodo_Pago)
        {
            return Ok(await context.PutMetodo_Pago(CodigoMetodoPago, metodo_Pago));
        }
         // DELETE: api/Metodo_Pago/5
        [HttpDelete("{CodigoMetodoPago}")]
        public async Task<IActionResult> DeleteMetodo_Pago(string CodigoMetodoPago)
        {
            return Ok(await context.DeleteMetodo_Pago(CodigoMetodoPago));
        }
    }
}