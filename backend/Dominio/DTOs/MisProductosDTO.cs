using System;

namespace backend.Dominio.DTOs
{
    public class MisProductosDTO
    {
        public string CodigoProducto { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Marca { get; set; } = string.Empty;
        public string NombreCategoria { get; set; } = string.Empty;
        public string EstadoProducto { get; set; } = string.Empty;
        public DateOnly Fecha { get; set; }
        public decimal? PrecioActual { get; set; }
        public int StockActual { get; set; }
        public string? Imagen { get; set; }
    }
}