import { useState } from "react";
import { useHistorialCompras } from "../../hooks/useHistorialCompras";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  AlertCircle,
  Filter,
  ChevronDown,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function HistorialComprasPage() {
  const { pedidos, loading, error } = useHistorialCompras();
  const navigate = useNavigate();

  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroTiempo, setFiltroTiempo] = useState("Todos");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-xl flex items-center gap-3">
        <AlertCircle size={24} />
        <div>
          <h3 className="font-bold">No pudimos cargar tu historial</h3>
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
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 font-bold text-xs uppercase tracking-wide rounded-full border border-green-200">
            <CheckCircle2 size={14} />
            {status}
          </div>
        );
      case "pendiente":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 font-bold text-xs uppercase tracking-wide rounded-full border border-orange-200">
            <Clock size={14} />
            {status}
          </div>
        );
      case "cancelado":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 font-bold text-xs uppercase tracking-wide rounded-full border border-red-200">
            <AlertCircle size={14} />
            {status}
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wide rounded-full border border-gray-200">
            {status}
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Agregando offset para evitar problemas de zona horaria si la BD devuelve DateOnly
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    // Filtro por Estado (Categoría de pedido)
    if (
      filtroEstado !== "Todos" &&
      pedido.estadoPedido.toLowerCase() !== filtroEstado.toLowerCase()
    ) {
      return false;
    }

    // Filtro por Tiempo
    if (filtroTiempo !== "Todos") {
      const fechaPedido = new Date(pedido.fecha);
      // Ajustar la fecha por zona horaria
      fechaPedido.setMinutes(fechaPedido.getMinutes() + fechaPedido.getTimezoneOffset());
      const hoy = new Date();

      if (filtroTiempo === "30_dias") {
        const treintaDiasAtras = new Date();
        treintaDiasAtras.setDate(hoy.getDate() - 30);
        if (fechaPedido < treintaDiasAtras) return false;
      }

      if (filtroTiempo === "3_meses") {
        const tresMesesAtras = new Date();
        tresMesesAtras.setMonth(hoy.getMonth() - 3);
        if (fechaPedido < tresMesesAtras) return false;
      }

      if (filtroTiempo === "este_anio") {
        if (fechaPedido.getFullYear() !== hoy.getFullYear()) return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0a4f66]">Mis Compras</h1>
          <p className="text-gray-500 mt-1">
            Revisa el estado de tus pedidos y vuelve a comprar tus favoritos.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="appearance-none w-full flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold px-4 py-2 pr-10 rounded-lg shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0a4f66] cursor-pointer"
            >
              <option value="Todos">Todas las categorías</option>
              <option value="Pagado">Pagados</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Confirmado">Confirmados</option>
              <option value="Entregado">Entregados</option>
              <option value="Cancelado">Cancelados</option>
            </select>
            <Filter
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={filtroTiempo}
              onChange={(e) => setFiltroTiempo(e.target.value)}
              className="appearance-none w-full flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold px-4 py-2 pr-10 rounded-lg shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0a4f66] cursor-pointer"
            >
              <option value="Todos">Todo el tiempo</option>
              <option value="30_dias">Últimos 30 días</option>
              <option value="3_meses">Últimos 3 meses</option>
              <option value="este_anio">Este año</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {pedidosFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center mt-8">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="text-blue-400" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Aún no tienes compras
          </h2>
          <p className="text-gray-500 mb-6">
            Explora nuestro catálogo y descubre los mejores productos.
          </p>
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 bg-[#0a4f66] hover:bg-[#07384a] text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Ir al Catálogo
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 mt-6">
          {pedidosFiltrados.map((pedido) => {
            const firstProduct =
              pedido.productos && pedido.productos.length > 0
                ? pedido.productos[0]
                : null;
            const extraProducts =
              pedido.productos && pedido.productos.length > 1
                ? pedido.productos.length - 1
                : 0;

            return (
              <div
                key={pedido.codigoPedido}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Upper Section */}
                <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 gap-4">
                  <div className="flex items-center gap-12">
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 tracking-wider mb-0.5">
                        FECHA DE COMPRA
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatDate(pedido.fecha)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 tracking-wider mb-0.5">
                        TOTAL
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        ${pedido.total.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 tracking-wider mb-0.5">
                        PEDIDO
                      </span>
                      <span className="text-sm font-semibold text-[#0a4f66]">
                        #{pedido.codigoPedido}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getStatusBadge(pedido.estadoPedido)}
                  </div>
                </div>

                {/* Lower Section */}
                <div className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    {/* Image */}
                    <div className="relative flex items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden shrink-0 z-10">
                        {firstProduct?.imagenProducto ? (
                          <img
                            src={firstProduct.imagenProducto}
                            alt={firstProduct.nombreProducto}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="text-gray-400" size={24} />
                        )}
                      </div>
                      {extraProducts > 0 && (
                        <div className="w-16 h-16 bg-blue-50 text-blue-700 font-bold rounded-lg flex items-center justify-center border border-blue-100 shrink-0 -ml-4 z-0">
                          +{extraProducts}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0a4f66]">
                        {firstProduct?.nombreProducto || "Varios productos"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {extraProducts > 0
                          ? `Y ${extraProducts} producto${
                              extraProducts > 1 ? "s" : ""
                            } más`
                          : "Vendido por MarketFlow Tech"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => navigate(`/mis-pedidos/${pedido.codigoPedido}`)}
                      className="border border-[#0a4f66] text-[#0a4f66] font-semibold text-sm px-6 py-2 rounded-lg hover:bg-[#0a4f66] hover:text-white transition-colors"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
