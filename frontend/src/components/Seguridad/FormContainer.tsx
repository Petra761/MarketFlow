import React from "react";

interface FormContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const FormContainer: React.FC<FormContainerProps> = ({ title, subtitle, children }) => {
  return (
    <div className="w-full max-w-[420px] mx-auto flex flex-col justify-center min-h-[500px]">
      <div className="mb-8">
        <h2 className="text-[34px] font-bold tracking-tight text-brand-teal-dark">
          {title}
        </h2>
        <p className="text-[14px] text-gray-500 mt-1 select-none">
          {subtitle}
        </p>
      </div>
      {children}
    </div>
  );
};
