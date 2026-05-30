import React from "react";
import { SupportWidget } from "./SupportWidget";

interface AuthLayoutProps {
  headline: string;
  headlineSuffix?: string;
  description: string;
  eyebrow?: string;
  showSupportWidget?: boolean;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  headline,
  headlineSuffix,
  description,
  eyebrow = "PLATAFORMA DE COMPRA Y VENTA",
  showSupportWidget = false,
  children,
}) => {
  return (
    <div className="min-h-screen flex bg-brand-bg-light select-none font-sans">
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] bg-gradient-to-br from-[#0a2838] via-[#0d3b4f] to-[#125875] text-white p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-cyan-400/5 rounded-full blur-[100px] -translate-y-24 translate-x-24 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[80px] translate-y-24 -translate-x-24 pointer-events-none" />

        <div className="flex items-center space-x-3 z-10">
          <div className="flex items-center justify-center text-white">
            <svg
              className="w-10 h-10 transform scale-x-[-1]"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 12H28C29.6569 12 31 13.3431 31 15V18.5C31 20.9853 28.9853 23 26.5 23H13.5C11.0147 23 9 20.9853 9 18.5V11L6 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="14.5" y1="12" x2="14.5" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="20" y1="12" x2="20" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="25.5" y1="12" x2="25.5" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="9" y1="17" x2="31" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="14" cy="29" r="2" fill="currentColor" />
              <circle cx="26" cy="29" r="2" fill="currentColor" />
            </svg>
          </div>
          <span className="text-[25px] font-bold tracking-tight text-white select-none">MarketFlow</span>
        </div>

        <div className="z-10 my-auto flex flex-col justify-center">
          {eyebrow && (
            <span className="text-[12px] font-bold tracking-[0.2em] text-[#0ea5e9] uppercase mb-4">
              {eyebrow}
            </span>
          )}
          <h1 className="text-[44px] font-bold tracking-tight leading-[1.1] text-white">
            {headline}
          </h1>
          {headlineSuffix && (
            <h1 className="text-[44px] font-bold tracking-tight leading-[1.1] text-white mb-6">
              {headlineSuffix}
            </h1>
          )}
          {!headlineSuffix && <div className="mb-6" />}
          <p className="text-[15px] text-[#cbd5e1] leading-relaxed max-w-[340px] font-light">
            {description}
          </p>
        </div>

        <div className="z-10">
          {showSupportWidget && <SupportWidget />}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24 py-12 relative overflow-y-auto">
        {children}
      </div>
    </div>
  );
};
