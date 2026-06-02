import React from "react";
import { Link } from "react-router-dom";

export const BackToLoginLink: React.FC = () => {
  return (
    <div className="mt-6 text-center">
      <Link
        to="/iniciar-sesion"
        className="inline-flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-brand-teal-dark transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Volver al inicio de sesión
      </Link>
    </div>
  );
};
