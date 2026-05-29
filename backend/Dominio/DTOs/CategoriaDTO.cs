using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dominio.DTOs
{
    public class CategoriaDTO
    {
        public string? CodigoCategoria { get; set; }
        public string Nombre { get; set; } = string.Empty;
     
    }
    public class mCategoriaDTO
    {
        public string Nombre { get; set; } = string.Empty;
    }
}