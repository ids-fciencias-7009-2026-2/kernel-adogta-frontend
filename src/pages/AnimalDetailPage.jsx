import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
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

function Galeria({ fotos, nombre, tipo }) {
  const fallback = fallbackImg(tipo);
  const lista = fotos && fotos.length > 0 ? fotos : [fallback];

  if (lista.length === 1) {
    return (
      <img
        src={lista[0]}
        alt={nombre}
        onError={(e) => { e.currentTarget.src = fallback; }}
        className="w-full max-h-[500px] object-cover rounded-2xl shadow-lg"
      />
    );
  }

  const colsClass =
    lista.length <= 3
      ? 'grid-cols-2 md:grid-cols-3'
      : 'grid-cols-2 md:grid-cols-4';
  const heightClass = lista.length <= 3 ? 'h-64 md:h-72' : 'h-48 md:h-56';

  return (
    <div className={`grid ${colsClass} gap-2`}>
      {lista.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={`${nombre} ${i + 1}`}
          onError={(e) => { e.currentTarget.src = fallback; }}
          className={`w-full ${heightClass} object-cover rounded-2xl shadow`}
        />
      ))}
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

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError('');
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
        <Galeria fotos={animal.fotos} nombre={animal.nombre} tipo={animal.tipo} />

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <header>
            <h1 className="text-3xl md:text-4xl font-bold text-adogta-primary">
              {animal.nombre}
            </h1>
            <p className="mt-2 text-sm text-adogta-primary opacity-80">
              {animal.tipo}
              {animal.razaNombre ? ` · ${animal.razaNombre}` : ''}
              {talla ? ` · ${talla}` : ''}
              {edadFmt ? ` · ${edadFmt}` : ''}
              {animal.codigoPostal ? ` · C.P. ${animal.codigoPostal}` : ''}
            </p>
          </header>

          {animal.descripcion && animal.descripcion.trim() !== '' && (
            <section>
              <h2 className="text-adogta-primary font-semibold mb-2">Sobre {animal.nombre}</h2>
              <p className="max-w-prose text-adogta-primary whitespace-pre-line">
                {animal.descripcion}
              </p>
            </section>
          )}

          <section className="flex flex-wrap gap-2">
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

          <section>
            <h2 className="text-adogta-primary font-semibold mb-3">Carácter</h2>
            <div className="divide-y divide-gray-100">
              <NivelRow icono="⚡" label="Nivel de energía" valor={animal.nivelEnergia} />
              <NivelRow icono="🧘" label="Independencia" valor={animal.independencia} />
              <NivelRow icono="👶" label="Sociable con niños" valor={animal.sociableNiños} />
              <NivelRow icono="🐶" label="Sociable con mascotas" valor={animal.sociableMascotas} />
            </div>
          </section>

          {animal.padecimientos && animal.padecimientos.length > 0 && (
            <section>
              <h2 className="text-adogta-primary font-semibold mb-2">Condiciones de salud</h2>
              <div className="flex flex-wrap gap-2">
                {animal.padecimientos.map((p, i) => (
                  <Chip key={`${p}-${i}`} tone="pendiente">{p}</Chip>
                ))}
              </div>
            </section>
          )}

          {!esPropia && (
            <section className="pt-2">
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
            </section>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
