using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dominio.DTOs
{
    public class Metodo_PagoDTO
    {
        public string CodigoMetodoPago { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
    }
}