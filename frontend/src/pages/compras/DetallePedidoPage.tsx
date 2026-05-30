import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pedidoService } from "../../services/pedidoService";
import { detallePedidoService } from "../../services/detallePedidoService";
import type { PedidoDTO } from "../../types/compras";
import {
  ArrowLeft,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";

export default function DetallePedidoPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState<PedidoDTO | null>(null);
  const [detalles, setDetalles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetalles = async () => {
      if (!codigo) return;
      try {
        setLoading(true);
        // Primero obtener el pedido
        const pedidoData = await pedidoService.getByCodigo(codigo);
        setPedido(pedidoData);

        // Obtener los detalles completos del nuevo endpoint
        const detallesData = await detallePedidoService.getByPedido(codigo);
        setDetalles(detallesData);

      } catch (err: any) {
        setError(err.message || "Error al cargar los detalles del pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetalles();
  }, [codigo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a4f66]"></div>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-xl flex items-center gap-3">
        <AlertCircle size={24} />
        <div>
          <h3 className="font-bold">No se encontró el pedido</h3>
          <p className="text-sm opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pagado":
      case "entregado":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 font-bold text-sm uppercase tracking-wide rounded-full border border-green-200 w-fit">
            <CheckCircle2 size={16} />
            {status}
          </div>
        );
      case "pendiente":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 font-bold text-sm uppercase tracking-wide rounded-full border border-orange-200 w-fit">
            <Clock size={16} />
            {status}
          </div>
        );
      case "cancelado":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 font-bold text-sm uppercase tracking-wide rounded-full border border-red-200 w-fit">
            <AlertCircle size={16} />
            {status}
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 font-bold text-sm uppercase tracking-wide rounded-full border border-gray-200 w-fit">
            {status}
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/mis-pedidos")}
          className="p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#0a4f66]">
            Detalles del Pedido #{pedido.codigoPedido}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Realizado el {formatDate(pedido.fecha)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Cards */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Package className="text-[#0a4f66]" size={20} />
              Artículos en tu pedido
            </h2>
            
            <div className="space-y-4">
              {detalles.map((d) => (
                <div key={d.codigoProducto} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 shrink-0">
                     <Package className="text-gray-400" size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {d.nombreProducto || d.codigoProducto}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{d.descripcionProducto || "Producto"}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium text-gray-600">Cant: {d.cantidad}</span>
                      <span className="font-bold text-[#0a4f66]">${(d.subtotal ?? 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Resumen</h2>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  Fecha
                </span>
                <span className="font-medium text-gray-900">{formatDate(pedido.fecha)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CreditCard size={16} className="text-gray-400" />
                  Pago
                </span>
                <span className="font-medium text-gray-900">{pedido.codigoMetodoPago}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  Envío
                </span>
                <span className="font-medium text-gray-900">Estándar</span>
              </div>
            </div>

            <hr className="my-4 border-gray-100" />

            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-2xl font-black text-[#0a4f66]">${(pedido.total ?? 0).toFixed(2)}</span>
            </div>

            <div className="flex justify-center">
              {getStatusBadge(pedido.estadoPedido)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
