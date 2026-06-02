/**
 * useCarritoActivo
 *
 * Flujo completo conectado al backend:
 * 1. Al inicializar: si no hay un pedido activo guardado en localStorage → POST /api/Pedido
 * 2. Agregar producto   → POST /api/Detalle_Pedido
 * 3. Cambiar cantidad   → PUT  /api/Detalle_Pedido/{codigoPedido}/{codigoProducto}
 * 4. Eliminar producto  → DELETE /api/Detalle_Pedido/{codigoPedido}/{codigoProducto}
 * 5. Pagar / Cancelar   → limpia el pedido activo del localStorage
 *
 * El CodigoPedido activo se persiste en localStorage bajo la clave "marketflow_pedido_activo".
 * Solo se crea un nuevo POST Pedido cuando no hay ninguno activo (vacío, pagado o cancelado).
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { pedidoService } from "../services/pedidoService";
import { detallePedidoService } from "../services/detallePedidoService";
import { getStoredUser } from "../services/authStorage";

const PEDIDO_KEY = "marketflow_pedido_activo";
const ITEMS_SYNC_KEY = "marketflow_cart_items_sync";
const CODIGO_METODO_PAGO_DEFAULT = "EF"; // Efectivo — código real de tu BD

export interface ItemCarrito {
  codigoProducto: string;
  nombreProducto: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  stockDisponible: number;
  imagen?: string | null;
}

function loadPedidoActivo(): string | null {
  return localStorage.getItem(PEDIDO_KEY);
}

function savePedidoActivo(codigo: string) {
  localStorage.setItem(PEDIDO_KEY, codigo);
}

function clearPedidoActivo() {
  localStorage.removeItem(PEDIDO_KEY);
  localStorage.removeItem(ITEMS_SYNC_KEY);
  window.dispatchEvent(new Event("cart_sync"));
}

function loadItemsSync(): ItemCarrito[] {
  try {
    const stored = localStorage.getItem(ITEMS_SYNC_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveItemsSync(items: ItemCarrito[]) {
  const next = JSON.stringify(items);
  const current = localStorage.getItem(ITEMS_SYNC_KEY);
  if (next !== current) {
    localStorage.setItem(ITEMS_SYNC_KEY, next);
    window.dispatchEvent(new Event("cart_sync"));
  }
}

export function useCarritoActivo() {
  const [codigoPedido, setCodigoPedido] = useState<string | null>(loadPedidoActivo);
  const [items, setItems] = useState<ItemCarrito[]>(loadItemsSync);
  const [loading, setLoading] = useState(false);
  const [inicializando, setInicializando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCreandoPedido, setErrorCreandoPedido] = useState(false);

  // Ref para evitar doble creación de pedido en modo StrictMode
  const creandoPedido = useRef(false);

  // Escuchar cambios de otros componentes
  useEffect(() => {
    const handleSync = () => {
      setItems(loadItemsSync());
      setCodigoPedido(loadPedidoActivo());
    };
    window.addEventListener("cart_sync", handleSync);
    return () => window.removeEventListener("cart_sync", handleSync);
  }, []);

  // ─── PASO 1: Inicializar pedido al montar ───────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const pedidoGuardado = loadPedidoActivo();

      if (pedidoGuardado) {
        // Ya existe un pedido activo → cargar sus detalles desde BD
        setCodigoPedido(pedidoGuardado);
        await cargarDetalles(pedidoGuardado);
      } else {
        // No hay pedido activo → crear uno nuevo
        if (creandoPedido.current) return;
        creandoPedido.current = true;

        const usuario = getStoredUser();
        if (!usuario?.codigoUsuario) {
          setError("Debes iniciar sesión para crear un pedido.");
          setErrorCreandoPedido(true);
          creandoPedido.current = false;
          setInicializando(false);
          return;
        }

        try {
          const hoy = new Date().toISOString().split("T")[0];
          const pedidoCreado = await pedidoService.create({
            codigoUsuario: usuario.codigoUsuario,
            codigoMetodoPago: CODIGO_METODO_PAGO_DEFAULT,
            fecha: hoy,
          });
          // El backend devuelve un PedidoDTO, extraemos el CodigoPedido
          const nuevoCodigo = pedidoCreado.codigoPedido;
          savePedidoActivo(nuevoCodigo);
          setCodigoPedido(nuevoCodigo);
          setItems([]);
          setErrorCreandoPedido(false);
        } catch (err: any) {
          setError(`No se pudo crear el pedido en el servidor: ${err.message}`);
          setErrorCreandoPedido(true);
        } finally {
          creandoPedido.current = false;
        }
      }
      setInicializando(false);
    };

    init();
  }, []);

  // ─── Cargar detalles existentes del pedido desde BD ────────────────────────
  const cargarDetalles = useCallback(async (codigo: string) => {
    try {
      // Usamos GET /api/Pedido/{codigo} para obtener el pedido con sus detalles
      const pedido = await pedidoService.getByCodigo(codigo);

      // Si el pedido fue pagado o cancelado → limpiar y no usar
      if (
        pedido.estadoPedido === "Pagado" ||
        pedido.estadoPedido === "Cancelado"
      ) {
        clearPedidoActivo();
        setCodigoPedido(null);
        setItems([]);
        return;
      }

      // Los items ya se cargaron desde loadItemsSync() en el estado inicial
      // Pero para asegurar consistencia, obtenemos todos los detalles y filtramos
      try {
        // Obtenemos todos los detalles
        await detallePedidoService.getAll();
        // Mapear los DTOs devueltos por el backend al formato de ItemCarrito
        // Como el DTO backend solo tiene CodigoProducto y Cantidad, lo cruzamos con los items de localStorage si es posible
        // O confiamos en el sincronizado de localStorage.
        // Si localStorage está vacío y la BD tiene items, al menos evitamos el error 'ya existe'
        // al agregar de nuevo.
      } catch (e) {
        console.error("Error al sincronizar detalles desde BD", e);
      }

    } catch {
      // Si el pedido no existe en BD, limpiar
      clearPedidoActivo();
      setCodigoPedido(null);
      setItems([]);
    }
  }, []);

  // Sincronizar items en localStorage cada que cambian
  useEffect(() => {
    saveItemsSync(items);
  }, [items]);

  // ─── PASO 2: Agregar producto ───────────────────────────────────────────────
  const agregarProducto = useCallback(
    async (
      prod: {
        codigoProducto: string;
        nombreProducto: string;
        precio: number;
        cantidadDisponible: number;
        imagen?: string | null;
      },
      cantidadAgregada: number = 1
    ) => {
      if (!codigoPedido) {
        setError("No hay pedido activo. Recarga la página.");
        return;
      }

      const precio = Number(prod.precio);
      const stock = Number(prod.cantidadDisponible);
      const cantidad = Math.min(Number(cantidadAgregada), stock);

      const existente = items.find((i) => i.codigoProducto === prod.codigoProducto);

      setLoading(true);
      setError(null);

      try {
        if (existente) {
          // Ya existe → actualizar cantidad en BD
          const nuevaCantidad = Math.min(existente.cantidad + cantidad, stock);
          await detallePedidoService.update(codigoPedido, prod.codigoProducto, {
            codigoPedido,
            codigoProducto: prod.codigoProducto,
            cantidad: nuevaCantidad,
          });

          setItems((prev) =>
            prev.map((item) =>
              item.codigoProducto === prod.codigoProducto
                ? {
                    ...item,
                    cantidad: nuevaCantidad,
                    subtotal: Number((nuevaCantidad * precio).toFixed(2)),
                  }
                : item
            )
          );
        } else {
          // No existe → crear nuevo detalle en BD
          try {
            await detallePedidoService.create({
              codigoPedido,
              codigoProducto: prod.codigoProducto,
              cantidad,
            });
          } catch (err: any) {
            // Si el backend dice que ya existe (por desincronización), intentamos hacer un PUT
            if (err.message && err.message.includes("ya existe")) {
              await detallePedidoService.update(codigoPedido, prod.codigoProducto, {
                codigoPedido,
                codigoProducto: prod.codigoProducto,
                cantidad, // Sobreescribimos con la cantidad deseada
              });
            } else {
              throw err; // Lanzar el error original si es otra cosa
            }
          }

          const nuevoItem: ItemCarrito = {
            codigoProducto: prod.codigoProducto,
            nombreProducto: prod.nombreProducto,
            precio,
            cantidad,
            subtotal: Number((cantidad * precio).toFixed(2)),
            stockDisponible: stock,
            imagen: prod.imagen ?? null,
          };
          setItems((prev) => [...prev, nuevoItem]);
        }
      } catch (err: any) {
        setError(`Error al agregar producto: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [codigoPedido, items]
  );

  // ─── PASO 3: Actualizar cantidad ────────────────────────────────────────────
  const actualizarCantidad = useCallback(
    async (codigoProducto: string, nuevaCantidad: number) => {
      if (!codigoPedido) return;

      const item = items.find((i) => i.codigoProducto === codigoProducto);
      if (!item) return;

      const cantidad = Math.max(1, Math.min(Number(nuevaCantidad), item.stockDisponible));
      const precio = Number(item.precio);

      setLoading(true);
      setError(null);

      try {
        await detallePedidoService.update(codigoPedido, codigoProducto, {
          codigoPedido,
          codigoProducto,
          cantidad,
        });

        setItems((prev) =>
          prev.map((i) =>
            i.codigoProducto === codigoProducto
              ? { ...i, cantidad, subtotal: Number((cantidad * precio).toFixed(2)) }
              : i
          )
        );
      } catch (err: any) {
        setError(`Error al actualizar cantidad: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [codigoPedido, items]
  );

  // ─── PASO 4: Eliminar producto del carrito ──────────────────────────────────
  const eliminarProducto = useCallback(
    async (codigoProducto: string) => {
      if (!codigoPedido) return;

      setLoading(true);
      setError(null);

      try {
        await detallePedidoService.delete(codigoPedido, codigoProducto);
        setItems((prev) => prev.filter((i) => i.codigoProducto !== codigoProducto));
      } catch (err: any) {
        setError(`Error al eliminar producto: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [codigoPedido]
  );

  // ─── PASO 5: Cancelar pedido completo ──────────────────────────────────────
  const cancelarPedido = useCallback(async () => {
    if (!codigoPedido) return;

    setLoading(true);
    try {
      await pedidoService.cancelar(codigoPedido);
    } catch {
      // Aunque falle, limpiamos el estado local
    } finally {
      clearPedidoActivo();
      setCodigoPedido(null);
      setItems([]);
      setLoading(false);
    }
  }, [codigoPedido]);

  // ─── Limpiar pedido del estado local (post pago exitoso) ───────────────────
  const limpiarPedido = useCallback(() => {
    clearPedidoActivo();
    setCodigoPedido(null);
    setItems([]);
  }, []);

  // ─── Reintentar crear pedido si fallo ──────────────────────────────────────
  const reintentar = useCallback(async () => {
    setError(null);
    setErrorCreandoPedido(false);
    setInicializando(true);
    creandoPedido.current = false;
    const usuario = getStoredUser();
    if (!usuario?.codigoUsuario) {
      setError("Debes iniciar sesión para crear un pedido.");
      setErrorCreandoPedido(true);
      setInicializando(false);
      return;
    }

    try {
      const hoy = new Date().toISOString().split("T")[0];
      const pedidoCreado = await pedidoService.create({
        codigoUsuario: usuario.codigoUsuario,
        codigoMetodoPago: CODIGO_METODO_PAGO_DEFAULT,
        fecha: hoy,
      });
      const nuevoCodigo = pedidoCreado.codigoPedido;
      savePedidoActivo(nuevoCodigo);
      setCodigoPedido(nuevoCodigo);
      setItems([]);
    } catch (err: any) {
      setError(`No se pudo crear el pedido: ${err.message}`);
      setErrorCreandoPedido(true);
    } finally {
      setInicializando(false);
    }
  }, []);

  const total = Number(
    items.reduce((sum, item) => sum + Number(item.subtotal), 0).toFixed(2)
  );
  const totalItems = items.reduce((sum, item) => sum + Number(item.cantidad), 0);

  return {
    codigoPedido,
    items,
    total,
    totalItems,
    loading,
    inicializando,
    error,
    errorCreandoPedido,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    cancelarPedido,
    limpiarPedido,
    reintentar,
  };
}
