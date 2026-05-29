using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Marketflow.Dominio.Entidades;
using backend.Dominio.Interfaces;
using Marketflow.Infraestructura.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Text.RegularExpressions;
using backend.Dominio.DTOs;
using System.Net;
using System.Net.Mail;
using backend.Dominio.Helpers;

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

        public async Task<Usuario?>CrearUsuario(Usuario usuario)
        {
            if (
                string.IsNullOrWhiteSpace(usuario.Nombre) ||
                string.IsNullOrWhiteSpace(usuario.Correo) ||
                string.IsNullOrWhiteSpace(usuario.Contrasenia)
            )
            {
                throw new Exception(
                    "Todos los campos son obligatorios"
                );
            }

            if (usuario.Contrasenia.Length < 8)
            {
                throw new Exception(
                    "La contraseña debe tener mínimo 8 caracteres"
                );
            }
            bool emailValido = Regex.IsMatch(
            usuario.Correo,
            @"^[^@\s]+@[^@\s]+\.[^@\s]+$"
            );

            if (!emailValido)
            {
                throw new Exception(
                    "El correo no tiene un formato válido"
                );
            }

            bool existe = await _context.Usuario
                .AnyAsync(u => u.Correo == usuario.Correo);

            if (existe)
            {
                throw new Exception(
                    "El correo ya está registrado"
                );
            }

            usuario.Contrasenia =
                BCrypt.Net.BCrypt.HashPassword(
                    usuario.Contrasenia);

            usuario.CodigoUsuario = CodeGenerator.Generate("U");

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

            if (!string.IsNullOrWhiteSpace(usuario.Nombre))
                usuarioExistente.Nombre = usuario.Nombre;

            if (!string.IsNullOrWhiteSpace(usuario.Apellido))
                usuarioExistente.Apellido = usuario.Apellido;

            if (!string.IsNullOrWhiteSpace(usuario.Nickname))
                usuarioExistente.Nickname = usuario.Nickname;

            if (!string.IsNullOrWhiteSpace(usuario.Correo))
                usuarioExistente.Correo = usuario.Correo;

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

        public async Task<Usuario?> IniciarSesion(LoginDTO dto)
        {
            if (
                string.IsNullOrWhiteSpace(dto.Correo) ||
                string.IsNullOrWhiteSpace(dto.Contrasenia)
            )
            {
                throw new Exception( "Correo y contraseña son obligatorios");
            }

            var usuario = await _context.Usuario
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(
                    u => u.Correo == dto.Correo
                );

            if (usuario == null) throw new Exception( "El correo no existe");
            
            int intentosFallidos =
            await _context.Intento_Login
            .CountAsync(i =>
                i.IdUsuario == usuario.IdUsuario &&
                i.Estado == "Fallido" &&
                i.FechaIntento >
                    DateTime.UtcNow.AddMinutes(-1)
            );

            if (intentosFallidos >= 5)
            {
                throw new Exception(
                    "Cuenta bloqueada temporalmente"
                );
            }


            bool passwordCorrecta =
                BCrypt.Net.BCrypt.Verify(
                    dto.Contrasenia,
                    usuario.Contrasenia
                );

            if (!passwordCorrecta)
            {
                var intento =
                new Intento_Login
                {
                    IdUsuario = usuario.IdUsuario,
                    FechaIntento = DateTime.UtcNow,
                    Estado = "Fallido"
                };

                _context.Intento_Login
                    .Add(intento);

                await _context.SaveChangesAsync();

                throw new Exception(
                    "Contraseña incorrecta"
                );
            }

            return usuario;
        }

        //Mandar link del correo
        public async Task RecuperarCuenta(string correo)
        {
            if (string.IsNullOrWhiteSpace(correo))
            {
                throw new Exception(
                    "El correo es obligatorio"
                );
            }

            var usuario = await _context.Usuario
                .FirstOrDefaultAsync(
                    u => u.Correo == correo
                );

            if (usuario == null)
            {
                throw new Exception(
                    "El correo no existe"
                );
            }

            string link =
            $"http://localhost:5173/api/Usuarios/CambiarPassword";

            await EnviarCorreoRecuperacion(
                correo,
                link
            );
        }
         private async Task EnviarCorreoRecuperacion(string correo,string link)
        {
            var mail = new MailMessage();

            mail.From = new MailAddress(
                "garzonale123@gmail.com"
            );

            mail.To.Add(correo);

            mail.Subject = "Recuperar contraseña";

            mail.IsBodyHtml = true;

            mail.Body = $@"
                <h2>Recuperación de cuenta</h2>

                <p>Haz click aquí:</p>

                <a href='{link}'>
                    Cambiar contraseña
                </a>
            ";

            using var smtp = new SmtpClient(
                "smtp.gmail.com",
                587
            );

            smtp.Credentials = new NetworkCredential(
                "garzonale123@gmail.com",
                "ndshrcsjgvwrkvut"
            );

            smtp.EnableSsl = true;

            await smtp.SendMailAsync(mail);
        }


        //Cambiar Contrasenia 
        public async Task CambiarContrasenia(CambiarContraseniaDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Correo) ||
                string.IsNullOrWhiteSpace(dto.NuevaPassword)) throw new Exception("Todos los campos son obligatorios");
            

            if (dto.NuevaPassword.Length < 8) throw new Exception("La contraseña debe tener mínimo 8 caracteres");

            var usuario = await _context.Usuario
                .FirstOrDefaultAsync(
                    u => u.Correo == dto.Correo
                );

            if (usuario == null)
            {
                throw new Exception(
                    "Usuario no encontrado"
                );
            }

            usuario.Contrasenia =
                BCrypt.Net.BCrypt.HashPassword(
                    dto.NuevaPassword
                );

            await _context.SaveChangesAsync();
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

