import type { ReactNode } from "react";

interface ReportCardProps {
  title: string;
  children: ReactNode;
  menu?: boolean;
}

export function ReportCard({ title, children, menu = false }: ReportCardProps) {
  return (
    <article className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <header className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {menu && (
          <button
            type="button"
            className="rounded p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            aria-label="Opciones"
          >
            <span className="inline-block text-xl leading-none">⋮</span>
          </button>
        )}
      </header>
      {children}
    </article>
  );
}
