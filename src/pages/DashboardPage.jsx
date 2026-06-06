import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Terms from '../modals/Terms';
import { useAuth } from '../hooks/useAuth';
import { animalApi } from '../api/animalApi';
import { formularioApi } from '../api/formularioApi';
import AnimalCard from '../components/animals/AnimalCard';
import MapaDashboardSection from '../components/mapa/MapaDashboardSection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import QuestionnaireModal from '../modals/QuestionnaireModal';
import dashboardBackground from '../assets/Adogta_dashboard.png';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading, loadUser } = useAuth();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [animales, setAnimales] = useState([]);
  const [cargandoAnimales, setCargandoAnimales] = useState(true);
  const [errorAnimales, setErrorAnimales] = useState('');
  const [filtroTipo, setFiltroTipo] = useState(null);
  const [pendienteFormulario, setPendienteFormulario] = useState(false);
  const [recomendados, setRecomendados] = useState([]);
  const [cargandoRecomendados, setCargandoRecomendados] = useState(false);
  const [eliminando, setEliminando] = useState(null);
  const [showCuestionario, setShowCuestionario] = useState(false);

  const handleEliminar = async (idPublicacion) => {
    if (!window.confirm('¿Estás seguro de eliminar esta publicación?')) return;
    setEliminando(idPublicacion);
    try {
      await animalApi.eliminar(idPublicacion);
      setAnimales((prev) => prev.filter(a => a.idPublicacion !== idPublicacion));
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar la publicación');
    } finally {
      setEliminando(null);
    }
  };

  useEffect(() => {
    let cancelado = false;
    animalApi.listar()
      .then((data) => {
        if (cancelado) return;
        setAnimales(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (cancelado) return;
        setErrorAnimales(
          err.response?.data?.error || 
          err.message || 
          'No se pudieron cargar las publicaciones.'
        );
      })
      .finally(() => {
        if (!cancelado) setCargandoAnimales(false);
      });
    return () => { cancelado = true; };
  }, []);

  useEffect(() => {
    formularioApi.pendienteContestar()
      .then((pendiente) => setPendienteFormulario(pendiente))
      .catch(() => setPendienteFormulario(false));
  }, []);

  useEffect(() => {
    if (!user?.envioFormulario) return;
    let cancelado = false;
    setCargandoRecomendados(true);
    animalApi.getRecomendados()
      .then((data) => {
        if (cancelado) return;
        setRecomendados(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (cancelado) return;
        setRecomendados([]);
      })
      .finally(() => {
        if (!cancelado) setCargandoRecomendados(false);
      });
    return () => { cancelado = true; };
  }, [user]);

  const conteos = useMemo(() => {
    const c = { Perro: 0, Gato: 0 };
    for (const a of animales) {
      if (a.tipo === 'Perro' || a.tipo === 'Gato') c[a.tipo] += 1;
    }
    return c;
  }, [animales]);

  const animalesVisibles = useMemo(() => {
    if (!filtroTipo) return animales;
    return animales.filter((a) => a.tipo === filtroTipo);
  }, [animales, filtroTipo]);

  if (loading) {
    return <LoadingSpinner message="Cargando tu dashboard..." />;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const headerButtons = [
    {
      label: 'Publicar mascota',
      onClick: () => navigate('/publicar'),
      variant: 'primary'
    },
    {
      label: 'Términos y Condiciones',
      onClick: () => setShowTermsModal(true),
      variant: 'secondary'
    },
    ...(pendienteFormulario ? [{
      label: '',
      onClick: () => { },
      variant: 'warning-icon',
      tooltip: 'Debes completar tu perfil'
    }] : [])
  ];

  return (
    <>
      <AuthLayout
        title="Inicio"
        backgroundImage={dashboardBackground}
        buttons={headerButtons}
      >
        <div className="w-full max-w-6xl space-y-12">
          {/* Bienvenida */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-5xl mb-3">🐾</div>
            <h1 className="text-adogta-primary text-2xl font-bold mb-2">
              ¡Bienvenido, {user?.nombres || user?.nombre || 'Usuario'}!
            </h1>
            <p className="text-adogta-primary text-sm opacity-90">
              Estamos felices de tenerte en Adogta: una comunidad comprometida
              con el bienestar animal.
            </p>
          </div>

          {/* Mapa de mascotas cercanas */}
          <section>
            <div className="flex items-center justify-center mb-6">
              <span className="block w-12 h-1 bg-adogta-secondary rounded-full" />
            </div>
            <h2 className="text-center text-adogta-primary text-2xl font-bold mb-8">
              🗺️ Mascotas cerca de ti
            </h2>
            <MapaDashboardSection usuario={user} />
          </section>

          {/* Categorías */}
          <section>
            <div className="flex items-center justify-center mb-6">
              <span className="block w-12 h-1 bg-adogta-secondary rounded-full" />
            </div>
            <h2 className="text-center text-adogta-primary text-2xl font-bold mb-8">
              ¿Quieres adoptar un perro o un gato?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CategoryCard
                tipo="Perro"
                label="Perros"
                count={conteos.Perro}
                imgSrc="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=70"
                bgClass="bg-adogta-secondary"
                active={filtroTipo === 'Perro'}
                onClick={() => 
                  setFiltroTipo(filtroTipo === 'Perro' ? null : 'Perro')
                }
              />
              <CategoryCard
                tipo="Gato"
                label="Gatos"
                count={conteos.Gato}
                imgSrc="https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&q=70"
                bgClass="bg-adogta-border"
                active={filtroTipo === 'Gato'}
                onClick={() => 
                  setFiltroTipo(filtroTipo === 'Gato' ? null : 'Gato')
                }
              />
            </div>
          </section>

          {/* Recomendados para ti */}
          <section>
            <div className="flex items-center justify-center mb-6">
              <span className="block w-12 h-1 bg-adogta-secondary rounded-full" />
            </div>
            <h2 className="text-center text-adogta-primary text-2xl font-bold mb-2">
              Recomendados para ti
            </h2>
            <p className="text-center text-adogta-primary text-sm opacity-70 mb-8">
              {user?.envioFormulario
                ? 'Basado en tu cuestionario y ubicación'
                : 'No encontramos mascotas compatibles.'}
            </p>

            {/* No cuestionario, mensaje y boton del modal. */}
            {!user?.envioFormulario ? (
              <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <p className="text-adogta-primary text-sm mb-4">
                  Responde el cuestionario de adopción para que podamos sugerirte
                  las mascotas más compatibles contigo.
                </p>
                <button
                  onClick={() => setShowCuestionario(true)}
                  className="bg-adogta-secondary text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-orange-600 transition-colors"
                >
                  Completar cuestionario
                </button>
              </div>
            ) : cargandoRecomendados ? (
              <p className="text-center text-adogta-primary">Calculando compatibilidad...</p>
            ) : recomendados.length === 0 ? (
              <p className="text-center text-adogta-primary opacity-70">
                No encontramos mascotas compatibles cerca de ti por ahora.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recomendados.map((a) => (
                  <AnimalCard
                    key={`rec-${a.idUsuario}-${a.idPublicacion}-${a.idAnimal}`}
                    animal={a}
                    currentUserId={user?.id}
                    onEliminar={handleEliminar}
                    eliminando={eliminando}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Últimas mascotas adoptables  */}
          <section>
            <div className="flex items-center justify-center mb-6">
              <span className="block w-12 h-1 bg-adogta-secondary rounded-full" />
            </div>
            <h2 className="text-center text-adogta-primary text-2xl font-bold mb-8">
              {filtroTipo
                ? `Últim${filtroTipo === 'Perro' ? 'os perros' : 'as gatas'} adoptables`
                : 'Últimas mascotas adoptables'}
            </h2>

            {cargandoAnimales && (
              <p className="text-center text-adogta-primary">
                Cargando publicaciones...
              </p>
            )}

            {!cargandoAnimales && errorAnimales && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm text-center">
                {errorAnimales}
              </div>
            )}

            {!cargandoAnimales && !errorAnimales && animalesVisibles.length === 0 && (
              <p className="text-center text-adogta-primary opacity-80">
                Aún no hay publicaciones. ¡Sé el primero en publicar una!
              </p>
            )}

            {!cargandoAnimales && !errorAnimales && animalesVisibles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {animalesVisibles.map((a) => (
                  <AnimalCard
                    key={`${a.idUsuario}-${a.idPublicacion}-${a.idAnimal}`}
                    animal={a}
                    currentUserId={user?.id}
                    onEliminar={handleEliminar}
                    eliminando={eliminando}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </AuthLayout>

      <Terms isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />

      {/* Modal del cuestionario */}
      <QuestionnaireModal
        isOpen={showCuestionario}
        onClose={() => setShowCuestionario(false)}
        onSuccess={() => {
          loadUser();
          setShowCuestionario(false);
        }}
      />
    </>
  );
};

function CategoryCard({ label, count, imgSrc, bgClass, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-72 rounded-2xl overflow-hidden text-left shadow-lg transition-all hover:shadow-xl ${bgClass} ${active ? 'ring-4 ring-adogta-secondary' : ''}`}
    >
      <img
        src={imgSrc}
        alt={label}
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <span className="absolute top-4 left-4 bg-white/80 text-adogta-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
        {count} {count === 1 ? 'anuncio' : 'anuncios'}
      </span>
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
        <h3 className="text-white text-2xl font-bold">{label}</h3>
        <p className="text-white/90 text-sm">{label}</p>
      </div>
    </button>
  );
}

export default DashboardPage;