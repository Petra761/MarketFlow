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

    [HttpPost]
    public async Task<ActionResult> Post([FromBody] PrecioCreateDTO dto)
    {
        int idProducto = await _context.ObtenerIdProductoPorCodigo(dto.CodigoProducto);
        if (idProducto == 0)
            return BadRequest("Producto no encontrado.");

        var precioExistente = await _context.ObtenerPrecioPorMontoYProductoAsync(
            idProducto,
            dto.Monto
        );

        if (precioExistente != null)
        {
            precioExistente.Estado = "Activo";
            precioExistente.FechaInicio = dto.FechaInicio;
            precioExistente.FechaFin = null;
            await _context.ActualizarPrecioAsync(precioExistente);

            await _context.DesactivarPreciosRestantesAsync(
                idProducto,
                precioExistente.CodigoPrecio
            );

            return Ok(
                new
                {
                    mensaje = "Precio reasignado (ya existía)",
                    codigo = precioExistente.CodigoPrecio,
                }
            );
        }
        else
        {
            var nuevoPrecio = PrecioMapper.ToEntity(dto, idProducto);
            await _context.CrearPrecioAsync(nuevoPrecio);

            await _context.DesactivarPreciosRestantesAsync(idProducto, nuevoPrecio.CodigoPrecio);

            return Ok(
                new { mensaje = "Nuevo precio registrado", codigo = nuevoPrecio.CodigoPrecio }
            );
        }
    }

    [HttpPut("{codigoPrecio}")]
    public async Task<ActionResult> Put(string codigoPrecio, [FromBody] PrecioUpdateDTO dto)
    {
        var precio = await _context.ObtenerPorCodigoPrecioAsync(codigoPrecio);
        if (precio == null)
            return NotFound();

        precio.Monto = dto.Monto;
        precio.FechaInicio = dto.FechaInicio;
        precio.FechaFin = dto.FechaFin;
        precio.Estado = dto.Estado;

        await _context.ActualizarPrecioAsync(precio);
        return NoContent();
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
