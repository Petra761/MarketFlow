// ===== CATEGORÍA =====

export interface CategoriaDTO {
  codigoCategoria: string;
  nombre: string;
}

export interface CategoriaAdminDTO {
  codigoCategoria: string;
  nombre: string;
  cantidadProductos: number;
}

/** DTO para crear: POST /api/Categoria */
export interface mCategoriaDTO {
  nombre: string;
}

/** Estado del modal de creación/edición */
export type CategoriaModalMode = "crear" | "editar";

export interface CategoriaModalState {
  open: boolean;
  mode: CategoriaModalMode;
  categoria: CategoriaDTO | null;
}
