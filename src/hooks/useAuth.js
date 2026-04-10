import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioApi } from '../api/usuarioApi';

/**
 * Hook autenticación de usuarios
 * @returns {Object} { user, loading, logout, loadUser, isAuthenticated }
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);       // Datos del usuario logueado
  const [loading, setLoading] = useState(true); // Estado de carga inicial
  const navigate = useNavigate();               // Para redirigir a otras páginas

  // Al cargarse, verifica si hay sesión activa
  useEffect(() => {
    const token = sessionStorage.getItem('token');  // checa el token
    if (!token) {
      setLoading(false);  // No hay token, deja de cargar.
      return;
    }
    loadUser();  // Hay token, carga datos del usuario
  }, []);

  /**
   * Carga los datos del usuario desde el backend
   */
  const loadUser = async () => {
    try {
      const userData = await usuarioApi.getMe();  // Pide datos al backend
      setUser(userData);                          // Guarda usuario
    } catch (err) {
      console.error('Error loading user:', err);
      // 401: limpia sesión y redirige al login
      if (err.response?.status === 401) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);  // Termina carga
    }
  };

  /**
   * Cierra sesión del usuario
   */
  const logout = async () => {
    try {
      await usuarioApi.logout();  // Notifica al backend
    } catch (err) {
      console.error('Error during logout:', err);
    }
    setUser(null);       // Nulifica el usuario.
    navigate('/login');  // Redirige al login
  };

  /**
   * Verifica si hay un token válido
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    const token = sessionStorage.getItem('token');
    return token !== null && token !== '';  // true si hay token
  };

  // Retorna los datos necesarios para autentificarlo.
  return { user, loading, logout, loadUser, isAuthenticated };
};