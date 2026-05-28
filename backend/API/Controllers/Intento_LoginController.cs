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
    public class Intento_LoginController : ControllerBase
    {
        private readonly IIntento_LoginRepositorio context;

        public Intento_LoginController(IIntento_LoginRepositorio context)
        {
            this.context = context;
        }
        
      
        [HttpGet]
        public async Task<IActionResult> GetIntento_Login()
        {
            return Ok(await context.GetIntento_Login());
        }
        
        [HttpGet("{Id}")]
        public async Task<IActionResult> GetIntento_LoginById(int Id)
        {
            return Ok(await context.GetIntento_LoginById(Id));
        }
        
        [HttpPost]
        public async Task<IActionResult> PostIntento_Login(Intento_LoginDTO intento)
        {
            return Ok(await context.PostIntento_Login(intento));
        }
        
        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteIntento_Login(int Id)
        {
            return Ok(await context.DeleteIntento_Login(Id));
        }
    }
}
