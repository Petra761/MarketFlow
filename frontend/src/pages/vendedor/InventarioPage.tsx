import { useMemo, useState } from "react";

import AddProductCard from "../../components/AddProductCard";

import SellerProductCard from "../../components/SellerProductCard";

import { useAuth } from "../../hooks/useAuth";

import { useMisProductos } from "../../hooks/useMisProductos";

import { productoService } from "../../services/productoService";



const STOCK_BAJO_UMBRAL = 5;



type Tab = "todos" | "stock-bajo" | "agotados";



export default function InventarioPage() {

  const { user } = useAuth();

  const codigoUsuario = user?.codigoUsuario;

  const { productos, loading, error, refetch } = useMisProductos(codigoUsuario);

  const [tab, setTab] = useState<Tab>("todos");

  const [deleting, setDeleting] = useState<string | null>(null);



  const stats = useMemo(() => {

    const stockBajo = productos.filter(

      (p) => p.stockActual > 0 && p.stockActual <= STOCK_BAJO_UMBRAL

    ).length;

    const agotados = productos.filter((p) => p.stockActual <= 0).length;

    const unidades = productos.reduce((sum, p) => sum + p.stockActual, 0);

    return { stockBajo, agotados, unidades };

  }, [productos]);



  const filtrados = useMemo(() => {

    if (tab === "stock-bajo") {

      return productos.filter(

        (p) => p.stockActual > 0 && p.stockActual <= STOCK_BAJO_UMBRAL

      );

    }

    if (tab === "agotados") {

      return productos.filter((p) => p.stockActual <= 0);

    }

    return productos;

  }, [productos, tab]);



  const handleDelete = async (codigo: string) => {

    if (!codigoUsuario) return;

    if (!confirm("¿Eliminar este producto? (Eliminación lógica)")) return;



    try {

      setDeleting(codigo);

      await productoService.eliminar(codigo, codigoUsuario);

      await refetch();

    } catch (err) {

      alert(err instanceof Error ? err.message : "Error al eliminar");

    } finally {

      setDeleting(null);

    }

  };



  const filtros: { id: Tab; label: string; count: number }[] = [

    { id: "todos", label: "Todos los productos", count: productos.length },

    { id: "stock-bajo", label: "Stock bajo", count: stats.stockBajo },

    { id: "agotados", label: "No disponible", count: stats.agotados },

  ];



  return (

    <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">

      <aside className="w-full shrink-0 space-y-4 lg:w-72">

        <section className="rounded-2xl border border-sky-100 bg-sky-50 p-5">

          <h3 className="text-sm font-bold uppercase tracking-wide text-sky-900">

            Resumen de inventario

          </h3>

          <dl className="mt-4 space-y-3 text-sm">

            <div className="flex justify-between">

              <dt className="text-slate-600">Productos activos</dt>

              <dd className="font-bold text-slate-800">{productos.length}</dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-600">Unidades en stock</dt>

              <dd className="font-bold text-slate-800">{stats.unidades}</dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-600">Con stock bajo</dt>

              <dd className="font-bold text-amber-700">{stats.stockBajo}</dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-600">Agotados</dt>

              <dd className="font-bold text-rose-700">{stats.agotados}</dd>

            </div>

          </dl>

        </section>



        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">

            Filtrar productos

          </h3>

          <div className="mt-4 space-y-2">

            {filtros.map((f) => (

              <label

                key={f.id}

                className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${

                  tab === f.id

                    ? "bg-[#30718d]/10 font-semibold text-[#30718d]"

                    : "text-slate-600 hover:bg-slate-50"

                }`}

              >

                <span className="flex items-center gap-2">

                  <input

                    type="radio"

                    name="filtro-inventario"

                    checked={tab === f.id}

                    onChange={() => setTab(f.id)}

                    className="accent-[#30718d]"

                  />

                  {f.label}

                </span>

                <span className="text-xs text-slate-400">({f.count})</span>

              </label>

            ))}

          </div>

        </section>



        <section className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-5">

          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">

            Historial de ventas

          </h3>

          <p className="mt-2 text-xs leading-relaxed text-slate-400">

            Métricas de ventas por periodo se implementarán en el módulo de

            pedidos del vendedor.

          </p>

        </section>

      </aside>



      <div className="min-w-0 flex-1">

        <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1e3a4c] to-[#30718d] p-8 text-white shadow-lg">

          <h1 className="text-3xl font-bold">Gana dinero vendiendo hoy</h1>

          <p className="mt-2 max-w-xl text-sm text-blue-100">

            Publica tus artículos en segundos, conecta con compradores locales y

            vende sin comisiones.

          </p>

        </section>



        <section>

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-slate-800">Gestiona tus productos</h2>

            <p className="text-sm text-slate-500">

              Administra tu inventario de forma rápida y sencilla

            </p>

          </div>



          {!codigoUsuario && (

            <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">

              Vuelve a iniciar sesión para obtener tu código de vendedor.

            </div>

          )}



          {loading && (

            <p className="text-center text-slate-500">Cargando productos...</p>

          )}

          {error && (

            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">

              {error}

            </p>

          )}



          {!loading && !error && (

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

              <AddProductCard to="/vendedor/inventario/nuevo" />

              {filtrados.map((p) => (

                <SellerProductCard

                  key={p.codigoProducto}

                  producto={p}

                  editPath={`/vendedor/inventario/editar/${p.codigoProducto}`}

                  onDelete={handleDelete}

                  deleting={deleting === p.codigoProducto}

                />

              ))}

            </div>

          )}



          {!loading && filtrados.length === 0 && tab !== "todos" && (

            <p className="mt-4 text-center text-sm text-slate-500">

              No hay productos en este filtro.

            </p>

          )}

        </section>

      </div>

    </div>

  );

}


