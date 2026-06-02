using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dominio.DTOs
{
    public class VentasCategoriaDTO
    {
        public string Categoria {get; set;} = string.Empty;
        public decimal TotalVentas {get; set;}
        public int CantidadVendida {get; set;}
    }
}