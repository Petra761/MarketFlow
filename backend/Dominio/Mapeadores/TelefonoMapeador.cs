using backend.Dominio.DTOs;
using Marketflow.Dominio.Entidades;

namespace backend.Dominio.Mapeadores
{
    public static class TelefonoMapeador
    {
        public static TelefonoDTO toTelefonoDTO(this Telefono telefono)
        {
            return new TelefonoDTO()
            {
                CodigoTelefono = telefono.CodigoTelefono,
                Numero = telefono.Numero
            };
        }
    }
}
