using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using Marketflow.Dominio.Entidades;

namespace backend.Dominio.Mapeadores
{
    public static class ProductoMapeador
    {
        public static ProductoDTO toProductoDTO(this Producto producto)
        {
            if (producto == null)
                return null;
            return new ProductoDTO()
            {
                CodigoProducto = producto.CodigoProducto,
                CodigoUsuario = producto.Usuario?.CodigoUsuario ?? "N/A",
                CodigoCategoria = producto.Categoria?.CodigoCategoria ?? "N/A",
                Nombre = producto.Nombre,
                Descripcion = producto.Descripcion,
                Marca = producto.Marca,
                Fecha = producto.Fecha,
                EstadoProducto = producto.EstadoProducto,
                Imagen = producto.Imagen,
            };
        }
    }
}
