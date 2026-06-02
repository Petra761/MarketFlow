import { useEffect, useState } from "react";
import {
  fetchVentasDia,
  fetchVentasSemana,
  fetchVentasMes,
  fetchVentasAnual,
} from "../services/reportesService";
import type { VentaRangoDTO } from "../types/reportes";

export interface MetricaResumen {
  valor: number;
  tendencia: number;
  subtext: string;
  rawData: VentaRangoDTO[];
}

export interface VentasResumen {
  ventasDia: MetricaResumen;
  ventasSemana: MetricaResumen;
  ventasMes: MetricaResumen;
  ventasAnual: MetricaResumen;
}

const DEFAULT_RESUMEN: VentasResumen = {
  ventasDia: { valor: 0, tendencia: 5.3, subtext: "vs. ayer", rawData: [] },
  ventasSemana: { valor: 0, tendencia: 12.4, subtext: "vs. semana anterior", rawData: [] },
  ventasMes: { valor: 0, tendencia: 8.1, subtext: "vs. mes anterior", rawData: [] },
  ventasAnual: { valor: 0, tendencia: -2.3, subtext: "vs. año anterior", rawData: [] },
};

export function useVentasResumen() {
  const [data, setData] = useState<VentasResumen>(DEFAULT_RESUMEN);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      setError(null);

      try {
        const [diaRes, semanaRes, mesRes, anualRes] = await Promise.all([
          fetchVentasDia(),
          fetchVentasSemana(),
          fetchVentasMes(),
          fetchVentasAnual(),
        ]);

        if (cancelled) return;

        // 1. Ventas Día: Suma de todas las ventas devueltas en VentasDia
        const totalDia = diaRes.reduce((sum, item) => sum + item.totalVentas, 0);

        // 2. Ventas Semana: Suma de los últimos 7 días devueltos
        const totalSemana = semanaRes.reduce((sum, item) => sum + item.totalVentas, 0);

        // 3. Ventas Mes: Buscar mes actual o tomar el último valor disponible
        const now = new Date();
        const currentMonthNameEs = now.toLocaleString("es-ES", { month: "long" }).toLowerCase();
        const currentMonthNameEn = now.toLocaleString("en-US", { month: "long" }).toLowerCase();

        let totalMes = 0;
        if (mesRes.length > 0) {
          const matchMes = mesRes.find(
            (item) =>
              item.periodo.toLowerCase().includes(currentMonthNameEs) ||
              item.periodo.toLowerCase().includes(currentMonthNameEn)
          );
          totalMes = matchMes ? matchMes.totalVentas : mesRes[mesRes.length - 1].totalVentas;
        }

        // 4. Ventas Anual: Buscar año actual o tomar el último valor disponible
        const currentYearStr = now.getFullYear().toString();
        let totalAnual = 0;
        if (anualRes.length > 0) {
          const matchAnio = anualRes.find((item) => item.periodo === currentYearStr);
          totalAnual = matchAnio ? matchAnio.totalVentas : anualRes[anualRes.length - 1].totalVentas;
        }

        setData({
          ventasDia: { valor: totalDia, tendencia: 5.3, subtext: "vs. ayer", rawData: diaRes },
          ventasSemana: { valor: totalSemana, tendencia: 12.4, subtext: "vs. semana anterior", rawData: semanaRes },
          ventasMes: { valor: totalMes, tendencia: 8.1, subtext: "vs. mes anterior", rawData: mesRes },
          ventasAnual: { valor: totalAnual, tendencia: -2.3, subtext: "vs. año anterior", rawData: anualRes },
        });
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar las métricas de resumen"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAll();

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return {
    data,
    loading,
    error,
    refetch: () => setTick((t) => t + 1),
  };
}
