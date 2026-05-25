import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { solicitudApi } from '../api/solicitudApi';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { animalApi } from '../api/animalApi';

export const ESTADO_CONFIG = {
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
  Rechazada: {
    label: 'No seleccionado',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: '✖',
  },

  Activa: {
    label: 'Activa',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '🟢',
  },
};

export function EstadoBadge({ estado }) {
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

export function SolicitudCard({ solicitud }) {
  const FALLBACK = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=70';
  const foto = solicitud.fotoAnimal?.[0] || FALLBACK;

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-adogta-border p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow">
      <img
        src={foto}
        alt={solicitud.nombreAnimal || 'Animal'}
        className="w-16 h-16 rounded-full object-cover flex-shrink-0 border border-adogta-border"
        onError={(e) => { e.currentTarget.src = FALLBACK; }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-adogta-primary font-bold text-base">
          {solicitud.nombreAnimal || `Animal #${solicitud.idAnimal}`}
        </p>
        <p className="text-gray-400 text-xs mt-0.5">
          Publicacion #{solicitud.idPublicacion} · Enviada el {new Date(solicitud.fecha).toLocaleDateString('es-MX', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      </div>
      <div className="flex-shrink-0">
        <EstadoBadge estado={solicitud.estado} />
      </div>
    </article>
  );
}

export function PublicacionCard({ publicacion }) {
  const [expanded, setExpanded] = useState(false);
  const [interesados, setInteresados] = useState([]);
  const [cargandoInteresados, setCargandoInteresados] = useState(false);
  const [errorInteresados, setErrorInteresados] = useState('');
  const [iniciando, setIniciando] = useState(null);
  const [estadoPublicacion, setEstadoPublicacion] = useState(publicacion.estadoPublicacion || 'Activa');

  const FALLBACK = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=70';

  const handleVerInteresados = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setExpanded(true);
    setCargandoInteresados(true);
    setErrorInteresados('');
    try {
      const data = await solicitudApi.getInteresados(publicacion.idPublicacion);
      setInteresados(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorInteresados('No se pudieron cargar los interesados.');
    } finally {
      setCargandoInteresados(false);
    }
  };

  const handleIniciarTramite = async (idSolicitud) => {
    if (!window.confirm('¿Iniciar trámite con este adoptante?')) return;
    setIniciando(idSolicitud);
    try {
      await solicitudApi.iniciarTramite(idSolicitud);
      setEstadoPublicacion('En proceso');
      setExpanded(false);
    } catch (err) {
      alert(err.response?.data?.error || 'No se pudo iniciar el trámite.');
    } finally {
      setIniciando(null);
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-adogta-border overflow-hidden hover:shadow-md transition-shadow">
      {/* Tarjeta principal */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <img
          src={publicacion.fotos?.[0] || FALLBACK}
          alt={publicacion.nombre}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0 border border-adogta-border"
          onError={(e) => { e.currentTarget.src = FALLBACK; }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-adogta-primary font-bold text-base">{publicacion.nombre}</p>
          <p className="text-gray-400 text-xs mt-0.5">{publicacion.tipo} · {publicacion.razaNombre}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <EstadoBadge estado={estadoPublicacion} />
          {estadoPublicacion !== 'En proceso' && estadoPublicacion !== 'Adoptado' && estadoPublicacion !== 'Borrada' && (
            <button
              onClick={handleVerInteresados}
              className="bg-adogta-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-adogta-secondary transition-colors"
            >
              {expanded ? 'Ocultar' : 'Ver interesados'}
            </button>
          )}
        </div>
      </div>

      {/* Lista de interesados expandible */}
      {expanded && (
        <div className="border-t border-adogta-border bg-adogta-background px-5 py-4 space-y-3">
          {cargandoInteresados && (
            <p className="text-center text-adogta-primary text-sm">Cargando interesados...</p>
          )}
          {errorInteresados && (
            <p className="text-center text-red-600 text-sm">{errorInteresados}</p>
          )}
          {!cargandoInteresados && !errorInteresados && interesados.length === 0 && (
            <p className="text-center text-gray-400 text-sm">Nadie ha expresado interés aún.</p>
          )}
          {!cargandoInteresados && interesados.map(i => (
            <div key={i.idSolicitud} className="bg-white rounded-xl border border-adogta-border p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-adogta-secondary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {i.nombre?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-adogta-primary font-semibold text-sm">{i.nombre}</p>
                <p className="text-gray-400 text-xs">{i.email}</p>
                {i.telefono && <p className="text-gray-400 text-xs">{i.telefono}</p>}
              </div>
              <button
                onClick={() => handleIniciarTramite(i.idSolicitud)}
                disabled={iniciando === i.idSolicitud}
                className="bg-adogta-secondary text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-orange-500 transition-colors disabled:opacity-50"
              >
                {iniciando === i.idSolicitud ? 'Iniciando...' : 'Iniciar trámite'}
              </button>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

const MisSolicitudesPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [misPublicaciones, setMisPublicaciones] = useState([]);
  const [cargandoPublicaciones, setCargandoPublicaciones] = useState(true);
  const [errorPublicaciones, setErrorPublicaciones] = useState('');


  useEffect(() => {
    let cancelado = false;
    animalApi.obtenerMisPublicaciones()
      .then((data) => {
        if (cancelado) return;
        setMisPublicaciones(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (cancelado) return;
        setErrorPublicaciones(err.response?.data?.error || 'No se pudieron cargar tus publicaciones.');
      })
      .finally(() => {
        if (!cancelado) setCargandoPublicaciones(false);
      });
    return () => { cancelado = true; };
  }, []);

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

        {/* Separador */}
        <div className="flex items-center justify-center">
          <span className="block w-12 h-1 bg-adogta-secondary rounded-full" />
        </div>

        {/* Encabezado mis publicaciones */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-5xl mb-3">🐕</div>
          <h1 className="text-adogta-primary text-2xl font-bold mb-2">Mis publicaciones</h1>
          <p className="text-adogta-primary text-sm opacity-80">Animales que has puesto en adopción.</p>
        </div>

        {cargandoPublicaciones && (
          <p className="text-center text-adogta-primary">Cargando publicaciones...</p>
        )}

        {!cargandoPublicaciones && errorPublicaciones && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm text-center">
            {errorPublicaciones}
          </div>
        )}

        {!cargandoPublicaciones && !errorPublicaciones && misPublicaciones.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-adogta-border p-8 text-center">
            <p className="text-adogta-primary font-semibold">Aún no has publicado ninguna mascota</p>
            <button
              onClick={() => navigate('/publicar')}
              className="mt-4 bg-adogta-secondary text-white font-semibold px-6 py-2 rounded-full text-sm hover:bg-orange-500 transition-colors"
              >
              Publicar mascota
            </button>
          </div>
        )}

        {!cargandoPublicaciones && !errorPublicaciones && misPublicaciones.length > 0 && (
          <div className="space-y-3">
            {misPublicaciones.map(p => (
            <PublicacionCard key={`${p.idAnimal}-${p.idPublicacion}`} publicacion={p} />
            ))}
          </div>
        )}

      </div>
    </AuthLayout>
  );
};

export default MisSolicitudesPage;