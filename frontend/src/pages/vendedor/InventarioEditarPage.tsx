import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm, { type ProductFormValues } from "../../components/ProductForm";
import { useAuth } from "../../hooks/useAuth";
import { useCategorias } from "../../hooks/useCategorias";
import { productoService } from "../../services/productoService";

export default function InventarioEditarPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categorias } = useCategorias();
  const [initialValues, setInitialValues] = useState<ProductFormValues | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!codigo) return;
    productoService
      .getByCodigo(codigo)
      .then((p) => {
        setInitialValues({
          nombre: p.nombre,
          descripcion: p.descripcion,
          marca: p.marca,
          codigoCategoria: p.codigoCategoria ?? "",
          estadoProducto: p.estadoProducto || "Nuevo",
          precio: p.precio != null ? String(p.precio) : "",
          cantidadInicial:
            p.stockActual != null ? String(p.stockActual) : "0",
          imagen: p.imagen ?? null,
        });
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "No se pudo cargar el producto")
      )
      .finally(() => setFetching(false));
  }, [codigo]);

  const handleSubmit = async (values: ProductFormValues) => {
    if (!codigo || !user?.codigoUsuario) return;

    try {
      setLoading(true);
      setError(null);
      await productoService.actualizar(codigo, user.codigoUsuario, {
        codigoProducto: codigo,
        codigoUsuario: user.codigoUsuario,
        codigoCategoria: values.codigoCategoria,
        nombre: values.nombre,
        descripcion: values.descripcion,
        marca: values.marca || "Sin marca",
        estadoProducto: values.estadoProducto,
        imagen: values.imagen,
        precio: Number(values.precio),
        stockActual: Number(values.cantidadInicial),
      });
      navigate("/vendedor/inventario");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">
        Cargando producto...
      </div>
    );
  }

  if (!initialValues) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-rose-600">{error ?? "Producto no encontrado"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="mx-auto max-w-3xl px-4">
        <ProductForm
          mode="edit"
          initialValues={initialValues}
          categorias={categorias}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/vendedor/inventario")}
        />
      </div>
    </div>
  );
}
