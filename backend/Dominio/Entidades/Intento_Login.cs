using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Marketflow.Dominio.Entidades
{
    public class Intento_Login
    {
        [Key]
        public int IdIntentoLogin { get; set; }
        public int IdUsuario { get; set; }
        public DateTime FechaIntento { get; set; }
        public string Estado { get; set; } = "Activo";

        [ForeignKey("IdUsuario")]
        [JsonIgnore]
        public Usuario? Usuario { get; set; }
    }
}
