import type { CartItem } from "../../types/compras";

interface CartItemCardProps {
  item: CartItem;
  onUpdateCantidad: (codigoProducto: string, cantidad: number) => void;
  onEliminar: (codigoProducto: string) => void;
}

export default function CartItemCard({
  item,
  onUpdateCantidad,
  onEliminar,
}: CartItemCardProps) {
  return (
    <div className="cart-item-card">
      <div className="cart-item-image">
        <div className="cart-item-image-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      </div>

      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.nombreProducto}</h3>
        <p className="cart-item-desc">{item.marca}</p>

        <div className="cart-item-qty">
          <button
            className="qty-btn"
            onClick={() =>
              onUpdateCantidad(item.codigoProducto, item.cantidad - 1)
            }
            disabled={item.cantidad <= 1}
          >
            −
          </button>
          <span className="qty-value">{item.cantidad}</span>
          <button
            className="qty-btn"
            onClick={() =>
              onUpdateCantidad(item.codigoProducto, item.cantidad + 1)
            }
            disabled={item.cantidad >= item.stockDisponible}
          >
            +
          </button>
        </div>
      </div>

      <div className="cart-item-pricing">
        <span className="cart-item-unit-label">Precio Unitario</span>
        <span className="cart-item-unit-price">
          {item.precioUnitario.toLocaleString("es-BO")} Bs
        </span>
        <span className="cart-item-subtotal">
          {item.subtotal.toLocaleString("es-BO")} Bs
        </span>
      </div>

      <button
        className="cart-item-delete"
        onClick={() => onEliminar(item.codigoProducto)}
        title="Eliminar del carrito"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
    </div>
  );
}
