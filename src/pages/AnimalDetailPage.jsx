import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import AnimalGallery from '../components/animals/AnimalGallery';
import { animalApi } from '../api/animalApi';
import { solicitudApi } from '../api/solicitudApi';
import { useAuth } from '../hooks/useAuth';
import {
  TALLA_LABEL,
  fallbackImg,
  formatEdad,
} from '../utils/animalDisplayHelpers';
import { NIVEL_LABELS } from '../utils/animalFormHelpers';
import dashboardBackground from '../assets/Adogta_dashboard.png';

const MAX_RELACIONADOS = 4;

function NivelDots({ valor }) {
  const v = Math.max(0, Math.min(5, Number(valor) || 0));
  return (
    <div className="flex gap-1" aria-label={`Nivel ${v} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`w-3 h-3 rounded-full ${n <= v ? 'bg-adogta-secondary' : 'bg-gray-200'}`}
        />
      ))}
    </div>
  );
}

function NivelRow({ icono, label, valor }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-sm text-adogta-primary font-medium">
        {icono} {label}
      </span>
      <div className="flex items-center gap-3">
        <NivelDots valor={valor} />
        <span className="text-xs text-adogta-primary opacity-70 min-w-[64px] text-right">
          {NIVEL_LABELS[valor] || ''}
        </span>
      </div>
    </div>
  );
}

function Chip({ tone, children }) {
  const styles =
    tone === 'positivo'
      ? 'bg-green-100 text-green-800'
      : 'bg-amber-50 text-amber-800';
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${styles}`}>
      {children}
    </span>
  );
}

function MiniCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <div className="p-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      </div>
    </div>
  );
}

export default function AnimalDetailPage() {
  const { idAnimal } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?.id;

  const [animal, setAnimal] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [enviando, setEnviando] = useState(false);
  const [enviada, setEnviada] = useState(false);
  const [errorInteres, setErrorInteres] = useState('');

  const [listaCompleta, setListaCompleta] = useState([]);
  const [cargandoRelacionados, setCargandoRelacionados] = useState(true);

  // Efecto A: fetch del animal por idAnimal.
  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError('');
    setAnimal(null);
    setEnviada(false);
    setErrorInteres('');
    animalApi.obtener(idAnimal)
      .then((data) => {
        if (cancelado) return;
        setAnimal(data);
      })
      .catch((err) => {
        if (cancelado) return;
        setError(
          err.response?.data?.error ||
          err.message ||
          'No se pudo cargar la información de la mascota.'
        );
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });
    return () => { cancelado = true; };
  }, [idAnimal]);

  // Efecto B: fetch de la lista completa para derivar relacionados + reset de scroll.
  useEffect(() => {
    let cancelado = false;
    setCargandoRelacionados(true);
    window.scrollTo(0, 0);
    animalApi.listar()
      .then((data) => {
        if (cancelado) return;
        setListaCompleta(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (cancelado) return;
        setListaCompleta([]);
      })
      .finally(() => {
        if (!cancelado) setCargandoRelacionados(false);
      });
    return () => { cancelado = true; };
  }, [idAnimal]);

  const relacionados = useMemo(() => {
    if (!animal || !Array.isArray(listaCompleta)) return [];
    return listaCompleta
      .filter(
        (a) =>
          a.tipo === animal.tipo &&
          Number(a.idAnimal) !== Number(animal.idAnimal)
      )
      .slice(0, MAX_RELACIONADOS);
  }, [animal, listaCompleta]);

  const handleInteres = async () => {
    if (!animal) return;
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

  const headerButtons = [
    {
      label: 'Volver al dashboard',
      onClick: () => navigate('/dashboard'),
      variant: 'secondary',
    },
  ];

  if (cargando) {
    return <LoadingSpinner message="Cargando información..." />;
  }

  if (error || !animal) {
    return (
      <AuthLayout
        title="Detalle"
        backgroundImage={dashboardBackground}
        buttons={headerButtons}
      >
        <div className="w-full max-w-2xl">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-center">
            {error || 'No encontramos esta publicación.'}
          </div>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => navigate('/dashboard')} variant="secondary">
              Volver al dashboard
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  const esPropia =
    currentUserId != null && Number(currentUserId) === Number(animal.idUsuario);

  const talla = TALLA_LABEL[animal.razaTalla] || '';
  const edadFmt = formatEdad(animal.edad);

  const vacunacionPositiva = animal.estadoVacunacion === 'Completo';

  return (
    <AuthLayout
      title={animal.nombre || 'Detalle'}
      backgroundImage={dashboardBackground}
      buttons={headerButtons}
    >
      <div className="w-full max-w-4xl space-y-8">
        <AnimalGallery fotos={animal.fotos} nombre={animal.nombre} tipo={animal.tipo} />

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <header className="text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-adogta-primary text-left">
              {animal.nombre}
            </h1>
            <p className="mt-2 text-sm text-adogta-primary opacity-80 text-left">
              {animal.tipo}
              {animal.razaNombre ? ` · ${animal.razaNombre}` : ''}
              {talla ? ` · ${talla}` : ''}
              {edadFmt ? ` · ${edadFmt}` : ''}
              {animal.codigoPostal ? ` · C.P. ${animal.codigoPostal}` : ''}
            </p>
          </header>

          {animal.descripcion && animal.descripcion.trim() !== '' && (
            <section className="text-left">
              <h2 className="text-adogta-primary font-semibold mb-2 text-left">
                Sobre {animal.nombre}
              </h2>
              <p className="max-w-prose text-adogta-primary whitespace-pre-line text-left">
                {animal.descripcion}
              </p>
            </section>
          )}

          <section className="flex flex-wrap justify-start gap-2">
            <Chip tone={vacunacionPositiva ? 'positivo' : 'pendiente'}>
              Vacunación: {animal.estadoVacunacion}
            </Chip>
            <Chip tone={animal.esterilizado ? 'positivo' : 'pendiente'}>
              {animal.esterilizado ? 'Esterilizado' : 'Sin esterilizar'}
            </Chip>
            <Chip tone={animal.entrenado ? 'positivo' : 'pendiente'}>
              {animal.entrenado ? 'Entrenado' : 'Sin entrenar'}
            </Chip>
          </section>

          <section className="text-left">
            <h2 className="text-adogta-primary font-semibold mb-3 text-left">Carácter</h2>
            <div className="divide-y divide-gray-100">
              <NivelRow icono="⚡" label="Nivel de energía" valor={animal.nivelEnergia} />
              <NivelRow icono="🧘" label="Independencia" valor={animal.independencia} />
              <NivelRow icono="👶" label="Sociable con niños" valor={animal.sociableNiños} />
              <NivelRow icono="🐶" label="Sociable con mascotas" valor={animal.sociableMascotas} />
            </div>
          </section>

          {animal.padecimientos && animal.padecimientos.length > 0 && (
            <section className="text-left">
              <h2 className="text-adogta-primary font-semibold mb-2 text-left">
                Condiciones de salud
              </h2>
              <div className="flex flex-wrap justify-start gap-2">
                {animal.padecimientos.map((p, i) => (
                  <Chip key={`${p}-${i}`} tone="pendiente">{p}</Chip>
                ))}
              </div>
            </section>
          )}

          {!esPropia && (
            <section className="pt-2 flex flex-col items-center">
              <div className="w-full max-w-md">
                {enviada ? (
                  <p className="text-center text-sm text-green-700 bg-green-50 border border-green-200 rounded-full py-3 font-semibold">
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
                  <p className="mt-2 text-center text-xs text-red-600">{errorInteres}</p>
                )}
              </div>
            </section>
          )}
        </div>

        {(cargandoRelacionados || relacionados.length > 0) && (
          <section aria-label="Más mascotas disponibles" className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-adogta-primary mb-4 text-left">
              {animal.tipo === 'Perro'
                ? 'Más perros disponibles'
                : 'Más gatos disponibles'}
            </h2>

            {cargandoRelacionados ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: MAX_RELACIONADOS }).map((_, i) => (
                  <MiniCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {relacionados.map((r) => {
                  const fb = fallbackImg(r.tipo);
                  const foto = r.fotos?.[0] || fb;
                  const irADetalle = () => navigate(`/animales/${r.idAnimal}`);
                  return (
                    <article
                      key={r.idAnimal}
                      role="button"
                      tabIndex={0}
                      onClick={irADetalle}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          irADetalle();
                        }
                      }}
                      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-adogta-secondary"
                    >
                      <img
                        src={foto}
                        alt={r.nombre}
                        onError={(e) => { e.currentTarget.src = fb; }}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="p-3">
                        <h3 className="text-adogta-primary font-semibold truncate">
                          {r.nombre}
                        </h3>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </AuthLayout>
  );
}
