import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { MapPin, AlertTriangle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';

interface GeolocationPromptProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

export function GeolocationPrompt({ onPermissionGranted, onPermissionDenied }: GeolocationPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { permissionGranted, error, requestPermission } = useGeolocation(false);

  // Vérifier si la permission a déjà été demandée
  useEffect(() => {
    const hasAskedPermission = localStorage.getItem('geolocation_permission_asked');
    
    if (!hasAskedPermission) {
      // Attendre un peu avant d'afficher la popup (meilleure UX)
      setTimeout(() => {
        setShowPrompt(true);
      }, 1000);
    }
  }, []);

  // Surveiller l'état de connexion
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

  // Fermer automatiquement si permission accordée
  useEffect(() => {
    if (permissionGranted) {
      localStorage.setItem('geolocation_permission_asked', 'true');
      localStorage.setItem('geolocation_permission_granted', 'true');
      setShowPrompt(false);
      onPermissionGranted?.();
    }
  }, [permissionGranted, onPermissionGranted]);

  const handleAllow = async () => {
    const granted = await requestPermission();
    
    localStorage.setItem('geolocation_permission_asked', 'true');
    
    if (!granted) {
      localStorage.setItem('geolocation_permission_granted', 'false');
      onPermissionDenied?.();
    }
  };

  const handleDeny = () => {
    localStorage.setItem('geolocation_permission_asked', 'true');
    localStorage.setItem('geolocation_permission_granted', 'false');
    setShowPrompt(false);
    onPermissionDenied?.();
  };

  return (
    <>
      {/* Indicateur de connexion (toujours visible) */}
      <div className="fixed bottom-4 right-4 z-50">
        {isOnline ? (
          <div className="flex items-center gap-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-3 py-2 rounded-full shadow-lg text-sm">
            <Wifi className="h-4 w-4" />
            <span className="font-medium">En ligne</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 px-3 py-2 rounded-full shadow-lg text-sm">
            <WifiOff className="h-4 w-4" />
            <span className="font-medium">Mode hors ligne</span>
          </div>
        )}
      </div>

      {/* Popup de demande de géolocalisation */}
      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">
              Activer la Géolocalisation
            </DialogTitle>
            <DialogDescription className="text-center">
              TwoInOne a besoin d'accéder à votre position pour valider votre présence
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Pourquoi c'est nécessaire */}
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-1">Pourquoi est-ce nécessaire ?</div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Vérifier que vous êtes sur le bon site</li>
                  <li>• Valider votre présence en binôme</li>
                  <li>• Détecter les anomalies de localisation</li>
                  <li>• Fonctionne même hors ligne</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Mode hors ligne */}
            {!isOnline && (
              <Alert variant="default">
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-1">Mode hors ligne détecté</div>
                  <p className="text-sm text-muted-foreground">
                    Votre position sera enregistrée localement et synchronisée lorsque vous serez de nouveau en ligne.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {/* Erreur */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-1">Erreur</div>
                  <p className="text-sm">{error}</p>
                </AlertDescription>
              </Alert>
            )}

            {/* Boutons */}
            <div className="flex flex-col gap-2">
              <Button onClick={handleAllow} className="w-full">
                <MapPin className="mr-2 h-4 w-4" />
                Autoriser la Géolocalisation
              </Button>
              <Button variant="ghost" onClick={handleDeny} className="w-full">
                Refuser
              </Button>
            </div>

            {/* Note de confidentialité */}
            <p className="text-xs text-center text-muted-foreground">
              Votre position n'est utilisée que pour valider votre présence. 
              Les données sont stockées de manière sécurisée et conforme au RGPD.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
