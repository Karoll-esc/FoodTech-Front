/**
 * Servicio para gestionar la carga de imágenes a S3
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Access to the token provider registered in apiClient
let getAccessToken: (() => Promise<string>) | null = null;

export const registerImageServiceTokenProvider = (provider: () => Promise<string>) => {
  getAccessToken = provider;
};

class ImageService {
  /**
   * Sube una imagen a S3 y devuelve la URL pública
   */
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: HeadersInit = {};

    if (getAccessToken) {
      const token = await getAccessToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al subir imagen: ${errorText || response.statusText}`);
    }

    const imageUrl = await response.text();
    console.log('🖼️ URL de imagen recibida de S3:', imageUrl);
    return imageUrl;
  }
}

export const imageService = new ImageService();
