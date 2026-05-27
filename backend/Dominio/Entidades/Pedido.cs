using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Numerics;
using System.Security;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Marketflow.Dominio.Entidades
{
    public class Pedido
    {
        [Key]
        public int IdPedido { get; set; }
        public int IdUsuario { get; set; }
        public int IdMetodoPago { get; set; }
        public string CodigoPedido { get; set; } = string.Empty;
        public DateOnly Fecha { get; set; }
        public decimal Total { get; set; }
        public string EstadoPedido { get; set; } = "Pendiente";
        public string Estado { get; set; } = "Activo";

        [ForeignKey("IdUsuario")]
        [JsonIgnore]
        public Usuario? Usuario { get; set; }

        [ForeignKey("IdMetodoPago")]
        [JsonIgnore]
        public Metodo_Pago? MetodoPago { get; set; }
        public List<Detalle_Pedido>? DetallesPedido { get; set; }
    }
}
