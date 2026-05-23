import apiClient from './client';

/**
 * API de razas para comunicarse con los endpoints del backend de Adogta.
 *
 * Endpoints disponibles:
 * - POST /formularios/guardar      - Guarda un nuevo formulario
 */
export const formularioApi = {

  /**
   * Guarda un nuevo formulario en el backend.
   *
   * @param {Object} formData - Datos del formulario a guardar
   * @returns {Promise<Object>} Datos del formulario guardado.
   */
  guardar: async (formData) => {
    const response = await apiClient.post('/formularios/guardar', formData);
    return response.data;
  },

  puedeResponder: async () => {
    const response = await apiClient.get('/formularios/puede-responder');
    return response.data;
  },

  /**
   * Obtiene el último formulario contestado por el usuario.
   * @returns {Promise<Object>} FormularioResponse
   */
  obtenerUltimo: async () => {
    const response = await apiClient.get('/formularios/ultimo');
    return response.data;
  },

  /**
   * Verifica si el usuario aún tiene pendiente contestar el cuestionario.
   * @returns {Promise<boolean>} true si está pendiente (202), false si ya lo contestó (200).
   */
  pendienteContestar: async () => {
    // 200 = ya contestó, 202 = pendiente
    try {
      const response = await apiClient.get('/formularios/pendiente-contestar');
      return response.status === 202;
    } catch (err) {
      if (err.response?.status === 202) return true;
      return false;
    }
  }
};