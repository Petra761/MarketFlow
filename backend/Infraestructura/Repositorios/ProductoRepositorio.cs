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
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography.X509Certificates;
namespace Marketflow.Infraestructura.Repositorios
{
    public class ProductoRepositorio : IProductoRepositorio
    {
        private readonly MarketflowContext context1;
        public ProductoRepositorio(MarketflowContext context)
        {
            this.context1 = context;
        }
        public async Task<List<ProductoDTO>>GetProductos()
        {
            var producto = await context1.Producto
             .Include(p => p.Usuario)
             .Include(p => p.Categoria)
             .Where(p =>p.Estado == "Activo")
             .ToListAsync();

             return producto.Select(p => p.toProductoDTO()).ToList();
        }

        public async Task<ProductoDTO>GetProducto(string codigo)
        {
            var producto = await context1.Producto
                .Include(p => p.Usuario)
                .Include(p => p.Categoria)
                .FirstOrDefaultAsync(p => p.CodigoProducto == codigo 
                && p.Estado == "Activo");
                if(producto == null) throw new Exception("El producto no existe");

                return producto.toProductoDTO();
        }


        public async Task<ProductoDTO> PostProducto([FromBody] ProductoDTO producto)
        {
            var comprobante = await context1.Producto
                .AnyAsync(p => p.CodigoProducto == producto.CodigoProducto 
                && p.Estado == "Activo");
                if(comprobante) throw new Exception("El prodcuto ya existe");

            var usuario = await context1.Usuario
                .FirstOrDefaultAsync(u => u.CodigoUsuario == producto.CodigoUsuario
                && u.Estado == "Activo");

            if(usuario == null) throw new Exception("El usuario no existe");

            var categoria = await context1.Categoria
                .FirstOrDefaultAsync(c => c.CodigoCategoria == producto.CodigoCategoria
                && c.Estado == "Activo");
            
            if(categoria == null) throw new Exception("La categoria no existe");
                
            var product = new Producto
            {
                CodigoProducto = producto.CodigoProducto,
                IdUsuario = usuario.IdUsuario,
                IdCategoria = categoria.IdCategoria,
                Nombre = producto.Nombre,
                Descripcion = producto.Descripcion,
                Marca = producto.Marca,
                Fecha = producto.Fecha,
                EstadoProducto = producto.EstadoProducto
            };
            context1.Producto.Add(product);
            await context1.SaveChangesAsync();
            
            return producto;

        }


        public async Task<ProductoDTO>PutProducto(string codigo, [FromBody] ProductoDTO producto)
        {
            var product = await context1.Producto
                .FirstOrDefaultAsync(p =>
                p.CodigoProducto == codigo &&
                p.Estado == "Activo" );
                
                if(product == null) throw new Exception("El producto no existe");

            var usuario = await context1.Usuario
            .FirstOrDefaultAsync(u => u.CodigoUsuario == producto.CodigoUsuario
            && u.Estado == "Activo");

            if(usuario == null) throw new Exception("El usuario no existe");

            var categoria = await context1.Categoria
                .FirstOrDefaultAsync(c => c.CodigoCategoria == producto.CodigoCategoria
                && c.Estado == "Activo");
            
            if(categoria == null) throw new Exception("La categoria no existe");    

            product.CodigoProducto = producto.CodigoProducto;
            product.IdUsuario = usuario.IdUsuario;
            product.IdCategoria = categoria.IdCategoria;
            product.Nombre = producto.Nombre;
            product.Descripcion = producto.Descripcion;
            product.Marca = producto.Marca;
            product.Fecha = producto.Fecha;
            product.EstadoProducto  = producto.EstadoProducto;

            await context1.SaveChangesAsync();

            await context1.Entry(product)
            .Reference(p => p.Usuario)
            .LoadAsync();

            await context1.Entry(product)
            .Reference(p => p.Categoria)
            .LoadAsync();
            return product.toProductoDTO();
        }            


            public async Task<ProductoDTO>DeleteProducto(string codigo)
            {
                var product = await context1.Producto
                    .Include(u => u.Usuario)
                    .Include(c => c.Categoria)
                    .FirstOrDefaultAsync(p =>
                    p.CodigoProducto == codigo &&
                    p.Estado == "Activo");
                    
                    if(product == null) throw new Exception("Este producto ya existe");

                    product.Estado = "Inactivo";
                    context1.Producto.Update(product);
                    await context1.SaveChangesAsync();
                    return product.toProductoDTO();

            }


        }





    }
