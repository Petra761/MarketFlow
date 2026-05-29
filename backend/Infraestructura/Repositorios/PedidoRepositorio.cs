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
        public async Task ConfirmarPedido(string codigoPedido)
        {
            var pedido = await _context.Pedido
                .FirstOrDefaultAsync(p => p.CodigoPedido == codigoPedido && p.Estado == "Activo");

            if (pedido == null)
                throw new Exception("El pedido no existe");

            if (pedido.EstadoPedido != "Pendiente")
                throw new Exception("Solo se pueden confirmar pedidos pendientes");

            var tieneDetalles = await _context.Detalle_Pedido
                .AnyAsync(d => d.IdPedido == pedido.IdPedido);

            if (!tieneDetalles)
                throw new Exception("No puedes confirmar un pedido sin productos");
            // =========================
            // STOCK (COMENTADO)
            // =========================
            /*
            foreach (var item in detalles)
            {
                if (!await HayStock(item.IdProducto, item.Cantidad))
                    throw new Exception("Stock insuficiente");

                await ActualizarStock(item.IdProducto, item.Cantidad);
            }
            */
            pedido.EstadoPedido = "Confirmado";

            await _context.SaveChangesAsync();
        }
        public async Task CancelarPedido(string codigoPedido)
        {
            var pedido = await _context.Pedido
                .FirstOrDefaultAsync(p => p.CodigoPedido == codigoPedido && p.Estado == "Activo");

            if (pedido == null)
                throw new Exception("El pedido no existe");

            if (pedido.EstadoPedido == "Pagado")
                throw new Exception("No se puede cancelar un pedido pagado");
            // =========================
            // STOCK (COMENTADO)
            // =========================
            /*
            if (pedido.EstadoPedido == "Confirmado")
            {
                var detalles = await _context.Detalle_Pedido
                    .Where(d => d.IdPedido == pedido.IdPedido)
                    .ToListAsync();

                foreach (var item in detalles)
                {
                    await RevertirStock(item.IdProducto, item.Cantidad);
                }
            }
            */
            pedido.EstadoPedido = "Cancelado";

            await _context.SaveChangesAsync();
        }
        public async Task PagarPedido(string codigoPedido)
        {
            var pedido = await _context.Pedido
                .FirstOrDefaultAsync(p => p.CodigoPedido == codigoPedido && p.Estado == "Activo");

            if (pedido == null)
                throw new Exception("El pedido no existe");

            if (pedido.EstadoPedido != "Confirmado")
                throw new Exception("Solo pedidos confirmados pueden pagarse");

            pedido.EstadoPedido = "Pagado";

            await _context.SaveChangesAsync();
        }
        public async Task<List<PedidoDTO>> GetHistorial(string codigoUsuario)
        {
            var pedidos = await _context.Pedido
                .Include(p => p.Usuario)
                .Include(p => p.MetodoPago)
                .Where(p => p.Usuario.CodigoUsuario == codigoUsuario
                        && p.Estado != "Inactivo")
                .OrderByDescending(p => p.Fecha)
                .ToListAsync();

            return pedidos.Select(p => p.toPedidoDTO()).ToList();
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
        public async Task<PedidoDTO> PostPedido([FromBody] CreatePedidoDTO dto)
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
                Total = 0,
                EstadoPedido = "Pendiente"
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
        public async Task<PedidoDTO> PutPedido(string CodigoPedido, UpdatePedidoDTO dto)
        {
            var pedido = await _context.Pedido
                .Include(p => p.Usuario)
                .Include(p => p.MetodoPago)
                .FirstOrDefaultAsync(p =>
                    p.CodigoPedido == CodigoPedido &&
                    p.Estado == "Activo");

            if (pedido == null)
                throw new Exception("El pedido no existe");

            if (pedido.EstadoPedido != "Pendiente")
                throw new Exception("Solo pedidos pendientes pueden modificarse");
                
            var Usuario = await _context.Usuario
                .FirstOrDefaultAsync(u => u.CodigoUsuario == dto.CodigoUsuario && u.Estado == "Activo");

            if (Usuario == null)
                throw new Exception("El usuario no existe");

            var MetodoPago = await _context.Metodo_Pago
                .FirstOrDefaultAsync(m => m.CodigoMetodoPago == dto.CodigoMetodoPago && m.Estado == "Activo");

            if (MetodoPago == null)
                throw new Exception("El metodo de pago no existe");

            pedido.IdUsuario = Usuario.IdUsuario;
            pedido.IdMetodoPago = MetodoPago.IdMetodoPago;
            pedido.Fecha = dto.Fecha;
            pedido.EstadoPedido = dto.EstadoPedido;

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