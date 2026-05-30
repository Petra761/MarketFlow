import {
  LoginPage,
  RegisterPage,
  RecuperarContrasenaPage,
} from "./components/Seguridad";
import CarritoPage from "./pages/compras/CarritoPage";
import PagoPage from "./pages/compras/PagoPage";
import ProductosPruebaPage from "./pages/compras/ProductosPruebaPage";
import HistorialComprasPage from "./pages/compras/HistorialComprasPage";
import DetallePedidoPage from "./pages/compras/DetallePedidoPage";
import { BrowserRouter, Routes, Route, Link, NavLink, Outlet } from "react-router-dom";
import { ReportesPage } from "./pages/admin/ReportesPage";

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
        <Link to="/mis-pedidos">Mis Compras</Link>
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
const AdminLayout = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive
      ? "bg-[#2be1a4] text-[#0b333b] shadow-md shadow-[#2be1a4]/10"
      : "text-teal-100 hover:bg-[#154650] hover:text-white"
    }`;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-[#0b333b] text-white p-6 flex flex-col justify-between shrink-0 shadow-xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2be1a4]/10 text-[#2be1a4]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm0 9.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75-9.75a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM12.75 18v-2.25a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-black tracking-wide text-white leading-none">MarketFlow</h2>
              <span className="text-[10px] text-teal-300 font-bold uppercase tracking-wider">Admin Dashboard</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-1.5">
            <NavLink to="/admin/resumen" className={linkClass}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
              </svg>
              <span>Resumen</span>
            </NavLink>

            <NavLink to="/admin/usuarios" className={linkClass}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.978 11.978 0 0112 20.25a11.978 11.978 0 01-3-1.013V19.1c0-1.113.285-2.16.786-3.07M12 19.128v.109c-3.683 0-6.937-2.072-8.625-5.128a4.125 4.125 0 017.533-2.493M18 10.5a3 3 0 11-6 0 3 3 0 016 0zm-8-3a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Gestionar Usuarios</span>
            </NavLink>

            <NavLink to="/admin/categorias" className={linkClass}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.44 1.44 0 002.036 0l4.318-4.318a1.44 1.44 0 000-2.036L10.01 3.659A2.25 2.25 0 008.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              <span>Gestionar Categorías</span>
            </NavLink>

            <NavLink to="/admin/reportes" className={linkClass}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span>Reportes</span>
            </NavLink>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="space-y-1 border-t border-teal-800/40 pt-4">
          <Link
            to="/admin/configuracion"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-teal-100 hover:bg-[#154650] hover:text-white transition-all duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Configuración</span>
          </Link>
          <Link
            to="/iniciar-sesion"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-300 hover:bg-rose-950/30 hover:text-rose-200 transition-all duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            <span>Cerrar Sesión</span>
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL APP ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de autenticación (layout propio, sin navbar) */}
        <Route path="/iniciar-sesion" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasenaPage />} />
        <Route path="/olvide-contrasena" element={<RecuperarContrasenaPage />} />

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
            element={<HistorialComprasPage />}
          />
          <Route
            path="/mis-pedidos/:codigo"
            element={<DetallePedidoPage />}
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
          <Route path="/admin/reportes" element={<ReportesPage />} />
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
