import apiClient from './client';

/**
 * API de solicitudes para comunicarse con los endpoints del backend de Adogta.
 *
 * Endpoints disponibles:
 * - POST /api/solicitudes           - Crear una solicitud ("me interesa")
 * - GET  /api/solicitudes/mis-solicitudes - Obtener solicitudes del usuario autenticado
 */
export const solicitudApi = {

  /**
   * Crea una nueva solicitud de adopción para un animal.
   *
   * @param {Object} solicitudData
   * @param {number} solicitudData.idAnimal        - ID del animal
   * @param {number} solicitudData.idPublicacion   - ID de la publicación
   * @param {number} solicitudData.idUsuarioAnimal - ID del usuario dueño del animal
   * @returns {Promise<Object>} { idSolicitud, fecha, estado, mensaje }
   */
  crear: async (solicitudData) => {
    const response = await apiClient.post('/api/solicitudes', solicitudData);
    return response.data;
  },

  /**
   * Obtiene todas las solicitudes enviadas por el usuario autenticado.
   *
   * @returns {Promise<Array>} Lista de solicitudes del adoptante.
   */
  getMisSolicitudes: async () => {
    const response = await apiClient.get('/api/solicitudes/mis-solicitudes');
    return response.data;
  },

};