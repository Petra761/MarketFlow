// ===== PRODUCTO =====
export interface Producto {
  idProducto: number;
  idUsuario: number;
  idCategoria: number;
  codigoProducto: string;
  codigoCategoria?: string;
  codigoUsuario?: string;
  nombre: string;
  descripcion: string;
  marca: string;
  fecha: string;
  estadoProducto: string;
  estado: string;
  imagen?: string | null;
  precio?: number | null;
  stockActual?: number | null;
  precios?: Precio[];
  stocks?: Stock[];
}

export interface MisProductosDTO {
  codigoProducto: string;
  nombre: string;
  descripcion: string;
  marca: string;
  nombreCategoria: string;
  estadoProducto: string;
  fecha: string;
  precioActual: number | null;
  stockActual: number;
  imagen?: string | null;
}

export interface ProductoStock {
  codigoProducto: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  marca: string;
  stock: number;
  estado: string;
}

export interface ProductoDisponibleDTO {
  codigoProducto: string;
  nombreProducto: string;
  precio: number | null;
  cantidadDisponible: number;
}

// ===== PRECIO =====
export interface Precio {
  idPrecio?: number;
  idProducto?: number;
  codigoPrecio: string;
  monto: number;
  fechaInicio: string;
  fechaFin: string | null;
  estado: string;
}

export interface PrecioResponseDTO {
  codigoProducto: string;
  nombreProducto: string;
  codigoPrecio: string;
  monto: number;
  fechaInicio: string;
  fechaFin: string | null;
  estado: string;
}

// ===== STOCK =====
export interface Stock {
  idStock?: number;
  idProducto?: number;
  codigoLote: string;
  fecha: string;
  stockInicial: number;
  stockActual: number;
  estado: string;
}

export interface StockSumarioDTO {
  codigoProducto: string;
  nombreProducto: string;
  stockTotal: number;
}

// ===== PEDIDO =====
export interface PedidoDTO {
  codigoUsuario: string;
  codigoMetodoPago: string;
  codigoPedido: string;
  fecha: string;
  total: number;
  estadoPedido: string;
  productos?: DetallePedidoRecibidoDTO[];
}

export interface DetallePedidoRecibidoDTO {
  nombreProducto: string;
  cantidad: number;
  subtotal: number;
}

export interface PedidoRecibidoDTO {
  codigoPedido: string;
  comprador: string;
  fecha: string;
  estadoPedido: string;
  total: number;
  productos: DetallePedidoRecibidoDTO[];
}

export interface CreatePedidoDTO {
  codigoUsuario: string;
  codigoMetodoPago: string;
  fecha: string; // "YYYY-MM-DD" — C# DateOnly se serializa como string
}

export interface UpdatePedidoDTO {
  codigoUsuario: string;
  codigoMetodoPago: string;
  codigoPedido: string;
  fecha: string;
  estadoPedido: string;
}

// ===== DETALLE PEDIDO =====
export interface Detalle_PedidoDTO {
  codigoPedido: string;
  codigoProducto: string;
  cantidad: number;
}

export interface DetallePedidoFull {
  codigoPedido: string;
  codigoProducto: string;
  cantidad: number;
  subtotal: number;
}

// ===== METODO DE PAGO =====
export interface MetodoPagoDTO {
  codigoMetodoPago: string;
  nombre: string;
}

// ===== CARRITO LOCAL =====
export interface CartItem {
  producto: Producto;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
  codigoProducto: string;
  nombreProducto: string;
  descripcion: string;
  marca: string;
  stockDisponible: number;
}
