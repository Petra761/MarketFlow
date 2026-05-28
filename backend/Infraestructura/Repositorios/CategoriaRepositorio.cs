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

namespace backend.Infraestructura.Repositorios
{
    public class CategoriaRepositorio : ICategoriaRepositorio
    {
        private readonly MarketflowContext context1;
         public CategoriaRepositorio(MarketflowContext context)
        {
            this.context1 = context;
        } 
        public async Task<List<CategoriaDTO>>GetCategorias()
        {
            var categoria = await context1.Categoria
             .Where(c =>c.Estado == "Activo")
             .ToListAsync();

             return categoria.Select(p => p.toCategoriaDTO()).ToList();
        }

        public async Task<CategoriaDTO>GetCategoria(string codigo)
        {
            var categoria = await context1.Categoria
                .FirstOrDefaultAsync(c => c.CodigoCategoria == codigo 
                && c.Estado == "Activo");

                if(categoria == null) throw new Exception("El producto no existe");
                return categoria.toCategoriaDTO();
        }


        public async Task<CategoriaDTO> PostCategoria([FromBody] CategoriaDTO categoria)
        {
            var comprobante = await context1.Categoria
                .AnyAsync(c => c.CodigoCategoria == categoria.CodigoCategoria
                && c.Estado == "Activo");
                if(comprobante) throw new Exception("La categoria ya existe");

        
            var cat = new Categoria
            {
                CodigoCategoria = categoria.CodigoCategoria,
                Nombre =  categoria.Nombre
                
            };
            context1.Categoria.Add(cat);
            await context1.SaveChangesAsync();
            
            return cat.toCategoriaDTO();

        }


        public async Task<CategoriaDTO>PutCategoria(string codigo, [FromBody] CategoriaDTO categoria)
        {
            var cat = await context1.Categoria
                .FirstOrDefaultAsync(c =>
                c.CodigoCategoria == codigo &&
                c.Estado == "Activo" );
            
            if(cat == null) throw new Exception("La categoria no existe");
    

            cat.CodigoCategoria = categoria.CodigoCategoria;
            cat.Nombre = categoria.Nombre;

            context1.Categoria.Update(cat);
            await context1.SaveChangesAsync();
            
            return cat.toCategoriaDTO();
        }            


            public async Task<CategoriaDTO>DeleteCategoria(string codigo)
            {
                var cat = await context1.Categoria
                    .FirstOrDefaultAsync(p =>
                    p.CodigoCategoria == codigo &&
                    p.Estado == "Activo");
                    
                    if(cat == null) throw new Exception("Este producto ya existe");

                    cat.Estado = "Inactivo";
                    context1.Categoria.Update(cat);
                    await context1.SaveChangesAsync();
                    return cat.toCategoriaDTO();

            }

    }
}