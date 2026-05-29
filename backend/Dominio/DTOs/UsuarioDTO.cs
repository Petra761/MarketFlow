using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dominio.DTOs
{
    public class UsuarioDTO
    {
        public string CodigoUsuario { get; set; } = string.Empty;
        public int IdRol { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public string Contrasenia { get; set; } = string.Empty;
    }
    public class LoginDTO
    {
        public string Correo { get; set; } = string.Empty;

        public string Contrasenia { get; set; } = string.Empty;
    }
    public class RecuperarCuentaDTO
    {
        public string Correo { get; set; } = string.Empty;
    }
    public class CambiarContraseniaDTO
    {
        public string Correo { get; set; } = string.Empty;

        public string NuevaPassword { get; set; } = string.Empty;
    }
}