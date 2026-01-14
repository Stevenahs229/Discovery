import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Bell, MapPin, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface RappelPresenceProps {
  isActive: boolean;
  onConfirm: (location?: GeolocationPosition) => void;
  onMissed: () => void;
}

export function RappelPresence({ isActive, onConfirm, onMissed }: RappelPresenceProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60 secondes pour répondre
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Planifier les rappels aléatoires
  useEffect(() => {
    if (!isActive) return;

    // Rappel matin: entre 9h et 11h (random)
    const morningTime = getRandomTime(9, 11);
    // Rappel soir: entre 15h et 17h (random)
    const eveningTime = getRandomTime(15, 17);

    const now = new Date();
    const morningDelay = morningTime.getTime() - now.getTime();
    const eveningDelay = eveningTime.getTime() - now.getTime();

    const morningTimeout = morningDelay > 0 
      ? setTimeout(() => triggerRappel(), morningDelay)
      : null;

    const eveningTimeout = eveningDelay > 0
      ? setTimeout(() => triggerRappel(), eveningDelay)
      : null;

    return () => {
      if (morningTimeout) clearTimeout(morningTimeout);
      if (eveningTimeout) clearTimeout(eveningTimeout);
    };
  }, [isActive]);

  // Countdown
  useEffect(() => {
    if (!showDialog) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showDialog]);

  const getRandomTime = (startHour: number, endHour: number): Date => {
    const now = new Date();
    const randomHour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
    const randomMinute = Math.floor(Math.random() * 60);
    
    const time = new Date(now);
    time.setHours(randomHour, randomMinute, 0, 0);
    
    return time;
  };

  const triggerRappel = () => {
    setShowDialog(true);
    setCountdown(60);
    
    // Notification audio
    playNotificationSound();
    
    // Notification navigateur si permission
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("TwoInOne - Rappel de présence", {
        body: "Confirmez votre présence sur le site",
        icon: "/logo.png",
        badge: "/logo.png",
      });
    }
  };

  const playNotificationSound = () => {
    // Jouer un son de notification
    const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBza=");
    audio.play().catch(() => {
      // Ignorer les erreurs de lecture audio
    });
  };

  const handleConfirm = async () => {
    setIsGettingLocation(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      onConfirm(position);
      setShowDialog(false);
      toast.success("Présence confirmée avec succès");
    } catch (error) {
      console.error("Erreur géolocalisation:", error);
      // Confirmer quand même mais sans localisation
      onConfirm(undefined);
      setShowDialog(false);
      toast.warning("Présence confirmée (localisation non disponible)");
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleTimeout = () => {
    setShowDialog(false);
    onMissed();
    toast.error("Rappel de présence manqué - Votre binôme sera notifié");
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500 animate-bounce" />
            Rappel de Présence
          </DialogTitle>
          <DialogDescription>
            Confirmez que vous êtes toujours présent sur le site
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Countdown */}
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-2">
                <Clock className="w-8 h-8 text-orange-500" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">{countdown}s</p>
                  <p className="text-sm text-gray-600">Temps restant pour répondre</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-600">
                Votre localisation sera vérifiée pour confirmer que vous êtes sur le site
              </p>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-600">
                En cas de non-réponse, votre binôme sera automatiquement notifié
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleConfirm}
              disabled={isGettingLocation}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              {isGettingLocation ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Localisation en cours...
                </>
              ) : (
                "Confirmer ma présence"
              )}
            </Button>
            
            {countdown > 30 && (
              <Button
                onClick={() => setShowDialog(false)}
                variant="outline"
                className="w-full"
              >
                Plus tard
              </Button>
            )}
          </div>

          {/* Avertissement urgence */}
          {countdown <= 15 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600 font-medium text-center">
                ⚠️ Attention ! Le délai expire bientôt
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook pour utiliser le système de rappels
export function useRappelPresence() {
  const [isActive, setIsActive] = useState(false);
  const [missedCount, setMissedCount] = useState(0);

  const handleConfirm = (location?: GeolocationPosition) => {
    console.log("Présence confirmée", location);
    // Enregistrer la confirmation dans la base de données
  };

  const handleMissed = () => {
    setMissedCount((prev) => prev + 1);
    console.log("Rappel manqué, total:", missedCount + 1);
    // Notifier le binôme et enregistrer l'anomalie
  };

  return {
    RappelComponent: () => (
      <RappelPresence
        isActive={isActive}
        onConfirm={handleConfirm}
        onMissed={handleMissed}
      />
    ),
    activateRappels: () => setIsActive(true),
    deactivateRappels: () => setIsActive(false),
    missedCount,
  };
}
