import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import CarritoPage from "./pages/compras/CarritoPage";
import PagoPage from "./pages/compras/PagoPage";
import ProductosPruebaPage from "./pages/compras/ProductosPruebaPage";

// --- COMPONENTE DE ESPERA (PLACEHOLDER) ---
const EnEspera = ({ titulo }: { titulo: string }) => (
  <div className="p-8 bg-white rounded-lg shadow-sm border border-gray-200">
    <h2 className="text-2xl font-bold text-gray-800">{titulo}</h2>
    <p className="text-gray-500 mt-2 italic">A espera de implementación...</p>
  </div>
);

// --- LAYOUTS ---

// Layout Público (Navbar general)
const PublicLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold">
        MarketFlow
      </Link>
      <div className="space-x-4 text-sm">
        <Link shadow-md to="/catalogo">
          Catálogo
        </Link>
        <Link to="/iniciar-sesion" className="bg-blue-800 px-3 py-1 rounded">
          Login
        </Link>
      </div>
    </nav>
    <main className="p-6">
      <Outlet />
    </main>
  </div>
);

// Layout Comprador (Cliente)
const BuyerLayout = () => (
  <div className="min-h-screen bg-slate-50">
    <nav className="bg-white border-b p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-blue-600">
        MarketFlow Cliente
      </Link>
      <div className="space-x-6 text-gray-600">
        <Link to="/carrito">Carrito</Link>
        <Link to="/mis-pedidos text-sm">Mis Compras</Link>
        <Link to="/perfil" className="font-medium">
          Mi Perfil
        </Link>
      </div>
    </nav>
    <main className="max-w-6xl mx-auto p-6">
      <Outlet />
    </main>
  </div>
);

// Layout Vendedor (Sidebar lateral)
const SellerLayout = () => (
  <div className="min-h-screen flex bg-zinc-100">
    <aside className="w-64 bg-zinc-900 text-white p-6 space-y-4">
      <h2 className="text-xl font-bold mb-8 text-blue-400">Panel Vendedor</h2>
      <nav className="flex flex-col space-y-2">
        <Link to="/vendedor/resumen" className="hover:text-blue-300">
          Resumen
        </Link>
        <Link to="/vendedor/inventario" className="hover:text-blue-300">
          Inventario
        </Link>
        <Link to="/vendedor/precios" className="hover:text-blue-300">
          Precios
        </Link>
        <Link to="/vendedor/pedidos-recibidos" className="hover:text-blue-300">
          Pedidos Recibidos
        </Link>
      </nav>
    </aside>
    <main className="flex-1 p-8">
      <Outlet />
    </main>
  </div>
);

// Layout Admin (Diferenciado por color)
const AdminLayout = () => (
  <div className="min-h-screen flex bg-gray-100">
    <aside className="w-64 bg-red-900 text-white p-6 space-y-4">
      <h2 className="text-xl font-bold mb-8">ADMINISTRACIÓN</h2>
      <nav className="flex flex-col space-y-2">
        <Link to="/admin/resumen" className="hover:bg-red-800 p-2 rounded">
          Métricas
        </Link>
        <Link to="/admin/usuarios" className="hover:bg-red-800 p-2 rounded">
          Usuarios
        </Link>
        <Link to="/admin/categorias" className="hover:bg-red-800 p-2 rounded">
          Categorías
        </Link>
      </nav>
    </aside>
    <main className="flex-1 p-8 text-center">
      <Outlet />
    </main>
  </div>
);

// --- COMPONENTE PRINCIPAL APP ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. RUTAS PÚBLICAS */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<EnEspera titulo="Home / Landing Page" />} />
          <Route
            path="/iniciar-sesion"
            element={<EnEspera titulo="Inicio de Sesión" />}
          />
          <Route
            path="/registro"
            element={<EnEspera titulo="Registro de Usuario" />}
          />
          <Route path="/catalogo" element={<ProductosPruebaPage />} />
          <Route
            path="/producto/:codigo"
            element={<EnEspera titulo="Detalle del Producto" />}
          />
        </Route>

        {/* 2. RUTAS COMPRADOR (CLIENTE) */}
        <Route element={<BuyerLayout />}>
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/pago" element={<PagoPage />} />
          <Route
            path="/mis-pedidos"
            element={<EnEspera titulo="Historial de Pedidos" />}
          />
          <Route
            path="/mis-pedidos/:codigo"
            element={<EnEspera titulo="Seguimiento de Pedido" />}
          />
          <Route
            path="/perfil"
            element={<EnEspera titulo="Perfil y Configuración" />}
          />
        </Route>

        {/* 3. RUTAS VENDEDOR */}
        <Route element={<SellerLayout />}>
          <Route
            path="/vendedor/resumen"
            element={<EnEspera titulo="Dashboard de Ventas" />}
          />
          <Route
            path="/vendedor/inventario"
            element={<EnEspera titulo="Listado de Inventario" />}
          />
          <Route
            path="/vendedor/inventario/nuevo"
            element={<EnEspera titulo="Crear Producto Nuevo" />}
          />
          <Route
            path="/vendedor/inventario/reponer"
            element={<EnEspera titulo="Gestión de Lotes / Reposición" />}
          />
          <Route
            path="/vendedor/inventario/stock-bajo"
            element={<EnEspera titulo="Alertas de Stock Crítico" />}
          />
          <Route
            path="/vendedor/precios"
            element={<EnEspera titulo="Gestión de Precios" />}
          />
          <Route
            path="/vendedor/pedidos-recibidos"
            element={<EnEspera titulo="Pedidos de Clientes" />}
          />
        </Route>

        {/* 4. RUTAS ADMIN */}
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/resumen"
            element={<EnEspera titulo="Métricas Globales" />}
          />
          <Route
            path="/admin/usuarios"
            element={<EnEspera titulo="Gestión de Usuarios" />}
          />
          <Route
            path="/admin/categorias"
            element={<EnEspera titulo="Gestión de Categorías" />}
          />
          <Route
            path="/admin/reportes"
            element={<EnEspera titulo="Reportes de Auditoría" />}
          />
        </Route>

        {/* 404 - Not Found */}
        <Route
          path="*"
          element={
            <div className="p-20 text-center text-3xl font-bold">
              404 - Página no encontrada
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
