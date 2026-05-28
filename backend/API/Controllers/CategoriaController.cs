using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using backend.Dominio.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriaController : ControllerBase
    {
        private readonly ICategoriaRepositorio context1;

        public CategoriaController(ICategoriaRepositorio context)
        {
            this.context1 = context;
        } 

        [HttpGet]
        public async Task<IActionResult>GetCategorias()
        {
            return Ok(await context1.GetCategorias());
        }
        [HttpGet("{codigo}")]
        public async Task<IActionResult>GetCategoria(string codigo)
        {
            return Ok(await context1.GetCategoria(codigo));
        }

        [HttpPost]
        public async Task<IActionResult> PostCategoria([FromBody] CategoriaDTO categoria)
        {
            return Ok(await context1.PostCategoria(categoria));
        }
        
        [HttpPut("{codigo}")]
        public async Task<IActionResult>PutCategoria(string codigo, [FromBody]CategoriaDTO categoria)
        {
            return Ok(await context1.PutCategoria(codigo,categoria));
        }
        
        [HttpDelete("{codigo}")]
        public async Task<IActionResult>Delete(string codigo)
        {
            return Ok(await context1.DeleteCategoria(codigo));
        }
    }
}