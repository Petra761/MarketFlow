using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dominio.DTOs
{
    public class Detalle_PedidoDTO
    {
        public string? CodigoPedido { get; set; }
        public string? CodigoProducto { get; set; }
        public int Cantidad { get; set; }
    }

    public class DetallePedidoRecibidoDTO
    {
        public string NombreProducto { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public decimal Subtotal { get; set; }
    }

    public class DetallePedidoDTO
    {
        public string CodigoProducto { get; set; } = string.Empty;
        public int cantidad { get; set; }
    }

    public class DetallePedidoClienteDTO
    {
        public string CodigoProducto { get; set; } = string.Empty;
        public string NombreProducto { get; set; } = string.Empty;
        public string DescripcionProducto { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public decimal Subtotal { get; set; }
    }
}
