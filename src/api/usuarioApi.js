import apiClient from './client';

/**
 * API de usuarios para comunicarse con los endpoints del backend de Adogta.
 * 
 * Endpoints disponibles:
 * - POST   /usuarios/register - Registro de nuevos usuarios
 * - POST   /usuarios/login    - Autenticación de usuario
 * - GET    /usuarios/me       - Obtención del perfil del usuario autenticado
 * - PUT    /usuarios          - Actualización del perfil del usuario autenticado
 * - POST   /usuarios/logout   - Cierre de sesión
 */
export const usuarioApi = {

  /**
   * Registra un nuevo usuario en el sistema.
   * 
   * @param {Object} userData - Datos del usuario a registrar
   * @param {string} userData.nombres - Nombre(s) del usuario
   * @param {string} userData.apellidoPaterno - Apellido paterno
   * @param {string} userData.apellidoMaterno - Apellido materno (opcional)
   * @param {string} userData.email - Correo electrónico
   * @param {string} userData.password - Contraseña
   * @param {string} userData.telefono - Número de teléfono (opcional)
   * @param {string} userData.codigoPostal - Código postal (opcional)
   * @returns {Promise<Object>} Usuario registrado
   */
  register: async (userData) => {
    const response = await apiClient.post('/usuarios/register', userData);
    return response.data;
  },

  /**
   * Autentica a un usuario y guarda el token de sesión.
   * 
   * El backend devuelve un token que se guarda en sessionStorage.
   * 
   * @param {Object} credentials - Credenciales de acceso
   * @param {string} credentials.email - Correo electrónico
   * @param {string} credentials.password - Contraseña
   * @returns {Promise<Object>} Respuesta del servidor (contiene el token)
   */
  login: async (credentials) => {
    const response = await apiClient.post('/usuarios/login', credentials);
    
    // El token se guarda tal cual como viene del backend (sin modificar)
    if (response.data.token) {
      sessionStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  },

  /**
   * Obtiene la información del usuario autenticado actualmente.
   * 
   * Requiere que el token de sesión esté presente en sessionStorage.
   * El interceptor de apiClient se encarga de agregarlo al header.
   * 
   * @returns {Promise<Object>} Datos completos del usuario autenticado
   */
  getMe: async () => {
    const response = await apiClient.get('/usuarios/me');
    return response.data;
  },

  /**
   * Actualiza los datos del perfil del usuario autenticado.
   * 
   * @param {Object} userData - Datos actualizados del usuario
   * @returns {Promise<Object>} Usuario actualizado
   */
  updateUsuario: async (userData) => {
    const response = await apiClient.put('/usuarios', userData);
    
    if (response.data) {
      sessionStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  },

  /**
   * Cierra la sesión del usuario actual.
   * 
   * Limpia el token y los datos del usuario de sessionStorage,
   * y notifica al backend para invalidar la sesión.
   * 
   * @returns {Promise<Object>} Mensaje de confirmación
   */
  logout: async () => {
    const response = await apiClient.post('/usuarios/logout');
    
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    return response.data;
  },

  forgotPassword: async (data) => {
    const response = await apiClient.post('/usuarios/forgot-password', data);
    return response.data;
  },
  
  resetPassword: async (data) => {
    const response = await apiClient.post('/usuarios/reset-password', data);
    return response.data;
  }


};