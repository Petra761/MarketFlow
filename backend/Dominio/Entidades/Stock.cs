using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Marketflow.Dominio.Entidades
{
    public class Stock
    {
        [Key]
        public int IdStock { get; set; }
        public int IdProducto { get; set; }
        public string CodigoLote { get; set; } = string.Empty;
        public DateOnly Fecha { get; set; }
        public int StockInicial { get; set; }
        public int StockActual { get; set; }
        public string Estado { get; set; } = "Activo";

        [ForeignKey("IdProducto")]
        [JsonIgnore]
        public Producto? Producto { get; set; }
    }
}
