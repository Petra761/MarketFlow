import React from "react";

interface RoleSelectorProps {
  value: "buyer" | "seller";
  onChange: (value: "buyer" | "seller") => void;
  disabled?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <label className="block text-[11px] font-bold tracking-widest text-brand-teal-dark uppercase mb-3.5 select-none">
        ¿QUÉ DESEAS HACER?
      </label>

      <div className="flex items-center space-x-6">
        <label className={`flex items-center space-x-2 text-[14px] font-medium ${disabled ? "opacity-60 cursor-default" : "cursor-pointer"} select-none`}>
          <input
            type="radio"
            name="role"
            value="buyer"
            checked={value === "buyer"}
            onChange={() => !disabled && onChange("buyer")}
            className="sr-only"
            disabled={disabled}
          />
          <span
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
              value === "buyer"
                ? "border-brand-teal-dark bg-white"
                : "border-gray-300 hover:border-brand-teal-dark bg-white"
            }`}
          >
            {value === "buyer" && <span className="w-2 h-2 rounded-full bg-brand-teal-dark" />}
          </span>
          <span className={`${value === "buyer" ? "text-brand-teal-dark font-semibold" : "text-gray-600"} transition-colors`}>
            Quiero Comprar
          </span>
        </label>

        <label className={`flex items-center space-x-2 text-[14px] font-medium ${disabled ? "opacity-60 cursor-default" : "cursor-pointer"} select-none`}>
          <input
            type="radio"
            name="role"
            value="seller"
            checked={value === "seller"}
            onChange={() => !disabled && onChange("seller")}
            className="sr-only"
            disabled={disabled}
          />
          <span
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
              value === "seller"
                ? "border-brand-teal-dark bg-white"
                : "border-gray-300 hover:border-brand-teal-dark bg-white"
            }`}
          >
            {value === "seller" && <span className="w-2 h-2 rounded-full bg-brand-teal-dark" />}
          </span>
          <span className={`${value === "seller" ? "text-brand-teal-dark font-semibold" : "text-gray-600"} transition-colors`}>
            Quiero Vender
          </span>
        </label>
      </div>
    </div>
  );
};
