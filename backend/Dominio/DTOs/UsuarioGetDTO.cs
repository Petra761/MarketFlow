using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dominio.DTOs
{
    public class UsuarioGetDTO
    {
        // Campos extendidos para la vista de administración
        public string CodigoUsuario { get; set; } = string.Empty;
        public string CodigoRol { get; set; } = string.Empty;
        public string NombreRol { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;

        // Campos base (mantener Rol por compatibilidad con otros usos)
        public string Rol { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
    }

}