using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dominio.DTOs
{
    public class UsuarioEstadisticaDTO
    {
        public string Periodo { get; set; } = string.Empty;
        public int CantidadUsuarios { get; set; }
    }
}