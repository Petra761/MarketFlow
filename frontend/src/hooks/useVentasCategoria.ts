import { useEffect, useState } from "react";
import type { VentasCategoria } from "../types/reportes";
import { fetchVentasCategoria } from "../services/reportesService";

interface UseVentasCategoriaResult {
  data: VentasCategoria[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useVentasCategoria(): UseVentasCategoriaResult {
  const [data, setData] = useState<VentasCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchVentasCategoria();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar los datos",
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

  return {
    data,
    loading,
    error,
    refetch: () => setTick((n) => n + 1),
  };
}
