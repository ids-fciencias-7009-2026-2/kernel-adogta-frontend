import apiClient from './client';

/**
 * API de reportes para usuarios autenticados.
 * Utiliza el token de sesión normal (no el de administrador).
 */
export const reporteApi = {

  /**
   * Reporta una publicación.
   * @param {number} idPublicacion - ID de la publicación.
   * @param {string} motivo - Motivo del reporte.
   * @returns {Promise<Object>}
   */
  reportarPublicacion: async (idPublicacion, motivo) => {
    const response = await apiClient.post('/api/reportes', { idPublicacion, motivo });
    return response.data;
  },

  /**
   * Verifica si el usuario actual ya reportó una publicación.
   * @param {number} idPublicacion
   * @returns {Promise<Object>} { existe: boolean }
   */
  existeReporte: async (idPublicacion) => {
    const response = await apiClient.get(`/api/reportes/existe?publicacionId=${idPublicacion}`);
    return response.data;
  }
};