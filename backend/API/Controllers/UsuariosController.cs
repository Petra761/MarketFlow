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
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioRepositorio _usuarioRepositorio;

        public UsuariosController(IUsuarioRepositorio usuarioRepositorio)
        {
            _usuarioRepositorio = usuarioRepositorio;
        }

        // GET TODOS
        [HttpGet("ObtenerUsuarios")]
        public async Task<IActionResult> GetTodos()
        {
            var usuarios = await _usuarioRepositorio.ListarUsuarios();

            var usuariosDTO = UsuarioMapeador.ToDTOList(usuarios);

            return Ok(usuariosDTO);
        }

        // GET POR CODIGO
        [HttpGet("ObtenerUsuario/{codigo}")]
        public async Task<IActionResult> GetPorCodigo(string codigo)
        {
            var usuario = await _usuarioRepositorio
                .ObtenerUsuarioCodigo(codigo);

            if (usuario == null)
                return NotFound();

            var usuarioDTO = UsuarioMapeador.ToDTO(usuario);

            return Ok(usuarioDTO);
        }

        // POST
        [HttpPost("CrearUsuario")]
        public async Task<IActionResult> CrearUsuario(UsuarioDTO dto)
        {
             try
        {
            var usuario =
                UsuarioMapeador.ToEntity(dto);

            usuario.Estado = "Activo";

            var resultado =
                await _usuarioRepositorio
                    .CrearUsuario(usuario);

            return Ok(new
            {
                mensaje =
                    "Usuario creado correctamente"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                mensaje = ex.Message
            });
        }
        }

        //Login
        [HttpPost("Login")]
        public async Task<IActionResult>
            Login(LoginDTO dto)
        {
            try
            {
                var usuario =
                    await _usuarioRepositorio
                        .IniciarSesion(dto);

                return Ok(new
                {
                    mensaje = "Login correcto",
                    rol = usuario?.Rol?.Nombre ?? "",                    
                    usuario = usuario?.Nombre ?? ""
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    mensaje = ex.Message
                });
            }
        }
        //Pedir link de cambiar contrasena
        [HttpPost("recuperar-cuenta{correo}")]
        public async Task<IActionResult> RecuperarCuenta( string correo)
        {
            try
            {
                await _usuarioRepositorio.RecuperarCuenta(
                    correo
                );

                return Ok(new
                {
                    mensaje = "Correo enviado"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    mensaje = ex.Message
                });
            }
        }




        //Cambiar Contrasenia 
        [HttpPost("CambiarPassword")]
        public async Task<IActionResult>
        CambiarPassword([FromBody] CambiarContraseniaDTO dto)
        {
            try
            {
                await _usuarioRepositorio
                    .CambiarContrasenia(dto);

                return Ok(new
                {mensaje = " Contraseña actualizada correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }



        // PUT
        [HttpPut("ActualizarUsuario/{codigo}")]
        public async Task<IActionResult> ActualizarUsuario(
            string codigo,
            UsuarioDTO dto)
        {
            var usuario = UsuarioMapeador.ToEntity(dto);

            var actualizado = await _usuarioRepositorio
                .ActualizarUsuario(codigo, usuario);

            if (!actualizado)
                return NotFound();

            return Ok(new
            {
                mensaje = "Usuario actualizado correctamente"
            });
        }

        // DELETE LOGICO
        [HttpDelete("EliminarUsuario/{codigo}")]
        public async Task<IActionResult> EliminarUsuario(string codigo)
        {
            var eliminado = await _usuarioRepositorio
                .EliminarUsuario(codigo);

            if (!eliminado)
                return NotFound();

            return Ok(new
            {
                mensaje = "Usuario eliminado correctamente"
            });
        }
    }
}

