import apiClient from './client';

export const uploadApi = {

  /**
   * Sube un archivo al backend y devuelve la URL accesible.
   *
   * @param {File} file - Archivo del input type=file
   * @returns {Promise<{ url: string }>}
   */
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

};
