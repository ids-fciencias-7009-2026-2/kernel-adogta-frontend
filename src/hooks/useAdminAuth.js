import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../api/adminApi';

/**
 * Hook de autenticación para administradores.
 * Utiliza 'adminToken' en sessionStorage.
 */
export const useAdminAuth = () => {
  const [admin, setAdmin] = useState(null);      // Datos del administrador logueado
  const [loading, setLoading] = useState(true);  // Variable de estado para 'loading'.
  const navigate = useNavigate();

  // Verifica si hay token de admin y carga los datos
  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
      setLoading(false);
      return;
    }
    loadAdmin();
  }, []);

  // Obtiene los datos del administrador
  const loadAdmin = async () => {
    try {
      const adminData = await adminApi.getMe();
      setAdmin(adminData);
    } catch (err) {
      // Si el token es inválido, limpia y redirige al login
      if (err.response?.status === 401) {
        sessionStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Cierra la sesión del administrador
  const logout = async () => {
    await adminApi.logout();
    setAdmin(null);
    navigate('/admin/login');
  };

  // Verifica si hay un token de administrador activo
  const isAuthenticated = () => {
    return sessionStorage.getItem('adminToken') !== null;
  };

  return { admin, loading, logout, loadAdmin, isAuthenticated };
};