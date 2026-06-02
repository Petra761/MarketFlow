interface SuccessScreenProps {
  total: number;
  onVolverTienda: () => void;
  onVerPedidos: () => void;
}

export default function SuccessScreen({ total, onVolverTienda, onVerPedidos }: SuccessScreenProps) {
  return (
    <div className="success-container">
      <div className="success-confetti" />
      <div className="success-content">
        <div className="success-icon-wrapper">
          <div className="success-icon-circle">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0d7377" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <h1 className="success-title">¡Compra Exitosa!</h1>
        <p className="success-subtitle">
          Tu pedido ha sido procesado correctamente.<br />
          Recibirás un correo de confirmación en breve con todos los detalles de tu entrega.
        </p>
        <div className="success-total-box">
          <span>Total Pagado</span>
          <span className="success-total-amount">{total.toLocaleString("es-BO")} Bs.</span>
        </div>
        <button className="success-btn-primary" onClick={onVolverTienda}>
          Volver a la tienda →
        </button>
        <button className="success-btn-secondary" onClick={onVerPedidos}>
          Ver mis pedidos
        </button>
      </div>
    </div>
  );
}
