using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace backend.Dominio.Interfaces
{
    public interface IMetodo_PagoRepositorio
    {
        Task<List<Metodo_PagoDTO>> GetMetodo_Pago();
        Task<Metodo_PagoDTO> GetMetodo_PagoByCodigo(string CodigoMetodoPago);
        Task<Metodo_PagoDTO> PostMetodo_Pago([FromBody] Metodo_PagoDTO dto);
        Task<Metodo_PagoDTO> PutMetodo_Pago(string CodigoMetodoPago, [FromBody] Metodo_PagoDTO dto);
        Task<Metodo_PagoDTO> DeleteMetodo_Pago(string CodigoMetodoPago);
    }
}