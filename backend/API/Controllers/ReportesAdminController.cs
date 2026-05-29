using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.Dominio.Interfaces;

namespace backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportesAdminController : ControllerBase
    {
        private readonly IReporteAdminRepositorio _reporteRepositorio;

        public ReportesAdminController(
            IReporteAdminRepositorio reporteRepositorio)
        {
            _reporteRepositorio = reporteRepositorio;
        }

        
        [HttpGet("VentasDia")]
        public async Task<IActionResult> ObtenerVentasDia()
        {
            var ventas =
                await _reporteRepositorio.ObtenerVentasDia();

            return Ok(ventas);
        }

        
        [HttpGet("VentasSemana")]
        public async Task<IActionResult> ObtenerVentasSemana()
        {
            var ventas =
                await _reporteRepositorio.ObtenerVentasSemana();

            return Ok(ventas);
        }

        
        [HttpGet("VentasMes")]
        public async Task<IActionResult> ObtenerVentasMes()
        {
            var ventas =
                await _reporteRepositorio.ObtenerVentasMes();

            return Ok(ventas);
        }

        
        [HttpGet("VentasAnual")]
        public async Task<IActionResult> ObtenerVentasAnual()
        {
            var ventas =
                await _reporteRepositorio.ObtenerVentasAnual();

            return Ok(ventas);
        }

        [HttpGet("ventasRango")]
        public async Task<IActionResult>
            ObtenerVentasPorRangoFechas(
                DateOnly fechaInicio,
                DateOnly fechaFin)
        {
            if (fechaInicio > fechaFin)
            {
                return BadRequest(
                    "La fecha de inicio no puede ser mayor a la fecha final");
            }

            var ventas = await _reporteRepositorio
                .ObtenerVentasPorRangoFechas(
                    fechaInicio,
                    fechaFin);

            return Ok(ventas);
        }

        [HttpGet("ventasCategoria")]
        public async Task<IActionResult>
            ObtenerVentasCategoria()
        {
            var ventas = await _reporteRepositorio
                .ObtenerVentasCategoria();

            return Ok(ventas);
        }

        [HttpGet("productosMasVendidos")]
        public async Task<IActionResult>
            ObtenerProductosMasVendidos()
        {
            var productos = await _reporteRepositorio
                .ObtenerProductosMasVendidos();

            return Ok(productos);
        }
    }
}