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
    public class Metodo_PagoRepositorio : IMetodo_PagoRepositorio
    {
        private readonly MarketflowContext _context;
        public Metodo_PagoRepositorio(MarketflowContext context)
        {
            this._context = context;
        }
        public async Task<List<Metodo_PagoDTO>> GetMetodo_Pago()
        {
            var metodo_Pago = await(from m in _context.Metodo_Pago 
                        where m.Estado == "Activo" 
                        select m.toMetodo_PagoDTO()).ToListAsync();
            return metodo_Pago;
        }
        public async Task<Metodo_PagoDTO> GetMetodo_PagoByCodigo(string CodigoMetodoPago)
        {
            return await(from m in _context.Metodo_Pago
                        where m.CodigoMetodoPago == CodigoMetodoPago && m.Estado == "Activo" 
                        select m.toMetodo_PagoDTO()).FirstOrDefaultAsync();
        }
        public async Task<Metodo_PagoDTO> PostMetodo_Pago([FromBody] Metodo_PagoDTO dto)
        {
            if(await _context.Metodo_Pago.AnyAsync(m => m.CodigoMetodoPago == dto.CodigoMetodoPago && m.Estado == "Activo"))
            {
                throw new Exception("El metodo de pago ya existe");
            }
            var metodo_Pago = new Metodo_Pago
            {
                CodigoMetodoPago = dto.CodigoMetodoPago,
                Nombre = dto.Nombre,
                Estado = "Activo"
            };
            _context.Metodo_Pago.Add(metodo_Pago);
            await _context.SaveChangesAsync();
            return metodo_Pago.toMetodo_PagoDTO();
        }
        public async Task<Metodo_PagoDTO> PutMetodo_Pago(string CodigoMetodoPago, [FromBody] Metodo_PagoDTO dto)
        {
            var metodo_Pago = await _context.Metodo_Pago.FirstOrDefaultAsync(m => m.CodigoMetodoPago == CodigoMetodoPago && m.Estado == "Activo");
            if(metodo_Pago == null)
            {
                throw new Exception("El metodo de pago no existe");
            }
            metodo_Pago.Nombre = dto.Nombre;
            await _context.SaveChangesAsync();
            return metodo_Pago.toMetodo_PagoDTO();
        }
        public async Task<Metodo_PagoDTO> DeleteMetodo_Pago(string CodigoMetodoPago)
        {
            var metodo_Pago = await _context.Metodo_Pago.FirstOrDefaultAsync(m => m.CodigoMetodoPago == CodigoMetodoPago && m.Estado == "Activo");
            if(metodo_Pago == null)
            {
                throw new Exception("El metodo de pago no existe");
            }
            metodo_Pago.Estado = "Inactivo";
            await _context.SaveChangesAsync();
            return metodo_Pago.toMetodo_PagoDTO();
        }
    }
}