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
    public class PedidoRepositorio : IPedidoRepositorio
    {
        private readonly MarketflowContext _context;
        public PedidoRepositorio(MarketflowContext context)
        {
            this._context = context;
        }
        public async Task<List<PedidoDTO>> GetPedido()
        {
            var almacen = await _context.Pedido
                .Include(p => p.Usuario)
                .Include(p => p.MetodoPago)
                .Where(p => p.Estado == "Activo")
                .ToListAsync();

            return almacen.Select(p => p.toPedidoDTO()).ToList();
        }
        public async Task<PedidoDTO> GetPedidoByCodigo(string CodigoPedido)
        {
            var pedido = await _context.Pedido
                .Include(p => p.Usuario)
                .Include(p => p.MetodoPago)
                .FirstOrDefaultAsync(p =>
                    p.CodigoPedido == CodigoPedido &&
                    p.Estado == "Activo");

            if (pedido == null)
            {
                throw new Exception("El pedido no existe");
            }

            return pedido.toPedidoDTO();
        }
        public async Task<PedidoDTO> PostPedido([FromBody] PedidoDTO dto)
        {
            if(await _context.Pedido.AnyAsync(p => p.CodigoPedido == dto.CodigoPedido && p.Estado == "Activo"))
            {
                throw new Exception("El pedido ya existe");
            }
            var Usuario = await _context.Usuario.FirstOrDefaultAsync(u => u.CodigoUsuario == dto.CodigoUsuario && u.Estado == "Activo");
             if(Usuario == null)            {
                throw new Exception("El usuario no existe");
            }
            var MetodoPago = await _context.Metodo_Pago.FirstOrDefaultAsync(m => m.CodigoMetodoPago == dto.CodigoMetodoPago && m.Estado == "Activo");
            if(MetodoPago == null)            
            {
                throw new Exception("El metodo de pago no existe");
            }
            var pedido = new Pedido
            {
                IdUsuario = Usuario.IdUsuario,
                IdMetodoPago = MetodoPago.IdMetodoPago,
                CodigoPedido = dto.CodigoPedido,
                Fecha = dto.Fecha,
                Total = dto.Total,
                EstadoPedido = dto.EstadoPedido
            };
            _context.Pedido.Add(pedido);
            await _context.SaveChangesAsync();

            await _context.Entry(pedido)
                .Reference(p => p.Usuario)
                .LoadAsync();

            await _context.Entry(pedido)
                .Reference(p => p.MetodoPago)
                .LoadAsync();

            return pedido.toPedidoDTO();
        }
        public async Task<PedidoDTO> PutPedido(string CodigoPedido, [FromBody] PedidoDTO dto)
        {
            var pedido = await _context.Pedido
                    .Include(p => p.Usuario)
                    .Include(p => p.MetodoPago)
                    .FirstOrDefaultAsync(p =>
                        p.CodigoPedido == CodigoPedido &&
                        p.Estado == "Activo");
            if(pedido == null)
            {
                throw new Exception("El pedido no existe");
            }
            var Usuario = await _context.Usuario.FirstOrDefaultAsync(u => u.CodigoUsuario == dto.CodigoUsuario && u.Estado == "Activo");
            if(Usuario == null)            {
                throw new Exception("El usuario no existe");
            }
            var MetodoPago = await _context.Metodo_Pago.FirstOrDefaultAsync(m => m.CodigoMetodoPago == dto.CodigoMetodoPago && m.Estado == "Activo");
            if(MetodoPago == null)            {
                throw new Exception("El metodo de pago no existe");
            }
            pedido.IdUsuario = Usuario.IdUsuario;
            pedido.IdMetodoPago = MetodoPago.IdMetodoPago;
            pedido.Fecha = dto.Fecha;
            pedido.Total = dto.Total;
            pedido.EstadoPedido = dto.EstadoPedido;

            _context.Pedido.Update(pedido);
            await _context.SaveChangesAsync();
            await _context.Entry(pedido)
            .Reference(p => p.Usuario)
            .LoadAsync();

            await _context.Entry(pedido)
            .Reference(p => p.MetodoPago)
            .LoadAsync();

            return pedido.toPedidoDTO();
        }
         public async Task<PedidoDTO> DeletePedido(string CodigoPedido)
        {
            var pedido = await _context.Pedido
                        .Include(p => p.Usuario)
                        .Include(p => p.MetodoPago)
                        .FirstOrDefaultAsync(p =>
                            p.CodigoPedido == CodigoPedido &&
                            p.Estado == "Activo");
            if(pedido == null)
            {
                throw new Exception("El pedido no existe");
            }
            pedido.Estado = "Inactivo";
            _context.Pedido.Update(pedido);
            await _context.SaveChangesAsync();
            return pedido.toPedidoDTO();
        }
    }
}