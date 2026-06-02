import { useEffect, useState } from "react";
import type { ProductoMasVendido } from "../types/reportes";
import { fetchProductosMasVendidos } from "../services/reportesService";

interface UseProductosMasVendidosResult {
  data: ProductoMasVendido[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProductosMasVendidos(): UseProductosMasVendidosResult {
  const [data, setData] = useState<ProductoMasVendido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchProductosMasVendidos();
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
