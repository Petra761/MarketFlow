import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm, { type ProductFormValues } from "../../components/ProductForm";
import { useAuth } from "../../hooks/useAuth";
import { useCategorias } from "../../hooks/useCategorias";
import { productoService } from "../../services/productoService";

const emptyValues: ProductFormValues = {
  nombre: "",
  descripcion: "",
  marca: "",
  codigoCategoria: "",
  estadoProducto: "Nuevo",
  precio: "",
  cantidadInicial: "1",
  imagen: null,
};

export default function InventarioNuevoPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categorias } = useCategorias();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: ProductFormValues) => {
    if (!user?.codigoUsuario) {
      setError("No se encontró tu código de vendedor. Inicia sesión de nuevo.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await productoService.crear({
        codigoUsuario: user.codigoUsuario,
        codigoCategoria: values.codigoCategoria,
        nombre: values.nombre,
        descripcion: values.descripcion,
        marca: values.marca || "Sin marca",
        estadoProducto: values.estadoProducto,
        precio: Number(values.precio),
        cantidadInicial: Number(values.cantidadInicial),
        imagen: values.imagen,
      });
      navigate("/vendedor/inventario");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="mx-auto max-w-3xl px-4">
        <ProductForm
          mode="create"
          initialValues={emptyValues}
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
