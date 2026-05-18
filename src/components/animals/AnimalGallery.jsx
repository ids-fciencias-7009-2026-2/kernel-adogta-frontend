import { useState } from 'react';
import { fallbackImg } from '../../utils/animalDisplayHelpers';

/**
 * Galería interactiva con foto principal y thumbnails navegables.
 * Soporta navegación por teclado (←/→), flechas en hover y contador.
 *
 * @param {Object}   props
 * @param {string[]} props.fotos  - URLs de las fotos. Si está vacío, usa fallback por tipo.
 * @param {string}   props.nombre - Nombre del animal (alt/aria).
 * @param {string}   props.tipo   - "Perro" | "Gato" para el fallback.
 */
export default function AnimalGallery({ fotos, nombre, tipo }) {
  const fallback = fallbackImg(tipo);
  const lista = fotos && fotos.length > 0 ? fotos : [fallback];
  const total = lista.length;
  const isMultiple = total > 1;

  const [activeIndex, setActiveIndex] = useState(0);

  const goPrev = () => setActiveIndex((i) => (i - 1 + total) % total);
  const goNext = () => setActiveIndex((i) => (i + 1) % total);

  const handleKeyDown = (e) => {
    if (!isMultiple) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  return (
    <div
      className="w-full focus:outline-none"
      tabIndex={isMultiple ? 0 : -1}
      onKeyDown={handleKeyDown}
      aria-label={`Galería de fotos de ${nombre}`}
    >
      <div className="relative group bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={lista[activeIndex]}
          alt={`${nombre} ${activeIndex + 1}`}
          onError={(e) => { e.currentTarget.src = fallback; }}
          className="w-full aspect-[4/3] md:aspect-[16/10] max-h-[500px] object-cover"
        />

        {isMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-adogta-primary rounded-full w-10 h-10 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-adogta-primary rounded-full w-10 h-10 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <span className="absolute bottom-3 right-3 bg-black/55 text-white text-xs font-medium px-2 py-1 rounded-full">
              {activeIndex + 1} / {total}
            </span>
          </>
        )}
      </div>

      {isMultiple && (
        <div className="mt-3 flex gap-2 overflow-x-auto snap-x snap-mandatory pb-1">
          {lista.map((src, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={isActive}
                className={`snap-start shrink-0 rounded-xl overflow-hidden focus:outline-none transition ${
                  isActive
                    ? 'ring-2 ring-adogta-secondary'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={src}
                  alt={`Miniatura ${i + 1}`}
                  onError={(e) => { e.currentTarget.src = fallback; }}
                  className="w-24 h-24 object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
