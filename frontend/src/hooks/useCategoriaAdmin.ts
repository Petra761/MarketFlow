
import { useEffect, useState } from "react";
import type { CategoriaDTO, CategoriaAdminDTO } from "../types/categoria";
import {
    fetchCategorias,
    postCategoria,
    putCategoria,
    deleteCategoria,
} from "../services/categoriaAdminService";
import type { mCategoriaDTO } from "../types/categoria";

interface UseCategoriasResult {
    data: CategoriaAdminDTO[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    crear: (dto: mCategoriaDTO) => Promise<void>;
    editar: (codigo: string, dto: CategoriaDTO) => Promise<void>;
    eliminar: (codigo: string) => Promise<void>;
}

export function useCategorias(): UseCategoriasResult {
    const [data, setData] = useState<CategoriaAdminDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const result = await fetchCategorias();
                if (!cancelled) {
                    setData(result);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error ? err.message : "Error al cargar las categorías"
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

    const crear = async (dto: mCategoriaDTO) => {
        await postCategoria(dto);
        setTick((n) => n + 1);
    };

    const editar = async (codigo: string, dto: CategoriaDTO) => {
        await putCategoria(codigo, dto);
        setTick((n) => n + 1);
    };

    const eliminar = async (codigo: string) => {
        await deleteCategoria(codigo);
        setTick((n) => n + 1);
    };

    return {
        data,
        loading,
        error,
        refetch: () => setTick((n) => n + 1),
        crear,
        editar,
        eliminar,
    }
};