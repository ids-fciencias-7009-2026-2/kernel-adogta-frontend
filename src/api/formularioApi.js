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
  }
};