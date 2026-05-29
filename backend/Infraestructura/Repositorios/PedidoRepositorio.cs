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
using Marketflow.Dominio.Interfaces;
using backend.Dominio.Helpers;

namespace backend.Infraestructura.Repositorios
{
    public class PedidoRepositorio : IPedidoRepositorio
    {
        private readonly MarketflowContext _context;
        private readonly IStockRepositorio _stockRepositorio;

        public PedidoRepositorio(MarketflowContext context, IStockRepositorio stockRepositorio)
        {
            this._context = context;
            this._stockRepositorio = stockRepositorio;
        }

        public async Task ConfirmarPedido(string codigoPedido)
        {
            var pedido = await _context.Pedido.FirstOrDefaultAsync(p =>
                p.CodigoPedido == codigoPedido && p.Estado == "Activo"
            );

            if (pedido == null)
                throw new Exception("El pedido no existe");

            if (pedido.EstadoPedido != "Pendiente")
                throw new Exception("Solo se pueden confirmar pedidos pendientes");

            var tieneDetalles = await _context.Detalle_Pedido.AnyAsync(d =>
                d.IdPedido == pedido.IdPedido
            );

            if (!tieneDetalles)
                throw new Exception("No puedes confirmar un pedido sin productos");
                        var detalles = await _context.Detalle_Pedido
                .Include(d => d.Producto)
                .Where(d => d.IdPedido == pedido.IdPedido)
                .ToListAsync();

            foreach (var item in detalles)
            {
                var hayStock = await _stockRepositorio.HayStock(
                    item.Producto.CodigoProducto,
                    item.Cantidad
                );

                if (!hayStock)
                    throw new Exception(
                        $"Stock insuficiente para el producto {item.Producto.Nombre}"
                    );
            }

            var resultado = await _stockRepositorio.ActualizarStock(codigoPedido);

            if (resultado != "Se Actualizo el stock correctamente")
                throw new Exception(resultado);
            pedido.EstadoPedido = "Confirmado";

            await _context.SaveChangesAsync();
        }

        public async Task CancelarPedido(string codigoPedido)
        {
            var pedido = await _context.Pedido.FirstOrDefaultAsync(p =>
                p.CodigoPedido == codigoPedido && p.Estado == "Activo"
            );

            if (pedido == null)
                throw new Exception("El pedido no existe");

            if (pedido.EstadoPedido == "Pagado")
                throw new Exception("No se puede cancelar un pedido pagado");

            if (pedido.EstadoPedido == "Confirmado")
            {
                var resultado = await _stockRepositorio.DevolverStock(codigoPedido);

                if (!resultado)
                    throw new Exception("No se pudo devolver el stock");
            }

            pedido.EstadoPedido = "Cancelado";

            await _context.SaveChangesAsync();
        }

        public async Task PagarPedido(string codigoPedido)
        {
            var pedido = await _context.Pedido.FirstOrDefaultAsync(p =>
                p.CodigoPedido == codigoPedido && p.Estado == "Activo"
            );

            if (pedido == null)
                throw new Exception("El pedido no existe");

            if (pedido.EstadoPedido != "Confirmado")
                throw new Exception("Solo pedidos confirmados pueden pagarse");

            pedido.EstadoPedido = "Pagado";

            await _context.SaveChangesAsync();
        }

        public async Task<List<PedidoDTO>> GetHistorial(string codigoUsuario)
        {
            var pedidos = await _context
                .Pedido.Include(p => p.Usuario)
                .Include(p => p.MetodoPago)
                .Where(p => p.Usuario.CodigoUsuario == codigoUsuario && p.Estado != "Inactivo")
                .OrderByDescending(p => p.Fecha)
                .ToListAsync();

            return pedidos.Select(p => p.toPedidoDTO()).ToList();
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

        public async Task<PedidoDTO> PostPedido([FromBody] CreatePedidoDTO dto)
        {
            var Usuario = await _context.Usuario.FirstOrDefaultAsync(u => u.CodigoUsuario == dto.CodigoUsuario && u.Estado == "Activo");
            if(Usuario == null)            {
               throw new Exception("El usuario no existe");
            }
            var MetodoPago = await _context.Metodo_Pago.FirstOrDefaultAsync(m =>
                m.CodigoMetodoPago == dto.CodigoMetodoPago && m.Estado == "Activo"
            );
            if (MetodoPago == null)
            {
                throw new Exception("El metodo de pago no existe");
            }
            var pedido = new Pedido
            {
                IdUsuario = Usuario.IdUsuario,
                IdMetodoPago = MetodoPago.IdMetodoPago,
                CodigoPedido = CodeGenerator.Generate("PED"),
                Fecha = dto.Fecha,
                Total = 0,
                EstadoPedido = "Pendiente",
            };
            _context.Pedido.Add(pedido);
            await _context.SaveChangesAsync();

            return pedido.toPedidoDTO();
        }

        public async Task<PedidoDTO> PutPedido(string CodigoPedido, UpdatePedidoDTO dto)
        {
            var pedido = await _context
                .Pedido.Include(p => p.Usuario)
                .Include(p => p.MetodoPago)
                .FirstOrDefaultAsync(p => p.CodigoPedido == CodigoPedido && p.Estado == "Activo");

            if (pedido == null)
                throw new Exception("El pedido no existe");

            if (pedido.EstadoPedido != "Pendiente")
                throw new Exception("Solo pedidos pendientes pueden modificarse");

            var Usuario = await _context.Usuario.FirstOrDefaultAsync(u =>
                u.CodigoUsuario == dto.CodigoUsuario && u.Estado == "Activo"
            );

            if (Usuario == null)
                throw new Exception("El usuario no existe");

            var MetodoPago = await _context.Metodo_Pago.FirstOrDefaultAsync(m =>
                m.CodigoMetodoPago == dto.CodigoMetodoPago && m.Estado == "Activo"
            );

            if (MetodoPago == null)
                throw new Exception("El metodo de pago no existe");

            pedido.IdUsuario = Usuario.IdUsuario;
            pedido.IdMetodoPago = MetodoPago.IdMetodoPago;
            pedido.Fecha = dto.Fecha;
            pedido.EstadoPedido = dto.EstadoPedido;

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

        public async Task<string> PedidoRecibido(string codigoPedido)
        {
            var pedido = await (
                from p in _context.Pedido
                where p.CodigoPedido == codigoPedido
                select p
            ).FirstOrDefaultAsync();

            if (pedido is null)
                return "";
            pedido.Estado = "Entregado";
            await _context.SaveChangesAsync();

            return "Se actualizo correctamente";
        }
    }
}
