import React from "react";

interface PasswordStrengthBarProps {
  password: string;
}

function getStrengthLevel(password: string): 0 | 1 | 2 | 3 {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)) score += 1;

  return score as 0 | 1 | 2 | 3;
}

const barColors = ["bg-gray-200", "bg-red-400", "bg-amber-400", "bg-brand-btn"];

export const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({ password }) => {
  const level = getStrengthLevel(password);
  const activeColor = level > 0 ? barColors[level] : "bg-gray-200";

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1.5">
        {[1, 2, 3].map((segment) => (
          <div
            key={segment}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              level >= segment ? activeColor : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-[11px] text-gray-400 select-none">
        Mínimo 8 caracteres, incluye un símbolo.
      </p>
    </div>
  );
};
