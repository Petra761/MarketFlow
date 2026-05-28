using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using Marketflow.Dominio.Entidades;

namespace backend.Dominio.Mapeadores
{
    public static class UsuarioMapeador
    {

        public static UsuarioDTO ToDTO(Usuario usuario)
        {
            return new UsuarioDTO
            {
                CodigoUsuario = usuario.CodigoUsuario,
                IdRol = usuario.IdRol,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
                Nickname = usuario.Nickname,
                Correo = usuario.Correo,
                Contrasenia = usuario.Contrasenia
            };
        }

        
        public static Usuario ToEntity(UsuarioDTO dto)
        {
            return new Usuario
            {
                CodigoUsuario = dto.CodigoUsuario,
                IdRol = dto.IdRol,
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Nickname = dto.Nickname,
                Correo = dto.Correo,
                Contrasenia = dto.Contrasenia
            };
        }


        public static List<UsuarioDTO> ToDTOList(List<Usuario> usuarios)
        {
            return usuarios.Select(u => ToDTO(u)).ToList();
        }
    }
}

