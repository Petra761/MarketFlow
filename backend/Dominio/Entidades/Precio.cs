using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Marketflow.Dominio.Entidades
{
    public class Precio
    {
        [Key]
        public int IdPrecio { get; set; }
        public int IdProducto { get; set; }
        public string CodigoPrecio { get; set; } = string.Empty;
        public decimal Monto { get; set; }
        public DateOnly FechaInicio { get; set; }
        public DateOnly FechaFin { get; set; }
        public string Estado { get; set; } = "Activo";

        [ForeignKey("IdProducto")]
        [JsonIgnore]
        public Producto? Producto { get; set; }
    }
}
