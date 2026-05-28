using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dominio.DTOs
{
    public class ProductoDTO
    {
        public string CodigoProducto { get; set; }
        public string CodigoUsuario { get; set; }
        public string CodigoCategoria { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Marca { get; set; }
        public DateOnly Fecha { get; set; }
        public string EstadoProducto { get; set; }
    }
}