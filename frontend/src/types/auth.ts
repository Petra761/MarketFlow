export interface AuthUser {
  name: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  role: "buyer" | "seller";
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  telefono: string;
  password: string;
}

export interface ServiceResult<T = void> {
  success: boolean;
  data?: T;
  message?: string;
}
