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
                CodigoRol = usuario.Rol!.CodigoRol,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
                Nickname = usuario.Nickname,
                Correo = usuario.Correo
            };
        }

        
        public static Usuario ToEntity(UsuarioDTO dto, int idRol)
        {
            return new Usuario
            {
                IdRol = idRol,
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Nickname = dto.Nickname,
                Correo = dto.Correo,
                Contrasenia = dto.Contrasenia
            };
        }

        public static UsuarioGetDTO ToGetDTO(Usuario usuario)
        {
            return new UsuarioGetDTO
            {
                CodigoUsuario = usuario.CodigoUsuario,
                Rol = usuario.Rol!.Nombre,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
                Nickname = usuario.Nickname,
                Correo = usuario.Correo
            };
        }

        public static Usuario ToEntityPut(UsuarioPutDTO dto)
        {
            return new Usuario
            {
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

        public static List<UsuarioGetDTO> ToGetDTOList(List<Usuario> usuarios)
        {
            return usuarios.Select(u => ToGetDTO(u)).ToList();
        }
    }
}

