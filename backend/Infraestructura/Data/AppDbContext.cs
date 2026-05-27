using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Marketflow.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;

namespace Marketflow.Infraestructura.Data
{
    public class MarketflowContext : DbContext
    {
        public MarketflowContext(DbContextOptions<MarketflowContext> options)
            : base(options) { }

        public DbSet<Marketflow.Dominio.Entidades.Usuario> Usuario { get; set; }
        public DbSet<Marketflow.Dominio.Entidades.Rol> Rol { get; set; }
        public DbSet<Marketflow.Dominio.Entidades.Producto> Producto { get; set; }
        public DbSet<Marketflow.Dominio.Entidades.Pedido> Pedido { get; set; }
        public DbSet<Marketflow.Dominio.Entidades.Telefono> Telefono { get; set; }
        public DbSet<Marketflow.Dominio.Entidades.Telefono_Usuario> Telefono_Usuario { get; set; }
        public DbSet<Marketflow.Dominio.Entidades.Intento_Login> Intento_Login { get; set; }
        public DbSet<Marketflow.Dominio.Entidades.Detalle_Pedido> Detalle_Pedido { get; set; }
        public DbSet<Marketflow.Dominio.Entidades.Categoria> Categoria { get; set; }
        public DbSet<Marketflow.Dominio.Entidades.Metodo_Pago> Metodo_Pago { get; set; }
        public DbSet<Marketflow.Dominio.Entidades.Precio> Precio { get; set; }
        public DbSet<Marketflow.Dominio.Entidades.Stock> Stock { get; set; }
    }
}
