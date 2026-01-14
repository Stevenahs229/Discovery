/**
 * Service API pour le Backend ML Python
 * Gestion de la reconnaissance faciale et biométrie
 */

// URL du backend ML Python (à configurer)
const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';

export interface FaceVerificationResult {
  success: boolean;
  user_id?: string;
  confidence: number;
  message: string;
}

export interface FaceEnrollmentResult {
  success: boolean;
  message: string;
  face_count?: number;
}

export const mlApi = {
  /**
   * Vérifier l'état du service ML
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${ML_API_URL}/ml/health`);
      return response.ok;
    } catch (error) {
      console.error('ML API health check failed:', error);
      return false;
    }
  },

  /**
   * Enregistrer le visage d'un utilisateur
   */
  async enrollFace(
    file: File,
    userId: string,
    token: string
  ): Promise<FaceEnrollmentResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${ML_API_URL}/ml/enroll-face`, {
        method: 'POST',
        headers: {
          'user_id': userId,
          'authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Erreur lors de l\'enregistrement facial');
      }

      return data;
    } catch (error) {
      console.error('Error enrolling face:', error);
      throw error;
    }
  },

  /**
   * Vérifier l'identité via reconnaissance faciale
   */
  async verifyFace(file: File, token: string): Promise<FaceVerificationResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${ML_API_URL}/ml/verify-face`, {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Erreur lors de la vérification faciale');
      }

      return data;
    } catch (error) {
      console.error('Error verifying face:', error);
      throw error;
    }
  },

  /**
   * Obtenir la liste des utilisateurs avec reconnaissance faciale activée
   */
  async getEnrolledUsers(token: string): Promise<string[]> {
    try {
      const response = await fetch(`${ML_API_URL}/ml/users-enrolled`, {
        headers: {
          'authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data.enrolled_users || [];
    } catch (error) {
      console.error('Error getting enrolled users:', error);
      return [];
    }
  },

  /**
   * Supprimer l'enregistrement facial d'un utilisateur
   */
  async deleteFaceEnrollment(userId: string, token: string): Promise<boolean> {
    try {
      const response = await fetch(`${ML_API_URL}/ml/delete-face/${userId}`, {
        method: 'DELETE',
        headers: {
          'authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting face enrollment:', error);
      return false;
    }
  },

  /**
   * Capturer une image depuis la webcam
   */
  async captureImageFromWebcam(): Promise<File | null> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');

      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          video.srcObject = stream;
          video.play();

          // Attendre que la vidéo soit prête
          video.onloadedmetadata = () => {
            setTimeout(() => {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;

              const context = canvas.getContext('2d');
              if (context) {
                context.drawImage(video, 0, 0);

                // Convertir en blob puis en File
                canvas.toBlob((blob) => {
                  if (blob) {
                    const file = new File([blob], 'face-capture.jpg', {
                      type: 'image/jpeg',
                    });
                    resolve(file);
                  } else {
                    resolve(null);
                  }

                  // Arrêter la webcam
                  stream.getTracks().forEach((track) => track.stop());
                }, 'image/jpeg');
              } else {
                resolve(null);
                stream.getTracks().forEach((track) => track.stop());
              }
            }, 1000); // Délai pour que l'utilisateur se positionne
          };
        })
        .catch((error) => {
          console.error('Error accessing webcam:', error);
          resolve(null);
        });
    });
  },
};
