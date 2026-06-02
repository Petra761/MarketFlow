import React from "react";

export const SupportWidget: React.FC = () => {
  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 max-w-[280px]">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shrink-0 text-white text-sm font-bold">
        MF
      </div>
      <div>
        <p className="text-[13px] font-semibold text-white leading-tight">¿Necesitas ayuda?</p>
        <p className="text-[12px] text-[#94a3b8] leading-tight mt-0.5">Soporte disponible 24/7</p>
      </div>
    </div>
  );
};
