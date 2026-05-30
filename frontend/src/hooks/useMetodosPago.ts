import { useState, useEffect } from "react";
import { metodoPagoService } from "../services/metodoPagoService";
import type { MetodoPagoDTO } from "../types/compras";

export function useMetodosPago() {
  const [metodosPago, setMetodosPago] = useState<MetodoPagoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetodos = async () => {
    try {
      setLoading(true);
      const data = await metodoPagoService.getAll();
      setMetodosPago(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetodos();
  }, []);

  return { metodosPago, loading, error, refetch: fetchMetodos };
}
