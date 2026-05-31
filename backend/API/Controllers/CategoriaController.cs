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
        public async Task<IActionResult> GetCategorias()
        {
            try
            {
                return Ok(await context1.GetCategorias());
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpGet("{codigo}")]
        public async Task<IActionResult> GetCategoria(string codigo)
        {
            try
            {
                return Ok(await context1.GetCategoria(codigo));
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> PostCategoria([FromBody] mCategoriaDTO categoria)
        {
            try
            {
                return Ok(await context1.PostCategoria(categoria));
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPut("{codigo}")]
        public async Task<IActionResult> PutCategoria(string codigo, [FromBody] CategoriaDTO categoria)
        {
            try
            {
                return Ok(await context1.PutCategoria(codigo, categoria));
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpDelete("{codigo}")]
        public async Task<IActionResult> Delete(string codigo)
        {
            try
            {
                return Ok(await context1.DeleteCategoria(codigo));
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }
        [HttpGet("Administracion")]
        public async Task<IActionResult> GetCategoriasAdmin()
        {
            try
            {
                return Ok(await context1.GetCategoriasAdmin());
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }
    }
}