import adminClient from './adminClient';

/**
 * API para las operaciones de administrador y reportes.
 *
 * Endpoints:
 *  - POST /admin/login
 *  - POST /admin/logout
 *  - GET  /admin/me
 *  - GET  /api/admin/reportes
 *  - PUT  /api/admin/reportes/{id}/resolver
 *  - POST /api/admin/baneos
 *  - POST /api/reportes
 *  - GET  /api/reportes/existe
 */
export const adminApi = {

  /**
   * Inicia sesión como administrador.
   * 
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>}  - { token }
   */
  login: async (credentials) => {
    const response = await adminClient.post('/admin/login', credentials);
    if (response.data.token) {
      sessionStorage.setItem('adminToken', response.data.token);
    }
    return response.data;
  },

  /**
   * Cierra la sesión del administrador.
   */
  logout: async () => {
    await adminClient.post('/admin/logout');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
  },

  /**
   * Obtiene los datos del administrador (loggeado).
   * 
   * @returns {Promise<Object>}
   */
  getMe: async () => {
    const response = await adminClient.get('/admin/me');
    return response.data;
  },

  /**
   * Lista los reportes para el panel.
   * 
   * @returns {Promise<Array>}
   */
  listarReportes: async () => {
    const response = await adminClient.get('/api/admin/reportes');
    return response.data;
  },

  /**
   * Resuelve un reporte.
   * 
   * @param {number} idReporte - ID del reporte.
   * @param {string} accion    - "DESESTIMAR" o "BAJA_PUBLICACION".
   * @returns {Promise<Object>}
   */
  resolverReporte: async (idReporte, accion) => {
    const response = await adminClient.put(`/api/admin/reportes/${idReporte}/resolver`, { accion });
    return response.data;
  },

  /**
   * Banea a un usuario.
   * 
   * @param {number} idUsuario  - ID del usuario a banear.
   * @param {string} motivo     - Motivo del baneo.
   * @returns {Promise<Object>}
   */
  banearUsuario: async (idUsuario, motivo) => {
    const response = await adminClient.post('/api/admin/baneos', { idUsuario, motivo });
    return response.data;
  },

};