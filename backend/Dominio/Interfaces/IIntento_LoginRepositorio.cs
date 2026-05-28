using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace backend.Dominio.Interfaces
{
    public interface IIntento_LoginRepositorio
    {
        Task<List<Intento_LoginDTO>> GetIntento_Login();
        Task<Intento_LoginDTO?> GetIntento_LoginById(int Id);
        Task<Intento_LoginDTO> PostIntento_Login([FromBody] Intento_LoginDTO dto);
        Task<Intento_LoginDTO> DeleteIntento_Login(int Id);
    }
}
