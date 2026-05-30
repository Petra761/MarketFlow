export interface VentasCategoria {
  categoria: string;
  totalVentas: number;
  cantidadVendida: number;
}

export interface ProductoMasVendido {
  producto: string;
  cantidadVendida: number;
  totalGenerado: number;
}

export interface VentaRangoDTO {
  periodo: string;
  totalVentas: number;
  cantidadVentas: number;
}

export interface UsuarioEstadisticaDTO {
  periodo: string;
  cantidadUsuarios: number;
}