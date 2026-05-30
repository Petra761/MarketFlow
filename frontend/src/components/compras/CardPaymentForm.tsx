import { useState } from "react";

interface CardPaymentFormProps {
  total: number;
  onPagar: () => void;
  onVolver: () => void;
  onCancelar: () => void;
  loading?: boolean;
}

export default function CardPaymentForm({
  total,
  onPagar,
  onVolver,
  onCancelar,
  loading = false,
}: CardPaymentFormProps) {
  const [nombre, setNombre] = useState("");
  const [numero, setNumero] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return digits.slice(0, 2) + "/" + digits.slice(2);
    }
    return digits;
  };

  const getMaskedNumber = () => {
    const digits = numero.replace(/\D/g, "");
    if (digits.length === 0) return "•••• •••• •••• ••••";
    const padded = digits.padEnd(16, "•");
    return `${padded.slice(0, 4)} ${padded.slice(4, 8)} ${padded.slice(8, 12)} ${padded.slice(12, 16)}`;
  };

  return (
    <div className="card-payment-container">
      <button className="back-link" onClick={onVolver}>
        ← Volver
      </button>

      <div className="card-payment-layout">
        {/* Left side - Card preview */}
        <div className="card-preview-section">
          <h2 className="card-form-title">Información de Tarjeta</h2>
          <p className="card-form-subtitle">
            Complete los detalles de su tarjeta VISA para procesar el pago de forma segura.
          </p>

          <div className="credit-card-visual">
            <div className="card-chip">
              <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
                <rect width="36" height="28" rx="4" fill="rgba(255,255,255,0.3)" />
                <rect x="4" y="6" width="12" height="8" rx="2" fill="rgba(255,255,255,0.5)" />
                <rect x="8" y="14" width="8" height="8" rx="2" fill="rgba(255,255,255,0.3)" />
              </svg>
            </div>
            <div className="card-brand">Visa</div>
            <div className="card-number-display">{getMaskedNumber()}</div>
            <div className="card-bottom-row">
              <div>
                <span className="card-label">CARD HOLDER</span>
                <span className="card-holder-name">
                  {nombre || "NOMBRE APELLIDO"}
                </span>
              </div>
              <div>
                <span className="card-label">EXPIRES</span>
                <span className="card-expiry-display">
                  {vencimiento || "MM/YY"}
                </span>
              </div>
            </div>
          </div>

          <div className="encrypted-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d7377" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <strong>Transacción Encriptada</strong>
              <p>Sus datos están protegidos por seguridad de nivel bancario (AES-256).</p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="card-form-section">
          <div className="form-group">
            <label>Nombre del titular</label>
            <input
              type="text"
              placeholder="Ej. Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Número de tarjeta</label>
            <div className="input-with-icon">
              <input
                type="text"
                placeholder="4000 0000 0000 0000"
                value={numero}
                onChange={(e) => setNumero(formatCardNumber(e.target.value))}
                maxLength={19}
              />
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="4" width="22" height="16" rx="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Vencimiento (MM/YY)</label>
              <input
                type="text"
                placeholder="12/26"
                value={vencimiento}
                onChange={(e) => setVencimiento(formatExpiry(e.target.value))}
                maxLength={5}
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <div className="input-with-icon">
                <input
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                />
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </div>
            </div>
          </div>

          <button
            className="pay-btn"
            onClick={onPagar}
            disabled={loading || !nombre || !numero || !vencimiento || !cvv}
          >
            {loading ? (
              <span className="pay-spinner"></span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Pagar
              </>
            )}
          </button>

          <button 
            className="pay-btn" 
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

          <p className="terms-text">
            Al hacer clic en pagar, aceptas nuestros{" "}
            <a href="#">Términos de Servicio</a> y{" "}
            <a href="#">Política de Privacidad</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
