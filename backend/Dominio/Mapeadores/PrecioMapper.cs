using backend.Dominio.Helpers;
using Marketflow.Dominio.DTOs;
using Marketflow.Dominio.Entidades;

namespace Marketflow.Dominio.Mappers;

public static class PrecioMapper
{
    public static PrecioResponseDTO ToDTO(Precio precio)
    {
        return new PrecioResponseDTO
        {
            CodigoProducto = precio.Producto?.CodigoProducto ?? "N/A",
            NombreProducto = precio.Producto?.Nombre ?? "N/A",
            CodigoPrecio = precio.CodigoPrecio,
            Monto = precio.Monto,
            FechaInicio = precio.FechaInicio,
            FechaFin = precio.FechaFin,
            Estado = precio.Estado,
        };
    }

    public static Precio ToEntity(PrecioCreateDTO dto, int idProducto)
    {
        return new Precio
        {
            IdProducto = idProducto,
            CodigoPrecio = CodeGenerator.Generate("PRE"),
            Monto = dto.Monto,
            FechaInicio = DateOnly.FromDateTime(DateTime.Now),
            Estado = "Activo",
        };
    }
}
