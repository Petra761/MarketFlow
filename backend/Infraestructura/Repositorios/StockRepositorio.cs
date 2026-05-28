using Marketflow.Dominio.Entidades;
using Marketflow.Dominio.Interfaces;
using Marketflow.Infraestructura.Data;
using Microsoft.EntityFrameworkCore;

namespace Marketflow.Infraestructura.Repositorios;

public class StockRepositorio : IStockRepositorio
{
    private readonly MarketflowContext _context;

    public StockRepositorio(MarketflowContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Stock>> ObtenerTodosAsync()
    {
        return await _context
            .Stock.Include(s => s.Producto)
            .Where(s => s.Estado != "Eliminado")
            .ToListAsync();
    }

    public async Task<Stock?> ObtenerPorCodigoLoteAsync(string codigoLote)
    {
        return await _context
            .Stock.Include(s => s.Producto)
            .FirstOrDefaultAsync(s => s.CodigoLote == codigoLote && s.Estado != "Eliminado");
    }

    public async Task<IEnumerable<Stock>> ObtenerPorCodigoProductoAsync(string codigoProducto)
    {
        return await _context
            .Stock.Include(s => s.Producto)
            .Where(s => s.Producto.CodigoProducto == codigoProducto && s.Estado != "Eliminado")
            .ToListAsync();
    }

    public async Task<int> ObtenerIdProductoPorCodigo(string codigoProducto)
    {
        var producto = await _context.Producto.FirstOrDefaultAsync(p =>
            p.CodigoProducto == codigoProducto
        );
        return producto?.IdProducto ?? 0;
    }

    public async Task<bool> CrearStockAsync(Stock stock)
    {
        await _context.Stock.AddAsync(stock);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> ActualizarStockAsync(Stock stock)
    {
        _context.Entry(stock).State = EntityState.Modified;
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> EliminarAsync(string codigoLote)
    {
        var stock = await ObtenerPorCodigoLoteAsync(codigoLote);
        if (stock == null)
            return false;

        stock.Estado = "Inactivo";
        return await _context.SaveChangesAsync() > 0;
    }
}
