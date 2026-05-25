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

  verificarInteres: async (idPublicacion) => {
    const response = await apiClient.get(`/api/solicitudes/verificar/${idPublicacion}`);
    return response.data.interes_expresado;
  },

  getMisSolicitudes: async () => {
    const response = await apiClient.get('/api/solicitudes/mis-solicitudes');
    return response.data;
  },
  /**
   * GET /api/solicitudes/por-publicacion/{idPublicacion} Obtiene 
   * toda la lista de personas interesadas con los datos mas relvantes de una
   * publicacion con su id.
   * 
   * @param {number} idPublicacion 
   * @returns {Promise<Object>} { datos de las peronsas interesadas. }
   */
  getInteresados: async (idPublicacion) => {
    const response = await apiClient.get(`/api/solicitudes/por-publicacion/${idPublicacion}`);
    return response.data;
  },
  
  /**
   * GET /api/solicitudes/idSolicitud/iniciar-tramite Inicia el proceso de 
   * contacto y actualizacion de estados de una solicitud asociada a una 
   * persona interesada.
   * 
   * @param {number} idSolicitud 
   * @returns {Promise<Object>} { Mensaje de exito o no }
   */
  iniciarTramite: async (idSolicitud) => {
    const response = await apiClient.put(`/api/solicitudes/${idSolicitud}/iniciar-tramite`);
    return response.data;
  },
};
