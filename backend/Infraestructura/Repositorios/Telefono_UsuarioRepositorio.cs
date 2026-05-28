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
    public class Telefono_UsuarioRepositorio : ITelefono_UsuarioRepositorio
    {
        private readonly MarketflowContext _context;
        public Telefono_UsuarioRepositorio(MarketflowContext context)
        {
            this._context = context;
        }

        public async Task<List<Telefono_UsuarioDTO>> GetTelefono_Usuario()
        {
            var tus = await(from tu in _context.Telefono_Usuario 
                        select tu.toTelefono_UsuarioDTO()).ToListAsync();
            return tus;
        }

        public async Task<Telefono_UsuarioDTO?> GetTelefono_UsuarioById(int Id)
        {
            return await(from tu in _context.Telefono_Usuario
                        where tu.IdTelefonoUsuario == Id
                        select tu.toTelefono_UsuarioDTO()).FirstOrDefaultAsync();
        }

        public async Task<Telefono_UsuarioDTO> PostTelefono_Usuario([FromBody] Telefono_UsuarioDTO dto)
        {
            var tu = new Telefono_Usuario
            {
                IdTelefono = dto.IdTelefono,
                IdUsuario = dto.IdUsuario,
                FechaInicio = dto.FechaInicio,
                FechaFin = dto.FechaFin
            };
            _context.Telefono_Usuario.Add(tu);
            await _context.SaveChangesAsync();
            return tu.toTelefono_UsuarioDTO();
        }

        public async Task<Telefono_UsuarioDTO> PutTelefono_Usuario(int Id, [FromBody] Telefono_UsuarioDTO dto)
        {
            var tu = await _context.Telefono_Usuario.FirstOrDefaultAsync(t => t.IdTelefonoUsuario == Id);
            if(tu == null)
            {
                throw new Exception("El registro no existe");
            }
            tu.FechaFin = dto.FechaFin;
            await _context.SaveChangesAsync();
            return tu.toTelefono_UsuarioDTO();
        }

        public async Task<Telefono_UsuarioDTO> DeleteTelefono_Usuario(int Id)
        {
            var tu = await _context.Telefono_Usuario.FirstOrDefaultAsync(t => t.IdTelefonoUsuario == Id);
            if(tu == null)
            {
                throw new Exception("El registro no existe");
            }
            _context.Telefono_Usuario.Remove(tu);
            await _context.SaveChangesAsync();
            return tu.toTelefono_UsuarioDTO();
        }
    }
}
