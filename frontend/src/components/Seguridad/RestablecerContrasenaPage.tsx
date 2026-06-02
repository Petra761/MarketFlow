import React from "react";
import { AuthLayout } from "./AuthLayout";
import { FormContainer } from "./FormContainer";
import { Input } from "./Input";
import { Button } from "./Button";
import { AuthAlert } from "./AuthAlert";
import { BackToLoginLink } from "./BackToLoginLink";
import { PasswordStrengthBar } from "./PasswordStrengthBar";
import { HelpCard } from "./HelpCard";
import { useResetPassword } from "../../hooks/useResetPassword";

export const RestablecerContrasenaPage: React.FC = () => {
  const {
    email,
    setEmail,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showEmailField,
    isLoading,
    errors,
    successMessage,
    handleSubmit,
  } = useResetPassword();

  return (
    <AuthLayout
      headline="Nueva Contraseña"
      description="Crea una contraseña segura para proteger tu cuenta."
      eyebrow=""
      showSupportWidget
    >
      <FormContainer
        title="Restablecer tu clave"
        subtitle="Asegúrate de que tu nueva contraseña sea difícil de adivinar."
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && <AuthAlert message={errors.general} />}
          {successMessage && <AuthAlert message={successMessage} variant="success" />}

          {showEmailField && (
            <Input
              label="CORREO ELECTRÓNICO"
              type="email"
              icon="email"
              placeholder="nombre@marketflow.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={isLoading}
            />
          )}

          <div>
            <Input
              label="NUEVA CONTRASEÑA"
              type="password"
              icon="lock"
              placeholder="••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={errors.newPassword}
              disabled={isLoading}
            />
            <PasswordStrengthBar password={newPassword} />
          </div>

          <Input
            label="CONFIRMAR CONTRASEÑA"
            type="password"
            icon="lockConfirm"
            placeholder="••••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            disabled={isLoading}
          />

          <div className="pt-2">
            <Button text="Restablecer Contraseña" isLoading={isLoading} />
          </div>
        </form>

        <BackToLoginLink />
        <HelpCard />
      </FormContainer>
    </AuthLayout>
  );
};
