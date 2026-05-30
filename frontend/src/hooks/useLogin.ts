import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/authService";
import { saveAuthUser } from "../services/authStorage";
import { getRedirectPathForRole } from "../utils/authRoutes";
import { validateEmail, validatePassword } from "../utils/validators";

export function useLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    const passErr = validatePassword(password);
    if (passErr) newErrors.password = passErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const result = await loginApi({ email, password });

      if (result.success && result.data) {
        saveAuthUser(result.data);
        const path = getRedirectPathForRole(result.data.role);
        setTimeout(() => {
          setIsLoading(false);
          navigate(path);
        }, 1200);
      } else {
        setIsLoading(false);
        setErrors({ general: result.message || "Credenciales inválidas." });
      }
    } catch (err) {
      setIsLoading(false);
      setErrors({ general: "Ocurrió un error en el servidor." });
      console.error(err);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errors,
    handleSubmit,
  };
}
