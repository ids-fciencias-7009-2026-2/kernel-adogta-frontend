import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import AnimalGallery from '../components/animals/AnimalGallery';
import { adminApi } from '../api/adminApi';
import { animalApi } from '../api/animalApi';
import { useAdminAuth } from '../hooks/useAdminAuth';
import {
  TALLA_LABEL,
  fallbackImg,
  formatEdad,
} from '../utils/animalDisplayHelpers';
import { NIVEL_LABELS } from '../utils/animalFormHelpers';
import dashboardBackground from '../assets/Adogta_dashboard.png';


/** Puntos que para el rango [1,5]. */
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

/** Fila con ícono, etiqueta y nivel representado con puntos. */
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

/** Etiqueta de estado. */
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

/**
 * Página de detalle de un animal exclusiva para administradores.
 * Muestra la información completa del animal y permite ejecutar
 * acciones de moderación (desestimar reporte, dar de baja, banear).
 */
export default function AdminAnimalDetailPage() {
  const { idAnimal } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idReporte = searchParams.get('reporte');

  const { admin, loading: authLoading } = useAdminAuth();

  // Estados.
  const [animal, setAnimal] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [accionEnProgreso, setAccionEnProgreso] = useState(null);

  // Carga los datos del animal.
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
        setError(err.response?.data?.error || 'No se pudo cargar la mascota.');
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });
    return () => { cancelado = true; };
  }, [idAnimal]);

  // Redirige al login si no administrador loggeado.
  useEffect(() => {
    if (!authLoading && !admin) {
      navigate('/admin/login', { replace: true });
    }
  }, [authLoading, admin, navigate]);


  /** Manejo de desestimar un reporte asociado. */
  const handleDesestimar = async () => {
    if (!idReporte) {
      alert('No hay reporte asociado a esta publicación.');
      return;
    }
    setAccionEnProgreso('desestimar');
    try {
      await adminApi.resolverReporte(Number(idReporte), 'DESESTIMAR');
      alert('Reporte desestimado.');
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al desestimar.');
    } finally {
      setAccionEnProgreso(null);
    }
  };

  /** Manejo de baja la publicación. */
  const handleDarDeBaja = async () => {
    if (!idReporte) {
      alert('No hay reporte asociado a esta publicación.');
      return;
    }
    if (!window.confirm('¿Dar de baja esta publicación?')) return;
    setAccionEnProgreso('baja');
    try {
      await adminApi.resolverReporte(Number(idReporte), 'BAJA_PUBLICACION');
      alert('Publicación dada de baja.');
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al dar de baja.');
    } finally {
      setAccionEnProgreso(null);
    }
  };

  /** Manejo del baneo al dueño de la publicación. */
  const handleBanearUsuario = async () => {
    if (!animal) return;
    const idUsuario = animal.idUsuario;
    const motivo = prompt('Motivo del baneo:');
    if (!motivo) return;
    setAccionEnProgreso('banear');
    try {
      await adminApi.banearUsuario(idUsuario, motivo);
      alert('Usuario baneado.');
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al banear.');
    } finally {
      setAccionEnProgreso(null);
    }
  };

  // Pantalla de carga
  if (authLoading || cargando) {
    return <LoadingSpinner message="Cargando información..." />;
  }

  // En caso d error por animal no encontrado.
  if (error || !animal) {
    return (
      <AuthLayout
        title="Detalle"
        backgroundImage={dashboardBackground}
        buttons={[
          { label: 'Volver al panel', onClick: () => navigate('/admin/dashboard'), variant: 'secondary' }
        ]}
      >
        <div className="w-full max-w-2xl">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-center">
            {error || 'No encontramos esta publicación.'}
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Datos: talla, edad, vacunación.
  const talla = TALLA_LABEL[animal.razaTalla] || '';
  const edadFmt = formatEdad(animal.edad);
  const vacunacionPositiva = animal.estadoVacunacion === 'Completo';

  return (
    <AuthLayout
      title={animal.nombre || 'Detalle Admin'}
      backgroundImage={dashboardBackground}
      buttons={[
        { label: 'Volver al panel', onClick: () => navigate('/admin/dashboard'), variant: 'secondary' }
      ]}
    >
      <div className="w-full max-w-4xl space-y-8">
        {/* Galería de fotos */}
        <AnimalGallery fotos={animal.fotos} nombre={animal.nombre} tipo={animal.tipo} />

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Encabezado con nombre y datos */}
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

          {/* Descripción */}
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

          {/* Chips de estado */}
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

          {/* Carácter */}
          <section className="text-left">
            <h2 className="text-adogta-primary font-semibold mb-3 text-left">Carácter</h2>
            <div className="divide-y divide-gray-100">
              <NivelRow icono="⚡" label="Nivel de energía" valor={animal.nivelEnergia} />
              <NivelRow icono="🧘" label="Independencia" valor={animal.independencia} />
              <NivelRow icono="👶" label="Sociable con niños" valor={animal.sociableNiños} />
              <NivelRow icono="🐶" label="Sociable con mascotas" valor={animal.sociableMascotas} />
            </div>
          </section>

          {/* Padecimientos */}
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

          {/* Acciones de moderación */}
          <section className="pt-4 flex flex-wrap gap-4 justify-center border-t border-adogta-border">
            <Button
              onClick={handleDesestimar}
              loading={accionEnProgreso === 'desestimar'}
              disabled={accionEnProgreso !== null}
              variant="secondary"
            >
              Desestimar reporte
            </Button>
            <Button
              onClick={handleDarDeBaja}
              loading={accionEnProgreso === 'baja'}
              disabled={accionEnProgreso !== null}
              variant="danger"
            >
              Dar de baja publicación
            </Button>
            <Button
              onClick={handleBanearUsuario}
              loading={accionEnProgreso === 'banear'}
              disabled={accionEnProgreso !== null}
              variant="danger"
            >
              Banear usuario
            </Button>
          </section>
        </div>
      </div>
    </AuthLayout>
  );
}