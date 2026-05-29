using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using backend.Dominio.Interfaces;
using backend.Dominio.Mapeadores;
using Microsoft.EntityFrameworkCore;
using Marketflow.Infraestructura.Data;
using Marketflow.Dominio.Entidades;
using Microsoft.AspNetCore.Mvc;

namespace backend.Infraestructura.Repositorios
{
    public class Detalle_PedidoRepositorio : IDetalle_PedidoRepositorio
    {
        public readonly MarketflowContext _context;
        public Detalle_PedidoRepositorio(MarketflowContext context)
        {
            this._context = context;
        }
        private async Task ActualizarTotalPedido(int idPedido)
        {
            var pedido = await _context.Pedido
                .FirstOrDefaultAsync(p => p.IdPedido == idPedido);

            if(pedido == null)
            {
                throw new Exception("El pedido no existe");
            }

            pedido.Total = await _context.Detalle_Pedido
                            .Where(d => d.IdPedido == idPedido)
                            .SumAsync(d => (decimal?)d.Subtotal) ?? 0;

            await _context.SaveChangesAsync();
        }
        public async Task<List<Detalle_PedidoDTO>> GetDetalle_Pedido()
        {
            var detalle_pedido = await _context.Detalle_Pedido
                                .Include(d => d.Pedido)
                                .Include(d => d.Producto)
                                .Where(d => d.Pedido.Estado == "Activo" && d.Producto.Estado == "Activo")
                                .ToListAsync();
            return detalle_pedido.Select(d => d.toDetalle_PedidoDTO()).ToList();
        }
        public async Task<Detalle_PedidoDTO> GetDetalle_PedidoByCodigo(string CodigoPedido, string CodigoProducto)
        {
            var detalle_pedido = await _context.Detalle_Pedido
                                .Include(d => d.Pedido)
                                .Include(d => d.Producto)
                                .Where(d => d.Pedido.Estado == "Activo" && d.Producto.Estado == "Activo")
                                .FirstOrDefaultAsync(d => d.Pedido.CodigoPedido == CodigoPedido && d.Producto.CodigoProducto == CodigoProducto);
            if(detalle_pedido == null)
            {
                throw new Exception("El detalle del pedido no existe");
            }
            return detalle_pedido.toDetalle_PedidoDTO();
        }
        public async Task<Detalle_PedidoDTO> PostDetalle_Pedido([FromBody] Detalle_PedidoDTO dto)
        {
            var Pedido = await _context.Pedido.FirstOrDefaultAsync(p => p.CodigoPedido == dto.CodigoPedido && p.Estado == "Activo");
            if(Pedido == null)
            {
                throw new Exception("El pedido no existe");
            }
            var Producto = await _context.Producto.FirstOrDefaultAsync(p => p.CodigoProducto == dto.CodigoProducto && p.Estado == "Activo");
            if(Producto == null)
            {
                throw new Exception("El producto no existe");
            }
            var existe = await _context.Detalle_Pedido.AnyAsync(d =>
                        d.IdPedido == Pedido.IdPedido &&
                        d.IdProducto == Producto.IdProducto);
            if (existe)
            {
                throw new Exception("El detalle del pedido ya existe");
            }

            // Logica para calcular el subtotal del detalle del pedido
            var hoy = DateOnly.FromDateTime(DateTime.Today);

            var precio = await _context.Precio
                    .Where(pr => pr.IdProducto == Producto.IdProducto &&
                                pr.FechaInicio <= hoy && (pr.FechaFin == null || pr.FechaFin >= hoy) &&
                                pr.Estado == "Activo").FirstOrDefaultAsync();
            if(precio == null)
            {
                throw new Exception("No hay un precio activo para el producto");
            }
            var subtotal = precio.Monto * dto.Cantidad;

            // ANTES de guardar cantidad nueva
            // var hayStock = await HayStock(dto.CodigoProducto, dto.Cantidad);
            // if (!hayStock) throw new Exception("Sin stock");
            if (dto.Cantidad <= 0)
                throw new Exception("La cantidad debe ser mayor a 0");
            var detalle_pedido = new Detalle_Pedido
            {
                IdPedido = Pedido.IdPedido,
                IdProducto = Producto.IdProducto,
                Cantidad = dto.Cantidad,
                Subtotal = subtotal
            };
            _context.Detalle_Pedido.Add(detalle_pedido);

            await _context.Entry(detalle_pedido)
                .Reference(d => d.Pedido)
                .LoadAsync();

            await _context.Entry(detalle_pedido)
                .Reference(d => d.Producto)
                .LoadAsync();
            
            await _context.SaveChangesAsync();
            await ActualizarTotalPedido(Pedido.IdPedido);

            return detalle_pedido.toDetalle_PedidoDTO();
        }
        public async Task<Detalle_PedidoDTO> PutDetalle_Pedido(string CodigoPedido,string CodigoProducto, Detalle_PedidoDTO dto)
        {
            var detalle_pedido = await _context.Detalle_Pedido
                .Include(d => d.Pedido)
                .Include(d => d.Producto)
                .FirstOrDefaultAsync(d =>
                    d.Pedido.CodigoPedido == CodigoPedido &&
                    d.Producto.CodigoProducto == CodigoProducto &&
                    d.Pedido.Estado == "Activo" &&
                    d.Producto.Estado == "Activo");

            if (detalle_pedido == null)
                throw new Exception("El detalle del pedido no existe");
            
            if (detalle_pedido.Pedido.EstadoPedido != "Pendiente")
                throw new Exception("Solo pedidos pendientes pueden modificarse");

            // Logica para calcular el subtotal del detalle del pedido
            var hoy = DateOnly.FromDateTime(DateTime.Today);

            var precio = await _context.Precio
                .Where(pr =>
                    pr.IdProducto == detalle_pedido.IdProducto &&
                    pr.FechaInicio <= hoy &&
                    (pr.FechaFin == null || pr.FechaFin >= hoy) &&
                    pr.Estado == "Activo")
                .FirstOrDefaultAsync();

            if (precio == null)
                throw new Exception("No hay un precio activo para el producto");
            if (dto.Cantidad <= 0)
                throw new Exception("La cantidad debe ser mayor a 0");
            var subtotal = precio.Monto * dto.Cantidad;
            // ANTES de guardar cantidad nueva
            // var hayStock = await HayStock(dto.CodigoProducto, dto.Cantidad);
            // if (!hayStock) throw new Exception("Sin stock");

            detalle_pedido.Cantidad = dto.Cantidad;
            detalle_pedido.Subtotal = subtotal;
            
            await _context.SaveChangesAsync();

            await ActualizarTotalPedido(detalle_pedido.IdPedido);

            await _context.Entry(detalle_pedido)
                .Reference(d => d.Pedido)
                .LoadAsync();

            await _context.Entry(detalle_pedido)
                .Reference(d => d.Producto)
                .LoadAsync();

            return detalle_pedido.toDetalle_PedidoDTO();
        }
         public async Task<Detalle_PedidoDTO> DeleteDetalle_Pedido(string CodigoPedido, string CodigoProducto)
        {
            var detalle_pedido = await _context.Detalle_Pedido
                                .Include(d => d.Pedido)
                                .Include(d => d.Producto)
                                .FirstOrDefaultAsync(d =>
                                    d.Pedido.CodigoPedido == CodigoPedido &&
                                    d.Producto.CodigoProducto == CodigoProducto &&
                                    d.Pedido.Estado == "Activo" &&
                                    d.Producto.Estado == "Activo");
            if(detalle_pedido == null)
            {
                throw new Exception("El detalle del pedido no existe");
            }
            _context.Detalle_Pedido.Remove(detalle_pedido);
            await _context.SaveChangesAsync();
            await ActualizarTotalPedido(detalle_pedido.IdPedido);
            
            return detalle_pedido.toDetalle_PedidoDTO();
        }
    }
}