using backend.Dominio.DTOs;
using Marketflow.Dominio.Entidades;

namespace backend.Dominio.Mapeadores
{
    public static class Intento_LoginMapeador
    {
        public static Intento_LoginDTO toIntento_LoginDTO(this Intento_Login login)
        {
            return new Intento_LoginDTO()
            {
                IdUsuario = login.IdUsuario,
                FechaIntento = login.FechaIntento,
                Estado = login.Estado
            };
        }
    }
}
