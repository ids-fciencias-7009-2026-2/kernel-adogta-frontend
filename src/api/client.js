import axios from 'axios';

/**
 * Cliente HTTP configurado para comunicarse con el backend de Adogta.
 * 
 * Características:
 * - Base URL: http://localhost:8080
 * - Timeout: 10 segundos
 * - Incluye automáticamente el token de sesión en los headers
 */
const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de peticiones.
 * Agrega el token de sesión al header Authorization si existe.
 * 
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = token;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor de respuestas.
 * 
 * Cuando se recibe un 401 (No autorizado):
 * - Limpia el token y los datos del usuario del sessionStorage
 * - Redirige al login.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el error es 401, el token es inválido o expiró
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;