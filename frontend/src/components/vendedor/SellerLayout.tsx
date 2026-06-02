import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
    isActive
      ? "bg-[#1e3a4c] text-white shadow-md"
      : "text-slate-600 hover:bg-slate-100"
  }`;

function IconGrid() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

export default function SellerLayout() {
  const { user, logout } = useAuth();
  const nombre = user?.name ?? "Vendedor";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-8">
          <Link to="/vendedor/dashboard" className="block">
            <span className="text-lg font-black text-[#1e3a4c]">MarketFlow</span>
            <span className="mt-0.5 block text-xs font-medium text-slate-500">
              Panel del Vendedor
            </span>
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          <NavLink to="/vendedor/dashboard" className={navClass}>
            <IconGrid />
            Dashboard
          </NavLink>
          <NavLink to="/vendedor/inventario" className={navClass}>
            <IconBox />
            Mis Productos
          </NavLink>
          <NavLink to="/vendedor/ventas" className={navClass}>
            <IconTag />
            Ventas Recibidas
          </NavLink>
          <NavLink to="/vendedor/reportes" className={navClass}>
            <IconChart />
            Reportes
          </NavLink>
        </nav>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <Link
            to="/vendedor/inventario/nuevo"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#30718d] px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#255a72]"
          >
            <span className="text-lg leading-none">+</span>
            Añadir producto
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <span className="text-sm font-semibold text-slate-700">{nombre}</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#30718d]/15 text-sm font-bold text-[#30718d]">
            {nombre.charAt(0).toUpperCase()}
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          >
            Cerrar sesión
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
