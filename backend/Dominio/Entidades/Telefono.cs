using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Marketflow.Dominio.Entidades
{
    public class Telefono
    {
        [Key]
        public int IdTelefono { get; set; }
        public string CodigoTelefono { get; set; } = string.Empty;
        public string Numero { get; set; } = string.Empty;
        public string Estado { get; set; } = "Activo";
        public List<Telefono_Usuario>? TelefonoUsuarios { get; set; }
    }
}
