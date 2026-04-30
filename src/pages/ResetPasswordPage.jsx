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
 * Recibe un token de recuperación mediante "?token=...""
 * y permite al usuario ingresar una nueva contraseña.
 * Tras el cambio exitoso, redirige al login automáticamente.
 */
const ResetPasswordPage = () => {
  /** Obtiene el token de la URL */
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);

  /**
   * Envía la nueva contraseña al backend.
   * @param {Object} formData               - Datos del formulario
   * @param {string} formData.newPassword   - Nueva contraseña
   * @returns {Promise<void>}
   */
  const onSubmit = async (formData) => {
    if (!token) throw new Error('Token no válido');
    await usuarioApi.resetPassword({ token, newPassword: formData.newPassword });
  };

  /**
   * Se ejecuta cuando el restablecimiento se completa.
   * Muestra mensaje y redirige al login después de 3 segundos.
   */
  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => navigate('/login'), 3000);
  };

  /**
   * Extrae el mensaje de error de la respuesta del servidor.
   * @param {Object} error - Error (axios)
   * @returns {string}     - Mensaje para el usuario
   */
  const getApiError = (error) => {
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
    getApiError,
    handleSuccess
  );

  // Pantalla de carga
  if (loading) {
    return <LoadingSpinner message="Restableciendo contraseña..." />;
  }

  return (
    <PublicLayout backgroundImage={null}>
      {/* Objeto formulario */}
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

        {/* Respuesta */}
        {success && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-5 text-[13px] flex items-center gap-2 border border-green-300">
            Contraseña actualizada. Serás redirigido al inicio de sesión.
          </div>
        )}

        {/* Error de servidor */}
        {serverError && (
          <div className="bg-[#FEF2F0] text-adogta-secondary px-4 py-3 rounded-xl mb-5 text-[13px] flex items-center gap-2 border border-adogta-secondary/30">
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
            placeholder="Mínimo 8 caracteres"
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