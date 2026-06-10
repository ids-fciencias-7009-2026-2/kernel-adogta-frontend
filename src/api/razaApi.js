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

  /**
   * Consulta sugerencias de razas mientras el usuario escribe.
   *
   * @param {string} nombreEntrada - Texto parcial ingresado por el usuario.
   * @returns {Promise<Array>} Lista de sugerencias devuelta por el backend.
   */
  sugerencias: async (nombreEntrada) => {
    const response = await apiClient.post('/api/razas/sugerencias', null, {
      params: { nombreEntrada },
    });

    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.sugerencias)) return data.sugerencias;
    if (Array.isArray(data?.data)) return data.data;
    if (data && typeof data === 'object' && (data.nombreEn || data.nombreEs || data.nombre_en || data.nombre_es)) {
      return [data];
    }

    return [];
  },

    /**
     * Agrega una nueva raza consultando la API externa.
     *
     * @param {Object} payload
     * @param {string} payload.nombre
     * @param {string} payload.tipo - "perro" | "gato"
     * @returns {Promise<Object>} Raza creada o existente.
     * @throws {Error} Si el microservicio falla o la raza no existe.
     */
    add: async (payload) => {
      try {
        const response = await apiClient.post('/api/razas', payload);

        if (response.data?.mensaje) {
          const error = new Error(response.data.mensaje);
          error.response = { data: response.data };
          throw error;
        }
        
        return response.data;
      } catch (error) {
        
        if (error.response?.data?.mensaje) {
          error.message = error.response.data.mensaje;
        }
        throw error;
      }
    },

};
