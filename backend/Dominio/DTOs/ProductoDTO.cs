using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dominio.DTOs
{
    public class ProductoDTO
    {
        public string CodigoProducto { get; set; } = string.Empty;
        public string CodigoUsuario { get; set; } = string.Empty;
        public string CodigoCategoria { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Marca { get; set; } = string.Empty;
        public DateOnly? Fecha { get; set; }
        public string EstadoProducto { get; set; } = string.Empty;
        public string? Imagen { get; set; }
        public decimal? Precio { get; set; }
        public int? StockActual { get; set; }
        public string? TelefonoContacto { get; set; }
    }

    public class ProductoStock
    {
        public string CodigoProducto { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Marca { get; set; } = string.Empty;
        public int Stock { get; set; }
        public string Estado { get; set; } = string.Empty;
    }

    public class mProductoDTO
    {
        public string CodigoUsuario { get; set; } = string.Empty;
        public string CodigoCategoria { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public int Precio { get; set; }
        public int? CantidadInicial { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public string Marca { get; set; } = string.Empty;
        public DateOnly? Fecha { get; set; }
        public string EstadoProducto { get; set; } = string.Empty;
        public string? Imagen { get; set; }
    }

    public class ActualizarPrecioDTO
    {
        public string CodigoProducto { get; set; } = string.Empty;
        public decimal NuevoPrecio { get; set; }
    }
    public class ProductoDisponibleDTO
    {
        public string CodigoProducto { get; set; } = string.Empty;
        public string NombreProducto { get; set; } = string.Empty;
        public string NombreCategoria { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public int CantidadDisponible { get; set; }
        public string? Imagen { get; set; }
    }
}
