import { useEffect, useState } from "react";
import type { UsuarioEstadisticaDTO } from "../types/reportes";
import { fetchEstadisticasUsuarios } from "../services/reportesService";

export function useEstadisticasUsuarios() {
    const [data, setData] = useState<UsuarioEstadisticaDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const cargar = async () => {
        try {
        setLoading(true);

        const resultado =
            await fetchEstadisticasUsuarios();

        setData(resultado);
        setError("");
        } catch {
        setError(
            "No se pudieron cargar las estadísticas de usuarios"
        );
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    return {
        data,
        loading,
        error,
        refetch: cargar,
    };
}