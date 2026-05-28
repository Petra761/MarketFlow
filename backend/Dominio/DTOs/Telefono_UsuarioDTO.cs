namespace backend.Dominio.DTOs
{
    public class Telefono_UsuarioDTO
    {
        public int IdTelefono { get; set; }
        public int IdUsuario { get; set; }
        public DateOnly FechaInicio { get; set; }
        public DateOnly? FechaFin { get; set; }
    }
}