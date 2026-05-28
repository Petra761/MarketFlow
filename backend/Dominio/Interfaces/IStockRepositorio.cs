using Marketflow.Dominio.Entidades;

namespace Marketflow.Dominio.Interfaces;

public interface IStockRepositorio
{
    Task<IEnumerable<Stock>> ObtenerTodosAsync();
    Task<Stock?> ObtenerPorCodigoLoteAsync(string codigoLote);
    Task<IEnumerable<Stock>> ObtenerPorCodigoProductoAsync(string codigoProducto);
    Task<bool> CrearStockAsync(Stock stock);
    Task<bool> ActualizarStockAsync(Stock stock);
    Task<bool> EliminarAsync(string codigoLote);
    Task<int> ObtenerIdProductoPorCodigo(string codigoProducto);
}
