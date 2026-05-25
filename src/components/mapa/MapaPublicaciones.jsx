import { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

const CONTAINER_STYLE = { width: '100%', height: '70vh' };
const MAP_OPTIONS = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  clickableIcons: false,
};

export default function MapaPublicaciones({ publicaciones, lat, lng }) {
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: apiKey });
  const center = useMemo(() => ({ lat, lng }), [lat, lng]);

  if (loadError) {
    console.error('Error cargando Google Maps:', loadError);
    return <div className="w-full h-full flex items-center justify-center">Error al cargar el mapa</div>;
  }
  if (!isLoaded) return <div className="w-full h-full flex items-center justify-center">Cargando mapa...</div>;

  return (
    <GoogleMap mapContainerStyle={CONTAINER_STYLE} center={center} zoom={12} options={MAP_OPTIONS}>
      {publicaciones.map(p => (
        <Marker
          key={p.idAnimal}
          position={{ lat: p.lat, lng: p.lng }}
          onClick={() => navigate(`/animales/${p.idAnimal}`)}
        />
      ))}
    </GoogleMap>
  );
}