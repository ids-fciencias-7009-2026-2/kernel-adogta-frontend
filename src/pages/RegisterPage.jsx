import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usuarioApi } from '../api/usuarioApi';
import Terms from '../modals/Terms';
import PublicLayout from '../layouts/PublicLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Checkbox from '../components/common/Checkbox';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useForm } from '../hooks/useForm';
import { validateRegisterForm } from '../utils/validations';
import registerBackground from '../assets/Adogta_register.png';
import logo from '../assets/Adogta_logo.png';

/**
 * Página de registro de nuevos usuarios
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');

  // Limpia los estilos del body
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

  /**
   * Envía los datos de registro al backend
   */
  const onSubmit = async (formData) => {
    setServerError('');
    setSuccess('');
    
    const userData = {
      nombres: formData.nombres,
      apellidoPaterno: formData.apellidoPaterno,
      apellidoMaterno: formData.apellidoMaterno,
      email: formData.email,
      contrasena: formData.contrasena,
      aceptaTerminos: formData.aceptaTerminos,
      codigoPostal: formData.codigoPostal,
      telefono: formData.telefono,
      proveedorAutenticacion: "LOCAL",
      esAdoptante: true,
      esDonante: false
    };
    
    await usuarioApi.register(userData);
    setSuccess('¡Registro exitoso! Redirigiendo al login...');
    
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  /**
   * Maneja errores del servidor
   */
  const handleApiError = (error) => {
    if (error.response?.data?.message) {
      setServerError(error.response.data.message);
    } else if (error.response?.status === 409) {
      setServerError('El correo electrónico ya está registrado');
    } else {
      setServerError('Error al registrar usuario. Intenta nuevamente.');
    }
  };

  const {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
  } = useForm(
    {
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      email: '',
      contrasena: '',
      confirmarContrasena: '',
      aceptaTerminos: false,
      codigoPostal: '',
      telefono: '',
    },
    validateRegisterForm,
    onSubmit,
    handleApiError
  );

  if (loading && !success) {
    return <LoadingSpinner message="Registrando usuario..." />;
  }

  return (
    <>
      <PublicLayout backgroundImage={registerBackground}>
        {/* Tarjeta de registro */}
        <div className="max-w-[580px] w-full bg-white rounded-2xl p-8 shadow-xl relative z-10 border border-white/20 max-h-[90vh] overflow-auto">
          
          {/* Logo */}
          <div className="text-center mb-5">
            <img 
              src={logo} 
              alt="Adogta Logo" 
              className="max-w-[140px] h-auto inline-block"
            />
          </div>
          
          <h2 className="text-adogta-primary text-[28px] font-bold text-center tracking-tight mb-1">
            Crear cuenta
          </h2>
          <p className="text-adogta-primary text-center text-sm opacity-80 mb-7">
            Únete a Adogta y ayuda a encontrar un hogar
          </p>
          
          {/* Error del servidor */}
          {serverError && (
            <div className="bg-[#FEF2F0] text-adogta-secondary px-4 py-3 rounded-xl mb-5 text-[13px] flex items-center gap-2 border border-adogta-secondary/30">
              <span>⚠️</span> {serverError}
            </div>
          )}
          
          {/* Mensaje de éxito */}
          {success && (
            <div className="bg-[#E8F3F0] text-adogta-primary px-4 py-3 rounded-xl mb-5 text-[13px] flex items-center gap-2 border border-adogta-primary/20">
              <span>✓</span> {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Fila 1: Nombres, Apellido Paterno, Apellido Materno */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                label="Nombre(s)"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                placeholder="Juan Carlos"
                required
                disabled={loading}
                error={errors.nombres}
              />
              
              <Input
                label="Apellido Paterno"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                placeholder="Pérez"
                required
                disabled={loading}
                error={errors.apellidoPaterno}
              />
              
              <Input
                label="Apellido Materno"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                placeholder="Rodríguez"
                required
                disabled={loading}
                error={errors.apellidoMaterno}
              />
            </div>
            
            {/* Fila 2: Correo electrónico */}
            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              required
              disabled={loading}
              error={errors.email}
            />
            
            {/* Fila 3: Contraseña y Confirmar contraseña */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Contraseña"
                name="contrasena"
                type="password"
                value={formData.contrasena}
                onChange={handleChange}
                placeholder="Contraseña segura"
                required
                disabled={loading}
                error={errors.contrasena}
              />
              
              <Input
                label="Confirmar contraseña"
                name="confirmarContrasena"
                type="password"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                required
                disabled={loading}
                error={errors.confirmarContrasena}
              />
            </div>
            
            {/* Fila 4: Código postal y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Código Postal"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
                placeholder="5 dígitos"
                maxLength="5"
                required
                disabled={loading}
                error={errors.codigoPostal}
              />
              
              <Input
                label="Teléfono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="10 dígitos"
                maxLength="10"
                required
                disabled={loading}
                error={errors.telefono}
              />
            </div>
            
            {/* Checkbox de términos y condiciones */}
            <Checkbox
              name="aceptaTerminos"
              checked={formData.aceptaTerminos}
              onChange={handleChange}
              label="Acepto los "
              linkText="términos y condiciones"
              onLinkClick={() => setShowTerms(true)}
              required
              disabled={loading}
            />
            {errors.aceptaTerminos && (
              <div className="text-adogta-secondary text-xs -mt-4 mb-4">
                {errors.aceptaTerminos}
              </div>
            )}
            
            {/* Botón Crear cuenta */}
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              fullWidth
              icon="🐕"
            >
              Crear cuenta
            </Button>
          </form>
          
          {/* Enlace a login */}
          <div className="mt-6 text-center text-adogta-primary text-[13px]">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-adogta-secondary no-underline font-semibold border-b border-dashed border-adogta-secondary">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </PublicLayout>

      {/* Modal de términos y condiciones */}
      <Terms
        isOpen={showTerms} 
        onClose={() => setShowTerms(false)} 
      />
    </>
  );
};

export default RegisterPage;