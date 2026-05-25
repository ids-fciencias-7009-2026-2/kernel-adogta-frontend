import apiClient from './client';

/**
 * API para las operaciones de administrador y reportes.
 *
 * Endpoints:
 *  - POST /admin/login
 *  - POST /admin/logout
 *  - GET  /api/admin/reportes
 *  - PUT  /api/admin/reportes/{id}/resolver
 *  - POST /api/admin/baneos
 *  - POST /api/reportes (cualquier usuario autenticado)
 */
export const adminApi = {
  /**
   * Inicia sesión como administrador.
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} { token }
   */
  login: async (credentials) => {
    const response = await apiClient.post('/admin/login', credentials);
    if (response.data.token) {
      sessionStorage.setItem('adminToken', response.data.token);
    }
    return response.data;
  },

  /**
   * Cierra la sesión del administrador.
   */
  logout: async () => {
    await apiClient.post('/admin/logout');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
  },

  /**
   * Obtiene los datos del administrador autenticado.
   * @returns {Promise<Object>}
   */
  getMe: async () => {
    const response = await apiClient.get('/admin/me');
    return response.data;
  },

  /**
   * Lista los reportes para el panel de administración.
   * @returns {Promise<Array>}
   */
  listarReportes: async () => {
    const response = await apiClient.get('/api/admin/reportes');
    return response.data;
  },

  /**
   * Resuelve un reporte.
   * @param {number} idReporte  - ID del reporte.
   * @param {string} accion     - "DESESTIMAR" o "BAJA_PUBLICACION".
   * @returns {Promise<Object>}
   */
  resolverReporte: async (idReporte, accion) => {
    const response = await apiClient.put(`/api/admin/reportes/${idReporte}/resolver`, { accion });
    return response.data;
  },

  /**
   * Banea a un usuario.
   * @param {number} idUsuario  - ID del usuario a banear.
   * @param {string} motivo     - Motivo del baneo.
   * @returns {Promise<Object>}
   */
  banearUsuario: async (idUsuario, motivo) => {
    const response = await apiClient.post('/api/admin/baneos', { idUsuario, motivo });
    return response.data;
  },

  /**
   * Reporta una publicación
   * @param {number} idPublicacion  - ID de la publicación.
   * @param {string} motivo         - Motivo del reporte.
   * @returns {Promise<Object>}
   */
  reportarPublicacion: async (idPublicacion, motivo) => {
    const response = await apiClient.post('/api/reportes', { idPublicacion, motivo });
    return response.data;
  },

  /**
   * Consulta si el usuario actual ya reportó una publicación.
   * @param {number} idPublicacion    -ID de la publicación
   * @returns {Promise<Object>} booleano indicando si existe.
   */
  existeReporte: async (idPublicacion) => {
    const response = await apiClient.get(`/api/reportes/existe?publicacionId=${idPublicacion}`);
    return response.data;
  }
};