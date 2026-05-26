import { useEffect, useMemo, useState } from 'react';
import MapaPublicaciones from './MapaPublicaciones';
import FiltrosMapa from './FiltrosMapa';
import { animalApi } from '../../api/animalApi';
import { usuarioApi } from '../../api/usuarioApi';
import { LAT_FALLBACK, LNG_FALLBACK, obtenerCoordsPorCP } from '../../utils/mapaUbicacion';

/**
 * Mapa de publicaciones embebido (pensado para el dashboard).
 *
 * Encapsula la carga de publicaciones, el centrado por GPS con fallback al
 * CP del usuario y, en último caso, a CDMX, los filtros y los estados de
 * carga/error manejados INLINE (sin spinner a pantalla completa, porque el
 * dashboard ya está renderizado).
 *
 * @param {Object|null} usuario - Usuario actual ya cargado (p. ej. desde
 *   useAuth). Si se provee, se evita una llamada extra a usuarioApi.getMe().
 * @param {string} height - Alto del mapa embebido (CSS). Por defecto un
 *   tamaño contenido para que no domine el dashboard.
 */
export default function MapaDashboardSection({ usuario = null, height = 'min(60vh, 520px)' }) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [centroLat, setCentroLat] = useState(LAT_FALLBACK);
  const [centroLng, setCentroLng] = useState(LNG_FALLBACK);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroRaza, setFiltroRaza] = useState('');
  const [filtroCP, setFiltroCP] = useState('');

  // Centra según GPS; si se niega o no hay soporte, cae al CP del usuario
  // y, si tampoco hay CP, se queda en el fallback de CDMX.
  const centrarPorGPS = (usuarioData) => {
    if (!navigator.geolocation) {
      if (usuarioData?.codigoPostal) {
        const [lat, lng] = obtenerCoordsPorCP(usuarioData.codigoPostal);
        setCentroLat(lat);
        setCentroLng(lng);
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCentroLat(latitude);
        setCentroLng(longitude);
      },
      (err) => {
        console.warn('Error obteniendo ubicación:', err);
        if (usuarioData?.codigoPostal) {
          const [lat, lng] = obtenerCoordsPorCP(usuarioData.codigoPostal);
          setCentroLat(lat);
          setCentroLng(lng);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    let cancelado = false;
    const cargarDatos = async () => {
      try {
        // Reutiliza el usuario recibido por props; solo pide getMe si no lo tenemos.
        let usuarioData = usuario;
        if (!usuarioData) {
          usuarioData = await usuarioApi.getMe().catch(() => null);
        }

        const datos = await animalApi.listarParaMapa();
        if (cancelado) return;

        setPublicaciones(Array.isArray(datos) ? datos : []);

        if (usuarioData) {
          centrarPorGPS(usuarioData);
        } else {
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
  }, [usuario]);

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

  // Placeholder inline mientras carga (misma estética que el resto de tarjetas).
  if (cargando) {
    return (
      <div
        className="bg-white rounded-2xl shadow-xl flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-adogta-primary opacity-80">Cargando mapa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
        <MapaPublicaciones
          publicaciones={publicacionesFiltradas}
          lat={centroLat}
          lng={centroLng}
          height={height}
        />

        {publicacionesFiltradas.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 rounded-xl px-6 py-4 shadow-lg text-center">
              <p className="text-adogta-primary font-semibold">
                No hay mascotas con los filtros seleccionados.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
