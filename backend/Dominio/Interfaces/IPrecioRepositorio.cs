using Marketflow.Dominio.Entidades;

namespace Marketflow.Dominio.Interfaces;

public interface IPrecioRepositorio
{
    Task<IEnumerable<Precio>> ObtenerTodosAsync();
    Task<Precio?> ObtenerPorCodigoPrecioAsync(string codigoPrecio);
    Task<Precio?> ObtenerPrecioPorMontoYProductoAsync(int idProducto, decimal monto);
    Task<IEnumerable<Precio>> ObtenerHistorialPorProductoAsync(string codigoProducto);
    Task<bool> CrearPrecioAsync(Precio precio);
    Task<bool> ActualizarPrecioAsync(Precio precio);
    Task<bool> DesactivarPreciosRestantesAsync(int idProducto, string codigoPrecioExcluido);
    Task<int> ObtenerIdProductoPorCodigo(string codigoProducto);
}
