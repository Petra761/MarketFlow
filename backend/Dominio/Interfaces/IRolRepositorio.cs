using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Marketflow.Dominio.Entidades;

namespace backend.Dominio.Interfaces
{
    public interface IRolRepositorio
    {
        Task<List<Rol>> ListarRoles();
        Task<Rol?> ObtenerRolesCodigo(string codigo);
        Task<Rol> CrearRol(Rol rol);
        Task<bool> ActualizarRol(string codigo, Rol rol);
        Task<bool> EliminarRol(string codigo);

    }
}