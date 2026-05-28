using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using Marketflow.Dominio.Entidades;

namespace backend.Dominio.Mapeadores
{
    public static class CategoriaMapeador
    {
        public static CategoriaDTO toCategoriaDTO(this Categoria categoria)
        {
            return new CategoriaDTO()
            {
                CodigoCategoria = categoria.CodigoCategoria,
                Nombre = categoria.Nombre
            };

        }
    }
}