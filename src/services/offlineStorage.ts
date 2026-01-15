/**
 * Service de gestion du stockage hors ligne
 * Permet de stocker et synchroniser les données quand l'app est offline
 */

interface OfflineData {
  id: string;
  type: 'presence' | 'absence' | 'geolocation' | 'biometric';
  data: any;
  timestamp: number;
  synced: boolean;
}

interface UserData {
  userId: string;
  nom: string;
  prenom: string;
  email: string;
  role?: string;
  lastSync: number;
}

const OFFLINE_STORAGE_KEY = 'twoinone_offline_data';
const USER_DATA_KEY = 'twoinone_user_data';
const SYNC_QUEUE_KEY = 'twoinone_sync_queue';

export class OfflineStorageService {
  
  // ========================================
  // GESTION DES DONNÉES UTILISATEUR
  // ========================================
  
  /**
   * Stocker les données utilisateur localement
   */
  static saveUserData(userData: Partial<UserData>): void {
    try {
      const existing = this.getUserData();
      const updated = {
        ...existing,
        ...userData,
        lastSync: Date.now(),
      };
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updated));
      console.log('[OfflineStorage] User data saved:', updated);
    } catch (error) {
      console.error('[OfflineStorage] Error saving user data:', error);
    }
  }

  /**
   * Récupérer les données utilisateur
   */
  static getUserData(): UserData | null {
    try {
      const data = localStorage.getItem(USER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[OfflineStorage] Error getting user data:', error);
      return null;
    }
  }

  /**
   * Supprimer les données utilisateur (déconnexion)
   */
  static clearUserData(): void {
    localStorage.removeItem(USER_DATA_KEY);
  }

  // ========================================
  // GESTION DE LA FILE DE SYNCHRONISATION
  // ========================================

  /**
   * Ajouter une donnée à la file de synchronisation
   */
  static addToSyncQueue(type: OfflineData['type'], data: any): string {
    try {
      const queue = this.getSyncQueue();
      const newItem: OfflineData = {
        id: this.generateId(),
        type,
        data,
        timestamp: Date.now(),
        synced: false,
      };
      
      queue.push(newItem);
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
      
      console.log(`[OfflineStorage] Added to sync queue (${type}):`, newItem);
      
      return newItem.id;
    } catch (error) {
      console.error('[OfflineStorage] Error adding to sync queue:', error);
      throw error;
    }
  }

  /**
   * Récupérer la file de synchronisation
   */
  static getSyncQueue(): OfflineData[] {
    try {
      const data = localStorage.getItem(SYNC_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[OfflineStorage] Error getting sync queue:', error);
      return [];
    }
  }

  /**
   * Obtenir uniquement les données non synchronisées
   */
  static getUnsyncedData(): OfflineData[] {
    return this.getSyncQueue().filter(item => !item.synced);
  }

  /**
   * Marquer un élément comme synchronisé
   */
  static markAsSynced(id: string): void {
    try {
      const queue = this.getSyncQueue();
      const updated = queue.map(item =>
        item.id === id ? { ...item, synced: true } : item
      );
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updated));
      console.log('[OfflineStorage] Marked as synced:', id);
    } catch (error) {
      console.error('[OfflineStorage] Error marking as synced:', error);
    }
  }

  /**
   * Supprimer les données synchronisées (nettoyage)
   */
  static clearSyncedData(): void {
    try {
      const queue = this.getSyncQueue();
      const unsynced = queue.filter(item => !item.synced);
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(unsynced));
      console.log('[OfflineStorage] Cleared synced data');
    } catch (error) {
      console.error('[OfflineStorage] Error clearing synced data:', error);
    }
  }

  // ========================================
  // STOCKAGE DES PRÉSENCES OFFLINE
  // ========================================

  /**
   * Enregistrer une présence hors ligne
   */
  static saveOfflinePresence(data: {
    validationType: string;
    latitude?: number;
    longitude?: number;
    accuracy?: number;
  }): string {
    return this.addToSyncQueue('presence', {
      ...data,
      timestamp: Date.now(),
      offline: true,
    });
  }

  /**
   * Enregistrer une absence hors ligne
   */
  static saveOfflineAbsence(data: {
    motif: string;
    dateDebut: string;
    dateFin: string;
    commentaire?: string;
    nouveauBinomeId?: string;
  }): string {
    return this.addToSyncQueue('absence', {
      ...data,
      timestamp: Date.now(),
      offline: true,
    });
  }

  // ========================================
  // GÉOLOCALISATION OFFLINE
  // ========================================

  /**
   * Sauvegarder la dernière position connue
   */
  static saveGeolocation(latitude: number, longitude: number, accuracy: number): void {
    const data = {
      latitude,
      longitude,
      accuracy,
      timestamp: Date.now(),
    };
    localStorage.setItem('last_geolocation', JSON.stringify(data));
    console.log('[OfflineStorage] Geolocation saved:', data);
  }

  /**
   * Récupérer la dernière position connue
   */
  static getLastGeolocation(): {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  } | null {
    try {
      const data = localStorage.getItem('last_geolocation');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[OfflineStorage] Error getting geolocation:', error);
      return null;
    }
  }

  // ========================================
  // DONNÉES BIOMÉTRIQUES
  // ========================================

  /**
   * Sauvegarder les données biométriques (empreinte activée, etc.)
   */
  static saveBiometricData(data: {
    fingerprintEnabled: boolean;
    facialEnabled: boolean;
    lastEnrollment?: number;
  }): void {
    localStorage.setItem('biometric_data', JSON.stringify(data));
  }

  /**
   * Récupérer les données biométriques
   */
  static getBiometricData(): {
    fingerprintEnabled: boolean;
    facialEnabled: boolean;
    lastEnrollment?: number;
  } | null {
    try {
      const data = localStorage.getItem('biometric_data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  }

  // ========================================
  // SYNCHRONISATION
  // ========================================

  /**
   * Synchroniser toutes les données non synchronisées
   */
  static async syncAll(): Promise<{ success: number; failed: number }> {
    const unsyncedData = this.getUnsyncedData();
    
    if (unsyncedData.length === 0) {
      console.log('[OfflineStorage] No data to sync');
      return { success: 0, failed: 0 };
    }

    console.log(`[OfflineStorage] Syncing ${unsyncedData.length} items...`);

    let success = 0;
    let failed = 0;

    for (const item of unsyncedData) {
      try {
        // Ici, vous appelleriez vos API endpoints pour envoyer les données
        // Pour l'instant, on simule juste
        console.log(`[OfflineStorage] Syncing ${item.type}:`, item.data);
        
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 100));
        
        this.markAsSynced(item.id);
        success++;
      } catch (error) {
        console.error(`[OfflineStorage] Failed to sync ${item.id}:`, error);
        failed++;
      }
    }

    console.log(`[OfflineStorage] Sync complete: ${success} success, ${failed} failed`);
    
    // Nettoyer les données synchronisées
    if (success > 0) {
      this.clearSyncedData();
    }

    return { success, failed };
  }

  // ========================================
  // STATISTIQUES
  // ========================================

  /**
   * Obtenir des statistiques sur le stockage offline
   */
  static getStats(): {
    totalItems: number;
    unsyncedItems: number;
    storageUsed: number;
    lastSync: number | null;
  } {
    const queue = this.getSyncQueue();
    const unsynced = this.getUnsyncedData();
    const userData = this.getUserData();

    // Calculer l'espace utilisé (approximatif)
    const storageUsed = new Blob([
      localStorage.getItem(SYNC_QUEUE_KEY) || '',
      localStorage.getItem(USER_DATA_KEY) || '',
    ]).size;

    return {
      totalItems: queue.length,
      unsyncedItems: unsynced.length,
      storageUsed,
      lastSync: userData?.lastSync || null,
    };
  }

  // ========================================
  // UTILITAIRES
  // ========================================

  /**
   * Générer un ID unique
   */
  private static generateId(): string {
    return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Nettoyer toutes les données offline
   */
  static clearAll(): void {
    localStorage.removeItem(SYNC_QUEUE_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem('last_geolocation');
    localStorage.removeItem('biometric_data');
    console.log('[OfflineStorage] All offline data cleared');
  }

  /**
   * Vérifier si l'application est en ligne
   */
  static isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Exporter toutes les données (pour debug)
   */
  static exportAllData(): {
    userData: UserData | null;
    syncQueue: OfflineData[];
    geolocation: any;
    biometric: any;
    stats: any;
  } {
    return {
      userData: this.getUserData(),
      syncQueue: this.getSyncQueue(),
      geolocation: this.getLastGeolocation(),
      biometric: this.getBiometricData(),
      stats: this.getStats(),
    };
  }
}

// Auto-sync quand l'app revient en ligne
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[OfflineStorage] App is online, starting auto-sync...');
    OfflineStorageService.syncAll().then((result) => {
      console.log('[OfflineStorage] Auto-sync complete:', result);
    });
  });
}

export default OfflineStorageService;
