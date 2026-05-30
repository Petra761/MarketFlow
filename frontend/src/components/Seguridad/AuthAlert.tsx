import React from "react";

interface AuthAlertProps {
  message: string;
  variant?: "error" | "success";
}

export const AuthAlert: React.FC<AuthAlertProps> = ({ message, variant = "error" }) => {
  const styles =
    variant === "success"
      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
      : "bg-red-50 border-red-200 text-red-600";

  return (
    <div className={`${styles} border text-xs rounded-lg p-3.5 mb-2 flex items-center gap-2 select-none`}>
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        {variant === "success" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        )}
      </svg>
      <span>{message}</span>
    </div>
  );
};
