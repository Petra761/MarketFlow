import { useEffect, useState } from "react";
import type { UsuarioGetDTO, UsuarioDTO, UsuarioPutDTO, RolDTO, UsuarioStats } from "../types/usuario";
import {
  fetchUsuarios,
  fetchRoles,
  postUsuario,
  putUsuario,
  bloquearUsuario,
  desbloquearUsuario,
  deleteUsuario,
} from "../services/usuarioService";

interface UseUsuariosResult {
  data: UsuarioGetDTO[];
  roles: RolDTO[];
  stats: UsuarioStats;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  crear: (dto: UsuarioDTO) => Promise<void>;
  editar: (codigo: string, dto: UsuarioPutDTO) => Promise<void>;
  bloquear: (codigo: string) => Promise<void>;
  desbloquear: (codigo: string) => Promise<void>;
  eliminar: (codigo: string) => Promise<void>;
}

const DEFAULT_STATS: UsuarioStats = {
  total: 0,
  activos: 0,
  bloqueados: 0,
  admins: 0,
};

function calcStats(usuarios: UsuarioGetDTO[]): UsuarioStats {
  return {
    total: usuarios.length,
    activos: usuarios.filter((u) => u.estado === "Activo").length,
    bloqueados: usuarios.filter((u) => u.estado === "Bloqueado").length,
    admins: usuarios.filter(
      (u) => u.nombreRol?.toLowerCase().includes("admin") ||
             u.nombreRol?.toLowerCase().includes("super")
    ).length,
  };
}

export function useUsuarios(): UseUsuariosResult {
  const [data, setData] = useState<UsuarioGetDTO[]>([]);
  const [roles, setRoles] = useState<RolDTO[]>([]);
  const [stats, setStats] = useState<UsuarioStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [usuarios, rolesData] = await Promise.all([
          fetchUsuarios(),
          fetchRoles(),
        ]);
        if (!cancelled) {
          setData(usuarios);
          setRoles(rolesData);
          setStats(calcStats(usuarios));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar los usuarios"
          );
          setData([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [tick]);

  const refetch = () => setTick((n) => n + 1);

  const crear = async (dto: UsuarioDTO) => {
    await postUsuario(dto);
    refetch();
  };

  const editar = async (codigo: string, dto: UsuarioPutDTO) => {
    await putUsuario(codigo, dto);
    refetch();
  };

  const bloquear = async (codigo: string) => {
    await bloquearUsuario(codigo);
    refetch();
  };

  const desbloquear = async (codigo: string) => {
    await desbloquearUsuario(codigo);
    refetch();
  };

  const eliminar = async (codigo: string) => {
    await deleteUsuario(codigo);
    refetch();
  };

  return { data, roles, stats, loading, error, refetch, crear, editar, bloquear, desbloquear, eliminar };
}
