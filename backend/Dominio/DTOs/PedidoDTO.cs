using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dominio.DTOs
{
    public class PedidoDTO
    {
        public string CodigoUsuario { get; set; } = string.Empty;
        public string CodigoMetodoPago { get; set; } = string.Empty;
        public string CodigoPedido { get; set; } = string.Empty;
        public DateOnly Fecha { get; set; }
        public decimal Total { get; set; }
        public string EstadoPedido { get; set; } = "Pendiente";
    }
    public class CreatePedidoDTO
    {
        public string CodigoUsuario { get; set; } = string.Empty;
        public string CodigoMetodoPago { get; set; } = string.Empty;
        public string CodigoPedido { get; set; } = string.Empty;
        public DateOnly Fecha { get; set; }
        
    }
    public class UpdatePedidoDTO
    {
        public string CodigoUsuario { get; set; } = string.Empty;
        public string CodigoMetodoPago { get; set; } = string.Empty;
        public string CodigoPedido { get; set; } = string.Empty;
        public DateOnly Fecha { get; set; }
        public string EstadoPedido { get; set; } = "Pendiente";
    }
}