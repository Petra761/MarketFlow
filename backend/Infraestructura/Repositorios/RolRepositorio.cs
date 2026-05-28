using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Marketflow.Dominio.Entidades;
using backend.Dominio.Interfaces;
using Marketflow.Infraestructura.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Infraestructura.Repositorios
{
    public class RolRepositorio : IRolRepositorio
    {
        private readonly MarketflowContext _context;

        public RolRepositorio(MarketflowContext context)
        {
            _context = context;
        }

        // GET TODOS
        public async Task<List<Rol>> ListarRoles()
        {
            return await _context.Rol
                .Where(r => r.Estado == "Activo")
                .ToListAsync();
        }

        // GET POR CODIGO
        public async Task<Rol?> ObtenerRolesCodigo(string codigo)
        {
            return await _context.Rol
                .FirstOrDefaultAsync(r => r.CodigoRol == codigo);
        }

        // POST
        public async Task<Rol> CrearRol(Rol rol)
        {
            _context.Rol.Add(rol);

            await _context.SaveChangesAsync();

            return rol;
        }

        // PUT
        public async Task<bool> ActualizarRol(string codigo, Rol rol)
        {
            var rolExistente = await _context.Rol
                .FirstOrDefaultAsync(r => r.CodigoRol == codigo);

            if (rolExistente == null)
                return false;

            rolExistente.Nombre = rol.Nombre;
            rolExistente.Estado = rol.Estado;
            rolExistente.CodigoRol = rol.CodigoRol;

            _context.Rol.Update(rolExistente);

            await _context.SaveChangesAsync();

            return true;
        }

        // DELETE LOGICO
        public async Task<bool> EliminarRol(string codigo)
        {
            var rolExistente = await _context.Rol
                .FirstOrDefaultAsync(r => r.CodigoRol == codigo);

            if (rolExistente == null)
                return false;

            rolExistente.Estado = "Inactivo";

            _context.Rol.Update(rolExistente);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}

