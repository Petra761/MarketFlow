using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Marketflow.Dominio.Entidades
{
    public class Detalle_Pedido
    {
        [Key]
        public int IdDetallePedido { get; set; }
        public int IdPedido { get; set; }
        public int IdProducto { get; set; }
        public int Cantidad { get; set; }
        public decimal Subtotal { get; set; }

        [ForeignKey("IdPedido")]
        [JsonIgnore]
        public Pedido? Pedido { get; set; }

        [ForeignKey("IdProducto")]
        [JsonIgnore]
        public Producto? Producto { get; set; }
    }
}
