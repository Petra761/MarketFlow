using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dominio.DTOs
{
    public class ProductoDTO
    {

        public string CodigoUsuario { get; set; } = string.Empty;
        public string CodigoCategoria { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Marca { get; set; } = string.Empty;
        public DateOnly? Fecha { get; set; }
        public string EstadoProducto { get; set; } = string.Empty;
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
        public string Descripcion { get; set; } = string.Empty;
        public string Marca { get; set; } = string.Empty;
        public DateOnly? Fecha { get; set; }
        public string EstadoProducto { get; set; } = string.Empty;
    }
     
}
