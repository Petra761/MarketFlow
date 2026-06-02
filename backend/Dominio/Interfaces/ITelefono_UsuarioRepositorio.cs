using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace backend.Dominio.Interfaces
{
    public interface ITelefono_UsuarioRepositorio
    {
        Task<List<Telefono_UsuarioDTO>> GetTelefono_Usuario();
        Task<Telefono_UsuarioDTO?> GetTelefono_UsuarioById(int Id);
        Task<Telefono_UsuarioDTO> PostTelefono_Usuario([FromBody] Telefono_UsuarioDTO dto);
        Task<Telefono_UsuarioDTO> PutTelefono_Usuario(int Id, [FromBody] Telefono_UsuarioDTO dto);
        Task<Telefono_UsuarioDTO> DeleteTelefono_Usuario(int Id);
    }
}
