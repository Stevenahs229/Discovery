import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Smartphone, Wifi, Download, Zap, X } from 'lucide-react';

export function PWAWelcomeModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Vérifier si c'est la première visite
    const hasSeenWelcome = localStorage.getItem('pwa-welcome-seen');
    
    if (!hasSeenWelcome) {
      // Attendre 2 secondes avant d'afficher pour ne pas être intrusif
      const timeout = setTimeout(() => {
        setShow(true);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('pwa-welcome-seen', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="max-w-md w-full shadow-2xl border-2 border-indigo-500 animate-in zoom-in-95 duration-300">
        <CardHeader className="relative pb-4">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
            Bienvenue sur TwoInOne !
          </CardTitle>
          
          <CardDescription className="text-center text-base mt-2">
            Cette application peut être installée sur votre smartphone comme une vraie app
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Avantages */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Installation rapide</h4>
                <p className="text-sm text-gray-600">Ajoutez TwoInOne à votre écran d'accueil en un clic</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Wifi className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Mode hors ligne</h4>
                <p className="text-sm text-gray-600">Accédez à l'app même sans connexion internet</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Performance optimale</h4>
                <p className="text-sm text-gray-600">Chargement ultra-rapide et expérience fluide</p>
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-3">
              <strong>Comment installer ?</strong>
            </p>
            <div className="bg-indigo-50 p-3 rounded-lg text-sm text-gray-700 space-y-2">
              <p className="flex items-center gap-2">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                Un message "Installer TwoInOne" apparaîtra
              </p>
              <p className="flex items-center gap-2">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                Cliquez sur "Installer"
              </p>
              <p className="flex items-center gap-2">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                L'icône apparaît sur votre écran d'accueil !
              </p>
            </div>
          </div>
          
          {/* Bouton */}
          <Button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
          >
            J'ai compris
          </Button>
          
          <p className="text-xs text-center text-gray-500">
            Ce message ne s'affichera plus
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
