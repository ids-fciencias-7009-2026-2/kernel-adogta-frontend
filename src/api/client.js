import axios from 'axios';

/**
 * Cliente HTTP configurado para comunicarse con el backend de Adogta.
 *
 * Características:
 * - Base URL: http://localhost:8080
 * - Timeout: 10 segundos
 * - Incluye automáticamente el token de sesión del usuario en los headers.
 * - Redirige al login si recibe un 401 (sesión expirada o no autorizada).
 */
const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones: agrega el token de usuario.
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Interceptor de respuestas: si recibe 401, limpia la sesión y redirige al login.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginPage = error.config?.url?.includes('/login');
    if (error.response?.status === 401 && !isLoginPage) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;