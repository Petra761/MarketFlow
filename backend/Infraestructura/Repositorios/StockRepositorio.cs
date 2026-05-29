using Marketflow.Dominio.DTOs;
using Marketflow.Dominio.Entidades;
using Marketflow.Dominio.Interfaces;
using Marketflow.Infraestructura.Data;
using Microsoft.AspNetCore.Http.HttpResults;
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
            .Where(s => s.Estado != "Inactivo")
            .ToListAsync();
    }

    public async Task<Stock?> ObtenerPorCodigoLoteAsync(string codigoLote)
    {
        return await _context
            .Stock.Include(s => s.Producto)
            .FirstOrDefaultAsync(s => s.CodigoLote == codigoLote && s.Estado != "Inactivo");
    }

    public async Task<IEnumerable<Stock>> ObtenerPorCodigoProductoAsync(string codigoProducto)
    {
        return await _context
            .Stock.Include(s => s.Producto)
            .Where(s => s.Producto.CodigoProducto == codigoProducto && s.Estado != "Inactivo")
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

    public async Task<bool> ReponerProducto(StockReposicionDTO dto)
    {
        var producto = await (
            from p in _context.Producto
            where p.CodigoProducto == dto.CodigoProducto
            select p
        ).FirstOrDefaultAsync();

        if (producto is null)
            return false;

        var stock = new Stock
        {
            IdProducto = producto.IdProducto,
            CodigoLote = CodeGenerator.Generate("STK", 5),
            Fecha = DateOnly.FromDateTime(DateTime.Now),
            StockActual = dto.CantidadIngreasada,
            StockInicial = dto.CantidadIngreasada,
        };

        await _context.Stock.AddAsync(stock);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> HayStock(string codigoproducto, int cantidad)
    {
        var producto = await (
            from p in _context.Producto
            where p.CodigoProducto == codigoproducto
            select p
        ).FirstOrDefaultAsync();
        if (producto is null)
            return false;
        var stockTotal = await (
            from s in _context.Stock
            where s.IdProducto == producto.IdProducto
            select s.StockActual
        ).SumAsync();

        if (stockTotal < cantidad)
            return false;
        return true;
    }

    public async Task<string> ActualizarStock(string CodigoPedido)
    {
        var pedido = await (
            from p in _context.Pedido
            where p.CodigoPedido == CodigoPedido
            select p
        ).FirstOrDefaultAsync();
        if (pedido is null)
            return "No se encontro el pedido";
        var detallles = await (
            from dp in _context.Detalle_Pedido
            where dp.IdPedido == pedido.IdPedido
            select dp
        ).ToListAsync();

        using var transaccion = await _context.Database.BeginTransactionAsync();

        try
        {
            foreach (var item in detallles)
            {
                int cantidadPendiente = item.Cantidad;

                var lotes = await (
                    from s in _context.Stock
                    where s.IdProducto == item.IdProducto && s.StockActual > 0
                    orderby s.Fecha
                    select s
                ).ToListAsync();
                foreach (var lote in lotes)
                {
                    if (cantidadPendiente <= 0)
                        break;
                    if (lote.StockActual >= cantidadPendiente)
                    {
                        lote.StockActual -= cantidadPendiente;
                        cantidadPendiente = 0;
                    }
                    else
                    {
                        cantidadPendiente -= lote.StockActual;
                        lote.StockActual = 0;
                    }
                }
                if (cantidadPendiente > 0)
                    return $"Algo salio mal en el FIFO {item.IdProducto}";
            }
            await _context.SaveChangesAsync();
            await transaccion.CommitAsync();

            return "Se Actualizo el stock correctamente";
        }
        catch (Exception ex)
        {
            return $"error {ex}";
        }
    }
}
