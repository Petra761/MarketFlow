import React from "react";
import { AuthLayout } from "./AuthLayout";
import { FormContainer } from "./FormContainer";
import { Input } from "./Input";
import { Button } from "./Button";
import { AuthAlert } from "./AuthAlert";
import { AuthFooter } from "./AuthFooter";
import { BackToLoginLink } from "./BackToLoginLink";
import { useRecoverPassword } from "../../hooks/useRecoverPassword";

export const RecuperarContrasenaPage: React.FC = () => {
  const {
    email,
    setEmail,
    isLoading,
    errors,
    successMessage,
    handleSubmit,
  } = useRecoverPassword();

  return (
    <AuthLayout
      headline="Recuperar Contraseña"
      description="Ingresa tu correo para recibir un enlace de recuperación."
      eyebrow=""
      showSupportWidget
    >
      <FormContainer
        title="Cambia tu contraseña"
        subtitle="De esta manera se te mandará un link para que puedas cambiar tu contraseña de manera más segura."
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && <AuthAlert message={errors.general} />}
          {successMessage && <AuthAlert message={successMessage} variant="success" />}

          <Input
            label="DIRECCIÓN DE CORREO"
            type="email"
            icon="email"
            placeholder="nombre@marketflow.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            disabled={isLoading}
          />

          <div className="pt-2">
            <Button text="Enviar Enlace" isLoading={isLoading} />
          </div>
        </form>

        <BackToLoginLink />
        <AuthFooter />
      </FormContainer>
    </AuthLayout>
  );
};
