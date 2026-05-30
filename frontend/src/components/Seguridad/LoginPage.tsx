import React from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { FormContainer } from "./FormContainer";
import { Input } from "./Input";
import { Button } from "./Button";
import { AuthAlert } from "./AuthAlert";
import { useLogin } from "../../hooks/useLogin";

export const LoginPage: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errors,
    handleSubmit,
  } = useLogin();

  return (
    <AuthLayout
      headline="Bienvenido"
      headlineSuffix="A marketflow"
      description="Tu espacio de trabajo te está esperando accede y retoma donde lo dejaste con todo tu equipo."
    >
      <FormContainer title="Inicia sesión" subtitle="Ingresa tus credenciales para continuar">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && <AuthAlert message={errors.general} />}

          <Input
            label="CORREO ELECTRÓNICO"
            placeholder="tugempresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            disabled={isLoading}
          />

          <div>
            <div className="flex justify-between items-center mb-2 select-none">
              <label className="block text-[11px] font-bold tracking-widest text-brand-teal-dark uppercase">
                CONTRASEÑA
              </label>
              <Link
                to="/recuperar-contrasena"
                className="text-[11px] font-bold text-brand-link hover:text-brand-link-hover transition-colors"
              >
                ¿Olvidaste la contraseña?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              disabled={isLoading}
            />
          </div>

          <div className="pt-2">
            <Button text="Iniciar Sesión" isLoading={isLoading} />
          </div>
        </form>

        <div className="mt-8 text-center text-[13px] text-gray-500 select-none">
          ¿No tienes cuenta?
          <Link
            to="/registro"
            className="text-brand-link font-bold ml-1 hover:text-brand-link-hover hover:underline transition-colors"
          >
            Regístrate gratis
          </Link>
        </div>
      </FormContainer>
    </AuthLayout>
  );
};
