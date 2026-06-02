using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Marketflow.Dominio.Entidades;

namespace Marketflow.Dominio.Entidades
{
    public class Categoria
    {
        [Key]
        public int IdCategoria { get; set; }
        public string CodigoCategoria { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Estado { get; set; } = "Activo";
        public List<Producto>? Productos { get; set; }
    }
}
