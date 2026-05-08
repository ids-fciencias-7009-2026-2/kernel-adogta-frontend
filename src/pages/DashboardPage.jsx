import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Terms from '../modals/Terms';
import { useAuth } from '../hooks/useAuth';
import { animalApi } from '../api/animalApi';
import { solicitudApi } from '../api/solicitudApi';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import dashboardBackground from '../assets/Adogta_dashboard.png';

const TALLA_LABEL = {
  1: 'Muy pequeño (menos de 5 kg)',
  2: 'Pequeño (de 5 a 10 kg)',
  3: 'Mediano (de 10 a 25 kg)',
  4: 'Grande (de 25 a 45 kg)',
  5: 'Muy grande (más de 45 kg)',
};

const FALLBACK_IMG_PERRO =
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=70';
const FALLBACK_IMG_GATO =
  'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&q=70';

function caracterDesdeEnergia(nivelEnergia) {
  if (nivelEnergia >= 4) return 'Activo';
  if (nivelEnergia <= 2) return 'Tranquilo';
  return 'Equilibrado';
}

function formatEdad(meses) {
  if (meses == null) return '';
  if (meses < 12) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  const anios = Math.floor(meses / 12);
  return `${anios} ${anios === 1 ? 'año' : 'años'}`;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [animales, setAnimales] = useState([]);
  const [cargandoAnimales, setCargandoAnimales] = useState(true);
  const [errorAnimales, setErrorAnimales] = useState('');
  const [filtroTipo, setFiltroTipo] = useState(null);

  const [eliminando, setEliminando] = useState(null);

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
                imgSrc={FALLBACK_IMG_PERRO}
                bgClass="bg-amber-400"
                active={filtroTipo === 'Perro'}
                onClick={() =>
                  setFiltroTipo(filtroTipo === 'Perro' ? null : 'Perro')
                }
              />
              <CategoryCard
                tipo="Gato"
                label="Gatos"
                count={conteos.Gato}
                imgSrc={FALLBACK_IMG_GATO}
                bgClass="bg-slate-300"
                active={filtroTipo === 'Gato'}
                onClick={() =>
                  setFiltroTipo(filtroTipo === 'Gato' ? null : 'Gato')
                }
              />
            </div>
          </section>

          {/* Últimas mascotas adoptables */}
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
                    navigate={navigate}                 
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

function AnimalCard({ animal, currentUserId, navigate, onEliminar, eliminando }) {
  const fallback = animal.tipo === 'Gato' ? FALLBACK_IMG_GATO : FALLBACK_IMG_PERRO;
  const foto = animal.fotos?.[0] || fallback;
  const caracter = caracterDesdeEnergia(animal.nivelEnergia);
  const tamanio = TALLA_LABEL[animal.razaTalla] || '';

  const esPropia = currentUserId != null && Number(currentUserId) === Number(animal.idUsuario);
  const [enviando, setEnviando] = useState(false);
  const [enviada, setEnviada] = useState(false);
  const [errorInteres, setErrorInteres] = useState('');

  const handleInteres = async () => {
    setErrorInteres('');
    setEnviando(true);
    try {
      await solicitudApi.expresarInteres({
        idAnimal: animal.idAnimal,
        idPublicacion: animal.idPublicacion,
        idUsuarioAnimal: animal.idUsuario,
      });
      setEnviada(true);
    } catch (err) {
      const status = err.response?.status;
      const apiMsg = err.response?.data?.error;
      if (status === 409) {
        setEnviada(true);
        setErrorInteres(apiMsg || 'Ya expresaste interés en esta publicación.');
      } else {
        setErrorInteres(apiMsg || 'No se pudo registrar tu interés. Inténtalo de nuevo.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
      <div className="relative h-56 bg-adogta-background">
        <img
          src={foto}
          alt={animal.nombre}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = fallback; }}
        />
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <span className="self-start bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
          {animal.tipo === 'Perro' ? 'Perros' : 'Gatos'}
        </span>

        <h3 className="text-adogta-primary text-xl font-bold uppercase mb-3">
          {animal.nombre}
        </h3>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-adogta-primary">
          <div>
            <span className="font-semibold">Edad:</span> {formatEdad(animal.edad)}
          </div>
          <div>
            <span className="font-semibold">Carácter:</span> {caracter}
          </div>
          <div className="col-span-2">
            <span className="font-semibold">Tamaño:</span> {tamanio}
          </div>
          <div>
            <span className="font-semibold">Raza:</span> {animal.razaNombre}
          </div>
          <div>
            <span className="font-semibold">Vacunación:</span> {animal.estadoVacunacion}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-600">
          C.P. {animal.codigoPostal}
        </div>

        <div className="mt-4 flex flex-col items-stretch gap-2">
          {esPropia ? (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/editar-animal/${animal.idAnimal}`)}
                className="flex-1 bg-amber-100 text-amber-800 font-semibold py-2 px-4 rounded-full hover:bg-amber-200 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => onEliminar(animal.idPublicacion)}
                disabled={eliminando === animal.idPublicacion}
                className="flex-1 bg-red-100 text-red-700 font-semibold py-2 px-4 rounded-full hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                {eliminando === animal.idPublicacion ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          ) : enviada ? (
            <p className="text-center text-sm text-green-700 bg-green-50 border border-green-200 rounded-full py-2 font-semibold">
              ¡Solicitud enviada!
            </p>
          ) : (
            <Button
              onClick={handleInteres}
              loading={enviando}
              disabled={enviando}
              fullWidth
            >
              Me interesa adoptar
            </Button>
          )}
          {errorInteres && !enviada && (
            <p className="text-center text-xs text-red-600">{errorInteres}</p>
          )}
        </div>
      </div>
    </article>
  );
}

export default DashboardPage;