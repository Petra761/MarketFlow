using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using Marketflow.Dominio.Entidades;
using Microsoft.AspNetCore.Mvc;

namespace backend.Dominio.Interfaces
{
    public interface IProductoRepositorio
    {
        Task<List<ProductoDTO>> GetProductos();
        Task<ProductoDTO> GetProducto(string codigo);
        Task<ProductoDTO> PostProducto([FromBody] ProductoDTO producto);
        Task<ProductoDTO> PutProducto(string codigo,[FromBody] ProductoDTO producto);
        Task<ProductoDTO> DeleteProducto(string codigo);
    }
}