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


             public async Task<UsuarioPefirlDTO?> ObtenerUsuarioCodigo(string codigo)
        {
            var user  = await _context.Usuario
                .FirstOrDefaultAsync(u => u.CodigoUsuario == codigo && u.Estado == "Activo");
            var rol = await _context.Rol
                .FirstOrDefaultAsync(r => r.IdRol == user.IdRol);
            
            return await (
            from u in _context.Usuario
            join tu in _context.Telefono_Usuario
                on u.IdUsuario equals tu.IdUsuario
            join t in _context.Telefono
                on tu.IdTelefono equals t.IdTelefono
            where u.CodigoUsuario == codigo
                && u.Estado == "Activo"
                && tu.FechaFin == null
            select new UsuarioPefirlDTO
            {
                Rol = rol.Nombre,
                Nombre = u.Nombre,
                Apellido = u.Apellido,
                Nickname = u.Nickname,
                Correo = u.Correo,
                Numero = t.Numero
            }
        ).FirstOrDefaultAsync();
        }
        

       public async Task<Usuario?> CrearUsuario(UsuarioDTO dto)
        {
            if (
                string.IsNullOrWhiteSpace(dto.Nombre) ||
                string.IsNullOrWhiteSpace(dto.Correo) ||
                string.IsNullOrWhiteSpace(dto.Contrasenia)
            )
            {
                throw new Exception("Todos los campos son obligatorios");
            }

            if (dto.Contrasenia.Length < 8)
            {
                throw new Exception(
                    "La contraseña debe tener mínimo 8 caracteres"
                );
            }

            bool emailValido = Regex.IsMatch(
                dto.Correo,
                @"^[^@\s]+@[^@\s]+\.[^@\s]+$"
            );

            if (!emailValido)
            {
                throw new Exception(
                    "El correo no tiene un formato válido"
                );
            }

            bool existe = await _context.Usuario
                .AnyAsync(u => u.Correo == dto.Correo);

            if (existe)
            {
                return null;
            }

            var rol = await _context.Rol
                .FirstOrDefaultAsync(r =>
                    r.CodigoRol == dto.CodigoRol &&
                    r.Estado == "Activo");

            if (rol == null)
            {
                throw new Exception("Rol no encontrado");
            }

            var nuevoUsuario = new Usuario
            {
                IdRol = rol.IdRol,
                CodigoUsuario = CodeGenerator.Generate("U"),
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Nickname = dto.Nickname,
                Correo = dto.Correo,
                Contrasenia = BCrypt.Net.BCrypt.HashPassword(dto.Contrasenia),
                FechaRegistro = DateOnly.FromDateTime(DateTime.Now),
                Estado = "Activo"
            };

            _context.Usuario.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            var telefono = new Telefono
            {
                CodigoTelefono = CodeGenerator.Generate("TEL"),
                Numero = dto.Numero,
                Estado = "Activo"
            };

            _context.Telefono.Add(telefono);
            await _context.SaveChangesAsync();

            var telefonoUsuario = new Telefono_Usuario
            {
                IdTelefono = telefono.IdTelefono,
                IdUsuario = nuevoUsuario.IdUsuario,
                FechaInicio = DateOnly.FromDateTime(DateTime.Now)
            };

            _context.Telefono_Usuario.Add(telefonoUsuario);
            await _context.SaveChangesAsync();

            return nuevoUsuario;
        }

        public async Task<bool> CorreoExisteAsync(string correo)
        {
            if (string.IsNullOrWhiteSpace(correo))
                return false;

            return await _context.Usuario.AnyAsync(u => u.Correo == correo);
        }

        public async Task<bool> ActualizarUsuario(string codigo, Usuario usuario)
        {
            var usuarioExistente = await _context.Usuario
                .FirstOrDefaultAsync(u =>
                    u.CodigoUsuario == codigo &&
                    u.Estado == "Activo");

            if (usuarioExistente == null)
                return false;

            if (!string.IsNullOrWhiteSpace(usuario.Correo))
            {
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
                    .AnyAsync(u =>
                        u.Correo == usuario.Correo &&
                        u.CodigoUsuario != codigo);

                if (existe)
                {
                    throw new Exception(
                        "El correo ya está registrado"
                    );
                }
            }

            // Validar contraseña si se envía
            if (!string.IsNullOrWhiteSpace(usuario.Contrasenia))
            {
                if (usuario.Contrasenia.Length < 8)
                {
                    throw new Exception(
                        "La contraseña debe tener mínimo 8 caracteres"
                    );
                }
            }

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

        public async Task<bool> ActualizarPerfil(string codigo,EditarPerfilDTO dto)
        {
            var usuario = await _context.Usuario
                .FirstOrDefaultAsync(u =>
                    u.CodigoUsuario == codigo &&
                    u.Estado == "Activo");

            if (usuario == null)
                return false;

            if (!string.IsNullOrWhiteSpace(dto.Correo))
            {
                bool emailValido = Regex.IsMatch(
                    dto.Correo,
                    @"^[^@\s]+@[^@\s]+\.[^@\s]+$"
                );

                if (!emailValido)
                {
                    throw new Exception(
                        "El correo no tiene un formato válido"
                    );
                }

                bool existeCorreo =
                    await _context.Usuario.AnyAsync(u =>
                        u.Correo == dto.Correo &&
                        u.IdUsuario != usuario.IdUsuario);

                if (existeCorreo)
                {
                    throw new Exception(
                        "El correo ya está registrado"
                    );
                }
            }

            usuario.Nombre = dto.Nombre;
            usuario.Apellido = dto.Apellido;
            usuario.Nickname = dto.Nickname;
            usuario.Correo = dto.Correo;

            // Actualizar teléfono si cambió
            if (!string.IsNullOrWhiteSpace(dto.Numero))
            {
                var telefonoUsuarioActual =
                    await _context.Telefono_Usuario
                    .FirstOrDefaultAsync(tu =>
                        tu.IdUsuario == usuario.IdUsuario &&
                        tu.FechaFin == null);

                if (telefonoUsuarioActual != null)
                {
                    var telefonoActual =
                        await _context.Telefono
                        .FirstOrDefaultAsync(t =>
                            t.IdTelefono ==
                            telefonoUsuarioActual.IdTelefono);

                    if (
                        telefonoActual != null &&
                        telefonoActual.Numero != dto.Numero
                    )
                    {
                        bool existeTelefono =
                            await _context.Telefono
                            .AnyAsync(t =>
                                t.Numero == dto.Numero &&
                                t.Estado == "Activo");

                        if (existeTelefono)
                        {
                            throw new Exception(
                                "El número de teléfono ya está registrado"
                            );
                        }

                        telefonoUsuarioActual.FechaFin =
                            DateOnly.FromDateTime(DateTime.Now);

                        var nuevoTelefono = new Telefono
                        {
                            CodigoTelefono =
                                CodeGenerator.Generate("TEL"),
                            Numero = dto.Numero,
                            Estado = "Activo"
                        };

                        _context.Telefono.Add(nuevoTelefono);

                        await _context.SaveChangesAsync();

                        var nuevaRelacion =
                            new Telefono_Usuario
                            {
                                IdTelefono =
                                    nuevoTelefono.IdTelefono,
                                IdUsuario =
                                    usuario.IdUsuario,
                                FechaInicio =
                                    DateOnly.FromDateTime(
                                        DateTime.Now
                                    ),
                                FechaFin = null
                            };

                        _context.Telefono_Usuario
                            .Add(nuevaRelacion);
                    }
                }
            }

            _context.Usuario.Update(usuario);

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
        public async Task<bool>BloquearUsuario(string codigo)
        {
            var usuario = await _context.Usuario
                .FirstOrDefaultAsync(u => 
                u.CodigoUsuario == codigo &&
                u.Estado == "Activo");
            if(usuario == null)
            {
                 return false;
            }
            usuario.Estado = "Bloqueado";
            _context.Usuario.Update(usuario);

            await _context.SaveChangesAsync();
            return true;
        }
          public async Task<bool>DesbloquearUsuario(string codigo)
        {
            var usuario = await _context.Usuario
                .FirstOrDefaultAsync(u => 
                u.CodigoUsuario == codigo &&
                u.Estado == "Bloqueado");
            if(usuario == null)
            {
                 return false;
            }
            usuario.Estado = "Activo";
            _context.Usuario.Update(usuario);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Usuario?> ObtenerPorCodigoActualizar(string codigo)
        {
            return await _context.Usuario
                .FirstOrDefaultAsync(u =>
                    u.CodigoUsuario == codigo &&
                    u.Estado == "Activo");
        }

    }
    
}

