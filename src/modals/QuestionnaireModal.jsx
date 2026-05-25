import { useEffect } from 'react';
import FormularioCuestionario from '../components/profile/QuestionnaireForm';

/**
 * Modal que envuelve el formulario del cuestionario de adopción.
 *
 * @param {boolean}  isOpen      - Controla si el modal está visible.
 * @param {Function} onClose     - Función para cerrar el modal.
 * @param {Function} onSuccess   - Callback tras enviar el cuestionario con éxito.
 */
const QuestionnaireModal = ({ isOpen, onClose, onSuccess }) => {
  // Bloquea el scroll del body mientras está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] animate-fade-in"
      onClick={onClose}
    >
      {/* Contenedor del modal */}
      <div
        className="relative bg-transparent max-w-[720px] w-[95%] max-h-[90vh] overflow-auto rounded-2xl shadow-xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/90 text-adogta-primary border border-adogta-border rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-adogta-background transition-colors z-10"
        >
          ✕
        </button>

        {/* Formulario del cuestionario */}
        <FormularioCuestionario
          alEnviarExitoso={() => {
            onSuccess?.();
            onClose();
          }}
        />
      </div>
    </div>
  );
};

export default QuestionnaireModal;