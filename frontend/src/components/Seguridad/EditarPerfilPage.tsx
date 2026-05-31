import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { Input } from "./Input";
import { Button } from "./Button";
import { AuthAlert } from "./AuthAlert";
import { RoleReadonly } from "./RoleReadonly";
import { useProfile } from "../../hooks/useProfile";

interface EditarPerfilPageProps {
  closePath: string;
}

export const EditarPerfilPage: React.FC<EditarPerfilPageProps> = ({ closePath }) => {
  const navigate = useNavigate();
  const {
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
  } = useProfile();

  const disabled = isLoading || isSaving;

  return (
    <AuthLayout
      headline="Gestiona tu Perfil"
      description="Mantén tus datos actualizados para garantizar transacciones seguras. Puedes modificar tu información de contacto o cambiar tu contraseña cuando lo necesites."
    >
      <div className="w-full max-w-[420px] mx-auto flex flex-col justify-center min-h-[500px] relative">
        <button
          type="button"
          onClick={() => navigate(closePath)}
          className="absolute -top-2 right-0 flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-8">
          <h2 className="text-[34px] font-bold tracking-tight text-brand-teal-dark">Editar Perfil</h2>
          <p className="text-[14px] text-gray-500 mt-1 select-none">
            Modifica los datos de tu cuenta en la plataforma
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
            Cargando perfil...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && <AuthAlert message={errors.general} />}
            {successMessage && <AuthAlert message={successMessage} variant="success" />}

            <RoleReadonly role={rol} />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                error={errors.nombre}
                disabled={disabled}
              />
              <Input
                label="Apellido"
                placeholder="Tu apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                error={errors.apellido}
                disabled={disabled}
              />
            </div>

            <Input
              label="Nombre de usuario"
              placeholder="Tu nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              error={errors.nickname}
              disabled={disabled}
            />

            <Input
              label="Correo electrónico"
              type="email"
              icon="email"
              placeholder="tu@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              error={errors.correo}
              disabled={disabled}
            />

            <Input
              label="Número de teléfono"
              placeholder="+00 000 000 000"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              error={errors.numero}
              disabled={disabled}
            />

            <div className="pt-2">
              <Button text="Guardar Cambios" isLoading={isSaving} />
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};
