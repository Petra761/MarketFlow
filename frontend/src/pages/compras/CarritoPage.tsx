import { useCarritoActivo } from "../../hooks/useCarritoActivo";
import { useProductosDisponibles } from "../../hooks/useProductos";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CarritoPage() {
  const navigate = useNavigate();
  const {
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
    reintentar,
  } = useCarritoActivo();

  const { productosDisponibles, loading: loadingProductos } = useProductosDisponibles();
  const [cantidades, setCantidades] = useState<Record<string, number>>({});

  const handleCantidadChange = (codigo: string, valor: number) => {
    setCantidades((prev) => ({ ...prev, [codigo]: Math.max(1, valor) }));
  };

  if (inicializando) {
    return (
      <div className="carrito-page">
        <div className="productos-loading" style={{ minHeight: "40vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="spinner-lg"></div>
          <p style={{ marginTop: "1rem", color: "#64748b" }}>Preparando tu carrito...</p>
        </div>
      </div>
    );
  }

  // Error al crear pedido en el servidor
  if (errorCreandoPedido) {
    return (
      <div className="carrito-page">
        <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: "12px", border: "1px solid #fca5a5" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
          <h2 style={{ color: "#dc2626", marginBottom: "0.5rem" }}>Error al iniciar el carrito</h2>
          <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            {error || "No se pudo conectar con el servidor. Verifica que el backend esté corriendo."}
          </p>
          <button
            onClick={reintentar}
            style={{ padding: "0.75rem 2rem", background: "#0d7377", color: "white", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "1rem" }}
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-page">
      <div className="carrito-header">
        <h1>Tu Carrito</h1>
        <p>
          Tienes {totalItems} artículo{totalItems !== 1 ? "s" : ""} en tu bolsa de compras.
          {codigoPedido && (
            <span style={{ marginLeft: "1rem", fontSize: "0.8rem", color: "#94a3b8", fontFamily: "monospace" }}>
              Pedido: {codigoPedido}
            </span>
          )}
        </p>
      </div>

      {/* Error global */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#dc2626", fontSize: "0.9rem" }}>
          ⚠️ {error}
        </div>
      )}

      <div className="carrito-layout">
        {/* Lista de items */}
        <div className="carrito-items-section">
          {items.length === 0 ? (
            <div className="carrito-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
              <h3>Tu carrito está vacío</h3>
              <p>Agrega productos desde la lista de abajo</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.codigoProducto} className="cart-item-card">
                <div className="cart-item-image">
                  <svg className="cart-item-image-placeholder" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.nombreProducto}</div>
                  <div className="cart-item-desc">{item.codigoProducto}</div>
                  <div className="cart-item-qty">
                    <button
                      className="qty-btn"
                      onClick={() => actualizarCantidad(item.codigoProducto, item.cantidad - 1)}
                      disabled={item.cantidad <= 1 || loading}
                    >−</button>
                    <span className="qty-value">{item.cantidad}</span>
                    <button
                      className="qty-btn"
                      onClick={() => actualizarCantidad(item.codigoProducto, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stockDisponible || loading}
                    >+</button>
                  </div>
                </div>
                <div className="cart-item-pricing">
                  <span className="cart-item-unit-label">Precio Unitario</span>
                  <span className="cart-item-unit-price">{Number(item.precio).toLocaleString("es-BO")} Bs</span>
                  <span className="cart-item-subtotal">{Number(item.subtotal).toLocaleString("es-BO")} Bs</span>
                </div>
                <button
                  className="cart-item-delete"
                  onClick={() => eliminarProducto(item.codigoProducto)}
                  disabled={loading}
                  title="Quitar del carrito"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                  </svg>
                </button>
              </div>
            ))
          )}

          <button
            className="seguir-comprando"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
          >
            ← Seguir Comprando
          </button>
        </div>

        {/* Resumen */}
        <div>
          <div className="order-summary">
            <div className="order-summary-title">Resumen de Compra</div>
            <div className="order-summary-rows">
              <div className="order-summary-row">
                <span>{totalItems} artículo{totalItems !== 1 ? "s" : ""}</span>
                <span>{total.toLocaleString("es-BO")} Bs</span>
              </div>
              <div className="order-summary-row">
                <span>Envío</span>
                <span className="order-summary-free">Gratis</span>
              </div>
            </div>
            <div className="order-summary-total">
              <span>Total</span>
              <span>{total.toLocaleString("es-BO")} Bs</span>
            </div>
            <button
              className="order-summary-btn"
              disabled={items.length === 0 || loading}
              onClick={() => navigate("/pago", { state: { codigoPedido } })}
            >
              {loading ? <div className="order-summary-spinner"></div> : "INICIAR COMPRA →"}
            </button>
            <button
              className="order-summary-btn"
              onClick={cancelarPedido}
              disabled={loading || items.length === 0}
              style={{
                marginTop: "0.75rem",
                background: "#f1f5f9",
                color: "#64748b",
                border: "1px solid #cbd5e1",
                boxShadow: "none"
              }}
            >
              Cancelar pedido
            </button>
            <div className="order-summary-secure">🔒 Transacción 100% segura</div>
          </div>
        </div>
      </div>

      {/* Productos Disponibles */}
      <div className="productos-disponibles">
        <h2>Productos Disponibles</h2>
        {loadingProductos ? (
          <div className="productos-loading">
            <div className="spinner-lg"></div>
            <p>Cargando productos...</p>
          </div>
        ) : (
          <div className="productos-grid">
            {productosDisponibles
              .filter((pd) => pd.cantidadDisponible > 0 && pd.precio > 0)
              .map((pd) => {
                const enCarrito = items.find((i) => i.codigoProducto === pd.codigoProducto);
                const cantidadInput = cantidades[pd.codigoProducto] || 1;
                const stockRestante = pd.cantidadDisponible - (enCarrito?.cantidad || 0);

                return (
                  <div key={pd.codigoProducto} className="producto-card">
                    <div className="producto-card-image">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                    <div className="producto-card-info">
                      <h4>{pd.nombreProducto}</h4>
                      <p className="producto-card-marca" style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{pd.codigoProducto}</p>
                      <p className="producto-card-precio">{Number(pd.precio).toLocaleString("es-BO")} Bs</p>
                      <p className="producto-card-stock">
                        Stock: {pd.cantidadDisponible}
                        {enCarrito && <span style={{ color: "#0d7377", marginLeft: "0.4rem" }}>({enCarrito.cantidad} en carrito)</span>}
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
                      <input
                        type="number"
                        min="1"
                        max={stockRestante}
                        value={cantidadInput}
                        onChange={(e) => handleCantidadChange(pd.codigoProducto, parseInt(e.target.value) || 1)}
                        style={{ width: "55px", padding: "4px 6px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.9rem" }}
                      />
                      <button
                        className="producto-card-add"
                        style={{ flex: 1 }}
                        onClick={() => agregarProducto(pd, cantidadInput)}
                        disabled={loading || stockRestante <= 0}
                      >
                        {loading ? "..." : stockRestante <= 0 ? "Sin stock" : "+ Agregar"}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
