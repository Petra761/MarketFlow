import { useState } from "react";
import { fetchVentasRango } from "../services/reportesService";
import type { VentaRangoDTO } from "../types/reportes";

export function useVentasRango() {
    const [data, setData] = useState<VentaRangoDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const buscar = async (
        fechaInicio: string,
        fechaFin: string
    ) => {
        try {
        setLoading(true);
        setError("");

        const resultado =
            await fetchVentasRango(
            fechaInicio,
            fechaFin
            );

        setData(resultado);
        } catch {
        setError(
            "No se pudieron cargar las ventas por rango"
        );
        } finally {
        setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        buscar,
    };
}