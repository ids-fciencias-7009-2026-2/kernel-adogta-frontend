import axios from 'axios';

/**
 * Cliente HTTP configurado para comunicarse con el backend de Adogta
 * usando las credenciales del administrador..
 *
 * Características:
 * - Base URL: http://localhost:8080
 * - Timeout: 10 segundos
 * - Incluye el token de administrador en los headers.
 * - Redirige al login de administrador si recibe un 401.
 */
const adminClient = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones: agrega el token de administrador.
adminClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Interceptor de respuestas: si recibe 401, redirige al login de admin.
adminClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default adminClient;