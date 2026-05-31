import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Outlet,
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { ReportesPage } from "./pages/admin/ReportesPage";
import { CategoriasPage } from "./pages/admin/CategoriasPage";
import { UsuariosPage } from "./pages/admin/UsuariosPage";
import { Search, ShoppingCart } from "lucide-react";

import { useAuth } from "./hooks/useAuth";
import { useCarritoActivo } from "./hooks/useCarritoActivo";

import {
  LoginPage,
  RegisterPage,
  RecuperarContrasenaPage,
  RestablecerContrasenaPage,
  EditarPerfilPage,
} from "./components/Seguridad";
import RequireRole from "./components/RequireRole";

import CatalogoPage from "./pages/compras/CatalogoPage";
import ProductoDetallePage from "./pages/compras/ProductoDetallePage";
import CarritoPage from "./pages/compras/CarritoPage";
import PagoPage from "./pages/compras/PagoPage";
import HistorialComprasPage from "./pages/compras/HistorialComprasPage";
import DetallePedidoPage from "./pages/compras/DetallePedidoPage";

import DashboardVendedorPage from "./pages/vendedor/DashboardVendedorPage";
import InventarioPage from "./pages/vendedor/InventarioPage";
import InventarioNuevoPage from "./pages/vendedor/InventarioNuevoPage";
import InventarioEditarPage from "./pages/vendedor/InventarioEditarPage";
import VentasRecibidasPage from "./pages/vendedor/VentasRecibidasPage";
import ReportesVendedorPage from "./pages/vendedor/ReportesVendedorPage";


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

const BuyerLayout = () => {
  const { totalItems } = useCarritoActivo();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const busqueda = searchParams.get("q") || "";

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    if (location.pathname !== "/catalogo") {
      navigate(`/catalogo?q=${encodeURIComponent(q)}`);
    } else {
      navigate(`?q=${encodeURIComponent(q)}`, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      <nav className="bg-[#0a4f66] text-white px-6 py-3 flex items-center justify-between shadow-md sticky top-0 z-20">
        <Link
          to="/catalogo"
          className="flex items-center gap-2 font-extrabold text-lg tracking-tight shrink-0"
        >
          <ShoppingCart size={22} /> MarketFlow
        </Link>
        <div className="flex-1 max-w-2xl mx-6 flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={handleSearch}
              className="w-full bg-[#07384a] text-white placeholder-white/60 pl-4 pr-10 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-white/30 border-none transition-all"
            />
            <Search
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80"
            />
          </div>
          <NavLink
            to="/carrito"
            className={({ isActive }) =>
              `relative flex items-center transition-colors ${isActive ? "text-[#2be1a4]" : "text-white/80 hover:text-white"}`
            }
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-600 text-white font-bold text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm">
                {totalItems}
              </span>
            )}
          </NavLink>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <NavLink
            to="/catalogo"
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? "text-[#2be1a4]" : "text-white/80 hover:text-white"}`
            }
          >
            Catálogo
          </NavLink>
          <NavLink
            to="/mis-pedidos"
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? "text-[#2be1a4]" : "text-white/80 hover:text-white"}`
            }
          >
            Mis Pedidos
          </NavLink>
          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              `text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isActive
                ? "bg-[#2be1a4] text-[#0a4f66]"
                : "bg-white/10 text-white hover:bg-white/20"
              }`
            }
          >
            Mi Perfil
          </NavLink>
          <button
            onClick={logout}
            className="text-sm font-medium text-white/80 hover:text-white cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
      <main className="max-w-6xl w-full mx-auto p-6 flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-4 px-6 flex items-center justify-between text-xs text-gray-500">
        <span className="font-bold text-[#0a4f66]">MarketFlow</span>
        <span>© 2024 MarketFlow. Todos los derechos reservados.</span>
      </footer>
    </div>
  );
};

const SellerLayout = () => {
  const { logout } = useAuth();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-[#30718d]" : "text-slate-500 hover:text-slate-700"}`;

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <Link
          to="/vendedor/dashboard"
          className="text-lg font-bold text-[#30718d]"
        >
          MarketFlow · Vendedor
        </Link>
        <div className="flex items-center gap-5">
          <NavLink to="/vendedor/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/vendedor/inventario" className={linkClass}>
            Inventario
          </NavLink>
          <NavLink to="/vendedor/ventas" className={linkClass}>
            Ventas
          </NavLink>
          <NavLink to="/vendedor/reportes" className={linkClass}>
            Reportes
          </NavLink>
          <NavLink to="/vendedor/perfil" className={linkClass}>
            Mi Perfil
          </NavLink>
          <button
            onClick={logout}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

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
          <h2 className="text-base font-black tracking-wide">
            MarketFlow Admin
          </h2>
          <nav className="flex flex-col space-y-1.5">
            <NavLink to="/admin/usuarios" className={linkClass}>
              Usuarios
            </NavLink>
            <NavLink to="/admin/categorias" className={linkClass}>
              Categorías
            </NavLink>
            <NavLink to="/admin/reportes" className={linkClass}>
              Reportes
            </NavLink>
          </nav>
        </div>
        <Link
          to="/iniciar-sesion"
          className="text-sm text-rose-300 hover:text-rose-200"
        >
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
        {/* AUTHENTICATION - Fuera de layouts */}
        <Route path="/iniciar-sesion" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/recuperar-contrasena"
          element={<RecuperarContrasenaPage />}
        />
        <Route
          path="/olvide-contrasena"
          element={<RecuperarContrasenaPage />}
        />
        <Route
          path="/api/Usuarios/CambiarPassword"
          element={<RestablecerContrasenaPage />}
        />
        <Route
          path="/restablecer-contrasena"
          element={<RestablecerContrasenaPage />}
        />

        <Route
          path="/perfil"
          element={
            <RequireRole allowed={["buyer", "seller", "admin"]}>
              <BuyerLayout />
            </RequireRole>
          }
        >
          <Route index element={<EditarPerfilPage closePath="/catalogo" />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Navigate to="/catalogo" replace />} />
          <Route
            path="/producto/:codigo"
            element={<EnEspera titulo="Detalle del Producto Público" />}
          />
        </Route>

        <Route element={<BuyerLayout />}>
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/catalogo/:codigo" element={<ProductoDetallePage />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/pago" element={<PagoPage />} />
          <Route path="/mis-pedidos" element={<HistorialComprasPage />} />
          <Route path="/mis-pedidos/:codigo" element={<DetallePedidoPage />} />
        </Route>

        <Route
          element={
            <RequireRole allowed={["seller"]}>
              <SellerLayout />
            </RequireRole>
          }
        >
          <Route
            path="/vendedor"
            element={<Navigate to="/vendedor/dashboard" replace />}
          />
          <Route
            path="/vendedor/dashboard"
            element={<DashboardVendedorPage />}
          />
          <Route
            path="/vendedor/resumen"
            element={<Navigate to="/vendedor/dashboard" replace />}
          />
          <Route path="/vendedor/inventario" element={<InventarioPage />} />
          <Route
            path="/vendedor/inventario/nuevo"
            element={<InventarioNuevoPage />}
          />
          <Route
            path="/vendedor/inventario/editar/:codigo"
            element={<InventarioEditarPage />}
          />
          <Route path="/vendedor/ventas" element={<VentasRecibidasPage />} />
          <Route path="/vendedor/reportes" element={<ReportesVendedorPage />} />
          <Route
            path="/vendedor/perfil"
            element={<EditarPerfilPage closePath="/vendedor/dashboard" />}
          />
          <Route
            path="/vendedor/inventario/reponer"
            element={<EnEspera titulo="Gestión de Lotes" />}
          />
          <Route
            path="/vendedor/precios"
            element={<EnEspera titulo="Gestión de Precios" />}
          />
        </Route>

        <Route
          element={
            <RequireRole allowed={["admin"]}>
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route
            path="/admin/resumen"
            element={<EnEspera titulo="Métricas Globales" />}
          />
          <Route path="/admin/usuarios" element={<UsuariosPage />} />
          <Route path="/admin/categorias" element={<CategoriasPage />} />
          <Route path="/admin/reportes" element={<ReportesPage />} />
        </Route>

        <Route path="/cart" element={<Navigate to="/carrito" replace />} />
        <Route path="/catalog" element={<Navigate to="/catalogo" replace />} />

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
