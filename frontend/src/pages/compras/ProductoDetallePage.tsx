import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Phone,
  Package,
  BadgeCheck,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { productoService } from "../../services/productoService";
import { useCarritoActivo } from "../../hooks/useCarritoActivo";

interface ProductoDetalle {
  codigoProducto: string;
  nombre: string;
  descripcion: string;
  marca: string;
  estadoProducto: string;
  nombreCategoria?: string;
  imagen?: string | null;
  precio?: number | null;
  stockActual?: number | null;
  telefonoContacto?: string | null;
}

export default function ProductoDetallePage() {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const { items, loading: loadingCarrito, agregarProducto } = useCarritoActivo();

  const [producto, setProducto] = useState<ProductoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  // Para el "slider" de imagen (si en el futuro hubiera varias)
  const [imgIdx] = useState(0);

  useEffect(() => {
    if (!codigo) return;
    setLoading(true);
    productoService
      .getByCodigo(codigo)
      .then((data) => {
        // El backend devuelve PascalCase desde la serialización
        const raw = data as Record<string, unknown>;
        setProducto({
          codigoProducto: (raw.codigoProducto as string) ?? "",
          nombre: (raw.nombre as string) ?? "",
          descripcion: (raw.descripcion as string) ?? "",
          marca: (raw.marca as string) ?? "",
          estadoProducto: (raw.estadoProducto as string) ?? "",
          imagen: (raw.imagen as string | null) ?? null,
          precio: (raw.precio as number | null) ?? null,
          stockActual: (raw.stockActual as number | null) ?? null,
          telefonoContacto: (raw.telefonoContacto as string | null) ?? null,
        });
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [codigo]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a4f66]" />
      </div>
    );

  if (error || !producto)
    return (
      <div className="text-center py-20 text-gray-500">
        <Package size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="font-semibold">{error ?? "Producto no encontrado"}</p>
        <button
          onClick={() => navigate("/catalogo")}
          className="mt-4 text-[#0a4f66] underline text-sm"
        >
          Volver al catálogo
        </button>
      </div>
    );

  const enCarrito = items.find((i) => i.codigoProducto === producto.codigoProducto);
  const stockRestante = (producto.stockActual ?? 0) - (enCarrito?.cantidad ?? 0);
  const precio = producto.precio ?? 0;
  const imagenes = producto.imagen ? [producto.imagen] : [];

  const handleAgregar = async () => {
    await agregarProducto(
      {
        codigoProducto: producto.codigoProducto,
        nombreProducto: producto.nombre,
        precio,
        cantidadDisponible: producto.stockActual ?? 0,
        imagen: producto.imagen,
      } as Parameters<typeof agregarProducto>[0],
      cantidad
    );
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
    setCantidad(1);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[#0a4f66] text-sm font-medium hover:underline mb-6"
      >
        <ArrowLeft size={16} />
        Volver
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* ── LEFT: Imagen ── */}
          <div className="md:w-1/2 bg-gray-50 flex flex-col items-center justify-center p-8 min-h-72">
            {imagenes.length > 0 ? (
              <div className="relative w-full">
                <img
                  src={imagenes[imgIdx]}
                  alt={producto.nombre}
                  className="w-full max-h-80 object-contain rounded-xl"
                />
                {imagenes.length > 1 && (
                  <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
                    <button className="bg-white rounded-full shadow p-1">
                      <ChevronLeft size={18} className="text-gray-600" />
                    </button>
                    <button className="bg-white rounded-full shadow p-1">
                      <ChevronRight size={18} className="text-gray-600" />
                    </button>
                  </div>
                )}
                {/* Dots */}
                {imagenes.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-3">
                    {imagenes.map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${i === imgIdx ? "bg-[#0a4f66]" : "bg-gray-300"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Package size={96} className="text-gray-200" />
            )}
          </div>

          {/* ── RIGHT: Info ── */}
          <div className="md:w-1/2 p-8 flex flex-col gap-5">
            {/* Marca / categoría */}
            <div>
              <span className="text-xs font-bold text-[#0a4f66] uppercase tracking-widest">
                {producto.marca}
              </span>
              <h1 className="text-2xl font-extrabold text-gray-900 mt-1 leading-tight">
                {producto.nombre}
              </h1>
            </div>

            {/* Precio */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-[#0a4f66]">
                {Number(precio).toLocaleString("es-BO")} Bs
              </span>
            </div>

            {/* Estado / Stock */}
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-gray-400 uppercase text-[10px] font-bold tracking-wider mb-0.5">Estado</p>
                <p className="font-semibold text-gray-800">{producto.estadoProducto || "—"}</p>
              </div>
              <div>
                <p className="text-gray-400 uppercase text-[10px] font-bold tracking-wider mb-0.5">Disponibilidad</p>
                <p className={`font-semibold ${stockRestante <= 5 ? "text-red-500" : "text-emerald-600"}`}>
                  {stockRestante <= 0
                    ? "Sin stock"
                    : `Quedan ${stockRestante} disponibles`}
                </p>
              </div>
            </div>

            {/* Descripción */}
            {producto.descripcion && (
              <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                {producto.descripcion}
              </p>
            )}

            {/* Teléfono de contacto */}
            {producto.telefonoContacto && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone size={15} className="text-[#0a4f66] shrink-0" />
                <span>
                  Contacto:{" "}
                  <a
                    href={`tel:${producto.telefonoContacto}`}
                    className="font-semibold text-[#0a4f66] hover:underline"
                  >
                    {producto.telefonoContacto}
                  </a>
                </span>
              </div>
            )}

            {/* Cantidad + Añadir */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  disabled={cantidad <= 1}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-30 font-bold text-lg transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-3 text-base font-bold text-gray-800 min-w-[44px] text-center">
                  {cantidad}
                </span>
                <button
                  onClick={() => setCantidad((c) => Math.min(stockRestante, c + 1))}
                  disabled={cantidad >= stockRestante}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-30 font-bold text-lg transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAgregar}
                disabled={loadingCarrito || stockRestante <= 0 || agregado}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl text-sm transition-all ${
                  agregado
                    ? "bg-emerald-500 text-white"
                    : stockRestante <= 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#0a4f66] hover:bg-[#07384a] text-white"
                }`}
              >
                <ShoppingCart size={16} />
                {agregado ? "¡Añadido!" : stockRestante <= 0 ? "Sin stock" : "Añadir a Carrito"}
              </button>
            </div>

            {/* Badges */}
            <div className="flex gap-4 pt-2 text-xs text-gray-500 border-t border-gray-100">
              <span className="flex items-center gap-1.5">
                <BadgeCheck size={14} className="text-emerald-500" />
                Garantía MarketFlow
              </span>
              <span className="flex items-center gap-1.5">
                <Truck size={14} className="text-blue-500" />
                Envío rápido
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
