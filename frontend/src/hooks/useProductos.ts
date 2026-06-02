import { useState, useEffect } from "react";
import { productoService } from "../services/productoService";
import { precioService } from "../services/precioService";
import { stockService } from "../services/stockService";
import type { Producto, PrecioResponseDTO, StockSumarioDTO } from "../types/compras";

export interface ProductoConPrecioYStock {
  producto: Producto;
  precioActual: number;
  stockDisponible: number;
}

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const data = await productoService.getAll();
      setProductos(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return { productos, loading, error, refetch: fetchProductos };
}

export function useProductosConDetalle() {
  const [productosDetalle, setProductosDetalle] = useState<ProductoConPrecioYStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);

      // 1. Obtener todos los productos
      const productos = await productoService.getAll();

      // 2. Obtener todos los precios activos
      const precios: PrecioResponseDTO[] = await precioService.getAll();

      // 3. Para cada producto, buscar su precio activo y stock
      const productosConDetalle: ProductoConPrecioYStock[] = await Promise.all(
        productos
          .filter((p) => p.estado === "Activo")
          .map(async (producto) => {
            // Buscar precio activo del producto
            const precioActivo = precios.find(
              (pr) =>
                pr.codigoProducto === producto.codigoProducto &&
                pr.estado === "Activo"
            );

            // Obtener stock
            let stockTotal = 0;
            try {
              const stockData: StockSumarioDTO = await stockService.getByProducto(
                producto.codigoProducto
              );
              stockTotal = stockData.stockTotal;
            } catch {
              stockTotal = 0;
            }

            return {
              producto,
              precioActual: precioActivo?.monto ?? 0,
              stockDisponible: stockTotal,
            };
          })
      );

      setProductosDetalle(productosConDetalle);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { productosDetalle, loading, error, refetch: fetchAll };
}

export function useProductosDisponibles() {
  const [productosDisponibles, setProductosDisponibles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDisponibles = async () => {
    try {
      setLoading(true);
      const data = await productoService.getProductosDisponibles();
      setProductosDisponibles(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisponibles();
  }, []);

  return { productosDisponibles, loading, error, refetch: fetchDisponibles };
}
