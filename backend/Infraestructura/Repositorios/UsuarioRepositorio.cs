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
            usuario.FechaRegistro = DateOnly.FromDateTime(DateTime.Now);

            _context.Usuario.Add(usuario);
            await _context.SaveChangesAsync();

            return usuario;
        }

        public async Task<bool> ActualizarUsuario(string codigo, Usuario usuario)
        {
            var usuarioExistente = await _context.Usuario
                .FirstOrDefaultAsync(u =>
                    u.CodigoUsuario == codigo &&
                    u.Estado == "Activo");

            if (usuarioExistente == null)
                return false;

            var rolExiste = await _context.Rol
                .FirstOrDefaultAsync(r =>
                    r.IdRol == usuario.IdRol &&
                    r.Estado == "Activo");

            if (rolExiste == null)
                return false;

            if (!string.IsNullOrWhiteSpace(usuario.Nombre))
                usuarioExistente.Nombre = usuario.Nombre;

            if (!string.IsNullOrWhiteSpace(usuario.Apellido))
                usuarioExistente.Apellido = usuario.Apellido;

            if (!string.IsNullOrWhiteSpace(usuario.Nickname))
                usuarioExistente.Nickname = usuario.Nickname;

            if (!string.IsNullOrWhiteSpace(usuario.Correo))
                usuarioExistente.Correo = usuario.Correo;

            usuarioExistente.IdRol = usuario.IdRol;

            if (!string.IsNullOrWhiteSpace(usuario.Contrasenia))
            {
                usuarioExistente.Contrasenia =
                    BCrypt.Net.BCrypt.HashPassword(usuario.Contrasenia);
            }

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

        public async Task<Rol?> ObtenerRolPorCodigo(string codigoRol)
        {
            return await _context.Rol
                .FirstOrDefaultAsync(r =>
                    r.CodigoRol == codigoRol &&
                    r.Estado == "Activo");
        }

    }
}

