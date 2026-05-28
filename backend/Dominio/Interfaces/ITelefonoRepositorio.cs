using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace backend.Dominio.Interfaces
{
    public interface ITelefonoRepositorio
    {
        Task<List<TelefonoDTO>> GetTelefono();
        Task<TelefonoDTO?> GetTelefonoByCodigo(string CodigoTelefono);
        Task<TelefonoDTO> PostTelefono([FromBody] TelefonoDTO dto);
        Task<TelefonoDTO> PutTelefono(string CodigoTelefono, [FromBody] TelefonoDTO dto);
        Task<TelefonoDTO> DeleteTelefono(string CodigoTelefono);
    }
}
