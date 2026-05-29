using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dominio.DTOs
{
    public class VentasGraficaDTO
    {
        public string Periodo {get; set;} = string.Empty;
        public decimal TotalVentas {get; set;}
        public int CantidadVentas {get; set;}

    }
}