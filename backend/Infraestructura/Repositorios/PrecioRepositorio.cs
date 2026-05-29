using backend.Dominio.Helpers;
using Marketflow.Dominio.Entidades;
using Marketflow.Dominio.Interfaces;
using Marketflow.Infraestructura.Data;
using Microsoft.EntityFrameworkCore;

namespace Marketflow.Infraestructura.Repositorios;

public class PrecioRepositorio : IPrecioRepositorio
{
    private readonly MarketflowContext _context;

    public PrecioRepositorio(MarketflowContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Precio>> ObtenerTodosAsync()
    {
        return await _context.Precio.Include(p => p.Producto).ToListAsync();
    }

    public async Task<Precio?> ObtenerPorCodigoPrecioAsync(string codigoPrecio)
    {
        return await _context
            .Precio.Include(p => p.Producto)
            .FirstOrDefaultAsync(p => p.CodigoPrecio == codigoPrecio);
    }

    public async Task<Precio?> ObtenerPrecioPorMontoYProductoAsync(int idProducto, decimal monto)
    {
        // Buscamos si ese producto ya tuvo ese monto exacto registrado
        return await _context.Precio.FirstOrDefaultAsync(p =>
            p.IdProducto == idProducto && p.Monto == monto
        );
    }

    public async Task<int> ObtenerIdProductoPorCodigo(string codigoProducto)
    {
        var producto = await _context.Producto.FirstOrDefaultAsync(p =>
            p.CodigoProducto == codigoProducto
        );
        return producto?.IdProducto ?? 0;
    }

    public async Task<bool> CrearPrecioAsync(int precio, int idProducto)
    {
        var nPrecio = new Precio
        {
            IdProducto = idProducto,
            CodigoPrecio = CodeGenerator.Generate("PRE"),
            Monto = precio,
            FechaInicio = DateOnly.FromDateTime(DateTime.Now),
        };
        await _context.Precio.AddAsync(nPrecio);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ActualizarPrecioAsync(Precio precio)
    {
        _context.Precio.Update(precio);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DesactivarPreciosRestantesAsync(
        int idProducto,
        string codigoPrecioExcluido
    )
    {
        // Lógica para que solo haya un precio "Activo" a la vez
        var precios = await _context
            .Precio.Where(p => p.IdProducto == idProducto && p.CodigoPrecio != codigoPrecioExcluido)
            .ToListAsync();

        foreach (var p in precios)
        {
            p.Estado = "Inactivo";
            p.FechaFin = DateOnly.FromDateTime(DateTime.Now);
        }

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<IEnumerable<Precio>> ObtenerHistorialPorProductoAsync(string codigoProducto)
    {
        return await _context
            .Precio.Include(p => p.Producto)
            .Where(p => p.Producto.CodigoProducto == codigoProducto)
            .OrderByDescending(p => p.FechaInicio)
            .ToListAsync();
    }
}
