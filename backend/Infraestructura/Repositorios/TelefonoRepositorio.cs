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
    public class TelefonoRepositorio : ITelefonoRepositorio
    {
        private readonly MarketflowContext _context;
        public TelefonoRepositorio(MarketflowContext context)
        {
            this._context = context;
        }

        public async Task<List<TelefonoDTO>> GetTelefono()
        {
            var telefonos = await(from t in _context.Telefono 
                        where t.Estado == "Activo" 
                        select t.toTelefonoDTO()).ToListAsync();
            return telefonos;
        }

        public async Task<TelefonoDTO?> GetTelefonoByCodigo(string CodigoTelefono)
        {
            return await(from t in _context.Telefono
                        where t.CodigoTelefono == CodigoTelefono && t.Estado == "Activo" 
                        select t.toTelefonoDTO()).FirstOrDefaultAsync();
        }

        public async Task<TelefonoDTO> PostTelefono([FromBody] TelefonoDTO dto)
        {
            if(await _context.Telefono.AnyAsync(t => t.CodigoTelefono == dto.CodigoTelefono && t.Estado == "Activo"))
            {
                throw new Exception("El teléfono ya existe");
            }
            var telefono = new Telefono
            {
                CodigoTelefono = dto.CodigoTelefono,
                Numero = dto.Numero,
                Estado = "Activo"
            };
            _context.Telefono.Add(telefono);
            await _context.SaveChangesAsync();
            return telefono.toTelefonoDTO();
        }

        public async Task<TelefonoDTO> PutTelefono(string CodigoTelefono, [FromBody] TelefonoDTO dto)
        {
            var telefono = await _context.Telefono.FirstOrDefaultAsync(t => t.CodigoTelefono == CodigoTelefono && t.Estado == "Activo");
            if(telefono == null)
            {
                throw new Exception("El teléfono no existe");
            }
            telefono.Numero = dto.Numero;
            await _context.SaveChangesAsync();
            return telefono.toTelefonoDTO();
        }

        public async Task<TelefonoDTO> DeleteTelefono(string CodigoTelefono)
        {
            var telefono = await _context.Telefono.FirstOrDefaultAsync(t => t.CodigoTelefono == CodigoTelefono && t.Estado == "Activo");
            if(telefono == null)
            {
                throw new Exception("El teléfono no existe");
            }
            telefono.Estado = "Inactivo";
            await _context.SaveChangesAsync();
            return telefono.toTelefonoDTO();
        }
    }
}
