import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { solicitudApi } from '../api/solicitudApi';
import { useAuth } from '../hooks/useAuth';
import dashboardBackground from '../assets/Adogta_dashboard.png';

/**
 * Página de detalle de un animal publicado.
 * Muestra la información del animal y permite al adoptante enviar
 * una solicitud de adopción ("me interesa").
 */
const AnimalDetallePage = () => {
  const { idPublicacion, idAnimal, idUsuarioAnimal } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');

  // Mientras no tengamos vista de listado de animales,
  // los datos del animal vienen por params de navegación (state)
  const [animal, setAnimal] = useState(
    () => window.history.state?.usr?.animal || null
  );

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  if (authLoading) {
    return <LoadingSpinner message="Cargando..." />;
  }

  /**
   * Maneja el clic en "Me interesa".
   * Crea una solicitud de adopción para este animal.
   */
  const handleMeInteresa = async () => {
    setError('');
    setEnviando(true);
    try {
      await solicitudApi.crear({
        idAnimal: parseInt(idAnimal),
        idPublicacion: parseInt(idPublicacion),
        idUsuarioAnimal: parseInt(idUsuarioAnimal),
      });
      setExito(true);
    } catch (err) {
      const mensaje =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Error al enviar la solicitud. Intenta nuevamente.';
      setError(mensaje);
    } finally {
      setEnviando(false);
    }
  };

  const headerButtons = [
    {
      label: 'Mis solicitudes',
      onClick: () => navigate('/mis-solicitudes'),
      variant: 'secondary',
    },
  ];

  return (
    <AuthLayout
      title="Detalle del animal"
      backgroundImage={dashboardBackground}
      showBackButton={true}
      backPath="/dashboard"
      buttons={headerButtons}
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-[700px] w-full">

        {/* Fotos */}
        {animal?.fotos?.length > 0 ? (
          <div className="h-64 overflow-hidden">
            <img
              src={animal.fotos[0]}
              alt={animal.nombre}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        ) : (
          <div className="h-48 bg-adogta-background flex items-center justify-center">
            <span className="text-6xl">🐾</span>
          </div>
        )}

        <div className="p-6">

          {/* Nombre y tipo */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-adogta-primary text-2xl font-bold">
              {animal?.nombre || 'Animal'}
            </h1>
            <span className="bg-adogta-background text-adogta-primary text-xs font-semibold px-3 py-1 rounded-full">
              {animal?.tipo || '—'}
            </span>
          </div>

          {/* Datos principales */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-adogta-primary text-xs font-medium">Raza</span>
              <span className="text-adogta-primary text-sm opacity-90">
                {animal?.raza || '—'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-adogta-primary text-xs font-medium">Edad</span>
              <span className="text-adogta-primary text-sm opacity-90">
                {animal?.edad != null ? `${animal.edad} meses` : '—'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-adogta-primary text-xs font-medium">Vacunación</span>
              <span className="text-adogta-primary text-sm opacity-90">
                {animal?.estadoVacunacion || '—'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-adogta-primary text-xs font-medium">Esterilizado</span>
              <span className="text-adogta-primary text-sm opacity-90">
                {animal?.esterilizado != null ? (animal.esterilizado ? 'Sí' : 'No') : '—'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-adogta-primary text-xs font-medium">Entrenado</span>
              <span className="text-adogta-primary text-sm opacity-90">
                {animal?.entrenado != null ? (animal.entrenado ? 'Sí' : 'No') : '—'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-adogta-primary text-xs font-medium">Código postal</span>
              <span className="text-adogta-primary text-sm opacity-90">
                {animal?.codigoPostal || '—'}
              </span>
            </div>
          </div>

          {/* Descripción */}
          {animal?.descripcion && (
            <div className="mb-4">
              <p className="text-adogta-primary text-xs font-medium mb-1">Descripción</p>
              <p className="text-adogta-primary text-sm opacity-90 leading-relaxed">
                {animal.descripcion}
              </p>
            </div>
          )}

          {/* Padecimientos */}
          {animal?.padecimientos?.length > 0 && (
            <div className="mb-4">
              <p className="text-adogta-primary text-xs font-medium mb-2">Padecimientos</p>
              <div className="flex flex-wrap gap-2">
                {animal.padecimientos.map((p, i) => (
                  <span
                    key={i}
                    className="bg-adogta-background text-adogta-primary text-xs px-3 py-1 rounded-full"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Fotos adicionales */}
          {animal?.fotos?.length > 1 && (
            <div className="mb-4">
              <p className="text-adogta-primary text-xs font-medium mb-2">Más fotos</p>
              <div className="grid grid-cols-3 gap-2">
                {animal.fotos.slice(1).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`foto ${i + 2}`}
                    className="w-full h-24 object-cover rounded-xl border border-adogta-border"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Mensaje de éxito */}
          {exito && (
            <div className="bg-adogta-notification text-adogta-primary px-4 py-3 rounded-xl mb-4 text-[13px] flex items-center gap-2 border border-adogta-primary/20">
              <span>✓</span> ¡Solicitud enviada! El donante se pondrá en contacto contigo.
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className="bg-adogta-error text-adogta-secondary px-4 py-3 rounded-xl mb-4 text-[13px] flex items-center gap-2 border border-adogta-secondary/30">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Botón Me interesa */}
          <div className="flex justify-center pt-2">
            {exito ? (
              <Button
                variant="secondary"
                onClick={() => navigate('/mis-solicitudes')}
              >
                Ver mis solicitudes
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleMeInteresa}
                loading={enviando}
                disabled={enviando}
                icon="🐾"
              >
                Me interesa
              </Button>
            )}
          </div>

        </div>
      </div>
    </AuthLayout>
  );
};

export default AnimalDetallePage;