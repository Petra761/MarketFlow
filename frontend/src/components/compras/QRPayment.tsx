import { useState, useEffect } from "react";

interface QRPaymentProps {
  total: number;
  onPagar: () => void;
  onVolver: () => void;
  onCancelar: () => void;
  loading?: boolean;
}

export default function QRPayment({ total, onPagar, onVolver, onCancelar, loading = false }: QRPaymentProps) {
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="qr-payment-container">
      <button className="back-link" onClick={onVolver}>← Volver</button>
      <div className="qr-payment-content">
        <div className="qr-lock-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <h2 className="qr-title">Pago con Código QR</h2>
        <p className="qr-subtitle">
          Escanea el código desde tu aplicación bancaria para completar el pago de{" "}
          <strong>{total.toLocaleString("es-BO")} Bs.</strong>
        </p>
        <div className="qr-code-wrapper">
          <div className="qr-code-box">
            <svg width="180" height="180" viewBox="0 0 180 180">
              <rect width="180" height="180" fill="white" />
              <rect x="10" y="10" width="50" height="50" fill="#1a3a4a" />
              <rect x="15" y="15" width="40" height="40" fill="white" />
              <rect x="22" y="22" width="26" height="26" fill="#1a3a4a" />
              <rect x="120" y="10" width="50" height="50" fill="#1a3a4a" />
              <rect x="125" y="15" width="40" height="40" fill="white" />
              <rect x="132" y="22" width="26" height="26" fill="#1a3a4a" />
              <rect x="10" y="120" width="50" height="50" fill="#1a3a4a" />
              <rect x="15" y="125" width="40" height="40" fill="white" />
              <rect x="22" y="132" width="26" height="26" fill="#1a3a4a" />
              <rect x="70" y="10" width="8" height="8" fill="#1a3a4a" />
              <rect x="86" y="26" width="8" height="8" fill="#1a3a4a" />
              <rect x="102" y="42" width="8" height="8" fill="#1a3a4a" />
              <rect x="70" y="70" width="8" height="8" fill="#1a3a4a" />
              <rect x="86" y="70" width="8" height="8" fill="#1a3a4a" />
              <rect x="102" y="70" width="8" height="8" fill="#1a3a4a" />
              <rect x="120" y="70" width="8" height="8" fill="#1a3a4a" />
              <rect x="140" y="86" width="8" height="8" fill="#1a3a4a" />
              <rect x="120" y="120" width="8" height="8" fill="#1a3a4a" />
              <rect x="140" y="140" width="8" height="8" fill="#1a3a4a" />
              <rect x="160" y="160" width="8" height="8" fill="#1a3a4a" />
            </svg>
          </div>
        </div>
        <div className="qr-timer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
          </svg>
          <span>Expira en {formatTime(timeLeft)} minutos</span>
        </div>
        <button className="qr-confirm-btn" onClick={onPagar} disabled={loading || timeLeft === 0}>
          {loading ? <span className="pay-spinner"></span> : "Ya realicé el pago"}
        </button>
        <button 
          className="qr-confirm-btn" 
          style={{ 
            background: "#f1f5f9", 
            color: "#64748b", 
            border: "1px solid #cbd5e1",
            boxShadow: "none"
          }}
          onClick={onCancelar}
        >
          Cancelar
        </button>
        <p className="qr-help-link">¿Tienes problemas con el escaneo? <a href="#">Solicitar ayuda</a></p>
      </div>
    </div>
  );
}
