using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using backend.Dominio.Interfaces;
using Marketflow.Infraestructura.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Infraestructura.Repositorios
{
    public class ReporteRepositorio : IReporteAdminRepositorio
    {
        private readonly MarketflowContext _context;

        public ReporteRepositorio(MarketflowContext context)
        {
            _context = context;
        }

        public async Task<List<VentasGraficaDTO>> ObtenerVentasDia()
        {
            var hoy = DateOnly.FromDateTime(DateTime.Now);

            var ventas = await _context.Pedido
                .Where(v =>
                    v.Estado == "Activo" &&
                    v.Fecha == hoy)
                .GroupBy(v => v.Fecha)
                .Select(g => new
                {
                    Fecha = g.Key,
                    TotalVentas = g.Sum(v => v.Total),
                    CantidadVentas = g.Count()
                })
                .ToListAsync();

            return ventas.Select(v => new VentasGraficaDTO
            {
                Periodo = v.Fecha.ToString("dd/MM/yyyy"),
                TotalVentas = v.TotalVentas,
                CantidadVentas = v.CantidadVentas
            }).ToList();
        }

        public async Task<List<VentasGraficaDTO>> ObtenerVentasSemana()
        {
            var hoy = DateOnly.FromDateTime(DateTime.Now);

            var hace7dias = hoy.AddDays(-6);

            var ventas = await _context.Pedido
                .Where(v =>
                    v.Estado == "Activo" &&
                    v.Fecha <= hoy &&
                    v.Fecha >= hace7dias)
                .GroupBy(v => v.Fecha)
                .Select(g => new
                {
                    Fecha = g.Key,
                    TotalVentas = g.Sum(v => v.Total),
                    CantidadVentas = g.Count()
                })
                .OrderBy(v => v.Fecha)
                .ToListAsync();

            return ventas.Select(v => new VentasGraficaDTO
            {
                Periodo = v.Fecha.ToString("dd/MM/yyyy"),
                TotalVentas = v.TotalVentas,
                CantidadVentas = v.CantidadVentas
            }).ToList();
        }

        public async Task<List<VentasGraficaDTO>> ObtenerVentasMes()
        {
            var anioActual = DateTime.Now.Year;

            var ventas = await _context.Pedido
                .Where(v =>
                    v.Estado == "Activo" &&
                    v.Fecha.Year == anioActual)
                .GroupBy(v => v.Fecha.Month)
                .Select(g => new
                {
                    Mes = g.Key,
                    TotalVentas = g.Sum(v => v.Total),
                    CantidadVentas = g.Count()
                })
                .OrderBy(v => v.Mes)
                .ToListAsync();

            return ventas.Select(v => new VentasGraficaDTO
            {
                Periodo = new DateTime(1, v.Mes, 1)
                    .ToString("MMMM"),

                TotalVentas = v.TotalVentas,

                CantidadVentas = v.CantidadVentas
            }).ToList();
        }

        public async Task<List<VentasGraficaDTO>> ObtenerVentasAnual()
        {
            var ventas = await _context.Pedido
                .Where(v => v.Estado == "Activo")
                .GroupBy(v => v.Fecha.Year)
                .Select(g => new
                {
                    Anio = g.Key,
                    TotalVentas = g.Sum(v => v.Total),
                    CantidadVentas = g.Count()
                })
                .OrderBy(v => v.Anio)
                .ToListAsync();

            return ventas.Select(v => new VentasGraficaDTO
            {
                Periodo = v.Anio.ToString(),
                TotalVentas = v.TotalVentas,
                CantidadVentas = v.CantidadVentas
            }).ToList();
        }

        public async Task<List<VentasGraficaDTO>>
            ObtenerVentasPorRangoFechas(
                DateOnly fechaInicio,
                DateOnly fechaFin)
        {
            var ventas = await _context.Pedido
                .Where(v =>
                    v.Estado == "Activo" &&
                    v.Fecha >= fechaInicio &&
                    v.Fecha <= fechaFin)
                .GroupBy(v => v.Fecha)
                .Select(g => new
                {
                    Fecha = g.Key,
                    TotalVentas = g.Sum(v => v.Total),
                    CantidadVentas = g.Count()
                })
                .OrderBy(v => v.Fecha)
                .ToListAsync();

            return ventas.Select(v => new VentasGraficaDTO
            {
                Periodo = v.Fecha.ToString("dd/MM/yyyy"),
                TotalVentas = v.TotalVentas,
                CantidadVentas = v.CantidadVentas
            }).ToList();
        }

        public async Task<List<VentasCategoriaDTO>>
            ObtenerVentasCategoria()
        {
            var ventas = await _context.Detalle_Pedido
                .Where(d => d.Pedido!.Estado == "Activo")
                .GroupBy(d => d.Producto!.Categoria!.Nombre)
                .Select(g => new VentasCategoriaDTO
                {
                    Categoria = g.Key,
                    TotalVentas = g.Sum(d => d.Subtotal),
                    CantidadVendida = g.Sum(d => d.Cantidad)
                })
                .OrderByDescending(v => v.TotalVentas)
                .ToListAsync();

            return ventas;
        }

        public async Task<List<ProductoMasVendidoDTO>> ObtenerProductosMasVendidos()
        {
            var productos = await _context.Detalle_Pedido
                .Where(d => d.Pedido!.Estado == "Activo")
                .GroupBy(d => new
                {
                    d.Producto!.Nombre,
                    d.Producto.Imagen
                })
                .Select(g => new ProductoMasVendidoDTO
                {
                    Producto = g.Key.Nombre,
                    Imagen = g.Key.Imagen,
                    CantidadVendida = g.Sum(d => d.Cantidad),
                    TotalGenerado = g.Sum(d => d.Subtotal)
                })
                .OrderByDescending(p => p.CantidadVendida)
                .ToListAsync();

            return productos;
        }

        public async Task<List<UsuarioEstadisticaDTO>>ObtenerCrecimientoUsuarios()
        {
                var datos = await _context.Usuario
                .Where(u => u.Estado == "Activo")
                .GroupBy(u => new
                {
                    u.FechaRegistro.Year,
                    u.FechaRegistro.Month
                })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    CantidadUsuarios = g.Count()
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToListAsync();

            return datos.Select(x => new UsuarioEstadisticaDTO
            {
                Periodo = $"{x.Month}/{x.Year}",
                CantidadUsuarios = x.CantidadUsuarios
            }).ToList();
        }
    }
}