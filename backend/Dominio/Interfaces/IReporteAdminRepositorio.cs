using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;

namespace backend.Dominio.Interfaces
{
    public interface IReporteAdminRepositorio
    {
        Task<List<VentasGraficaDTO>> ObtenerVentasDia();
        Task<List<VentasGraficaDTO>> ObtenerVentasSemana();
        Task<List<VentasGraficaDTO>> ObtenerVentasMes();
        Task<List<VentasGraficaDTO>> ObtenerVentasAnual();
        Task<List<VentasCategoriaDTO>> ObtenerVentasCategoria();
        Task<List<VentasGraficaDTO>> ObtenerVentasPorRangoFechas(DateOnly fechaInicio, DateOnly fechaFin);
        Task<List<ProductoMasVendidoDTO>> ObtenerProductosMasVendidos();
    }
}