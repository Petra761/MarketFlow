using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Marketflow.Dominio.Entidades
{
    public class Telefono_Usuario
    {
        [Key]
        public int IdTelefonoUsuario { get; set; }
        public int IdTelefono { get; set; }
        public int IdUsuario { get; set; }
        public DateOnly FechaInicio { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public DateOnly? FechaFin { get; set; }

        [ForeignKey("IdTelefono")]
        [JsonIgnore]
        public Telefono? Telefono { get; set; }

        [ForeignKey("IdUsuario")]
        [JsonIgnore]
        public Usuario? Usuario { get; set; }
    }
}
