import React from "react";

interface RoleReadonlyProps {
  role: string;
}

export const RoleReadonly: React.FC<RoleReadonlyProps> = ({ role }) => {
  return (
    <div className="w-full">
      <label className="block text-[11px] font-bold tracking-widest text-brand-teal-dark uppercase mb-2 select-none">
        Rol de usuario
      </label>
      <div className="flex items-center gap-3 rounded-lg border border-[#e5e7eb] bg-gray-50 px-4 py-3 shadow-sm">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0a4f66]/10 text-[#0a4f66]">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
        </span>
        <span className="text-[14px] font-semibold text-gray-700 capitalize">{role || "—"}</span>
      </div>
    </div>
  );
};
