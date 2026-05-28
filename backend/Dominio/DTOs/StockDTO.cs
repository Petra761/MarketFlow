namespace Marketflow.Dominio.DTOs;

public class StockResponseDTO
{
    public string CodigoProducto { get; set; } = string.Empty;
    public string NombreProducto { get; set; } = string.Empty;
    public string CodigoLote { get; set; } = string.Empty;
    public DateOnly Fecha { get; set; }
    public int StockInicial { get; set; }
    public int StockActual { get; set; }
}

public class StockCreateDTO
{
    public string CodigoProducto { get; set; } = string.Empty;
    public string CodigoLote { get; set; } = string.Empty;
    public int Cantidad { get; set; }
    public DateOnly Fecha { get; set; }
}

public class StockUpdateDTO
{
    public int StockActual { get; set; }
    public string Estado { get; set; } = "Activo";
}

public class StockSumarioDTO
{
    public string CodigoProducto { get; set; } = string.Empty;
    public string NombreProducto { get; set; } = string.Empty;
    public int StockTotal { get; set; }
}
