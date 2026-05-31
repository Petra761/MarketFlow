import { useCallback, useEffect, useState } from "react";
import { productoService } from "../services/productoService";
import type { MisProductosDTO } from "../types/compras";

export function useMisProductos(codigoUsuario: string | undefined) {
  const [productos, setProductos] = useState<MisProductosDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!codigoUsuario) {
      setProductos([]);
      setLoading(false);
      setError("Inicia sesión como vendedor para ver tus productos.");
      return;
    }

    try {
      setLoading(true);
      const data = await productoService.getMisProductos(codigoUsuario);
      setProductos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }, [codigoUsuario]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { productos, loading, error, refetch };
}
