using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Marketflow.Dominio.Entidades;

namespace Marketflow.Dominio.Entidades
{
    public class Usuario
    {
        [Key]
        public int IdUsuario { get; set; }
        public int IdRol { get; set; }
        public string CodigoUsuario { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public string Contrasenia { get; set; } = string.Empty;
        public DateOnly FechaRegistro { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public string Estado { get; set; } = "Activo";

        [ForeignKey("IdRol")]
        [JsonIgnore]
        public Rol? Rol { get; set; }
        public List<Producto>? Productos { get; set; }
        public List<Pedido>? Pedidos { get; set; }
        public List<Telefono_Usuario>? TelefonosUsuarios { get; set; }
        public List<Intento_Login>? IntentosLogin { get; set; }
    }
}
