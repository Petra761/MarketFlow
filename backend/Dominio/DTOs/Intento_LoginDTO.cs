namespace backend.Dominio.DTOs
{
    public class Intento_LoginDTO
    {
         public int IdUsuario { get; set; }
        public DateTime FechaIntento { get; set; }
        public string Estado { get; set; } = "Activo";
    }
}