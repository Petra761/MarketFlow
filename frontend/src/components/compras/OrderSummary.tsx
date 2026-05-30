interface OrderSummaryProps {
  subtotal: number;
  envio?: number;
  impuestos?: number;
  total: number;
  buttonText?: string;
  onAction?: () => void;
  secondaryButtonText?: string;
  onSecondaryAction?: () => void;
  loading?: boolean;
  showProtection?: boolean;
}

export default function OrderSummary({
  subtotal,
  envio = 0,
  impuestos = 0,
  total,
  buttonText = "INICIAR COMPRA",
  onAction,
  secondaryButtonText,
  onSecondaryAction,
  loading = false,
  showProtection = false,
}: OrderSummaryProps) {
  return (
    <div className="order-summary">
      <h3 className="order-summary-title">Resumen de Pedido</h3>

      <div className="order-summary-rows">
        <div className="order-summary-row">
          <span>Subtotal</span>
          <span>{total.toLocaleString("es-BO")} Bs</span>
        </div>
        <div className="order-summary-row">
          <span>Envío</span>
          <span className="order-summary-free">
            {envio === 0 ? "Gratis" : `${envio.toLocaleString("es-BO")} Bs`}
          </span>
        </div>
        <div className="order-summary-row">
          <span>Impuestos</span>
          <span>{impuestos} Bs</span>
        </div>
      </div>

      <div className="order-summary-total">
        <span>Total</span>
        <span>{total.toLocaleString("es-BO")} Bs</span>
      </div>

      <button
        className="order-summary-btn"
        onClick={onAction}
        disabled={loading || total === 0}
        style={{ marginBottom: secondaryButtonText ? "0.5rem" : "1rem" }}
      >
        {loading ? (
          <span className="order-summary-spinner"></span>
        ) : (
          buttonText
        )}
      </button>

      {secondaryButtonText && onSecondaryAction && (
        <button
          className="order-summary-btn"
          onClick={onSecondaryAction}
          disabled={loading}
          style={{ 
            background: "#f1f5f9", 
            color: "#64748b", 
            border: "1px solid #cbd5e1",
            boxShadow: "none",
            marginBottom: "1rem"
          }}
        >
          {secondaryButtonText}
        </button>
      )}

      <p className="order-summary-secure">
        Pagos seguros procesados por MarketFlow
      </p>

      {showProtection && (
        <div className="order-summary-protection">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d7377" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <span>Protección al comprador MarketFlow activa.</span>
        </div>
      )}
    </div>
  );
}
