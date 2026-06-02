using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using Marketflow.Dominio.Entidades;

namespace backend.Dominio.Mapeadores
{
    public static class RolMapeador
    {
        
        public static RolDTO ToDTO(Rol rol)
        {
            return new RolDTO
            {
                CodigoRol = rol.CodigoRol,
                Nombre = rol.Nombre
            };
        }

        
        public static Rol ToEntity(RolDTO dto)
        {
            return new Rol
            {
                CodigoRol = dto.CodigoRol,
                Nombre = dto.Nombre
            };
        }

        
        public static List<RolDTO> ToDTOList(List<Rol> roles)
        {
            return roles.Select(r => ToDTO(r)).ToList();
        }
    }
}

