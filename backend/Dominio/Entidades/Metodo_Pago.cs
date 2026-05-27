using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Marketflow.Dominio.Entidades
{
    public class Metodo_Pago
    {
        [Key]
        public int IdMetodoPago { get; set; }
        public string CodigoMetodoPago { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Estado { get; set; } = "Activo";
        public List<Pedido>? Pedidos { get; set; }
    }
}
