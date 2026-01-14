import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { MapPin, AlertTriangle, CheckCircle, Navigation } from "lucide-react";
import { toast } from "sonner";

interface SafeZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // en mètres
}

interface SafeZoneProps {
  currentSite: SafeZone;
  isWorkTime: boolean;
}

export function SafeZone({ currentSite, isWorkTime }: SafeZoneProps) {
  const [isInZone, setIsInZone] = useState(true);
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null);
  const [distanceFromCenter, setDistanceFromCenter] = useState<number>(0);
  const [showJustificationDialog, setShowJustificationDialog] = useState(false);
  const [justification, setJustification] = useState("");
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    if (!isWorkTime) {
      // Arrêter le suivi si ce n'est pas l'heure de travail
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      return;
    }

    // Démarrer le suivi de localisation
    if ("geolocation" in navigator) {
      const id = navigator.geolocation.watchPosition(
        handlePositionUpdate,
        handlePositionError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        }
      );
      setWatchId(id);

      return () => {
        navigator.geolocation.clearWatch(id);
      };
    } else {
      toast.error("Géolocalisation non disponible");
    }
  }, [isWorkTime, currentSite]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    // Formule de Haversine
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance en mètres
  };

  const handlePositionUpdate = (position: GeolocationPosition) => {
    setCurrentPosition(position);

    const distance = calculateDistance(
      position.coords.latitude,
      position.coords.longitude,
      currentSite.latitude,
      currentSite.longitude
    );

    setDistanceFromCenter(distance);

    const wasInZone = isInZone;
    const nowInZone = distance <= currentSite.radius;

    setIsInZone(nowInZone);

    // Notification si sortie de zone
    if (wasInZone && !nowInZone) {
      handleZoneExit();
    }

    // Notification si retour dans la zone
    if (!wasInZone && nowInZone) {
      toast.success("Vous êtes de retour dans la zone autorisée");
    }
  };

  const handlePositionError = (error: GeolocationPositionError) => {
    console.error("Erreur géolocalisation:", error);
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        toast.error("Permission de localisation refusée");
        break;
      case error.POSITION_UNAVAILABLE:
        toast.error("Position indisponible");
        break;
      case error.TIMEOUT:
        toast.warning("Délai d'attente de localisation dépassé");
        break;
    }
  };

  const handleZoneExit = () => {
    // Jouer un son d'alerte
    playAlertSound();

    // Notification
    toast.warning("⚠️ Vous avez quitté la zone autorisée", {
      duration: 10000,
      action: {
        label: "Justifier",
        onClick: () => setShowJustificationDialog(true),
      },
    });

    // Notification navigateur
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("TwoInOne - Alerte Zone", {
        body: "Vous avez quitté la zone de travail autorisée",
        icon: "/logo.png",
        tag: "zone-exit",
        requireInteraction: true,
      });
    }

    // Ouvrir automatiquement le dialogue après 5 secondes
    setTimeout(() => {
      setShowJustificationDialog(true);
    }, 5000);
  };

  const playAlertSound = () => {
    const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBza=");
    audio.play().catch(() => {});
  };

  const handleSubmitJustification = () => {
    if (!justification.trim()) {
      toast.error("Veuillez fournir une justification");
      return;
    }

    // Enregistrer la justification dans la base de données
    console.log("Justification soumise:", {
      timestamp: new Date(),
      position: currentPosition,
      distance: distanceFromCenter,
      justification,
    });

    toast.success("Justification enregistrée");
    setShowJustificationDialog(false);
    setJustification("");
  };

  const getZoneStatusColor = () => {
    if (!isWorkTime) return "bg-gray-500";
    return isInZone ? "bg-green-500" : "bg-red-500";
  };

  const getZoneStatusText = () => {
    if (!isWorkTime) return "Suivi désactivé (hors horaires de travail)";
    return isInZone ? "Dans la zone autorisée" : "Hors zone autorisée";
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            Safe Zone - {currentSite.name}
          </CardTitle>
          <CardDescription>
            Zone de travail géographique autorisée
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Statut de la zone */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${getZoneStatusColor()} flex items-center justify-center text-white`}>
                {isWorkTime && isInZone ? (
                  <CheckCircle className="w-6 h-6" />
                ) : isWorkTime && !isInZone ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <Navigation className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="font-medium">{getZoneStatusText()}</p>
                {isWorkTime && currentPosition && (
                  <p className="text-sm text-gray-600">
                    Distance du centre: {Math.round(distanceFromCenter)}m / {currentSite.radius}m
                  </p>
                )}
              </div>
            </div>
            <Badge variant={isInZone ? "default" : "destructive"}>
              {isInZone ? "✓ OK" : "⚠ Alerte"}
            </Badge>
          </div>

          {/* Informations de la zone */}
          <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Site</span>
              <span className="font-medium">{currentSite.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Rayon autorisé</span>
              <span className="font-medium">{currentSite.radius}m</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Coordonnées</span>
              <span className="font-mono text-xs">
                {currentSite.latitude.toFixed(4)}, {currentSite.longitude.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Carte (simulée) */}
          <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Zone de travail</p>
                <p className="text-xs text-gray-600">{currentSite.name}</p>
              </div>
            </div>
            {/* Cercle de zone (représentation visuelle) */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-orange-500 opacity-30"
              style={{ width: "60%", height: "60%" }}
            />
            {/* Position actuelle */}
            {currentPosition && (
              <div
                className={`absolute w-4 h-4 rounded-full ${
                  isInZone ? "bg-green-500" : "bg-red-500"
                } animate-pulse`}
                style={{
                  top: "50%",
                  left: isInZone ? "50%" : "30%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </div>

          {/* Actions */}
          {!isInZone && isWorkTime && (
            <Button
              onClick={() => setShowJustificationDialog(true)}
              variant="outline"
              className="w-full"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Fournir une justification
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Dialog de justification */}
      <Dialog open={showJustificationDialog} onOpenChange={setShowJustificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Justification de sortie de zone</DialogTitle>
            <DialogDescription>
              Vous avez quitté la zone de travail autorisée. Veuillez fournir une justification.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Motif de sortie *</Label>
              <Textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Ex: Mission extérieure, pause déjeuner autorisée, déplacement exceptionnel..."
                rows={4}
              />
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-800">
                ℹ️ Cette justification sera enregistrée et pourra être vérifiée par votre responsable.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmitJustification}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                Enregistrer
              </Button>
              <Button
                onClick={() => setShowJustificationDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Plus tard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
