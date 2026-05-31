import { useState, useEffect } from "react";
import { pedidoService } from "../services/pedidoService";
import { getStoredUser } from "../services/authStorage";
import type { PedidoDTO } from "../types/compras";

export function useHistorialCompras() {
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      const usuario = getStoredUser();
      if (!usuario?.codigoUsuario) {
        setError("Usuario no autenticado");
        setLoading(false);
        return;
      }

      try {
        const data = await pedidoService.getHistorial(usuario.codigoUsuario);
        setPedidos(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar el historial");
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  return { pedidos, loading, error };
}
