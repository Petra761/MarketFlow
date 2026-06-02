import React from "react";

export const AuthFooter: React.FC = () => {
  return (
    <p className="mt-8 text-center text-[11px] text-gray-400 leading-relaxed select-none">
      Al continuar, aceptas nuestros{" "}
      <span className="text-brand-link hover:text-brand-link-hover cursor-pointer">Términos de Servicio</span>
      {" "}y{" "}
      <span className="text-brand-link hover:text-brand-link-hover cursor-pointer">Política de Privacidad</span>.
    </p>
  );
};
