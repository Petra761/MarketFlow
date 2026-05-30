import {
  LoginPage,
  RegisterPage,
  RecuperarContrasenaPage,
} from "./components/Seguridad";
import RequireRole from "./components/RequireRole";
import CarritoPage from "./pages/compras/CarritoPage";
import PagoPage from "./pages/compras/PagoPage";
import InventarioPage from "./pages/vendedor/InventarioPage";
import InventarioNuevoPage from "./pages/vendedor/InventarioNuevoPage";
import InventarioEditarPage from "./pages/vendedor/InventarioEditarPage";
import { BrowserRouter, Routes, Route, Link, NavLink, Outlet, Navigate } from "react-router-dom";
import { ReportesPage } from "./pages/admin/ReportesPage";

const EnEspera = ({ titulo }: { titulo: string }) => (
  <div className="p-8 bg-white rounded-lg shadow-sm border border-gray-200">
    <h2 className="text-2xl font-bold text-gray-800">{titulo}</h2>
    <p className="text-gray-500 mt-2 italic">A espera de implementación...</p>
  </div>
);

const PublicLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold">
        MarketFlow
      </Link>
      <div className="space-x-4 text-sm">
        <Link to="/catalogo">Catálogo</Link>
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

const SellerLayout = () => (
  <div className="min-h-screen bg-zinc-100">
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <Link to="/vendedor/inventario" className="text-lg font-bold text-[#30718d]">
        MarketFlow · Vendedor
      </Link>
      <Link
        to="/iniciar-sesion"
        className="text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        Cerrar sesión
      </Link>
    </header>
    <main className="p-6 lg:p-8">
      <Outlet />
    </main>
  </div>
);

const AdminLayout = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
      isActive
        ? "bg-[#2be1a4] text-[#0b333b] shadow-md shadow-[#2be1a4]/10"
        : "text-teal-100 hover:bg-[#154650] hover:text-white"
    }`;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-[#0b333b] text-white p-6 flex flex-col justify-between shrink-0 shadow-xl">
        <div className="space-y-8">
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
          <nav className="flex flex-col space-y-1.5">
            <NavLink to="/admin/resumen" className={linkClass}>Resumen</NavLink>
            <NavLink to="/admin/usuarios" className={linkClass}>Gestionar Usuarios</NavLink>
            <NavLink to="/admin/categorias" className={linkClass}>Gestionar Categorías</NavLink>
            <NavLink to="/admin/reportes" className={linkClass}>Reportes</NavLink>
          </nav>
        </div>
        <Link to="/iniciar-sesion" className="text-sm text-rose-300 hover:text-rose-200">
          Cerrar Sesión
        </Link>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/iniciar-sesion" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasenaPage />} />
        <Route path="/olvide-contrasena" element={<RecuperarContrasenaPage />} />

        <Route element={<PublicLayout />}>
          <Route path="/" element={<EnEspera titulo="Home / Landing Page" />} />
          <Route path="/catalogo" element={<EnEspera titulo="Catálogo de Productos" />} />
          <Route path="/producto/:codigo" element={<EnEspera titulo="Detalle del Producto" />} />
        </Route>

        <Route element={<BuyerLayout />}>
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/pago" element={<PagoPage />} />
          <Route path="/mis-pedidos" element={<EnEspera titulo="Historial de Pedidos" />} />
          <Route path="/mis-pedidos/:codigo" element={<EnEspera titulo="Seguimiento de Pedido" />} />
          <Route path="/perfil" element={<EnEspera titulo="Perfil y Configuración" />} />
        </Route>

        <Route element={<SellerLayout />}>
          <Route path="/vendedor/resumen" element={<EnEspera titulo="Dashboard de Ventas" />} />
          <Route
            path="/vendedor/inventario"
            element={
              <RequireRole allowed={["seller"]}>
                <InventarioPage />
              </RequireRole>
            }
          />
          <Route
            path="/vendedor/inventario/nuevo"
            element={
              <RequireRole allowed={["seller"]}>
                <InventarioNuevoPage />
              </RequireRole>
            }
          />
          <Route
            path="/vendedor/inventario/editar/:codigo"
            element={
              <RequireRole allowed={["seller"]}>
                <InventarioEditarPage />
              </RequireRole>
            }
          />
          <Route path="/vendedor/inventario/reponer" element={<EnEspera titulo="Gestión de Lotes / Reposición" />} />
          <Route path="/vendedor/inventario/stock-bajo" element={<EnEspera titulo="Alertas de Stock Crítico" />} />
          <Route path="/vendedor/precios" element={<EnEspera titulo="Gestión de Precios" />} />
          <Route path="/vendedor/pedidos-recibidos" element={<EnEspera titulo="Pedidos de Clientes" />} />
        </Route>

        <Route path="/seller/inventory" element={<Navigate to="/vendedor/inventario" replace />} />
        <Route path="/seller/inventory/add" element={<Navigate to="/vendedor/inventario/nuevo" replace />} />
        <Route path="/cart" element={<Navigate to="/carrito" replace />} />
        <Route path="/catalog" element={<Navigate to="/catalogo" replace />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin/resumen" element={<EnEspera titulo="Métricas Globales" />} />
          <Route path="/admin/usuarios" element={<EnEspera titulo="Gestión de Usuarios" />} />
          <Route path="/admin/categorias" element={<EnEspera titulo="Gestión de Categorías" />} />
          <Route path="/admin/reportes" element={<ReportesPage />} />
        </Route>

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
