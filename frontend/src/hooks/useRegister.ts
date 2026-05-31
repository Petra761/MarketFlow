import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { RegisterData } from "../types/auth";
import { registerApi } from "../services/authService";
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validatePassword,
} from "../utils/validators";

export function useRegister() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const reqNombre = validateRequired(nombre, "nombre");
    if (reqNombre) newErrors.nombre = reqNombre;

    const reqApellido = validateRequired(apellido, "apellido");
    if (reqApellido) newErrors.apellido = reqApellido;

    const reqUser = validateRequired(username, "nombre de usuario");
    if (reqUser) newErrors.username = reqUser;

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    const phoneErr = validatePhone(telefono);
    if (phoneErr) newErrors.telefono = phoneErr;

    const passErr = validatePassword(password);
    if (passErr) newErrors.password = passErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    const payload: RegisterData = {
      role,
      nombre,
      apellido,
      username,
      email,
      telefono,
      password,
    };

    try {
      const result = await registerApi(payload);

      if (result.success) {
        setIsLoading(false);
        navigate("/iniciar-sesion", {
          state: { registered: true, email },
          replace: true,
        });
      } else {
        setIsLoading(false);
        setErrors({
          general: result.message || "No se pudo registrar la cuenta. Pruebe otro correo.",
        });
      }
    } catch (err) {
      setIsLoading(false);
      setErrors({ general: "Ocurrió un error en el servidor." });
      console.error(err);
    }
  };

  return {
    role,
    setRole,
    nombre,
    setNombre,
    apellido,
    setApellido,
    username,
    setUsername,
    email,
    setEmail,
    telefono,
    setTelefono,
    password,
    setPassword,
    isLoading,
    errors,
    handleSubmit,
  };
}
