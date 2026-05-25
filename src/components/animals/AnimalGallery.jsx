import { useEffect, useRef, useState } from 'react';
import { fallbackImg } from '../../utils/animalDisplayHelpers';

function ChevronLeftIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function CloseIcon() {
  return (
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function Lightbox({
  fotos,
  nombre,
  fallback,
  activeIndex,
  setActiveIndex,
  onClose,
  returnFocusRef,
}) {
  const closeBtnRef = useRef(null);
  const total = fotos.length;
  const isMultiple = total > 1;

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const handler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (isMultiple && e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + total) % total);
      } else if (isMultiple && e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % total);
      }
    };
    document.addEventListener('keydown', handler);

    const opener = returnFocusRef.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', handler);
      if (opener && typeof opener.focus === 'function') {
        opener.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goPrev = () => setActiveIndex((i) => (i - 1 + total) % total);
  const goNext = () => setActiveIndex((i) => (i + 1) % total);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ampliada de ${nombre}`}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <span className="absolute top-4 left-4 text-sm text-gray-700 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow">
        {nombre}
      </span>

      <button
        ref={closeBtnRef}
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-4 right-4 bg-white/85 hover:bg-white text-adogta-primary rounded-full w-10 h-10 flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-adogta-secondary"
      >
        <CloseIcon />
      </button>

      <img
        src={fotos[activeIndex]}
        alt={`${nombre} ${activeIndex + 1}`}
        onError={(e) => { e.currentTarget.src = fallback; }}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
      />

      {isMultiple && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Foto anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-adogta-primary rounded-full w-11 h-11 flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-adogta-secondary"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Foto siguiente"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-adogta-primary rounded-full w-11 h-11 flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-adogta-secondary"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2"
            role="tablist"
            aria-label="Selector de foto"
          >
            {fotos.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                onClick={() => setActiveIndex(i)}
                aria-label={`Ir a foto ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-adogta-secondary ${
                  i === activeIndex ? 'bg-adogta-secondary' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Galería interactiva con foto principal, thumbnails y lightbox.
 * - Click en la foto principal o en el botón "expandir" abre lightbox.
 * - Flechas ←/→ del teclado navegan entre fotos cuando hay foco.
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
  const [isOpen, setIsOpen] = useState(false);
  const openerRef = useRef(null);

  const openLightbox = () => {
    openerRef.current = document.activeElement;
    setIsOpen(true);
  };
  const closeLightbox = () => setIsOpen(false);

  const goPrev = () => setActiveIndex((i) => (i - 1 + total) % total);
  const goNext = () => setActiveIndex((i) => (i + 1) % total);

  const handleKeyDown = (e) => {
    if (!isMultiple || isOpen) return;
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
        <button
          type="button"
          onClick={openLightbox}
          aria-label={`Ampliar foto de ${nombre}`}
          className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-adogta-secondary"
        >
          <img
            src={lista[activeIndex]}
            alt={`${nombre} ${activeIndex + 1}`}
            onError={(e) => { e.currentTarget.src = fallback; }}
            className="w-full aspect-[4/3] md:aspect-[16/10] max-h-[500px] object-cover"
          />
        </button>

        <button
          type="button"
          onClick={openLightbox}
          aria-label="Ver foto ampliada"
          className="absolute top-3 right-3 bg-white/85 hover:bg-white text-adogta-primary rounded-full w-9 h-9 flex items-center justify-center shadow-md opacity-70 hover:opacity-100 focus:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-adogta-secondary"
        >
          <ExpandIcon />
        </button>

        {isMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-adogta-primary rounded-full w-10 h-10 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-adogta-primary rounded-full w-10 h-10 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            >
              <ChevronRightIcon />
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

      {isOpen && (
        <Lightbox
          fotos={lista}
          nombre={nombre}
          fallback={fallback}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          onClose={closeLightbox}
          returnFocusRef={openerRef}
        />
      )}
    </div>
  );
}
