import { useState } from "react";
import { useProductosConDetalle } from "../../hooks/useProductos";
import { useCarrito } from "../../hooks/useCarrito";
import type { Producto } from "../../types/compras";

export default function ProductosPruebaPage() {
  const { productosDetalle, loading, error } = useProductosConDetalle();
  const { agregarProducto, items } = useCarrito();

  // Estado local para manejar la cantidad de cada producto
  const [cantidades, setCantidades] = useState<Record<string, number>>({});

  const handleCantidadChange = (codigo: string, valor: number) => {
    setCantidades((prev) => ({
      ...prev,
      [codigo]: Math.max(1, valor),
    }));
  };

  const handleAgregar = (producto: Producto, stockDisponible: number) => {
    const cantidadAEnviar = cantidades[producto.codigoProducto] || 1;
    // Evitar agregar más del stock
    const enCarrito = items.find((i) => i.codigoProducto === producto.codigoProducto)?.cantidad || 0;
    
    if (enCarrito + cantidadAEnviar > stockDisponible) {
      alert(`No puedes agregar más del stock disponible. Stock: ${stockDisponible}, En carrito: ${enCarrito}`);
      return;
    }

    agregarProducto(producto, cantidadAEnviar);
    alert(`Agregado al carrito: ${producto.nombre} x${cantidadAEnviar}`);
  };

  if (loading) return <div>Cargando productos desde el backend...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Página de Prueba: Catálogo de Productos</h2>
      <p>Cantidad de productos en BD: {productosDetalle.length}</p>
      
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px" }}>
        {productosDetalle.map((pd) => (
          <div 
            key={pd.producto.codigoProducto} 
            style={{ 
              border: "1px solid #ccc", 
              padding: "15px", 
              borderRadius: "5px",
              width: "250px"
            }}
          >
            <h3>{pd.producto.nombre}</h3>
            <p><strong>Código:</strong> {pd.producto.codigoProducto}</p>
            <p><strong>Marca:</strong> {pd.producto.marca}</p>
            <p><strong>Estado:</strong> {pd.producto.estadoProducto}</p>
            <p style={{ color: "green", fontWeight: "bold" }}>
              Precio Activo: {pd.precioActual} Bs
            </p>
            <p style={{ color: "blue", fontWeight: "bold" }}>
              Stock Disponible: {pd.stockDisponible}
            </p>

            <div style={{ marginTop: "15px" }}>
              <label>Cantidad: </label>
              <input 
                type="number" 
                min="1"
                max={pd.stockDisponible}
                value={cantidades[pd.producto.codigoProducto] || 1}
                onChange={(e) => handleCantidadChange(pd.producto.codigoProducto, parseInt(e.target.value) || 1)}
                style={{ width: "60px", marginRight: "10px" }}
              />
              <button 
                onClick={() => handleAgregar(pd.producto, pd.stockDisponible)}
                disabled={pd.stockDisponible <= 0}
                style={{ cursor: pd.stockDisponible <= 0 ? "not-allowed" : "pointer" }}
              >
                Agregar al Carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
