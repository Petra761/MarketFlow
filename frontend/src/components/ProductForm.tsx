import { useState } from "react";
import { comprimirAWebP } from "../utils/comprimirImagen";
import type { Categoria } from "../services/categoriaService";

export interface ProductFormValues {
  nombre: string;
  descripcion: string;
  marca: string;
  codigoCategoria: string;
  estadoProducto: string;
  precio: string;
  cantidadInicial: string;
  imagen: string | null;
}

interface ProductFormProps {
  mode: "create" | "edit";
  initialValues: ProductFormValues;
  categorias: Categoria[];
  loading?: boolean;
  error?: string | null;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  onCancel: () => void;
}

const ESTADOS = ["Nuevo", "Usado", "Reacondicionado"];

export default function ProductForm({
  mode,
  initialValues,
  categorias,
  loading,
  error,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [values, setValues] = useState(initialValues);
  const [preview, setPreview] = useState<string | null>(initialValues.imagen);
  const [imagenError, setImagenError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagenError(null);
    try {
      const base64 = await comprimirAWebP(file);
      setPreview(base64);
      setValues((prev) => ({ ...prev, imagen: base64 }));
    } catch {
      setImagenError("No se pudo procesar la imagen.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          {mode === "create" ? "Nuevo producto" : "Editar producto"}
        </h2>
        <p className="text-sm text-slate-500">
          Completa la información. La imagen se comprime automáticamente.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">Nombre *</span>
          <input
            name="nombre"
            required
            value={values.nombre}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#30718d]"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">Descripción</span>
          <textarea
            name="descripcion"
            rows={3}
            value={values.descripcion}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#30718d]"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Marca</span>
          <input
            name="marca"
            value={values.marca}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#30718d]"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Categoría *</span>
          <select
            name="codigoCategoria"
            required
            value={values.codigoCategoria}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#30718d]"
          >
            <option value="">Seleccionar...</option>
            {categorias.map((c) => (
              <option key={c.codigoCategoria} value={c.codigoCategoria}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Estado del producto</span>
          <select
            name="estadoProducto"
            value={values.estadoProducto}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#30718d]"
          >
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Precio (Bs) *
          </span>
          <input
            name="precio"
            type="number"
            min="1"
            required
            value={values.precio}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#30718d]"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            {mode === "create" ? "Stock inicial *" : "Stock *"}
          </span>
          <input
            name="cantidadInicial"
            type="number"
            min="0"
            required
            value={values.cantidadInicial}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#30718d]"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">Imagen</span>
          <input type="file" accept="image/*" onChange={handleImagen} className="text-sm" />
          {imagenError && <p className="mt-1 text-sm text-rose-600">{imagenError}</p>}
          {preview && (
            <img
              src={preview}
              alt="Vista previa"
              className="mt-3 h-40 w-40 rounded-xl border object-cover"
            />
          )}
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-full border border-slate-200 py-3 font-semibold text-slate-600 hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-full bg-[#30718d] py-3 font-semibold text-white hover:bg-[#255a72] disabled:opacity-60"
        >
          {loading ? "Guardando..." : mode === "create" ? "Publicar producto" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
