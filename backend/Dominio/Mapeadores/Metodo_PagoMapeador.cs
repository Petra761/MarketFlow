using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Marketflow.Dominio.Entidades;
using backend.Dominio.DTOs;

namespace backend.Dominio.Mapeadores
{
    public static class Metodo_PagoMapeador
    {
        public static Metodo_PagoDTO toMetodo_PagoDTO(this Metodo_Pago metodo_Pago)
        {
            if (metodo_Pago == null) return null;
            return new Metodo_PagoDTO
            {
                CodigoMetodoPago = metodo_Pago.CodigoMetodoPago,
                Nombre = metodo_Pago.Nombre
            };
        }
    }
}