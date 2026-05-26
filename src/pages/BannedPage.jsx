import { useSearchParams, Link } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import logo from '../assets/Adogta_logo.png';
import loginBackground from '../assets/Adogta_login.png';

/**
 * Página mostrada a usuarios que han sido baneados.
 * Recibe el motivo del baneo y se lo muestra al usuario.
 */
const BannedPage = () => {
  // Obtiene el motivo con la URL.
  const [searchParams] = useSearchParams();
  const motivo = searchParams.get('motivo') || 'Violación de las normas comunitarias.';

  return (
    <PublicLayout backgroundImage={loginBackground}>
      <div className="max-w-[440px] w-full bg-white rounded-2xl p-10 shadow-xl relative z-10 border border-white/20">
        {/* Logo */}
        <div className="text-center mb-6">
          <img src={logo} alt="Adogta Logo" className="max-w-[180px] h-auto inline-block" />
        </div>

        {/* Título y mensaje principal de la tarjeta. */}
        <h2 className="text-adogta-primary text-[28px] font-bold text-center tracking-tight mb-1">
          Cuenta suspendida
        </h2>
        <p className="text-adogta-primary text-center text-sm opacity-80 mb-7">
          Tu cuenta ha sido suspendida.
        </p>

        {/* Cuadro con el motivo de la suspensión */}
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm mb-6">
          <strong>Motivo:</strong> {motivo}
        </div>

        {/* Información de contacto a sporte: adogtaofficial@gmail.com */}
        <p className="text-adogta-primary text-center text-sm mb-6">
          Si consideras que se trata de un error, contacta a nuestro equipo de soporte en{' '}
          <a href="mailto:adogtaofficial@gmail.com" className="text-adogta-secondary underline">
            adogtaofficial@gmail.com
          </a>
        </p>

        {/* Enlace para volver al inicio de sesión */}
        <div className="text-center">
          <Link to="/login" className="text-adogta-secondary no-underline font-semibold border-b border-dashed border-adogta-secondary">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default BannedPage;