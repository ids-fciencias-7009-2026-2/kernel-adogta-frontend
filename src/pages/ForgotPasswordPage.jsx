import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { usuarioApi } from '../api/usuarioApi';
import { useForm } from '../hooks/useForm';
import { validateForgotPasswordForm } from '../utils/validations';
import logo from '../assets/Adogta_logo.png';

/**
 * Página para solicitar la recuperación de contraseña.
 * 
 * Permite al usuario ingresar su correo electrónico y recibir
 * un enlace de restablecimiento. 
 */
const ForgotPasswordPage = () => {
  const [success, setSuccess] = useState(false);

  /**
   * Envía la solicitud de recuperación al backend.
   * @param {Object} formData       - Datos del formulario
   * @param {string} formData.email - Correo del usuario
   * @returns {Promise<void>}
   */
  const onSubmit = async (formData) => {
    await usuarioApi.forgotPassword({ email: formData.email });
  };

  const handleSuccess = () => setSuccess(true);

  /**
   * Extrae el mensaje de error de la respuesta del servidor.
   * @param {Object} error  - Error (axios)
   * @returns {string}      - Mensaje para el usuario
   */
  const getApiError = (error) => {
    return error.response?.data?.message || 'Error al enviar la solicitud';
  };

  const {
    formData,
    errors,
    loading,
    serverError,
    handleChange,
    handleSubmit,
  } = useForm(
    { email: '' },
    validateForgotPasswordForm,
    onSubmit,
    getApiError,
    handleSuccess
  );

  // Pantalla de carga
  if (loading) {
    return <LoadingSpinner message="Enviando solicitud..." />;
  }

  return (
    <PublicLayout backgroundImage={null}>
      {/* El objeto formulario */}
      <div className="max-w-[440px] w-full bg-white rounded-2xl p-10 shadow-xl relative z-10 border border-white/20">
        {/* Logo */}
        <div className="text-center mb-6">
          <img src={logo} alt="Adogta Logo" className="max-w-[180px] h-auto inline-block" />
        </div>

        {/* Títulos */}
        <h2 className="text-adogta-primary text-[28px] font-bold text-center tracking-tight mb-1">
          Recuperar contraseña
        </h2>
        <p className="text-adogta-primary text-center text-sm opacity-80 mb-7">
          Ingresa tu correo y te enviaremos un enlace
        </p>

        {/* Respuesta */}
        {success && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-5 text-[13px] flex items-center gap-2 border border-green-300">
            Revisa tu correo electrónico para continuar.
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
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            required
            disabled={loading}
            icon="📧"
            error={errors.email}
          />
          <Button type="submit" disabled={loading} loading={loading} fullWidth icon="🐾">
            Enviar enlace
          </Button>
        </form>

        {/* Volver al login */}
        <div className="mt-6 text-center text-adogta-primary text-[13px]">
          <Link to="/login" className="text-adogta-secondary no-underline font-semibold">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ForgotPasswordPage;