using backend.Dominio.DTOs;
using Marketflow.Dominio.Entidades;

namespace backend.Dominio.Mapeadores
{
    public static class Telefono_UsuarioMapeador
    {
        public static Telefono_UsuarioDTO toTelefono_UsuarioDTO(this Telefono_Usuario tu)
        {
            return new Telefono_UsuarioDTO()
            {
                IdTelefono = tu.IdTelefono,
                IdUsuario = tu.IdUsuario,
                FechaInicio = tu.FechaInicio,
                FechaFin = tu.FechaFin
            };
        }
    }
}
