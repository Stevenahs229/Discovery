import { useEffect, useState } from 'react';

export function usePWAInstalled() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est en mode standalone (installée)
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone ||
                          document.referrer.includes('android-app://');
      
      setIsInstalled(isStandalone);
    };

    checkInstalled();

    // Écouter les changements de mode d'affichage
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkInstalled);

    return () => {
      mediaQuery.removeEventListener('change', checkInstalled);
    };
  }, []);

  return isInstalled;
}

// Hook pour vérifier l'état de connexion
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Badge pour indiquer le mode installé
export function PWAInstalledBadge() {
  const isInstalled = usePWAInstalled();

  if (!isInstalled) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
        Application installée
      </div>
    </div>
  );
}

// Bannière pour le mode hors ligne
export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const [show, setShow] = useState(!isOnline);

  useEffect(() => {
    if (!isOnline) {
      setShow(true);
    } else {
      // Attendre 2 secondes avant de masquer pour montrer la reconnexion
      const timeout = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isOnline]);

  if (!show) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isOnline ? 'bg-green-500' : 'bg-orange-500'
    }`}>
      <div className="container mx-auto px-4 py-2 text-center text-white text-sm font-medium">
        {isOnline ? (
          <span>✅ Connexion rétablie</span>
        ) : (
          <span>⚠️ Mode hors ligne - Certaines fonctionnalités sont limitées</span>
        )}
      </div>
    </div>
  );
}
