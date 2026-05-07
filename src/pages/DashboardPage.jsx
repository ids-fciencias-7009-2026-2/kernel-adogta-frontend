import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Terms from '../modals/Terms';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import dashboardBackground from '../assets/Adogta_dashboard.png';

/**
 * Página principal del dashboard
 * Por el momento solo muestra mensaje de bienvenida y acceso a perfil/términos.
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Pantalla de carga
  if (loading) {
    return <LoadingSpinner message="Cargando tu dashboard..." />;
  }

  // Si no hay usuario, manda al login
  if (!user) {
    navigate('/login');
    return null;
  }

  // Botones que aparecen en el header
  const headerButtons = [
    {
      label: 'Publicar mascota',
      onClick: () => navigate('/publicar'),
      variant: 'primary'
    },
    {
      label: 'Mi Perfil',
      onClick: () => navigate('/profile'),
      variant: 'primary'
    },
    {
      label: 'Términos y Condiciones',
      onClick: () => setShowTermsModal(true),
      variant: 'secondary'
    }
  ];

  return (
    <>
      <AuthLayout 
        title="Inicio"
        backgroundImage={dashboardBackground}
        buttons={headerButtons}
      >
        {/* Tarjeta con mensaje de bienvenida */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-[600px] w-full text-center p-12">
          {/* Emoji */}
          <div className="text-6xl mb-4">🐾</div>
          
          {/* Título con nombre del usuario */}
          <h1 className="text-adogta-primary text-[1.75rem] font-bold mb-4">
            ¡Bienvenido, {user?.nombres || user?.nombre || 'Usuario'}!
          </h1>
          
          {/* Mensaje de bienvenida */}
          <p className="text-adogta-primary text-sm leading-relaxed opacity-90">
            Estamos felices de tenerte en Adogta: Una comunidad comprometida 
            con el bienestar animal.
          </p>
        </div>
      </AuthLayout>

      {/* Modal de términos */}
      <Terms isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </>
  );
};

export default DashboardPage;