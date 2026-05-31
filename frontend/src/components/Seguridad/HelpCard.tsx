import React from "react";

export const HelpCard: React.FC = () => {
  return (
    <div className="mt-8 flex gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-teal-dark shadow-sm">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        </svg>
      </div>
      <div>
        <p className="text-[13px] font-semibold text-gray-800">¿Necesitas ayuda?</p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-gray-500">
          Si tienes problemas para acceder, nuestro equipo de soporte está disponible 24/7 para
          asistirte.
        </p>
        <a
          href="mailto:soporte@marketflow.com"
          className="mt-1 inline-block text-[12px] font-bold text-brand-link hover:text-brand-link-hover transition-colors"
        >
          Contactar Soporte
        </a>
      </div>
    </div>
  );
};
