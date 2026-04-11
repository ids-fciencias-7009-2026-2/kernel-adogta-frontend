import { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { usuarioApi } from '../api/usuarioApi';

/**
 * Modal para editar perfil de usuario
 * @param {boolean} isOpen - Controla si el modal está visible
 * @param {function} onClose - Función para cerrar el modal
 * @param {Object} userData - Datos actuales del usuario
 * @param {function} onUpdate - Función al actualizar (recibe nuevos datos)
 */
const EditProfile = ({ isOpen, onClose, userData, onUpdate }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    telefono: '',
    codigoPostal: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cuando el modal se abre, llena el formulario con los datos del usuario
  useEffect(() => {
    if (isOpen && userData) {
      setFormData({
        nombres: userData.nombres || userData.nombre || '',
        apellidoPaterno: userData.apellidoPaterno || '',
        apellidoMaterno: userData.apellidoMaterno || '',
        email: userData.email || '',
        telefono: userData.telefono || '',
        codigoPostal: userData.codigoPostal || ''
      });
    }
  }, [isOpen, userData]);

  // Actualiza formData cuando el usuario escribe
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Envía los cambios al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updatedUser = await usuarioApi.updateUsuario(formData);
      onUpdate(updatedUser);
      onClose();
    } catch (err) {
      console.error('Error al actualizar:', err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  // Si el modal está cerrado, no renderiza nada
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] animate-fade-in"
      onClick={onClose}
    >
      {/* Contenido del modal */}
      <div 
        className="bg-white rounded-xl max-w-[500px] w-[90%] max-h-[85vh] overflow-auto shadow-xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con título y botón cerrar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-adogta-border bg-adogta-primary rounded-t-xl">
          <h2 className="text-white text-xl m-0">Editar Perfil</h2>
          <button 
            onClick={onClose}
            className="bg-transparent border-none text-xl cursor-pointer text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-[#FEF2F0] text-adogta-secondary px-3 py-2.5 mx-6 my-4 rounded-lg text-[13px] text-center">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 flex flex-col gap-4">
            <Input
              label="Nombre(s)"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              required
              disabled={loading}
            />
            
            <Input
              label="Apellido Paterno"
              name="apellidoPaterno"
              value={formData.apellidoPaterno}
              onChange={handleChange}
              required
              disabled={loading}
            />
            
            <Input
              label="Apellido Materno"
              name="apellidoMaterno"
              value={formData.apellidoMaterno}
              onChange={handleChange}
              disabled={loading}
            />
            
            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            
            <Input
              label="Teléfono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              disabled={loading}
            />
            
            <Input
              label="Código Postal"
              name="codigoPostal"
              value={formData.codigoPostal}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 justify-center px-6 py-4 pb-6 border-t border-adogta-border bg-adogta-background rounded-b-xl">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1 max-w-[160px]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              variant="primary"
              className="flex-1 max-w-[160px]"
            >
              Guardar cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;