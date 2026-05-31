import type { CategoriaDTO, mCategoriaDTO, CategoriaAdminDTO } from "../types/categoria";

const API_BASE = "/api/Categoria";

/** GET /api/Categoria/Administracion — lista con detalles */
export async function fetchCategorias(): Promise<CategoriaAdminDTO[]> {
    const response = await fetch(`${API_BASE}/Administracion`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.mensaje || "No se pudieron cargar las categorías");
    }
    return response.json() as Promise<CategoriaAdminDTO[]>;
}

/** GET /api/Categoria/{codigo} — una sola categoría */
export async function fetchCategoria(codigo: string): Promise<CategoriaDTO> {
    const response = await fetch(`${API_BASE}/${codigo}`);
    if (!response.ok) {
        throw new Error(`No se encontró la categoría con código: ${codigo}`);
    }
    return response.json() as Promise<CategoriaDTO>;
}

/** POST /api/Categoria — crear nueva categoría */
export async function postCategoria(data: mCategoriaDTO): Promise<CategoriaDTO> {
    const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("No se pudo crear la categoría");
    }
    return response.json() as Promise<CategoriaDTO>;
}

/** PUT /api/Categoria/{codigo} — actualizar categoría existente */
export async function putCategoria(
    codigo: string,
    data: CategoriaDTO
): Promise<CategoriaDTO> {
    const response = await fetch(`${API_BASE}/${codigo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("No se pudo actualizar la categoría");
    }
    return response.json() as Promise<CategoriaDTO>;
}

/** DELETE /api/Categoria/{codigo} — eliminar categoría */
export async function deleteCategoria(codigo: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${codigo}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("No se pudo eliminar la categoría");
    }
}