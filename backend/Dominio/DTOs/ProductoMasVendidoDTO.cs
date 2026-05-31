using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dominio.DTOs
{
    public class ProductoMasVendidoDTO
    {
        public string Producto { get; set; } = string.Empty;
        public int CantidadVendida { get; set; }
        public decimal TotalGenerado { get; set; }
        public string? Imagen { get; set; }
    }
}