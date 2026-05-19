import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { solicitudApi } from '../api/solicitudApi';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ESTADO_CONFIG = {
  Pendiente: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '⏳',
  },
  'En proceso': {
    label: 'En proceso',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '🔄',
  },
  Adoptado: {
    label: '¡Adoptado!',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '🐾',
  },
  Rechazado: {
    label: 'No seleccionado',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: '✖',
  },
};

function EstadoBadge({ estado }) {
  const config = ESTADO_CONFIG[estado] || {
    label: estado,
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: '•',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}

function SolicitudCard({ solicitud }) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-adogta-border p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow">
      {/* Ícono animal */}
      <div className="w-12 h-12 rounded-full bg-adogta-background flex items-center justify-center text-2xl flex-shrink-0">
        🐾
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            Publicación #{solicitud.idPublicacion}
          </span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400">
            Animal #{solicitud.idAnimal}
          </span>
        </div>
        <p className="text-adogta-primary text-sm font-medium">
          Solicitud #{solicitud.idSolicitud}
        </p>
        <p className="text-gray-400 text-xs mt-0.5">
          Enviada el {new Date(solicitud.fecha).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Estado */}
      <div className="flex-shrink-0">
        <EstadoBadge estado={solicitud.estado} />
      </div>
    </article>
  );
}

const MisSolicitudesPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelado = false;
    solicitudApi.getMisSolicitudes()
      .then((data) => {
        if (cancelado) return;
        setSolicitudes(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (cancelado) return;
        setError(err.response?.data?.error || 'No se pudieron cargar tus solicitudes.');
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });
    return () => { cancelado = true; };
  }, []);

  if (authLoading) return <LoadingSpinner message="Cargando..." />;

  if (!user) {
    navigate('/login');
    return null;
  }

  const headerButtons = [
    {
      label: '← Volver al dashboard',
      onClick: () => navigate('/dashboard'),
      variant: 'secondary',
    },
  ];

  const pendientes = solicitudes.filter(s => s.estado === 'Pendiente');
  const enProceso = solicitudes.filter(s => s.estado === 'En proceso');
  const resueltas = solicitudes.filter(s => s.estado !== 'Pendiente' && s.estado !== 'En proceso');

  return (
    <AuthLayout title="Mis solicitudes" buttons={headerButtons}>
      <div className="w-full max-w-3xl space-y-8">

        {/* Encabezado */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-5xl mb-3">📋</div>
          <h1 className="text-adogta-primary text-2xl font-bold mb-2">
            Publicaciones de interés
          </h1>
          <p className="text-adogta-primary text-sm opacity-80">
            Aquí puedes ver el estado de cada solicitud que has enviado.
          </p>
        </div>

        {/* Cargando */}
        {cargando && (
          <p className="text-center text-adogta-primary">Cargando solicitudes...</p>
        )}

        {/* Error */}
        {!cargando && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm text-center">
            {error}
          </div>
        )}

        {/* Sin solicitudes */}
        {!cargando && !error && solicitudes.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-adogta-border p-10 text-center">
            <div className="text-4xl mb-3">🐕</div>
            <p className="text-adogta-primary font-semibold mb-1">Aún no has expresado interés en ninguna mascota</p>
            <p className="text-gray-400 text-sm mb-4">Explora el dashboard y encuentra tu compañero ideal.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-adogta-secondary text-white font-semibold px-6 py-2 rounded-full text-sm hover:bg-orange-500 transition-colors"
            >
              Ver mascotas
            </button>
          </div>
        )}

        {/* Pendientes */}
        {!cargando && !error && pendientes.length > 0 && (
          <section>
            <h2 className="text-adogta-primary font-bold text-lg mb-4 flex items-center gap-2">
              <span>⏳</span> Pendientes
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {pendientes.length}
              </span>
            </h2>
            <div className="space-y-3">
              {pendientes.map(s => <SolicitudCard key={s.idSolicitud} solicitud={s} />)}
            </div>
          </section>
        )}

        {/* En proceso */}
        {!cargando && !error && enProceso.length > 0 && (
          <section>
            <h2 className="text-adogta-primary font-bold text-lg mb-4 flex items-center gap-2">
              <span>🔄</span> En proceso
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {enProceso.length}
              </span>
            </h2>
            <div className="space-y-3">
              {enProceso.map(s => <SolicitudCard key={s.idSolicitud} solicitud={s} />)}
            </div>
          </section>
        )}

        {/* Resueltas */}
        {!cargando && !error && resueltas.length > 0 && (
          <section>
            <h2 className="text-adogta-primary font-bold text-lg mb-4 flex items-center gap-2">
              <span>📁</span> Historial
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {resueltas.length}
              </span>
            </h2>
            <div className="space-y-3">
              {resueltas.map(s => <SolicitudCard key={s.idSolicitud} solicitud={s} />)}
            </div>
          </section>
        )}

      </div>
    </AuthLayout>
  );
};

export default MisSolicitudesPage;