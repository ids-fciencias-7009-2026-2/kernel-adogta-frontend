import { useState } from 'react';

/**
 * Hook para manejar estados de carga (sea spinner o deshabilitar botones, cualquier espera necesaria).
 * @param {boolean} initialState - Estado inicial (default: false)
 * @returns {Object} { loading, startLoading, stopLoading, withLoading }
 */
export const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);  // Estado de carga

  const startLoading = () => setLoading(true);   // Activa carga
  const stopLoading = () => setLoading(false);   // Desactiva carga

  /**
   * Ejecuta una función asíncrona mostrando carga automáticamente
   * @param {Function} callback - Función asíncrona a ejecutar
   */
  const withLoading = async (callback) => {
    startLoading();  // Activa carga
    try {
      return await callback();  // Ejecuta la función
    } finally {
      stopLoading();  // Desactiva carga al terminar.
    }
  };

  return { loading, startLoading, stopLoading, withLoading };
};