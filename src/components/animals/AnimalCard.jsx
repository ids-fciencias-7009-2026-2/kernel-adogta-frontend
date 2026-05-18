import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { solicitudApi } from '../../api/solicitudApi';
import Button from '../common/Button';
import {
  TALLA_LABEL,
  fallbackImg,
  caracterDesdeEnergia,
  formatEdad,
} from '../../utils/animalDisplayHelpers';

/**
 * Tarjeta que muestra la información de un animal en adopción.
 * Click en la tarjeta navega al detalle; los botones internos detienen
 * la propagación para no disparar la navegación.
 *
 * @param {Object}   props
 * @param {Object}   props.animal         - Datos del animal.
 * @param {number}   props.currentUserId  - ID del usuario autenticado.
 * @param {Function} props.onEliminar     - Función a ejecutar al eliminar la publicación.
 * @param {number}   props.eliminando     - ID de la publicación que se está eliminando (para deshabilitar el botón).
 */
export default function AnimalCard({ animal, currentUserId, onEliminar, eliminando }) {
  const navigate = useNavigate();
  const fallback = fallbackImg(animal.tipo);
  const foto = animal.fotos?.[0] || fallback;
  const caracter = caracterDesdeEnergia(animal.nivelEnergia);
  const tamanio = TALLA_LABEL[animal.razaTalla] || '';

  const esPropia = currentUserId != null && Number(currentUserId) === Number(animal.idUsuario);
  const [enviando, setEnviando] = useState(false);
  const [enviada, setEnviada] = useState(false);
  const [errorInteres, setErrorInteres] = useState('');

  const irADetalle = () => navigate(`/animales/${animal.idAnimal}`);

  const handleCardKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      irADetalle();
    }
  };

  const handleInteres = async (e) => {
    e.stopPropagation();
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
    <article
      role="button"
      tabIndex={0}
      onClick={irADetalle}
      onKeyDown={handleCardKeyDown}
      className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-2xl transition-shadow focus:outline-none focus:ring-2 focus:ring-adogta-secondary"
    >
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
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/editar-animal/${animal.idAnimal}`);
                }}
                className="flex-1 bg-adogta-background text-adogta-primary font-semibold py-2 px-4 rounded-full hover:bg-adogta-secondary/20 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEliminar(animal.idPublicacion);
                }}
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
