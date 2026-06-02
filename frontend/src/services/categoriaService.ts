export interface Categoria {
  codigoCategoria: string;
  nombre: string;
}

const API_BASE = "/api/Categoria";

export const categoriaService = {
  getAll: async (): Promise<Categoria[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Error al obtener categorías");
    return res.json();
  },
};
