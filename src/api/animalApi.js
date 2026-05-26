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

  /**
   * GET /api/animales — lista las publicaciones activas para el dashboard.
   *
   * @returns {Promise<Array>} Arreglo de publicaciones con los datos del animal.
   */
  listar: async () => {
    const response = await apiClient.get('/api/animales');
    return response.data;
  },

  /**
   * GET /api/animales/{idAnimal} — obtiene el detalle público de una publicación.
   *
   * @param {number} idAnimal
   * @returns {Promise<Object>} AnimalListItemResponse del animal.
   */
  obtener: async (idAnimal) => {
    const response = await apiClient.get(`/api/animales/${idAnimal}`);
    return response.data;
  },

  /**
   * GET /api/animales/{idAnimal}/editar — obtiene los datos completos de un animal para edición.
   * Requiere token de sesión. Solo el dueño puede acceder.
   *
   * @param {number} idAnimal
   * @returns {Promise<Object>} Datos editables del animal (AnimalDetailResponse).
   */
  obtenerParaEditar: async (idAnimal) => {
    const response = await apiClient.get(`/api/animales/${idAnimal}/editar`);
    return response.data;
  },

  /**
   * PUT /api/animales/{idAnimal} — actualiza los campos de un animal.
   * Solo envía los campos que se desean modificar.
   *
   * @param {number} idAnimal
   * @param {Object} data - Campos a actualizar (todos opcionales).
   * @returns {Promise<Object>} { mensaje, idAnimal }
   */
  editar: async (idAnimal, data) => {
    const response = await apiClient.put(`/api/animales/${idAnimal}`, data);
    return response.data;
  },

  /**
   * DELETE /api/animales/{idPublicacion} — borrado lógico de una publicación.
   * Cambia el estado a "Borrada". Solo el dueño puede realizarlo.
   *
   * @param {number} idPublicacion
   * @returns {Promise<Object>} { mensaje }
   */
  eliminar: async (idPublicacion) => {
    const response = await apiClient.delete(`/api/animales/${idPublicacion}`);
    return response.data;
  },

};
