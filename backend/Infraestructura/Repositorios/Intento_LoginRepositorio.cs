using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using backend.Dominio.Interfaces;
using backend.Dominio.Mapeadores;
using Marketflow.Infraestructura.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Marketflow.Dominio.Entidades;

namespace backend.Infraestructura.Repositorios
{
    public class Intento_LoginRepositorio : IIntento_LoginRepositorio
    {
        private readonly MarketflowContext _context;
        public Intento_LoginRepositorio(MarketflowContext context)
        {
            this._context = context;
        }

        public async Task<List<Intento_LoginDTO>> GetIntento_Login()
        {
            var intentos = await(from i in _context.Intento_Login 
                        where i.Estado == "Activo" 
                        select i.toIntento_LoginDTO()).ToListAsync();
            return intentos;
        }

        public async Task<Intento_LoginDTO?> GetIntento_LoginById(int Id)
        {
            return await(from i in _context.Intento_Login
                        where i.IdIntentoLogin == Id && i.Estado == "Activo" 
                        select i.toIntento_LoginDTO()).FirstOrDefaultAsync();
        }

        public async Task<Intento_LoginDTO> PostIntento_Login([FromBody] Intento_LoginDTO dto)
        {
            var intento = new Intento_Login
            {
                IdUsuario = dto.IdUsuario,
                FechaIntento = dto.FechaIntento,
                Estado = "Activo"
            };
            _context.Intento_Login.Add(intento);
            await _context.SaveChangesAsync();
            return intento.toIntento_LoginDTO();
        }

        public async Task<Intento_LoginDTO> DeleteIntento_Login(int Id)
        {
            var intento = await _context.Intento_Login.FirstOrDefaultAsync(i => i.IdIntentoLogin == Id && i.Estado == "Activo");
            if(intento == null)
            {
                throw new Exception("El intento no existe");
            }
            intento.Estado = "Inactivo";
            await _context.SaveChangesAsync();
            return intento.toIntento_LoginDTO();
        }
    }
}
