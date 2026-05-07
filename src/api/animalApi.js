import apiClient from './client';

export const animalApi = {

  /**
   * POST /api/animales/publicar — requiere token de sesión.
   *
   * @param {Object} animalData
   * @param {string} animalData.nombre
   * @param {string} animalData.tipo - "Perro" o "Gato"
   * @param {number} animalData.edad - en meses
   * @param {string} animalData.descripcion
   * @param {string} animalData.codigoPostal - 5 dígitos
   * @param {string} animalData.estadoVacunacion - "Completo" | "Parcial" | "Ninguno"
   * @param {boolean} animalData.esterilizado
   * @param {boolean} animalData.entrenado
   * @param {number} animalData.idRaza
   * @param {?number} animalData.overrideEnergia - 1-5 o null
   * @param {?number} animalData.overrideIndependencia
   * @param {?number} animalData.overrideSociableNiños
   * @param {?number} animalData.overrideSociableMascotas
   * @param {string[]} animalData.padecimientos
   * @param {string[]} animalData.fotos
   * @returns {Promise<Object>} { idAnimal, idPublicacion, nombre }
   */
  publicar: async (animalData) => {
    const response = await apiClient.post('/api/animales/publicar', animalData);
    return response.data;
  },

};
