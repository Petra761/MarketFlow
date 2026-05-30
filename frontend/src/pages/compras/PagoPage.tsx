import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMetodosPago } from "../../hooks/useMetodosPago";
import { useCarritoActivo } from "../../hooks/useCarritoActivo";
import { pedidoService } from "../../services/pedidoService";
import OrderSummary from "../../components/compras/OrderSummary";
import PaymentMethodSelector from "../../components/compras/PaymentMethodSelector";
import CardPaymentForm from "../../components/compras/CardPaymentForm";
import QRPayment from "../../components/compras/QRPayment";
import ManualPaymentForm from "../../components/compras/ManualPaymentForm";
import SuccessScreen from "../../components/compras/SuccessScreen";

type PagoStep = "seleccion" | "tarjeta" | "qr" | "manual" | "exito";

export default function PagoPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // El codigoPedido viene del estado de navegación (pasado desde CarritoPage)
  const codigoPedidoDesdeCarrito = (location.state as any)?.codigoPedido as string | null;

  const { metodosPago } = useMetodosPago();
  const { total, items, limpiarPedido } = useCarritoActivo();

  const [step, setStep] = useState<PagoStep>("seleccion");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorPago, setErrorPago] = useState<string | null>(null);

  const [finalTotal, setFinalTotal] = useState(0);

  // El codigoPedido activo
  const codigoPedido = codigoPedidoDesdeCarrito;

  // Mapear métodos de pago al formato del selector visual
  const methodsForSelector = metodosPago.map((m) => {
    const lower = m.nombre.toLowerCase();
    let description = "";
    if (lower.includes("qr")) {
      description = "Genera un código QR dinámico para pagar desde tu app bancaria.";
    } else if (lower.includes("tarjeta") || lower.includes("crédito")) {
      description = "Paga con tu tarjeta de crédito o débito.";
    } else {
      description = `Paga con ${m.nombre}`;
    }
    return { id: m.codigoMetodoPago, name: m.nombre, description };
  });

  /**
   * Confirmar el pedido y avanzar al formulario de pago.
   */
  const handleConfirmar = async () => {
    if (!selectedMethod || !codigoPedido || items.length === 0) return;
    setLoading(true);
    setErrorPago(null);

    try {
      // 1. Actualizar el pedido con el método de pago seleccionado
      const today = new Date().toISOString().split("T")[0];
      await pedidoService.update(codigoPedido, {
        codigoUsuario: "U1",
        codigoMetodoPago: selectedMethod,
        codigoPedido: codigoPedido,
        fecha: today,
        estadoPedido: "Pendiente",
      });

      // 2. Redirigir a la pantalla de pago correspondiente
      const metodo = metodosPago.find((m) => m.codigoMetodoPago === selectedMethod);
      const nombre = metodo?.nombre.toLowerCase() || "";
      if (nombre.includes("qr")) {
        setStep("qr");
      } else if (nombre.includes("efectivo") || nombre.includes("transferencia")) {
        setStep("manual");
      } else {
        setStep("tarjeta");
      }
    } catch (err: any) {
      setErrorPago(`Error al confirmar el pedido: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePagar = async () => {
    if (!codigoPedido) return;
    setLoading(true);
    setErrorPago(null);
    try {
      setFinalTotal(total); // Guardamos el total antes de limpiar el carrito
      
      // Confirmar reserva de stock justo antes de pagar
      await pedidoService.confirmar(codigoPedido);
      
      // Marcar como pagado
      await pedidoService.pagar(codigoPedido);
      
      limpiarPedido(); // Limpia el pedido activo del localStorage
      setStep("exito");
    } catch (err: any) {
      setErrorPago(`Error al procesar el pago: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async () => {
    if (codigoPedido) {
      try {
        await pedidoService.cancelar(codigoPedido);
        limpiarPedido();
      } catch {
        // Si falla, igual redirigimos
      }
    }
    navigate("/carrito");
  };

  const handleVolver = () => {
    // Si queremos volver a la selección de método, no cancelamos el pedido
    // Solo cambiamos la vista, ya que el pedido sigue en estado Pendiente
    setStep("seleccion");
  };

  // ─── Pantallas según el step ────────────────────────────────────────────────

  if (step === "exito") {
    return (
      <SuccessScreen
        total={finalTotal}
        onVolverTienda={() => navigate("/catalogo")}
        onVerPedidos={() => navigate("/mis-pedidos")}
      />
    );
  }

  if (step === "tarjeta") {
    return (
      <CardPaymentForm
        total={total}
        onPagar={handlePagar}
        onVolver={handleVolver}
        onCancelar={handleCancelar}
        loading={loading}
      />
    );
  }

  if (step === "qr") {
    return (
      <QRPayment
        total={total}
        onPagar={handlePagar}
        onVolver={handleVolver}
        onCancelar={handleCancelar}
        loading={loading}
      />
    );
  }

  if (step === "manual") {
    const selectedMethodName = metodosPago.find(m => m.codigoMetodoPago === selectedMethod)?.nombre || "Manual";
    return (
      <ManualPaymentForm
        total={total}
        methodName={selectedMethodName}
        onPagar={handlePagar}
        onVolver={handleVolver}
        onCancelar={handleCancelar}
        loading={loading}
      />
    );
  }

  // ─── Selección de método de pago ────────────────────────────────────────────
  return (
    <div className="pago-page">
      <h1 className="pago-title">Selecciona tu método de pago</h1>

      {errorPago && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#dc2626", fontSize: "0.9rem" }}>
          ⚠️ {errorPago}
        </div>
      )}

      {codigoPedido && (
        <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "1rem", fontFamily: "monospace" }}>
          Pedido activo: {codigoPedido}
        </p>
      )}

      <div className="pago-layout">
        <div className="pago-methods-section">
          <PaymentMethodSelector
            methods={methodsForSelector}
            selected={selectedMethod}
            onSelect={setSelectedMethod}
          />
          <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "1rem" }}>
            <button className="back-link" onClick={() => navigate("/carrito")}>
              ← Regresar al carrito
            </button>
          </div>
        </div>

        <div className="pago-summary-section">
          <OrderSummary
            subtotal={total}
            total={total}
            buttonText="Confirmar y Pagar"
            onAction={handleConfirmar}
            secondaryButtonText="Cancelar compra"
            onSecondaryAction={handleCancelar}
            loading={loading}
            showProtection={true}
          />
          <p className="secure-text" style={{ marginTop: "1rem" }}>Transacción segura y encriptada</p>
        </div>
      </div>
    </div>
  );
}
