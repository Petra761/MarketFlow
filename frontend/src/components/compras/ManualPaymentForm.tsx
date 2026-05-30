import { useState } from "react";

interface ManualPaymentFormProps {
  total: number;
  methodName: string;
  onPagar: () => void;
  onVolver: () => void;
  onCancelar: () => void;
  loading?: boolean;
}

export default function ManualPaymentForm({
  total,
  methodName,
  onPagar,
  onVolver,
  onCancelar,
  loading = false,
}: ManualPaymentFormProps) {
  const isEfectivo = methodName.toLowerCase().includes("efectivo");

  return (
    <div className="card-payment-container" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <button className="back-link" onClick={onVolver}>
        ← Volver
      </button>

      <div style={{ textAlign: "center", padding: "2rem", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <div style={{ background: "#f1f5f9", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          {isEfectivo ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0d7377" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="12" cy="12" r="2" />
              <path d="M6 12h.01M18 12h.01" />
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0d7377" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="7" y1="15" x2="7.01" y2="15" />
              <line x1="11" y1="15" x2="13" y2="15" />
            </svg>
          )}
        </div>

        <h2 style={{ fontSize: "1.5rem", color: "#1e293b", marginBottom: "0.5rem" }}>
          Pago con {methodName}
        </h2>
        
        <p style={{ color: "#64748b", marginBottom: "2rem", lineHeight: "1.5" }}>
          {isEfectivo
            ? `Por favor ten preparado el monto exacto de ${total.toLocaleString("es-BO")} Bs. al momento de recibir tu pedido para agilizar la entrega.`
            : `Realiza una transferencia de ${total.toLocaleString("es-BO")} Bs. a la cuenta indicada abajo. Una vez validado el pago, procesaremos tu pedido.`}
        </p>

        {!isEfectivo && (
          <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "8px", border: "1px dashed #cbd5e1", marginBottom: "2rem", textAlign: "left" }}>
            <h3 style={{ fontSize: "0.9rem", textTransform: "uppercase", color: "#64748b", marginBottom: "1rem" }}>Datos de la cuenta</h3>
            <div style={{ marginBottom: "0.5rem" }}><strong>Banco:</strong> Banco Nacional de Bolivia</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Cuenta:</strong> 1000-2458-9844</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Titular:</strong> MarketFlow SRL</div>
            <div><strong>NIT:</strong> 8451294014</div>
          </div>
        )}

        <button
          className="pay-btn"
          style={{ width: "100%", padding: "1rem", fontSize: "1.1rem", marginBottom: "1rem" }}
          onClick={onPagar}
          disabled={loading}
        >
          {loading ? (
            <span className="pay-spinner"></span>
          ) : (
            isEfectivo ? "Confirmar pedido" : "Ya realicé la transferencia"
          )}
        </button>

        <button 
          className="pay-btn" 
          onClick={onCancelar} 
          style={{ 
            width: "100%", 
            background: "#f1f5f9", 
            color: "#64748b", 
            border: "1px solid #cbd5e1",
            boxShadow: "none"
          }}
        >
          Cancelar compra
        </button>
      </div>
    </div>
  );
}
