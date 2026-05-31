using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using backend.Dominio.Interfaces;
using backend.Dominio.Mapeadores;
using Marketflow.Dominio.Entidades;
using Marketflow.Infraestructura.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Dominio.Helpers;

namespace backend.Infraestructura.Repositorios
{
    public class CategoriaRepositorio : ICategoriaRepositorio
    {
        private readonly MarketflowContext context1;
        public CategoriaRepositorio(MarketflowContext context)
        {
            this.context1 = context;
        }

        public async Task<List<CategoriaDTO>> GetCategorias()
        {
            var categorias = await context1.Categoria
                .Where(c => c.Estado == "Activo")
                .ToListAsync();
            return categorias.Select(c => c.toCategoriaDTO()).ToList();
        }

        public async Task<CategoriaDTO> GetCategoria(string codigo)
        {
            var categoria = await context1.Categoria
                .FirstOrDefaultAsync(c => c.CodigoCategoria == codigo && c.Estado == "Activo");

            if (categoria == null) throw new Exception("La categoría no existe.");
            return categoria.toCategoriaDTO();
        }

        public async Task<CategoriaDTO> PostCategoria([FromBody] mCategoriaDTO categoria)
        {
            if (string.IsNullOrEmpty(categoria.Nombre))
                throw new Exception("El nombre de la categoría es obligatorio.");

            string codigoGenerado = CodeGenerator.Generate("CAT");

            bool existe = await context1.Categoria
                .AnyAsync(c => c.Nombre == categoria.Nombre && c.Estado == "Activo");
            if (existe) throw new Exception("Ya existe una categoría con ese nombre.");
            var codigo = CodeGenerator.Generate("CAT");

            var cat = new Categoria
            {
                CodigoCategoria = codigo,
                Nombre = categoria.Nombre
            };
            context1.Categoria.Add(cat);
            await context1.SaveChangesAsync();

            return cat.toCategoriaDTO();
        }

        public async Task<CategoriaDTO> PutCategoria(string codigo, [FromBody] CategoriaDTO categoria)
        {
            if (string.IsNullOrEmpty(categoria.Nombre))
                throw new Exception("El nombre de la categoría es obligatorio.");

            var cat = await context1.Categoria
                .FirstOrDefaultAsync(c => c.CodigoCategoria == codigo && c.Estado == "Activo");
            if (cat == null) throw new Exception("La categoría no existe.");

            cat.Nombre = categoria.Nombre;
            context1.Categoria.Update(cat);
            await context1.SaveChangesAsync();

            return cat.toCategoriaDTO();
        }

        public async Task<CategoriaDTO> DeleteCategoria(string codigo)
        {
            var cat = await context1.Categoria
                .FirstOrDefaultAsync(c => c.CodigoCategoria == codigo && c.Estado == "Activo");
            if (cat == null) throw new Exception("La categoría no existe.");

            bool tieneProductos = await context1.Producto
                .AnyAsync(p => p.IdCategoria == cat.IdCategoria && p.Estado == "Activo");
            if (tieneProductos)
                throw new Exception("No puedes eliminar esta categoría porque tiene productos activos asociados.");

            cat.Estado = "Inactivo";
            context1.Categoria.Update(cat);
            await context1.SaveChangesAsync();
            return cat.toCategoriaDTO();
        }

        public async Task<List<CategoriaAdminDTO>> GetCategoriasAdmin()
        {
            return await context1.Categoria
                .Where(c => c.Estado == "Activo")
                .Select(c => new CategoriaAdminDTO
                {
                    CodigoCategoria = c.CodigoCategoria,
                    Nombre = c.Nombre,
                    CantidadProductos = context1.Producto
                        .Count(p => p.IdCategoria == c.IdCategoria)
                })
                .ToListAsync();
        }


    }
}
