using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Marketflow.Dominio.Entidades;
using backend.Dominio.Interfaces;
using Marketflow.Infraestructura.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;

namespace backend.Infraestructura.Repositorios
{
    public class UsuarioRepositorio : IUsuarioRepositorio
    {
        private readonly MarketflowContext _context;

        public UsuarioRepositorio(MarketflowContext context)
        {
            _context = context;
        }


        public async Task<List<Usuario>> ListarUsuarios()
        {
            return await _context.Usuario
                .Include(u => u.Rol)
                .Where(u => u.Estado == "Activo")
                .ToListAsync();
        }


        public async Task<Usuario?> ObtenerUsuarioCodigo(string codigo)
        {
            return await _context.Usuario
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.CodigoUsuario == codigo);
        }

        public async Task<Usuario?> CrearUsuario(Usuario usuario)
        {
            var rolExiste = await _context.Rol.FirstOrDefaultAsync(r => r.IdRol == usuario.IdRol && r.Estado == "Activo");
            usuario.FechaRegistro = DateOnly.FromDateTime(DateTime.Now);

            if (rolExiste == null)
            {
                return null;
            }

            usuario.Contrasenia = BCrypt.Net.BCrypt.HashPassword(usuario.Contrasenia);

            _context.Usuario.Add(usuario);

            await _context.SaveChangesAsync();

            return usuario;
        }

        public async Task<bool> ActualizarUsuario(string codigo, Usuario usuario)
        {
            var usuarioExistente = await _context.Usuario.FirstOrDefaultAsync(u => u.CodigoUsuario == codigo && u.Estado == "Activo");

            if (usuarioExistente == null)
                return false;

            var rolExiste = await _context.Rol.FirstOrDefaultAsync(r => r.IdRol == usuario.IdRol && r.Estado == "Activo");

            if (rolExiste == null) 
                return false;

            usuarioExistente.Nombre = usuario.Nombre;
            usuarioExistente.Apellido = usuario.Apellido;
            usuarioExistente.Nickname = usuario.Nickname;
            usuarioExistente.Correo = usuario.Correo;
            usuarioExistente.Contrasenia = usuario.Contrasenia;
            usuarioExistente.Estado = usuario.Estado;
            usuarioExistente.CodigoUsuario = usuario.CodigoUsuario;
            usuarioExistente.IdRol = usuario.IdRol;

            usuarioExistente.Contrasenia = BCrypt.Net.BCrypt.HashPassword(usuario.Contrasenia);

            _context.Usuario.Update(usuarioExistente);

            await _context.SaveChangesAsync();

            return true;
        }

        
        public async Task<bool> EliminarUsuario(string codigo)
        {
            var usuarioExistente = await _context.Usuario
                .FirstOrDefaultAsync(u => u.CodigoUsuario == codigo);

            if (usuarioExistente == null)
                return false;

            usuarioExistente.Estado = "nactivo";

            _context.Usuario.Update(usuarioExistente);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}

