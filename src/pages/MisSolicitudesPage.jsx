import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { solicitudApi } from '../api/solicitudApi';
import { useAuth } from '../hooks/useAuth';
import dashboardBackground from '../assets/Adogta_dashboard.png';

/**
 * Página que muestra todas las solicitudes de adopción
 * enviadas por el usuario autenticado.
 */
const MisSolicitudesPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (!authLoading && user) {
      cargarSolicitudes();
    }
  }, [authLoading, user]);

  /**
   * Carga las solicitudes del usuario autenticado desde el backend.
   */
  const cargarSolicitudes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await solicitudApi.getMisSolicitudes();
      setSolicitudes(data);
    } catch (err) {
      setError('No se pudieron cargar tus solicitudes. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Devuelve estilos de color según el estado de la solicitud.
   */
  const estiloEstado = (estado) => {
    switch (estado) {
      case 'Aprobada':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'Rechazada':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'Cancelada':
        return 'bg-gray-100 text-gray-600 border border-gray-200';
      default:
        return 'bg-adogta-background text-adogta-primary border border-adogta-border';
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner message="Cargando tus solicitudes..." />;
  }

  const headerButtons = [
    {
      label: 'Inicio',
      onClick: () => navigate('/dashboard'),
      variant: 'secondary',
    },
  ];

  return (
    <AuthLayout
      title="Mis solicitudes"
      backgroundImage={dashboardBackground}
      showBackButton={true}
      backPath="/dashboard"
      buttons={headerButtons}
    >
      <div className="max-w-[700px] w-full">

        {/* Error */}
        {error && (
          <div className="bg-adogta-error text-adogta-secondary px-4 py-3 rounded-xl mb-6 text-[13px] flex items-center gap-2 border border-adogta-secondary/30">
            {error}
          </div>
        )}

        {/* Sin solicitudes */}
        {!error && solicitudes.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-5xl mb-4">🐾</div>
            <h2 className="text-adogta-primary text-xl font-bold mb-2">
              Aún no tienes solicitudes
            </h2>
            <p className="text-adogta-primary text-sm opacity-80 mb-6">
              Cuando te interese un animal y envíes una solicitud, aparecerá aquí.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-adogta-secondary text-white rounded-full px-6 py-2 text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-orange-600 hover:scale-105 active:scale-95"
            >
              Explorar animales
            </button>
          </div>
        )}

        {/* Lista de solicitudes */}
        {solicitudes.length > 0 && (
          <div className="flex flex-col gap-4">
            {solicitudes.map((solicitud) => (
              <div
                key={solicitud.idSolicitud}
                className="bg-white rounded-2xl shadow-md p-5 flex justify-between items-start"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-adogta-primary font-semibold text-sm">
                    Animal #{solicitud.idAnimal}
                  </p>
                  <p className="text-adogta-primary text-xs opacity-70">
                    Publicación #{solicitud.idPublicacion}
                  </p>
                  <p className="text-adogta-primary text-xs opacity-70">
                    Fecha: {solicitud.fecha}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${estiloEstado(solicitud.estado)}`}
                >
                  {solicitud.estado}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </AuthLayout>
  );
};

export default MisSolicitudesPage;