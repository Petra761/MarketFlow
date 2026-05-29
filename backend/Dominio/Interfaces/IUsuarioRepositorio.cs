using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dominio.DTOs;
using Marketflow.Dominio.Entidades;

namespace backend.Dominio.Interfaces
{
    public interface IUsuarioRepositorio
    {
        Task<List<Usuario>> ListarUsuarios();
        Task<Usuario?> ObtenerUsuarioCodigo(string codigo);
        Task<Usuario?> CrearUsuario(Usuario usuario);
        Task<Rol?> ObtenerRolPorCodigo(string codigoRol);
        Task<bool> ActualizarUsuario(string codigo, Usuario usuario);
        Task<bool> EliminarUsuario(string codigo);
        Task<Usuario?> IniciarSesion(LoginDTO dto);
        Task RecuperarCuenta(string correo);
        Task CambiarContrasenia(CambiarContraseniaDTO dto);
    }
}