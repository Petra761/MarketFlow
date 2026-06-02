import { useState, useCallback } from "react";
import { pedidoService } from "../services/pedidoService";
import { detallePedidoService } from "../services/detallePedidoService";
import type { CreatePedidoDTO, Detalle_PedidoDTO } from "../types/compras";

export function usePedido() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codigoPedidoActual, setCodigoPedidoActual] = useState<string | null>(null);

  // Crear un nuevo pedido
  const crearPedido = useCallback(async (pedido: CreatePedidoDTO) => {
    try {
      setLoading(true);
      setError(null);
      const pedidoResponse = await pedidoService.create(pedido);
      setCodigoPedidoActual(pedidoResponse.codigoPedido);
      return pedidoResponse.codigoPedido;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Agregar un detalle al pedido
  const agregarDetalle = useCallback(async (detalle: Detalle_PedidoDTO) => {
    try {
      setLoading(true);
      setError(null);
      return await detallePedidoService.create(detalle);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Confirmar pedido (cambia estado a "Confirmado")
  const confirmarPedido = useCallback(async (codigoPedido: string) => {
    try {
      setLoading(true);
      setError(null);
      await pedidoService.confirmar(codigoPedido);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Pagar pedido (cambia estado a "Pagado")
  const pagarPedido = useCallback(async (codigoPedido: string) => {
    try {
      setLoading(true);
      setError(null);
      await pedidoService.pagar(codigoPedido);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancelar pedido
  const cancelarPedido = useCallback(async (codigoPedido: string) => {
    try {
      setLoading(true);
      setError(null);
      await pedidoService.cancelar(codigoPedido);
      setCodigoPedidoActual(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    codigoPedidoActual,
    setCodigoPedidoActual,
    crearPedido,
    agregarDetalle,
    confirmarPedido,
    pagarPedido,
    cancelarPedido,
  };
}
