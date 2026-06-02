/**
 * URL base del API. En local usa .env.development; en producción define VITE_API_URL
 * (ej. https://tu-api.azurewebsites.net/api).
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5173/api";
