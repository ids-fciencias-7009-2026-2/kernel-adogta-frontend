import { useState } from 'react';

/**
 * Hook para manejar formularios.
 * @param {Object} initialState     - Estado inicial del formulario
 * @param {Function} validate       - Función de validación
 * @param {Function} onSubmit       - Función que envía los datos
 * @param {Function} getApiError    - Función para extraer mensajes de error del API
 */
export const useForm = (initialState, validate, onSubmit, getApiError) => {
  const [formData, setFormData] = useState(initialState);  // Datos del formulario
  const [errors, setErrors] = useState({});                // Errores de validación
  const [loading, setLoading] = useState(false);            // Estado de envío
  const [serverError, setServerError] = useState('');       // Error del servidor

  /**
   * Maneja cambios en los inputs del formulario
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Actualiza: si es checkbox guarda el checked, eoc guarda el value
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Limpia error de ese campo si existe
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    // Limpia error del servidor
    if (serverError) {
      setServerError('');
    }
  };

  /**
   * Para manejar el envío del formulario
   */
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    // 1. Validar campos
    let validationErrors = {};
    if (validate) {
      validationErrors = validate(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);  // Muestra errores y detiene envío
        return;
      }
    }
    
    // 2. Limpiar errores previos y activar loading
    setErrors({});
    setLoading(true);
    setServerError('');
    
    try {
      // 3. Enviar datos al backend
      await onSubmit(formData);
    } catch (error) {
      console.error('Error en submit:', error);
      
      // 4. Mensaje de error
      let errorMessage = 'Ocurrió un error. Intenta nuevamente.';
      
      //checa todos los posibles errores.
      if (getApiError) {
        errorMessage = getApiError(error);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setServerError(errorMessage);  // muestr el error.
    } finally {
      setLoading(false);  // Termina carga
    }
  };

  /**
   * Para resetear el formulario.
   */
  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
    setServerError('');
  };

  // Retorna todo.
  return {
    formData,
    errors,
    loading,
    serverError,
    handleChange,
    handleSubmit,
    setFormData,
    setErrors,
    setLoading,
    setServerError,
    resetForm
  };
};