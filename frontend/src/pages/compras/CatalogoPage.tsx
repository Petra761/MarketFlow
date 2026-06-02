import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useProductosDisponibles } from "../../hooks/useProductos";
import { useCarritoActivo } from "../../hooks/useCarritoActivo";
import { ShoppingCart, SlidersHorizontal, ChevronDown, Package } from "lucide-react";
import { categoriaService } from "../../services/categoriaService";
import type { Categoria } from "../../services/categoriaService";

export default function CatalogoPage() {
  const [searchParams] = useSearchParams();
  const busqueda = searchParams.get("q") || "";

  const { productosDisponibles, loading: loadingProductos } = useProductosDisponibles();
  const { items, loading, agregarProducto } = useCarritoActivo();

  // Filtros
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos los productos");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [ordenar, setOrdenar] = useState("recientes");
  
  const [categoriasDb, setCategoriasDb] = useState<Categoria[]>([]);

  useEffect(() => {
    categoriaService.getAll().then(setCategoriasDb).catch(console.error);
  }, []);

  const categorias = useMemo(() => {
    return ["Todos los productos", ...categoriasDb.map(c => c.nombre)];
  }, [categoriasDb]);

  const categoriaCount = useMemo(() => {
    const counts: Record<string, number> = { "Todos los productos": productosDisponibles.length };
    productosDisponibles.forEach((p) => {
      if (p.nombreCategoria) {
        counts[p.nombreCategoria] = (counts[p.nombreCategoria] || 0) + 1;
      }
    });
    return counts;
  }, [productosDisponibles]);

  const productosFiltrados = useMemo(() => {
    let lista = productosDisponibles.filter((p) => p.cantidadDisponible > 0 && (p.precio ?? 0) > 0);

    if (categoriaSeleccionada !== "Todos los productos") {
      lista = lista.filter((p) => p.nombreCategoria === categoriaSeleccionada);
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      lista = lista.filter(
        (p) =>
          p.nombreProducto.toLowerCase().includes(q) ||
          p.descripcion?.toLowerCase().includes(q)
      );
    }
    if (precioMin !== "") {
      lista = lista.filter((p) => (p.precio ?? 0) >= Number(precioMin));
    }
    if (precioMax !== "") {
      lista = lista.filter((p) => (p.precio ?? 0) <= Number(precioMax));
    }

    if (ordenar === "precio_asc") lista = [...lista].sort((a, b) => (a.precio ?? 0) - (b.precio ?? 0));
    if (ordenar === "precio_desc") lista = [...lista].sort((a, b) => (b.precio ?? 0) - (a.precio ?? 0));

    return lista;
  }, [productosDisponibles, categoriaSeleccionada, busqueda, precioMin, precioMax, ordenar]);

  const handleCantidad = (codigo: string, val: number) => {
    setCantidades((prev) => ({ ...prev, [codigo]: Math.max(1, val) }));
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">

      <div className="flex max-w-7xl mx-auto px-4 py-6 gap-6">
        {/* Sidebar Filtros */}
        <aside className="w-52 shrink-0 hidden md:block space-y-6">
          {/* Categorías */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <SlidersHorizontal size={14} />
              Filtrar Productos
            </h3>
            <ul className="space-y-1">
              {categorias.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setCategoriaSeleccionada(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                      categoriaSeleccionada === cat
                        ? "bg-[#0a4f66] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${categoriaSeleccionada === cat ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                      {categoriaCount[cat] ?? 0}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Rango de Precio */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Rango de Precio</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                min="0"
                placeholder="Mínimo"
                value={precioMin}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPrecioMin(val < 0 ? "0" : e.target.value);
                }}
                className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a4f66]"
              />
              <input
                type="number"
                min="0"
                placeholder="Máximo"
                value={precioMax}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPrecioMax(val < 0 ? "0" : e.target.value);
                }}
                className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a4f66]"
              />
            </div>
            <button
              onClick={() => { setPrecioMin(""); setPrecioMax(""); }}
              className="w-full bg-[#0a4f66] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#07384a] transition-colors"
            >
              Aplicar Filtro
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header área */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Gana dinero comprando hoy</h1>
              <p className="text-sm text-gray-500 mt-1">Explora ofertas exclusivas seleccionadas para ti.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">Ordenar por:</span>
              <div className="relative">
                <select
                  value={ordenar}
                  onChange={(e) => setOrdenar(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0a4f66] cursor-pointer"
                >
                  <option value="recientes">Más recientes</option>
                  <option value="precio_asc">Menor precio</option>
                  <option value="precio_desc">Mayor precio</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {loadingProductos ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a4f66]"></div>
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 mt-6">
              <Package className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-bold text-gray-700">No se encontraron productos</h3>
              <p className="text-gray-500 mt-2 text-sm">
                {categoriaSeleccionada !== "Todos los productos" && (categoriaCount[categoriaSeleccionada] || 0) === 0
                  ? "No hay productos en esta categoría."
                  : "Intenta con otros filtros o categorías."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {productosFiltrados.map((pd) => {
                const enCarrito = items.find((i) => i.codigoProducto === pd.codigoProducto);
                const cantidadInput = cantidades[pd.codigoProducto] ?? 1;
                const stockRestante = pd.cantidadDisponible - (enCarrito?.cantidad ?? 0);

                return (
                  <div
                    key={pd.codigoProducto}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <Link
                      to={`/catalogo/${pd.codigoProducto}`}
                      className="relative h-44 bg-gray-100 flex items-center justify-center overflow-hidden block"
                    >
                      {pd.imagen ? (
                        <img
                          src={pd.imagen}
                          alt={pd.nombreProducto}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Package className="text-gray-300" size={52} />
                      )}
                      <span className="absolute top-2 right-2 bg-[#0a4f66] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {Number(pd.precio).toLocaleString("es-BO")} Bs
                      </span>
                    </Link>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-[#0a4f66] uppercase tracking-wider">{pd.nombreCategoria}</span>
                        <span className={`text-[10px] font-bold ${stockRestante <= 5 ? "text-red-500" : "text-gray-400"}`}>
                          Stock: {stockRestante}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{pd.nombreProducto}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{pd.descripcion}</p>

                      {/* Cantidad + Añadir */}
                      <div className="flex items-center gap-2 mt-auto">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleCantidad(pd.codigoProducto, cantidadInput - 1)}
                            disabled={cantidadInput <= 1}
                            className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30 font-bold text-sm transition-colors"
                          >
                            −
                          </button>
                          <span className="px-2 py-1.5 text-sm font-semibold text-gray-800 min-w-[28px] text-center">
                            {cantidadInput}
                          </span>
                          <button
                            onClick={() => handleCantidad(pd.codigoProducto, cantidadInput + 1)}
                            disabled={cantidadInput >= stockRestante}
                            className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30 font-bold text-sm transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="flex-1 flex items-center justify-center gap-1.5 bg-[#0a4f66] hover:bg-[#07384a] text-white font-bold text-sm py-2 rounded-lg transition-colors disabled:opacity-50"
                          disabled={loading || stockRestante <= 0 || cantidadInput <= 0}
                          onClick={() => {
                            agregarProducto(pd as any, cantidadInput);
                            handleCantidad(pd.codigoProducto, 1);
                          }}
                        >
                          <ShoppingCart size={14} />
                          {stockRestante <= 0 ? "Sin stock" : "Añadir"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

    </div>
  );
}
