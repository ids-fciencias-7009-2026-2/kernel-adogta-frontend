import { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

const MAP_OPTIONS = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  clickableIcons: false,
};

export default function MapaPublicaciones({ publicaciones, lat, lng, height = '70vh' }) {
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: apiKey });
  const center = useMemo(() => ({ lat, lng }), [lat, lng]);
  const containerStyle = useMemo(() => ({ width: '100%', height }), [height]);

  if (loadError) {
    console.error('Error cargando Google Maps:', loadError);
    return <div className="w-full flex items-center justify-center" style={{ height }}>Error al cargar el mapa</div>;
  }
  if (!isLoaded) return <div className="w-full flex items-center justify-center" style={{ height }}>Cargando mapa...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12} options={MAP_OPTIONS}>
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