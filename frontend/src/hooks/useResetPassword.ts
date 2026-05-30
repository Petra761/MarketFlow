import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { changePasswordApi } from "../services/authService";
import {
  validateEmail,
  validateNewPassword,
  validatePasswordMatch,
} from "../utils/validators";

export function useResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const emailFromUrl = searchParams.get("correo") ?? "";

  const [email, setEmail] = useState(emailFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const showEmailField = !emailFromUrl;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    const nextErrors: Record<string, string> = {};

    if (showEmailField) {
      const emailErr = validateEmail(email);
      if (emailErr) nextErrors.email = emailErr;
    }

    const passwordErr = validateNewPassword(newPassword);
    if (passwordErr) nextErrors.newPassword = passwordErr;

    const matchErr = validatePasswordMatch(newPassword, confirmPassword);
    if (matchErr) nextErrors.confirmPassword = matchErr;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const result = await changePasswordApi(emailFromUrl || email, newPassword);

      if (result.success) {
        setSuccessMessage(result.message || "Contraseña actualizada correctamente.");
        setTimeout(() => navigate("/iniciar-sesion"), 2000);
      } else {
        setErrors({
          general: result.message || "No se pudo restablecer la contraseña.",
        });
      }
    } catch (err) {
      setErrors({ general: "Ocurrió un error en el servidor." });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showEmailField,
    isLoading,
    errors,
    successMessage,
    handleSubmit,
  };
}
