import { useEffect, useState } from "react";
import { categoriaService, type Categoria } from "../services/categoriaService";

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoriaService
      .getAll()
      .then(setCategorias)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Error al cargar categorías")
      )
      .finally(() => setLoading(false));
  }, []);

  return { categorias, loading, error };
}
