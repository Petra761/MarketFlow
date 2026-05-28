using Marketflow.Dominio.DTOs;
using Marketflow.Dominio.Entidades;

namespace Marketflow.Dominio.Mappers;

public static class StockMapper
{
    public static StockResponseDTO ToDTO(Stock stock)
    {
        return new StockResponseDTO
        {
            CodigoProducto = stock.Producto?.CodigoProducto ?? "N/A",
            NombreProducto = stock.Producto?.Nombre ?? "N/A",
            CodigoLote = stock.CodigoLote,
            Fecha = stock.Fecha,
            StockInicial = stock.StockInicial,
            StockActual = stock.StockActual,
        };
    }

    public static Stock ToEntity(StockCreateDTO dto, int idProducto)
    {
        return new Stock
        {
            IdProducto = idProducto,
            CodigoLote = dto.CodigoLote,
            Fecha = dto.Fecha,
            StockInicial = dto.Cantidad,
            StockActual = dto.Cantidad,
            Estado = "Activo",
        };
    }
}
