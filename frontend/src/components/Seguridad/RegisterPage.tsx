import React from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { FormContainer } from "./FormContainer";
import { RoleSelector } from "./RoleSelector";
import { Input } from "./Input";
import { Button } from "./Button";
import { AuthAlert } from "./AuthAlert";
import { useRegister } from "../../hooks/useRegister";

export const RegisterPage: React.FC = () => {
  const {
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
  } = useRegister();

  return (
    <AuthLayout
      headline="Únete"
      headlineSuffix="A marketflow"
      description="Crea tu cuenta en segundos. Publica tus propios productos para vender de forma directa o explora un catálogo único con precios increíbles cerca de ti."
    >
      <FormContainer title="Crea tu cuenta" subtitle="Completa tus datos para empezar en la plataforma">
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.general && <AuthAlert message={errors.general} />}

          <RoleSelector value={role} onChange={setRole} disabled={isLoading} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre" placeholder="Ej. Juan" value={nombre} onChange={(e) => setNombre(e.target.value)} error={errors.nombre} disabled={isLoading} />
            <Input label="Apellido" placeholder="Ej. Pérez" value={apellido} onChange={(e) => setApellido(e.target.value)} error={errors.apellido} disabled={isLoading} />
          </div>

          <Input label="Nombre de Usuario" placeholder="juan_perez" value={username} onChange={(e) => setUsername(e.target.value)} error={errors.username} disabled={isLoading} />
          <Input label="Correo Electrónico" placeholder="juan@marketflow.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} disabled={isLoading} />
          <Input label="Número de Teléfono" placeholder="Ej. 12345678" value={telefono} onChange={(e) => setTelefono(e.target.value)} error={errors.telefono} disabled={isLoading} />
          <Input label="Contraseña" type="password" placeholder="••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} disabled={isLoading} />

          <div className="pt-2">
            <Button text="Registrarse" isLoading={isLoading} />
          </div>
        </form>

        <div className="mt-7 text-center text-[13px] text-gray-500 select-none">
          ¿Ya tienes una cuenta?
          <Link to="/iniciar-sesion" className="text-brand-link font-bold ml-1 hover:text-brand-link-hover hover:underline transition-colors">
            Inicia sesión
          </Link>
        </div>
      </FormContainer>
    </AuthLayout>
  );
};
