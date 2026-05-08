import apiClient from './client';

export const solicitudApi = {

  /**
   * POST /api/solicitudes — expresa interés en adoptar.
   * Requiere token de sesión.
   *
   * @param {Object} payload
   * @param {number} payload.idAnimal
   * @param {number} payload.idPublicacion
   * @param {number} payload.idUsuarioAnimal - dueño/donante de la publicación
   * @returns {Promise<Object>} Datos de la solicitud creada.
   */
  expresarInteres: async ({ idAnimal, idPublicacion, idUsuarioAnimal }) => {
    const response = await apiClient.post('/api/solicitudes', {
      idAnimal,
      idPublicacion,
      idUsuarioAnimal,
    });
    return response.data;
  },

};
