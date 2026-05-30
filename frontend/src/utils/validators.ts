/**
 * Unified form input validation helpers.
 */

/**
 * Validates that a string value is not empty.
 * Returns an error message if invalid, or null if valid.
 */
export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || !value.trim()) {
    return `El campo ${fieldName} es requerido.`;
  }
  return null;
}

/**
 * Validates whether the given string is a valid email format.
 * Returns an error message if invalid, or null if valid.
 */
export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) {
    return "El correo electrónico es requerido.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Ingrese un correo electrónico válido.";
  }
  return null;
}

/**
 * Validates that the phone number contains only numbers and is at least 8 digits.
 * Returns an error message if invalid, or null if valid.
 */
export function validatePhone(phone: string): string | null {
  if (!phone || !phone.trim()) {
    return "El número de teléfono es requerido.";
  }
  const phoneRegex = /^[0-9]+$/;
  if (!phoneRegex.test(phone)) {
    return "El número de teléfono debe contener solo números.";
  }
  if (phone.length < 8) {
    return "El número de teléfono debe tener al menos 8 dígitos.";
  }
  return null;
}

/**
 * Validates the length and presence of a password.
 * Returns an error message if invalid, or null if valid.
 */
export function validatePassword(password: string): string | null {
  if (!password) {
    return "La contraseña es requerida.";
  }
  if (password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  return null;
}

/**
 * Validates a new password for reset flows (min 8 chars + symbol).
 */
export function validateNewPassword(password: string): string | null {
  if (!password) {
    return "La contraseña es requerida.";
  }
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "La contraseña debe incluir al menos un símbolo.";
  }
  return null;
}

/**
 * Validates that password and confirmation match.
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): string | null {
  if (!confirmPassword) {
    return "Debes confirmar la contraseña.";
  }
  if (password !== confirmPassword) {
    return "Las contraseñas no coinciden.";
  }
  return null;
}
