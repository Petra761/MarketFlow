using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Marketflow.Dominio.Entidades;

namespace Marketflow.Dominio.Entidades
{
    public class Rol
    {
        [Key]
        public int IdRol { get; set; }
        public string CodigoRol { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Estado { get; set; } = "Activo";
        public List<Usuario>? Usuarios { get; set; }
    }
}
