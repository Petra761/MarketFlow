using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dominio.DTOs
{
    public class UsuarioGetDTO
    {
        public string CodigoUsuario { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty; 
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;

    }
}