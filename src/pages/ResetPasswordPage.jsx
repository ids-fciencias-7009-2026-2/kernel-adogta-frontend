import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { usuarioApi } from '../api/usuarioApi';
import { useForm } from '../hooks/useForm';
import { validateResetPasswordForm } from '../utils/validations';
import logo from '../assets/Adogta_logo.png';

/**
 * Página para restablecer la contraseña.
 * 
 * Recibe un token de recuperación mediante query string (?token=...)
 * y permite al usuario ingresar una nueva contraseña.
 * Tras el cambio exitoso, redirige al login automáticamente.
 */
const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  /** Estado local para el mensaje de éxito (useForm no lo incluye) */
  const [success, setSuccess] = useState('');

  /**
   * Envía la nueva contraseña al backend.
   * @param {Object} formData - { newPassword, confirmPassword }
   */
  const onSubmit = async (formData) => {
    if (!token) throw new Error('Token no válido');

    setSuccess('');
    await usuarioApi.resetPassword({ token, newPassword: formData.newPassword });
    setSuccess('Contraseña actualizada. Serás redirigido al inicio de sesión.');
    setTimeout(() => navigate('/login'), 3000);
  };

  /**
   * Extrae el mensaje de error de la respuesta del servidor.
   */
  const handleApiError = (error) => {
    return error.response?.data?.message || 'Error al restablecer la contraseña';
  };

  const {
    formData,
    errors,
    loading,
    serverError,
    handleChange,
    handleSubmit,
  } = useForm(
    { newPassword: '', confirmPassword: '' },
    validateResetPasswordForm,
    onSubmit,
    handleApiError
  );

  // Pantalla de carga
  if (loading) return <LoadingSpinner message="Restableciendo contraseña..." />;

  return (
    <PublicLayout backgroundImage={null}>
      <div className="max-w-[440px] w-full bg-white rounded-2xl p-10 shadow-xl relative z-10 border border-white/20">
        {/* Logo */}
        <div className="text-center mb-6">
          <img src={logo} alt="Adogta Logo" className="max-w-[180px] h-auto inline-block" />
        </div>

        {/* Títulos */}
        <h2 className="text-adogta-primary text-[28px] font-bold text-center tracking-tight mb-1">
          Nueva contraseña
        </h2>
        <p className="text-adogta-primary text-center text-sm opacity-80 mb-7">
          Elige una contraseña segura
        </p>

        {/* Mensaje de éxito */}
        {success && (
          <div className="bg-adogta-notification text-adogta-primary px-4 py-3 rounded-xl mb-5 text-[13px] flex items-center gap-2 border border-adogta-primary/20">
            <span>✓</span> {success}
          </div>
        )}

        {/* Error del servidor */}
        {serverError && (
          <div className="bg-adogta-error text-adogta-secondary px-4 py-3 rounded-xl mb-5 text-[13px] flex items-center gap-2 border border-adogta-secondary/30">
            <span>⚠️</span> {serverError}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <Input
            label="Nueva contraseña"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Contraseña segura"
            required
            disabled={loading}
            icon="🔒"
            error={errors.newPassword}
          />
          <Input
            label="Confirmar contraseña"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repite la contraseña"
            required
            disabled={loading}
            icon="🔒"
            error={errors.confirmPassword}
          />
          <Button type="submit" disabled={loading} loading={loading} fullWidth icon="🐾">
            Restablecer contraseña
          </Button>
        </form>
      </div>
    </PublicLayout>
  );
};

export default ResetPasswordPage;