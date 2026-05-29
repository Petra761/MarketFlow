using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Intrinsics.Arm;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using backend.Dominio.Interfaces;
using backend.Dominio.Mapeadores;
using Marketflow.Dominio.Entidades;
using Marketflow.Infraestructura.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            var almacen = await _context
                .Pedido.Include(p => p.Usuario)
                .Include(p => p.MetodoPago)
                .Where(p => p.Estado == "Activo")
                .ToListAsync();

            return almacen.Select(p => p.toPedidoDTO()).ToList();
        }

        public async Task<PedidoDTO> GetPedidoByCodigo(string CodigoPedido)
        {
            var pedido = await _context
                .Pedido.Include(p => p.Usuario)
                .Include(p => p.MetodoPago)
                .FirstOrDefaultAsync(p => p.CodigoPedido == CodigoPedido && p.Estado == "Activo");

            if (pedido == null)
            {
                throw new Exception("El pedido no existe");
            }

            return pedido.toPedidoDTO();
        }

        public async Task<PedidoDTO> PostPedido([FromBody] PedidoDTO dto)
        {
            if (
                await _context.Pedido.AnyAsync(p =>
                    p.CodigoPedido == dto.CodigoPedido && p.Estado == "Activo"
                )
            )
            {
                throw new Exception("El pedido ya existe");
            }
            // var Usuario = await _context.Usuario.FirstOrDefaultAsync(u => u.CodigoUsuario == dto.CodigoUsuario && u.Estado == "Activo");
            // if(Usuario == null)            {
            //     throw new Exception("El usuario no existe");
            // }
            var MetodoPago = await _context.Metodo_Pago.FirstOrDefaultAsync(m =>
                m.CodigoMetodoPago == dto.CodigoMetodoPago && m.Estado == "Activo"
            );
            if (MetodoPago == null)
            {
                throw new Exception("El metodo de pago no existe");
            }
            var pedido = new Pedido
            {
                IdUsuario = 2,
                IdMetodoPago = MetodoPago.IdMetodoPago,
                CodigoPedido = dto.CodigoPedido,
                Fecha = dto.Fecha,
                Total = dto.Total,
                EstadoPedido = dto.EstadoPedido,
            };
            _context.Pedido.Add(pedido);
            await _context.SaveChangesAsync();

            return pedido.toPedidoDTO();
        }

        public async Task<PedidoDTO> PutPedido(string CodigoPedido, [FromBody] PedidoDTO dto)
        {
            var pedido = await _context.Pedido.FirstOrDefaultAsync(p =>
                p.CodigoPedido == CodigoPedido && p.Estado == "Activo"
            );
            if (pedido == null)
            {
                throw new Exception("El pedido no existe");
            }
            // var Usuario = await _context.Usuario.FirstOrDefaultAsync(u => u.CodigoUsuario == dto.CodigoUsuario && u.Estado == "Activo");
            // if(Usuario == null)            {
            //     throw new Exception("El usuario no existe");
            // }
            var MetodoPago = await _context.Metodo_Pago.FirstOrDefaultAsync(m =>
                m.CodigoMetodoPago == dto.CodigoMetodoPago && m.Estado == "Activo"
            );
            if (MetodoPago == null)
            {
                throw new Exception("El metodo de pago no existe");
            }
            pedido.IdUsuario = 2;
            pedido.IdMetodoPago = MetodoPago.IdMetodoPago;
            pedido.Fecha = dto.Fecha;
            pedido.Total = dto.Total;
            pedido.EstadoPedido = dto.EstadoPedido;

            _context.Pedido.Update(pedido);
            await _context.SaveChangesAsync();
            await _context.Entry(pedido).Reference(p => p.Usuario).LoadAsync();

            await _context.Entry(pedido).Reference(p => p.MetodoPago).LoadAsync();

            return pedido.toPedidoDTO();
        }

        public async Task<PedidoDTO> DeletePedido(string CodigoPedido)
        {
            var pedido = await _context.Pedido.FirstOrDefaultAsync(p =>
                p.CodigoPedido == CodigoPedido && p.Estado == "Activo"
            );
            if (pedido == null)
            {
                throw new Exception("El pedido no existe");
            }
            pedido.Estado = "Inactivo";
            _context.Pedido.Update(pedido);
            await _context.SaveChangesAsync();
            return pedido.toPedidoDTO();
        }

        public async Task<List<PedidoRecibidoDTO>> ObtenerPedidosPorVendedor(string codigoVendedor)
        {
            var vendedor = await (
                from u in _context.Usuario
                where u.CodigoUsuario == codigoVendedor
                select u
            ).FirstOrDefaultAsync();
            if (vendedor is null)
                return new List<PedidoRecibidoDTO>();

            var ventas = await (
                from dp in _context.Detalle_Pedido
                join p in _context.Pedido on dp.IdPedido equals p.IdPedido
                join u in _context.Usuario on p.IdUsuario equals u.IdUsuario
                join pr in _context.Producto on dp.IdProducto equals pr.IdProducto
                where pr.IdUsuario == vendedor.IdUsuario
                select new
                {
                    CodigoPedido = p.CodigoPedido,
                    CompradorNombre = u.Nombre + " " + u.Apellido,
                    FechaPedido = p.Fecha,
                    Estado = p.EstadoPedido,
                    ProductoNombre = pr.Nombre,
                    Cantidad = dp.Cantidad,
                    Subtotal = dp.Subtotal,
                    PedidoIdInterno = p.IdPedido,
                }
            ).ToListAsync();

            var resultado = (
                from q in ventas
                group q by new
                {
                    q.CodigoPedido,
                    q.CompradorNombre,
                    q.FechaPedido,
                    q.Estado,
                } into grupo
                select new PedidoRecibidoDTO
                {
                    CodigoPedido = grupo.Key.CodigoPedido,
                    Comprador = grupo.Key.CompradorNombre,
                    Fecha = grupo.Key.FechaPedido,
                    EstadoPedido = grupo.Key.Estado,
                    Total = grupo.Sum(x => x.Subtotal),
                    Productos = grupo
                        .Select(x => new DetallePedidoRecibidoDTO
                        {
                            NombreProducto = x.ProductoNombre,
                            Cantidad = x.Cantidad,
                            Subtotal = x.Subtotal,
                        })
                        .ToList(),
                }
            )
                .OrderByDescending(p => p.Fecha)
                .ToList();

            return resultado;
        }
    }
}
