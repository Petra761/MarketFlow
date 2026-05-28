using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.Dominio.Interfaces;
using backend.Dominio.DTOs;
using Marketflow.Dominio.Entidades;
using backend.Dominio.Mapeadores;

namespace backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly IRolRepositorio _rolRepositorio;

        public RolesController(IRolRepositorio rolRepositorio)
        {
            _rolRepositorio = rolRepositorio;
        }

        // GET TODOS
        [HttpGet("ObtenerRoles")]
        public async Task<IActionResult> GetTodos()
        {
            var roles = await _rolRepositorio.ListarRoles();

            var rolesDTO = RolMapeador.ToDTOList(roles);

            return Ok(rolesDTO);
        }

        [HttpGet("ObtenerRol/{codigo}")]
        public async Task<IActionResult> GetPorCodigo(string codigo)
        {
            var rol = await _rolRepositorio.ObtenerRolesCodigo(codigo);

            if (rol == null)
                return NotFound();

            var rolDTO = RolMapeador.ToDTO(rol);

            return Ok(rolDTO);
        }

        // POST
        [HttpPost("CrearRol")]
        public async Task<IActionResult> CrearRol(RolDTO dto)
        {
            var rol = RolMapeador.ToEntity(dto);
            rol.Estado = "Activo";

            var resultado = await _rolRepositorio.CrearRol(rol);

            return Ok(resultado);
        }

        // PUT
        [HttpPut("ActualizarRol/{codigo}")]
        public async Task<IActionResult> ActualizarRol(string codigo, RolDTO dto)
        {
            var rol = RolMapeador.ToEntity(dto);

            var actualizado = await _rolRepositorio
                .ActualizarRol(codigo, rol);

            if (!actualizado)
                return NotFound();

            return Ok(new
            {
                mensaje = "Rol actualizado correctamente"
            });
        }

        // DELETE LOGICO
        [HttpDelete("EliminarRol/{codigo}")]
        public async Task<IActionResult> EliminarRol(string codigo)
        {
            var eliminado = await _rolRepositorio
                .EliminarRol(codigo);

            if (!eliminado)
                return NotFound();

            return Ok(new
            {
                mensaje = "Rol eliminado correctamente"
            });
        }
    }
}

