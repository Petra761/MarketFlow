using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Marketflow.Dominio.Entidades;

namespace Marketflow.Dominio.Entidades
{
    public class Producto
    {
        [Key]
        public int IdProducto { get; set; }
        public int IdUsuario { get; set; }
        public int IdCategoria { get; set; }
        public string CodigoProducto { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Marca { get; set; } = string.Empty;
        public DateOnly Fecha { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public string EstadoProducto { get; set; } = "Nuevo";
        public string Estado { get; set; } = "Activo";

        [ForeignKey("IdUsuario")]
        [JsonIgnore]
        public Usuario? Usuario { get; set; }

        [ForeignKey("IdCategoria")]
        [JsonIgnore]
        public Categoria? Categoria { get; set; }
        public List<Precio>? Precios { get; set; }
        public List<Detalle_Pedido>? DetallesPedido { get; set; }
        public List<Stock>? Stocks { get; set; }
    }
}
