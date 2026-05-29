using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.Interfaces;
using backend.Infraestructura;
using Marketflow.Infraestructura.Data;
using Marketflow.Dominio.Entidades;
using backend.Dominio.DTOs;
using Microsoft.EntityFrameworkCore;
using backend.Dominio.Mapeadores;
using Microsoft.AspNetCore.Mvc;
using backend.Dominio.Helpers;

namespace Marketflow.Infraestructura.Repositorios
{
    public class ProductoRepositorio : IProductoRepositorio
    {
        private readonly MarketflowContext context1;
        public ProductoRepositorio(MarketflowContext context)
        {
            this.context1 = context;
        }

        public async Task<List<ProductoDTO>> GetProductos()
        {
            var producto = await context1.Producto
                .Include(p => p.Usuario)
                .Include(p => p.Categoria)
                .Where(p => p.Estado == "Activo")
                .ToListAsync();
            return producto.Select(p => p.toProductoDTO()).ToList();
        }

        public async Task<ProductoDTO> GetProducto(string codigo)
        {
            var producto = await context1.Producto
                .Include(p => p.Usuario)
                .Include(p => p.Categoria)
                .FirstOrDefaultAsync(p => p.CodigoProducto == codigo && p.Estado == "Activo");
            if (producto == null) throw new Exception("El producto no existe.");
            return producto.toProductoDTO();
        }

        public async Task<List<MisProductosDTO>> GetMisProductos(string codigoUsuario)
        {
            var usuario = await context1.Usuario
                .FirstOrDefaultAsync(u => u.CodigoUsuario == codigoUsuario && u.Estado == "Activo");
            if (usuario == null) throw new Exception("El usuario no existe.");

            var productos = await context1.Producto
                .Include(p => p.Categoria)
                .Include(p => p.Precios)
                .Include(p => p.Stocks)
                .Where(p => p.IdUsuario == usuario.IdUsuario && p.Estado == "Activo")
                .ToListAsync();

            return productos.Select(p => new MisProductosDTO
            {
                CodigoProducto  = p.CodigoProducto,
                Nombre          = p.Nombre,
                Descripcion     = p.Descripcion,
                Marca           = p.Marca,
                NombreCategoria = p.Categoria?.Nombre ?? "Sin categoría",
                EstadoProducto  = p.EstadoProducto,
                Fecha           = p.Fecha,
                PrecioActual    = p.Precios?
                    .Where(pr => pr.Estado == "Activo" && pr.FechaFin == null)
                    .Select(pr => (decimal?)pr.Monto)
                    .FirstOrDefault(),
                StockActual     = p.Stocks?
                    .Where(s => s.Estado == "Activo")
                    .Sum(s => s.StockActual) ?? 0
            }).ToList();
        }

        public async Task<ProductoDTO> PostProducto([FromBody] ProductoDTO producto)
        {
            if (string.IsNullOrEmpty(producto.Nombre))
                throw new Exception("El nombre del producto es obligatorio.");
            if (string.IsNullOrEmpty(producto.CodigoCategoria))
                throw new Exception("Debe seleccionar una categoría.");
            if (string.IsNullOrEmpty(producto.CodigoUsuario))
                throw new Exception("Debe estar asociado a un vendedor.");

            var usuario = await context1.Usuario
                .FirstOrDefaultAsync(u => u.CodigoUsuario == producto.CodigoUsuario && u.Estado == "Activo");
            if (usuario == null) throw new Exception("El usuario no existe.");

            var categoria = await context1.Categoria
                .FirstOrDefaultAsync(c => c.CodigoCategoria == producto.CodigoCategoria && c.Estado == "Activo");
            if (categoria == null) throw new Exception("La categoría no existe.");

            string codigoGenerado = CodeGenerator.Generate("PROD");

            var product = new Producto
            {
                CodigoProducto = codigoGenerado,
                IdUsuario      = usuario.IdUsuario,
                IdCategoria    = categoria.IdCategoria,
                Nombre         = producto.Nombre,
                Descripcion    = producto.Descripcion ?? "",
                Marca          = string.IsNullOrEmpty(producto.Marca) ? "Sin marca" : producto.Marca,
                Fecha          = DateOnly.FromDateTime(DateTime.Now),
                EstadoProducto = "Nuevo"
            };
            context1.Producto.Add(product);
            await context1.SaveChangesAsync();

            return product.toProductoDTO();
        }

        public async Task<ProductoDTO> PutProducto(string codigo, string codigoUsuario, [FromBody] ProductoDTO producto)
        {
            if (string.IsNullOrEmpty(producto.Nombre))
                throw new Exception("El nombre del producto es obligatorio.");

            var product = await context1.Producto
                .FirstOrDefaultAsync(p => p.CodigoProducto == codigo && p.Estado == "Activo");
            if (product == null) throw new Exception("El producto no existe.");

            var usuario = await context1.Usuario
                .FirstOrDefaultAsync(u => u.CodigoUsuario == codigoUsuario && u.Estado == "Activo");
            if (usuario == null) throw new Exception("El usuario no existe.");
            if (product.IdUsuario != usuario.IdUsuario)
                throw new Exception("No tienes permiso para editar este producto.");

            var categoria = await context1.Categoria
                .FirstOrDefaultAsync(c => c.CodigoCategoria == producto.CodigoCategoria && c.Estado == "Activo");
            if (categoria == null) throw new Exception("La categoría no existe.");

            product.IdCategoria    = categoria.IdCategoria;
            product.Nombre         = producto.Nombre;
            product.Descripcion    = producto.Descripcion ?? "";
            product.Marca          = string.IsNullOrEmpty(producto.Marca) ? "Sin marca" : producto.Marca;
            product.EstadoProducto = producto.EstadoProducto;

            await context1.SaveChangesAsync();

            await context1.Entry(product).Reference(p => p.Usuario).LoadAsync();
            await context1.Entry(product).Reference(p => p.Categoria).LoadAsync();
            return product.toProductoDTO();
        }

        public async Task<ProductoDTO> DeleteProducto(string codigo, string codigoUsuario)
        {
            var product = await context1.Producto
                .Include(u => u.Usuario)
                .Include(c => c.Categoria)
                .FirstOrDefaultAsync(p => p.CodigoProducto == codigo && p.Estado == "Activo");
            if (product == null) throw new Exception("El producto no existe.");

            var usuario = await context1.Usuario
                .FirstOrDefaultAsync(u => u.CodigoUsuario == codigoUsuario && u.Estado == "Activo");
            if (usuario == null) throw new Exception("El usuario no existe.");
            if (product.IdUsuario != usuario.IdUsuario)
                throw new Exception("No tienes permiso para eliminar este producto.");

            product.Estado = "Inactivo";
            context1.Producto.Update(product);
            await context1.SaveChangesAsync();
            return product.toProductoDTO();
        }
    }
}
