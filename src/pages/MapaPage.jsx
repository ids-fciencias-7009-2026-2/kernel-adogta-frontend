import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MapaPublicaciones from '../components/mapa/MapaPublicaciones';
import FiltrosMapa from '../components/mapa/FiltrosMapa';
import { animalApi } from '../api/animalApi';
import { usuarioApi } from '../api/usuarioApi';
import { LAT_FALLBACK, LNG_FALLBACK, obtenerCoordsPorCP } from '../utils/mapaUbicacion';
import dashboardBackground from '../assets/Adogta_dashboard.png';

export default function MapaPage() {
  const navigate = useNavigate();

  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [centroLat, setCentroLat] = useState(LAT_FALLBACK);
  const [centroLng, setCentroLng] = useState(LNG_FALLBACK);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroRaza, setFiltroRaza] = useState('');
  const [filtroCP, setFiltroCP] = useState('');
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);

  // Función para centrar según GPS
  const centrarPorGPS = (usuarioData) => {
    if (!navigator.geolocation) {
      console.warn("Geolocalización no soportada");
      if (usuarioData?.codigoPostal) {
        const [lat, lng] = obtenerCoordsPorCP(usuarioData.codigoPostal);
        setCentroLat(lat);
        setCentroLng(lng);
      }
      return;
    }

    setObteniendoUbicacion(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCentroLat(latitude);
        setCentroLng(longitude);
        setObteniendoUbicacion(false);
      },
      (error) => {
        console.warn("Error obteniendo ubicación:", error);
        setObteniendoUbicacion(false);
        // Fallback al código postal del usuario
        if (usuarioData?.codigoPostal) {
          const [lat, lng] = obtenerCoordsPorCP(usuarioData.codigoPostal);
          setCentroLat(lat);
          setCentroLng(lng);
        } else {
          // Si no hay CP, ya está en fallback CDMX
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    let cancelado = false;
    const cargarDatos = async () => {
      try {
        const [usuarioData, datos] = await Promise.all([
          usuarioApi.getMe().catch(() => null),
          animalApi.listarParaMapa(),
        ]);
        if (cancelado) return;

        setPublicaciones(Array.isArray(datos) ? datos : []);

        // Intentar centrar por GPS (si permite)
        if (usuarioData) {
          centrarPorGPS(usuarioData);
        } else {
          // Sin usuario, usar fallback CDMX
          setCentroLat(LAT_FALLBACK);
          setCentroLng(LNG_FALLBACK);
        }
      } catch (err) {
        if (!cancelado) {
          setError(err.response?.data?.error || 'Error al cargar el mapa.');
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    };
    cargarDatos();
    return () => { cancelado = true; };
  }, []);

  const razasDisponibles = useMemo(() => {
    const fuente = filtroTipo
      ? publicaciones.filter((p) => p.tipo === filtroTipo)
      : publicaciones;
    return [...new Set(fuente.map((p) => p.razaNombre))].sort();
  }, [publicaciones, filtroTipo]);

  const publicacionesFiltradas = useMemo(() => {
    return publicaciones.filter((p) => {
      if (filtroTipo && p.tipo !== filtroTipo) return false;
      if (filtroRaza && p.razaNombre !== filtroRaza) return false;
      if (filtroCP && !p.codigoPostal.startsWith(filtroCP)) return false;
      return true;
    });
  }, [publicaciones, filtroTipo, filtroRaza, filtroCP]);

  // Botón para volver al dashboard
  const headerButtons = [
    {
      label: '<- Volver',
      onClick: () => navigate('/dashboard'),
      variant: 'secondary',
    },
  ];

  if (cargando || obteniendoUbicacion) return <LoadingSpinner message="Cargando mapa y obteniendo tu ubicación..." />;

  return (
    <AuthLayout
      title="Mapa de adopciones"
      backgroundImage={dashboardBackground}
      buttons={headerButtons}
    >
      <div className="w-full max-w-6xl flex flex-col gap-4" style={{ flex: 1, minHeight: 0 }}>
        {/* Encabezado */}
        <div className="bg-white rounded-2xl shadow-xl px-8 py-5">
          <h1 className="text-adogta-primary text-2xl font-bold mb-1">
            🗺️ Mapa de mascotas en adopción
          </h1>
          <p className="text-adogta-primary text-sm opacity-80">
            Encuentra mascotas cerca de ti. Haz clic en un pin para ver más detalles.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm text-center">
            {error}
          </div>
        )}

        {/* Filtros */}
        {!error && (
          <FiltrosMapa
            filtroTipo={filtroTipo}
            setFiltroTipo={setFiltroTipo}
            filtroRaza={filtroRaza}
            setFiltroRaza={setFiltroRaza}
            filtroCP={filtroCP}
            setFiltroCP={setFiltroCP}
            razasDisponibles={razasDisponibles}
            totalVisible={publicacionesFiltradas.length}
          />
        )}

        {/* Mapa */}
        {!error && (
          <div
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            style={{ flex: 1, minHeight: 0 }}
          >
            <MapaPublicaciones
              publicaciones={publicacionesFiltradas}
              lat={centroLat}
              lng={centroLng}
            />
          </div>
        )}

        {/* Sin resultados */}
        {!error && publicacionesFiltradas.length === 0 && !cargando && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 rounded-xl px-6 py-4 shadow-lg text-center">
              <p className="text-adogta-primary font-semibold">
                No hay mascotas con los filtros seleccionados.
              </p>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}