namespace Marketflow.Dominio.DTOs;

public class PrecioResponseDTO
{
    public string CodigoProducto { get; set; } = string.Empty;
    public string NombreProducto { get; set; } = string.Empty;
    public string CodigoPrecio { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public DateOnly FechaInicio { get; set; }
    public DateOnly? FechaFin { get; set; }
    public string Estado { get; set; } = string.Empty;
}

public class PrecioCreateDTO
{
    public string CodigoProducto { get; set; } = string.Empty;
    public string CodigoPrecio { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public DateOnly FechaInicio { get; set; }
}

public class PrecioUpdateDTO
{
    public decimal Monto { get; set; }
    public DateOnly FechaInicio { get; set; }
    public DateOnly? FechaFin { get; set; }
    public string Estado { get; set; } = "Activo";
}
