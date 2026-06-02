using Marketflow.Dominio.DTOs;
using Marketflow.Dominio.Interfaces;
using Marketflow.Dominio.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace Marketflow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PrecioController : ControllerBase
{
    private readonly IPrecioRepositorio _context;

    public PrecioController(IPrecioRepositorio repository)
    {
        _context = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PrecioResponseDTO>>> Get()
    {
        var precios = await _context.ObtenerTodosAsync();
        return Ok(precios.Select(PrecioMapper.ToDTO));
    }

    [HttpGet("{codigoPrecio}")]
    public async Task<ActionResult<PrecioResponseDTO>> GetByCodigo(string codigoPrecio)
    {
        var precio = await _context.ObtenerPorCodigoPrecioAsync(codigoPrecio);
        if (precio == null)
            return NotFound();
        return Ok(PrecioMapper.ToDTO(precio));
    }

    [HttpGet("producto/{codigoProducto}")]
    public async Task<ActionResult<IEnumerable<PrecioResponseDTO>>> GetByProducto(
        string codigoProducto
    )
    {
        var precios = await _context.ObtenerHistorialPorProductoAsync(codigoProducto);
        return Ok(precios.Select(PrecioMapper.ToDTO));
    }

    [HttpDelete("{codigoPrecio}")]
    public async Task<ActionResult> Delete(string codigoPrecio)
    {
        var precio = await _context.ObtenerPorCodigoPrecioAsync(codigoPrecio);
        if (precio == null)
            return NotFound();

        precio.Estado = "Inactivo";
        precio.FechaFin = DateOnly.FromDateTime(DateTime.Now);

        await _context.ActualizarPrecioAsync(precio);
        return Ok("Precio desactivado.");
    }
}
