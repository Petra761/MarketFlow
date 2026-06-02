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
    public class Telefono_UsuarioController : ControllerBase
    {
        private readonly ITelefono_UsuarioRepositorio context;

        public Telefono_UsuarioController(ITelefono_UsuarioRepositorio context)
        {
            this.context = context;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetTelefono_Usuario()
        {
            return Ok(await context.GetTelefono_Usuario());
        }
        
        [HttpGet("{Id}")]
        public async Task<IActionResult> GetTelefono_UsuarioById(int Id)
        {
            return Ok(await context.GetTelefono_UsuarioById(Id));
        }
        
        [HttpPost]
        public async Task<IActionResult> PostTelefono_Usuario(Telefono_UsuarioDTO tu)
        {
            return Ok(await context.PostTelefono_Usuario(tu));
        }
        
        [HttpPut("{Id}")]
        public async Task<IActionResult> PutTelefono_Usuario(int Id, Telefono_UsuarioDTO tu)
        {
            return Ok(await context.PutTelefono_Usuario(Id, tu));
        }
        
        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteTelefono_Usuario(int Id)
        {
            return Ok(await context.DeleteTelefono_Usuario(Id));
        }
    }
}
