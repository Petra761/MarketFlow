import { useState, type FormEvent } from "react";
import { recoverAccountApi } from "../services/authService";
import { validateEmail } from "../utils/validators";

export function useRecoverPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    const emailErr = validateEmail(email);
    if (emailErr) {
      setErrors({ email: emailErr });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const result = await recoverAccountApi(email);

      if (result.success) {
        setSuccessMessage(
          result.message ||
            "Revisa tu correo. Te enviamos un enlace para cambiar tu contraseña."
        );
      } else {
        setErrors({
          general: result.message || "No se pudo enviar el enlace de recuperación.",
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
    isLoading,
    errors,
    successMessage,
    handleSubmit,
  };
}
