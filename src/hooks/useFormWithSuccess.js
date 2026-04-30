import { useState } from 'react';

/**
 * Hook especializado para formularios que necesitan manejar un estado de éxito.
 * Extiende el comportamiento de useForm agregando 'success' y un callback 'onSuccess'.
 * 
 * Esto se desarrolló para no alterar la lógica de formularios que no requieren esta funcionalidad
 * Páginas asincronas como ForgotPasswordPage y ResetPaswordPage la necesitan al tener que mostrar
 * respuestas del sistema sin redirección inmediata.
 *
 * @param {Object}   initialState  - Estado inicial del formulario
 * @param {Function} validate      - Función de validación
 * @param {Function} onSubmit      - Función asíncrona que envía los datos
 * @param {Function} getApiError   - Función para extraer mensajes de error del API
 * @param {Function} onSuccess     - Callback que se ejecuta tras un envío exitoso
 * @returns {Object} { formData, errors, loading, serverError, success, handleChange, handleSubmit, ... }
 */
export const useFormWithSuccess = (initialState, validate, onSubmit, getApiError, onSuccess) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (serverError) {
      setServerError('');
    }
    if (success) {
      setSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    let validationErrors = {};
    if (validate) {
      validationErrors = validate(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    setErrors({});
    setLoading(true);
    setServerError('');

    try {
      await onSubmit(formData);
      if (onSuccess) {
        onSuccess(formData);
      }
    } catch (error) {
      let errorMessage = 'Ocurrió un error. Intenta nuevamente.';
      if (getApiError) {
        errorMessage = getApiError(error);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
    setServerError('');
    setSuccess(false);
  };

  return {
    formData,
    errors,
    loading,
    serverError,
    success,
    handleChange,
    handleSubmit,
    setFormData,
    setErrors,
    setLoading,
    setServerError,
    setSuccess,
    resetForm
  };
};