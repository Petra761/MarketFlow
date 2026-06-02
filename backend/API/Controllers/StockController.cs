using Marketflow.Dominio.DTOs;
using Marketflow.Dominio.Interfaces;
using Marketflow.Dominio.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace Marketflow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StockController : ControllerBase
{
    private readonly IStockRepositorio _context;

    public StockController(IStockRepositorio repository)
    {
        _context = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StockResponseDTO>>> Get()
    {
        var stocks = await _context.ObtenerTodosAsync();
        return Ok(stocks.Select(StockMapper.ToDTO));
    }

    [HttpGet("lote/{codigoLote}")]
    public async Task<ActionResult<StockResponseDTO>> GetByLote(string codigoLote)
    {
        var stock = await _context.ObtenerPorCodigoLoteAsync(codigoLote);
        if (stock == null)
            return NotFound("Lote no encontrado.");
        return Ok(StockMapper.ToDTO(stock));
    }

    [HttpGet("producto/{codigoProducto}")]
    public async Task<ActionResult<StockSumarioDTO>> GetTotalByProducto(string codigoProducto)
    {
        var lotes = await _context.ObtenerPorCodigoProductoAsync(codigoProducto);
        if (!lotes.Any())
            return NotFound("No hay stock para este producto.");

        var sumario = new StockSumarioDTO
        {
            CodigoProducto = codigoProducto,
            NombreProducto = lotes.First().Producto?.Nombre ?? "N/A",
            StockTotal = lotes.Sum(s => s.StockActual),
        };
        return Ok(sumario);
    }

    // [HttpPost]
    // public async Task<ActionResult> Post([FromBody] StockCreateDTO dto)
    // {
    //     int idProducto = await _context.ObtenerIdProductoPorCodigo(dto.CodigoProducto);
    //     if (idProducto == 0)
    //         return BadRequest("El producto especificado no existe.");

    //     var entidad = StockMapper.ToEntity(dto, idProducto);
    //     var result = await _context.CrearStockAsync(entidad);

    //     if (!result)
    //         return BadRequest("No se pudo registrar el stock.");
    //     return Ok("Nuevo lote registrado exitosamente.");
    // }

    [HttpPut("{codigoLote}")]
    public async Task<ActionResult> Put(string codigoLote, [FromBody] StockUpdateDTO dto)
    {
        var stock = await _context.ObtenerPorCodigoLoteAsync(codigoLote);
        if (stock == null)
            return NotFound("Lote no encontrado.");

        stock.StockActual = dto.StockActual;
        stock.Estado = dto.Estado;

        await _context.ActualizarStockAsync(stock);
        return NoContent();
    }

    [HttpDelete("{codigoLote}")]
    public async Task<ActionResult> Delete(string codigoLote)
    {
        var result = await _context.EliminarAsync(codigoLote);
        if (!result)
            return NotFound("Lote no encontrado o no se pudo eliminar.");
        return Ok("Lote dado de baja exitosamente.");
    }

    [HttpPost("abastecer")]
    public async Task<IActionResult> Abastecer([FromBody] StockReposicionDTO dto)
    {
        var result = await _context.ReponerProducto(dto);
        if (result)
        {
            return Ok("Se repuso correctamente el producto");
        }
        else
        {
            return BadRequest("No se pudo reponer el producto");
        }
    }
}
