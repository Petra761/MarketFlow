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
    public class TelefonoController : ControllerBase
    {
        private readonly ITelefonoRepositorio context;

        public TelefonoController(ITelefonoRepositorio context)
        {
            this.context = context;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetTelefono()
        {
            return Ok(await context.GetTelefono());
        }
        
        [HttpGet("{CodigoTelefono}")]
        public async Task<IActionResult> GetTelefonoByCodigo(string CodigoTelefono)
        {
            return Ok(await context.GetTelefonoByCodigo(CodigoTelefono));
        }
        
        [HttpPost]
        public async Task<IActionResult> PostTelefono(TelefonoDTO telefono)
        {
            return Ok(await context.PostTelefono(telefono));
        }
        
        [HttpPut("{CodigoTelefono}")]
        public async Task<IActionResult> PutTelefono(string CodigoTelefono, TelefonoDTO telefono)
        {
            return Ok(await context.PutTelefono(CodigoTelefono, telefono));
        }
        
        [HttpDelete("{CodigoTelefono}")]
        public async Task<IActionResult> DeleteTelefono(string CodigoTelefono)
        {
            return Ok(await context.DeleteTelefono(CodigoTelefono));
        }
    }
}
