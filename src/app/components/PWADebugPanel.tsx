import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface PWAStatus {
  isStandalone: boolean;
  hasServiceWorker: boolean;
  isOnline: boolean;
  manifestValid: boolean;
  swActive: boolean;
}

export function PWADebugPanel() {
  const [status, setStatus] = useState<PWAStatus>({
    isStandalone: false,
    hasServiceWorker: false,
    isOnline: true,
    manifestValid: false,
    swActive: false,
  });
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    checkPWAStatus();
    
    // Vérifier périodiquement
    const interval = setInterval(checkPWAStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkPWAStatus = async () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');

    const hasServiceWorker = 'serviceWorker' in navigator;
    const isOnline = navigator.onLine;

    // Vérifier le manifest
    let manifestValid = false;
    try {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        const response = await fetch((manifestLink as HTMLLinkElement).href);
        manifestValid = response.ok;
      }
    } catch (error) {
      console.error('Erreur vérification manifest:', error);
    }

    // Vérifier le Service Worker
    let swActive = false;
    if (hasServiceWorker && navigator.serviceWorker.controller) {
      swActive = true;
    }

    setStatus({
      isStandalone,
      hasServiceWorker,
      isOnline,
      manifestValid,
      swActive,
    });
  };

  const handleForceUpdate = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        window.location.reload();
      }
    }
  };

  // Raccourci clavier pour afficher/masquer le panel (Ctrl+Shift+P)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowPanel(!showPanel);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showPanel]);

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-4 left-4 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Afficher le debug PWA (Ctrl+Shift+P)"
      >
        🔧
      </button>
    );
  }

  const StatusIcon = ({ condition }: { condition: boolean }) => (
    condition ? (
      <CheckCircle2 className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    )
  );

  const overallScore = Object.values(status).filter(Boolean).length;
  const totalChecks = Object.keys(status).length;
  const scorePercentage = (overallScore / totalChecks) * 100;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <Card className="shadow-2xl border-2 border-indigo-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">PWA Debug Panel</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPanel(false)}
              className="h-6 w-6 p-0"
            >
              ✕
            </Button>
          </div>
          <CardDescription>
            Score : {overallScore}/{totalChecks} ({scorePercentage.toFixed(0)}%)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Mode Standalone */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Mode Installé</span>
            <div className="flex items-center gap-2">
              <StatusIcon condition={status.isStandalone} />
              <Badge variant={status.isStandalone ? "default" : "secondary"}>
                {status.isStandalone ? "Oui" : "Non"}
              </Badge>
            </div>
          </div>

          {/* Service Worker Support */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Support SW</span>
            <div className="flex items-center gap-2">
              <StatusIcon condition={status.hasServiceWorker} />
              <Badge variant={status.hasServiceWorker ? "default" : "secondary"}>
                {status.hasServiceWorker ? "Oui" : "Non"}
              </Badge>
            </div>
          </div>

          {/* Service Worker Active */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">SW Actif</span>
            <div className="flex items-center gap-2">
              <StatusIcon condition={status.swActive} />
              <Badge variant={status.swActive ? "default" : "secondary"}>
                {status.swActive ? "Actif" : "Inactif"}
              </Badge>
            </div>
          </div>

          {/* Manifest Valid */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Manifest</span>
            <div className="flex items-center gap-2">
              <StatusIcon condition={status.manifestValid} />
              <Badge variant={status.manifestValid ? "default" : "secondary"}>
                {status.manifestValid ? "Valide" : "Invalide"}
              </Badge>
            </div>
          </div>

          {/* Online Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Connexion</span>
            <div className="flex items-center gap-2">
              <StatusIcon condition={status.isOnline} />
              <Badge variant={status.isOnline ? "default" : "destructive"}>
                {status.isOnline ? "En ligne" : "Hors ligne"}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t space-y-2">
            <Button
              onClick={checkPWAStatus}
              size="sm"
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            
            <Button
              onClick={handleForceUpdate}
              size="sm"
              variant="outline"
              className="w-full"
            >
              Forcer la mise à jour
            </Button>
          </div>

          {/* Conseils */}
          {scorePercentage < 100 && (
            <div className="pt-3 border-t">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-600">
                  {!status.swActive && "Service Worker non actif. Rechargez la page."}
                  {!status.manifestValid && " Manifest introuvable ou invalide."}
                  {!status.isStandalone && " App non installée. Installez-la via le prompt."}
                </p>
              </div>
            </div>
          )}

          {scorePercentage === 100 && (
            <div className="pt-3 border-t">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <p className="text-xs font-medium">
                  ✅ PWA parfaitement configurée !
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
