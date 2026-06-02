using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using Marketflow.Dominio.Entidades;
using Microsoft.AspNetCore.Mvc;

namespace backend.Dominio.Interfaces
{
    public interface ICategoriaRepositorio
    {
        Task<List<CategoriaDTO>> GetCategorias();
        Task<CategoriaDTO> GetCategoria(string codigo);
        Task<CategoriaDTO> PostCategoria([FromBody] mCategoriaDTO categoria);
        Task<CategoriaDTO> DeleteCategoria(string codigo);
        Task<CategoriaDTO> PutCategoria(string codigo,[FromBody] CategoriaDTO dto);
        Task<List<CategoriaAdminDTO>> GetCategoriasAdmin();
    }
}