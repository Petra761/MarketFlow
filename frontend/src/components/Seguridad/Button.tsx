import React from "react";

interface ButtonProps {
  text: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "submit" | "button";
}

export const Button: React.FC<ButtonProps> = ({
  text,
  isLoading = false,
  disabled = false,
  onClick,
  type = "submit",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className="w-full bg-brand-btn hover:bg-brand-btn-hover text-white text-[14px] font-semibold py-3.5 px-4 rounded-lg shadow-btn hover:shadow-btn-hover hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Procesando...</span>
        </>
      ) : (
        <>
          <span>{text}</span>
          <svg
            className="w-4 h-4 ml-0.5 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </>
      )}
    </button>
  );
};
