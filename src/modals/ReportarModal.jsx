import { useState, useEffect } from 'react';
import Button from '../components/common/Button';

/**
 * Modal para reportar una publicación.
 *
 * @param {boolean}  isOpen          - Si el modal está visible.
 * @param {Function} onClose         - Para cerrar el modal.
 * @param {Function} onSubmit        - Recibe el motivo de reporte y envía el reporte.
 * @param {boolean}  loading         - Si se está mandando el reporte.
 * @param {string}   successMessage  - Mensaje de éxito.
 */
const ReportarModal = ({ isOpen, onClose, onSubmit, loading, successMessage }) => {
  const [motivo, setMotivo] = useState('');

  // Para cerrar el modal después de mostrar el mensaje de éxito (2.5s)
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (motivo.trim()) {
      onSubmit(motivo.trim());
      setMotivo('');
    }
  };

  //  Mensaje de confirmación.
  if (successMessage) {
    return (
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] animate-fade-in"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl max-w-[440px] w-[90%] p-7 shadow-xl animate-slide-in text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-adogta-primary text-lg font-semibold mb-3">
            {successMessage}
          </div>
          <button
            onClick={onClose}
            className="text-adogta-primary underline text-sm hover:text-adogta-secondary"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  // Formulario para poner el motivo del reporte
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-[440px] w-[90%] max-h-[85vh] p-7 relative overflow-auto shadow-xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-adogta-primary text-xl font-bold mb-4">
          Reportar publicación
        </h3>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-adogta-primary mb-2">
            Motivo del reporte
          </label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={3}
            className="w-full border border-adogta-border rounded-xl px-4 py-2 text-sm text-adogta-primary focus:outline-none focus:ring-2 focus:ring-adogta-secondary"
            placeholder="Describe el motivo..."
            required
            disabled={loading}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" onClick={onClose} variant="secondary">
              Cancelar
            </Button>
            <Button type="submit" loading={loading} disabled={loading}>
              Enviar reporte
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportarModal;