import { useCallback, useEffect, useState, type FormEvent } from "react";
import { getProfileApi, updateProfileApi } from "../services/authService";
import { getStoredUser, saveAuthUser } from "../services/authStorage";
import type { ProfileData } from "../types/auth";
import {
  validateEmail,
  validatePhone,
  validateRequired,
} from "../utils/validators";

export function useProfile() {
  const stored = getStoredUser();
  const codigoUsuario = stored?.codigoUsuario ?? "";

  const [rol, setRol] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nickname, setNickname] = useState("");
  const [correo, setCorreo] = useState("");
  const [numero, setNumero] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const loadProfile = useCallback(async () => {
    if (!codigoUsuario) {
      setErrors({ general: "Sesión inválida. Vuelve a iniciar sesión." });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrors({});

    const result = await getProfileApi(codigoUsuario);

    if (result.success && result.data) {
      const p: ProfileData = result.data;
      setRol(p.rol);
      setNombre(p.nombre);
      setApellido(p.apellido);
      setNickname(p.nickname);
      setCorreo(p.correo);
      setNumero(p.numero);
    } else {
      setErrors({ general: result.message || "No se pudo cargar el perfil." });
    }

    setIsLoading(false);
  }, [codigoUsuario]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    const nextErrors: Record<string, string> = {};

    const reqNombre = validateRequired(nombre, "nombre");
    if (reqNombre) nextErrors.nombre = reqNombre;

    const reqApellido = validateRequired(apellido, "apellido");
    if (reqApellido) nextErrors.apellido = reqApellido;

    const reqNick = validateRequired(nickname, "nombre de usuario");
    if (reqNick) nextErrors.nickname = reqNick;

    const emailErr = validateEmail(correo);
    if (emailErr) nextErrors.correo = emailErr;

    const phoneErr = validatePhone(numero);
    if (phoneErr) nextErrors.numero = phoneErr;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (!codigoUsuario) {
      setErrors({ general: "Sesión inválida. Vuelve a iniciar sesión." });
      return;
    }

    setErrors({});
    setIsSaving(true);

    try {
      const result = await updateProfileApi(codigoUsuario, {
        nombre,
        apellido,
        nickname,
        correo,
        numero,
      });

      if (result.success) {
        setSuccessMessage(result.message || "Perfil actualizado correctamente.");
        if (stored) {
          saveAuthUser({
            ...stored,
            name: nombre,
            email: correo,
          });
        }
      } else {
        setErrors({ general: result.message || "No se pudo guardar el perfil." });
      }
    } catch {
      setErrors({ general: "Ocurrió un error en el servidor." });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    rol,
    nombre,
    setNombre,
    apellido,
    setApellido,
    nickname,
    setNickname,
    correo,
    setCorreo,
    numero,
    setNumero,
    isLoading,
    isSaving,
    errors,
    successMessage,
    handleSubmit,
  };
};
