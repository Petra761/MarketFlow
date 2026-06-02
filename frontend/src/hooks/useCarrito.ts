import { useState, useCallback, useEffect } from "react";
import type { CartItem, Producto, PrecioResponseDTO, StockSumarioDTO } from "../types/compras";
import { precioService } from "../services/precioService";
import { stockService } from "../services/stockService";

const CART_KEY = "marketflow_cart";

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return [];
    const parsed: CartItem[] = JSON.parse(stored);
    // Limpiar items corruptos donde el subtotal es NaN o incorrecto
    return parsed
      .filter((item) => item.codigoProducto && Number(item.precioUnitario) > 0)
      .map((item) => ({
        ...item,
        precioUnitario: Number(item.precioUnitario),
        cantidad: Number(item.cantidad),
        subtotal: Number((Number(item.precioUnitario) * Number(item.cantidad)).toFixed(2)),
        stockDisponible: Number(item.stockDisponible),
      }));
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function useCarrito() {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  // Persist to localStorage whenever items change
  useEffect(() => {
    saveCart(items);
  }, [items]);

  const agregarProducto = useCallback(
    async (producto: Producto, cantidad: number = 1) => {
      // Obtener precio activo
      let precioActual = 0;
      try {
        const precios: PrecioResponseDTO[] = await precioService.getByProducto(
          producto.codigoProducto
        );
        const activo = precios.find((p) => p.estado === "Activo");
        precioActual = activo?.monto ?? 0;
      } catch {
        precioActual = 0;
      }

      // Obtener stock disponible
      let stockDisponible = 0;
      try {
        const stockData: StockSumarioDTO = await stockService.getByProducto(
          producto.codigoProducto
        );
        stockDisponible = stockData.stockTotal;
      } catch {
        stockDisponible = 0;
      }

      setItems((prev) => {
        const existente = prev.find(
          (item) => item.codigoProducto === producto.codigoProducto
        );

        if (existente) {
          const nuevaCantidad = Math.min(
            existente.cantidad + cantidad,
            stockDisponible
          );
          return prev.map((item) =>
            item.codigoProducto === producto.codigoProducto
              ? {
                  ...item,
                  cantidad: nuevaCantidad,
                  subtotal: nuevaCantidad * precioActual,
                  stockDisponible,
                }
              : item
          );
        }

        const cantidadFinal = Math.min(cantidad, stockDisponible);
        const newItem: CartItem = {
          producto,
          precioUnitario: precioActual,
          cantidad: cantidadFinal,
          subtotal: cantidadFinal * precioActual,
          codigoProducto: producto.codigoProducto,
          nombreProducto: producto.nombre,
          descripcion: producto.descripcion,
          marca: producto.marca,
          stockDisponible,
        };

        return [...prev, newItem];
      });
    },
    []
  );

  const agregarProductoPrueba = useCallback(
    (prod: { codigoProducto: string; nombreProducto: string; precio: number; cantidadDisponible: number }, cantidadAgregada: number = 1) => {
      // Forzar conversión numérica — el JSON de C# decimal puede venir como string
      const precio = Number(prod.precio);
      const stock = Number(prod.cantidadDisponible);
      const cantidadAgregar = Number(cantidadAgregada);

      setItems((prev) => {
        const existente = prev.find((item) => item.codigoProducto === prod.codigoProducto);

        if (existente) {
          const nuevaCantidad = Math.min(Number(existente.cantidad) + cantidadAgregar, stock);
          return prev.map((item) =>
            item.codigoProducto === prod.codigoProducto
              ? {
                  ...item,
                  cantidad: nuevaCantidad,
                  precioUnitario: precio,
                  subtotal: Number((nuevaCantidad * precio).toFixed(2)),
                  stockDisponible: stock,
                }
              : item
          );
        }

        const cantidadFinal = Math.min(cantidadAgregar, stock);
        const newItem: CartItem = {
          producto: {
            codigoProducto: prod.codigoProducto,
            nombre: prod.nombreProducto,
            descripcion: "",
            marca: "",
            estadoProducto: "Activo",
            estado: "Activo",
            idProducto: 0,
            idUsuario: 0,
            idCategoria: 0,
            fecha: "",
          },
          precioUnitario: precio,
          cantidad: cantidadFinal,
          subtotal: Number((cantidadFinal * precio).toFixed(2)),
          codigoProducto: prod.codigoProducto,
          nombreProducto: prod.nombreProducto,
          descripcion: "",
          marca: "",
          stockDisponible: stock,
        };

        return [...prev, newItem];
      });
    },
    []
  );

  const actualizarCantidad = useCallback(
    (codigoProducto: string, cantidad: number) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.codigoProducto !== codigoProducto) return item;
          const nuevaCantidad = Math.max(1, Math.min(Number(cantidad), Number(item.stockDisponible)));
          const precio = Number(item.precioUnitario);
          return {
            ...item,
            cantidad: nuevaCantidad,
            precioUnitario: precio,
            subtotal: Number((nuevaCantidad * precio).toFixed(2)),
          };
        })
      );
    },
    []
  );

  const eliminarProducto = useCallback((codigoProducto: string) => {
    setItems((prev) => prev.filter((item) => item.codigoProducto !== codigoProducto));
  }, []);

  const vaciarCarrito = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const total = Number(items.reduce((sum, item) => sum + Number(item.subtotal), 0).toFixed(2));
  const totalItems = items.reduce((sum, item) => sum + Number(item.cantidad), 0);

  return {
    items,
    total,
    totalItems,
    agregarProducto,
    agregarProductoPrueba,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
  };
}
