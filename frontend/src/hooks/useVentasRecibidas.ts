import { useCallback, useEffect, useMemo, useState } from "react";
import { pedidoService } from "../services/pedidoService";
import type { PedidoRecibidoDTO } from "../types/compras";

/** Pedidos que ya pasaron el pago (lo que hace el comprador en /pago). */
export const ESTADOS_VENTA_COBRADA = ["Pagado", "Confirmado", "Entregado"];

export function useVentasRecibidas(codigoVendedor: string | undefined) {
  const [ventas, setVentas] = useState<PedidoRecibidoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!codigoVendedor) {
      setVentas([]);
      setLoading(false);
      setError("Inicia sesión como vendedor.");
      return;
    }

    try {
      setLoading(true);
      const data = await pedidoService.getRecibidos(codigoVendedor);
      setVentas(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar ventas");
    } finally {
      setLoading(false);
    }
  }, [codigoVendedor]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const ventasCobradas = useMemo(
    () =>
      ventas.filter((v) =>
        ESTADOS_VENTA_COBRADA.includes(v.estadoPedido)
      ),
    [ventas]
  );

  const totalIngresos = useMemo(
    () => ventasCobradas.reduce((s, v) => s + (v.total ?? 0), 0),
    [ventasCobradas]
  );

  const productosMasVendidos = useMemo(() => {
    const map = new Map<string, number>();
    for (const venta of ventasCobradas) {
      for (const p of venta.productos ?? []) {
        map.set(
          p.nombreProducto,
          (map.get(p.nombreProducto) ?? 0) + p.cantidad
        );
      }
    }
    return [...map.entries()]
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
  }, [ventasCobradas]);

  return {
    ventas,
    ventasCobradas,
    totalIngresos,
    productosMasVendidos,
    loading,
    error,
    refetch,
  };
}
