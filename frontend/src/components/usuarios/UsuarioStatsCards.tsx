import type { ReactNode } from "react";
import type { UsuarioStats } from "../../types/usuario";

interface Props {
  stats: UsuarioStats;
  loading: boolean;
}

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  color: string;
  bgColor: string;
  icon: ReactNode;
}

function StatCard({ label, value, sub, color, bgColor, icon }: StatCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${bgColor} ${color}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-extrabold tracking-tight ${color}`}>
          {value}
        </span>
        {sub && (
          <span className="mb-0.5 text-xs font-semibold text-gray-400">{sub}</span>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 space-y-3 animate-pulse">
      <div className="h-3 w-24 rounded bg-gray-100" />
      <div className="h-8 w-16 rounded bg-gray-100" />
    </div>
  );
}

export function UsuarioStatsCards({ stats, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Total Usuarios"
        value={stats.total.toLocaleString()}
        color="text-gray-800"
        bgColor="bg-gray-100"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        }
      />
      <StatCard
        label="Usuarios Activos"
        value={stats.activos.toLocaleString()}
        color="text-teal-600"
        bgColor="bg-teal-50"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        label="Roles de Admin"
        value={stats.admins}
        color="text-violet-600"
        bgColor="bg-violet-50"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        }
      />
      <StatCard
        label="Bloqueados"
        value={stats.bloqueados}
        color="text-rose-500"
        bgColor="bg-rose-50"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        }
      />
    </div>
  );
}
