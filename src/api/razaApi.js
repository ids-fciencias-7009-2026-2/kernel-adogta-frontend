import apiClient from './client';

/**
 * API de razas para comunicarse con los endpoints del backend de Adogta.
 *
 * Endpoints disponibles:
 * - GET /api/razas      - Lista todas las razas disponibles
 * - GET /api/razas/{id} - Obtiene una raza por ID
 */
export const razaApi = {

  /**
   * Obtiene la lista completa de razas.
   *
   * @returns {Promise<Array>} Arreglo de razas con sus atributos por defecto.
   */
  getAll: async () => {
    const response = await apiClient.get('/api/razas');
    return response.data;
  },

  /**
   * Obtiene una raza por su ID.
   *
   * @param {number} idRaza - Identificador de la raza
   * @returns {Promise<Object>} Datos de la raza solicitada.
   */
  getById: async (idRaza) => {
    const response = await apiClient.get(`/api/razas/${idRaza}`);
    return response.data;
  },

};
