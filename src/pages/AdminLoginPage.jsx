import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useForm } from '../hooks/useForm';
import { validateLoginForm } from '../utils/validations';
import { adminApi } from '../api/adminApi';
import loginBackground from '../assets/Adogta_login.png';
import logo from '../assets/Adogta_logo.png';

/**
 * Página de inicio de sesión para administradores.
 */
const AdminLoginPage = () => {
  const navigate = useNavigate();

  // Ajusta los estilos.
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.minHeight = '100vh';
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.minHeight = '';
    };
  }, []);

  // Envía las credenciales y redirige al panel de administración
  const onSubmit = async (formData) => {
    await adminApi.login({ email: formData.email, password: formData.password });
    navigate('/admin/dashboard');
  };

  // Convierte el error del API en un mensaje legible para el usuario
  const handleApiError = (error) => {
    if (error.response?.data?.error) return error.response.data.error;
    if (error.response?.data?.message) return error.response.data.message;
    return 'Error al iniciar sesión. Verifica tus credenciales.';
  };

  // Hook del estado del formulario, validación y envío
  const { formData, errors, loading, serverError, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    validateLoginForm,
    onSubmit,
    handleApiError
  );

  // Pantalla de carga.
  if (loading) return <LoadingSpinner message="Iniciando sesión..." />;

  return (
    <PublicLayout backgroundImage={loginBackground}>
      <div className="max-w-[440px] w-full bg-white rounded-2xl p-10 shadow-xl relative z-10 border border-white/20 max-h-[90vh] overflow-auto">
        {/* Logo */}
        <div className="text-center mb-6">
          <img src={logo} alt="Adogta Logo" className="max-w-[180px] h-auto inline-block" />
        </div>

        {/* Títulos de la tarjeta. */}
        <h2 className="text-adogta-primary text-[28px] font-bold text-center tracking-tight mb-1">
          Administrador
        </h2>
        <p className="text-adogta-primary text-center text-sm opacity-80 mb-7">
          Inicia sesión con tu cuenta de administrador
        </p>

        {/* Error del servidor */}
        {serverError && (
          <div className="bg-[#FEF2F0] text-adogta-secondary px-4 py-3 rounded-xl mb-5 text-[13px] flex items-center gap-2 border border-adogta-secondary/30">
            <span>⚠️</span> {serverError}
          </div>
        )}

        {/* Error de validación del formulario */}
        {Object.keys(errors).length > 0 && !serverError && (
          <div className="bg-[#FEF2F0] text-adogta-secondary px-4 py-3 rounded-xl mb-5 text-[13px] flex items-center gap-2 border border-adogta-secondary/30">
            <span>⚠️</span> Por favor, llena adecuadamente los campos
          </div>
        )}

        {/* Formulario de login */}
        <form onSubmit={handleSubmit}>
          <Input
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@adogta.com"
            required
            disabled={loading}
            icon="📧"
            error={errors.email}
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Tu contraseña"
            required
            disabled={loading}
            icon="🔒"
            error={errors.password}
          />
          <Button type="submit" disabled={loading} loading={loading} fullWidth icon="🔐">
            Iniciar Sesión
          </Button>
        </form>

        {/* Enlace para dirigir al login normal */}
        <div className="mt-6 text-center text-adogta-primary text-[13px]">
          <Link to="/login" className="text-adogta-secondary no-underline font-semibold">
            Volver al inicio de sesión normal
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AdminLoginPage;