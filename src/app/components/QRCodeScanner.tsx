import { useState, useEffect, useRef } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { QrCode, Camera, CheckCircle, XCircle, Fingerprint, Shield } from "lucide-react";
import QRCode from "qrcode";
import QrScanner from "qr-scanner";
import { toast } from "sonner";

interface QRCodeScannerProps {
  onScanSuccess: (data: string) => void;
  userId: string;
  userName: string;
  mode: "generate" | "scan";
}

export function QRCodeScanner({ onScanSuccess, userId, userName, mode }: QRCodeScannerProps) {
  const [qrCodeData, setQrCodeData] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [showBiometricDialog, setShowBiometricDialog] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  // Générer le QR Code avec timestamp pour validation temporelle
  useEffect(() => {
    if (mode === "generate") {
      generateQRCode();
    }
  }, [mode, userId]);

  const generateQRCode = async () => {
    const timestamp = Date.now();
    const qrData = JSON.stringify({
      userId,
      userName,
      timestamp,
      type: "presence_validation",
      expiresAt: timestamp + 2 * 60 * 1000, // Expire dans 2 minutes
    });

    try {
      const qrCodeUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: "#2C5F4D", // Vert principal du branding
          light: "#FFFFFF",
        },
      });
      setQrCodeData(qrCodeUrl);
    } catch (error) {
      console.error("Erreur génération QR Code:", error);
      toast.error("Impossible de générer le QR Code");
    }
  };

  // Simulation de vérification biométrique
  const simulateBiometricAuth = async () => {
    setShowBiometricDialog(true);
    
    // Simuler le délai de la vérification biométrique
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulation: 90% de succès
    const success = Math.random() > 0.1;
    
    if (success) {
      setBiometricVerified(true);
      setShowBiometricDialog(false);
      toast.success("Biométrie vérifiée avec succès");
      // Démarrer automatiquement le scan après vérification
      setTimeout(() => startScanning(), 500);
    } else {
      setShowBiometricDialog(false);
      toast.error("Échec de la vérification biométrique. Réessayez.");
    }
  };

  const startScanning = async () => {
    // Vérifier la biométrie avant de permettre le scan
    if (!biometricVerified) {
      toast.error("Veuillez d'abord vérifier votre biométrie");
      return;
    }

    if (!videoRef.current) return;

    setIsScanning(true);
    try {
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          handleScanResult(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      scannerRef.current = scanner;
      await scanner.start();
    } catch (error) {
      console.error("Erreur démarrage scanner:", error);
      toast.error("Impossible d'accéder à la caméra");
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScanResult = (data: string) => {
    try {
      const parsedData = JSON.parse(data);
      
      // Vérifier l'expiration
      if (parsedData.expiresAt < Date.now()) {
        toast.error("QR Code expiré");
        return;
      }

      // Vérifier le type
      if (parsedData.type !== "presence_validation") {
        toast.error("QR Code invalide");
        return;
      }

      setScanResult(data);
      stopScanning();
      onScanSuccess(data);
      toast.success(`Binôme validé: ${parsedData.userName}`);
    } catch (error) {
      console.error("Erreur parsing QR Code:", error);
      toast.error("QR Code invalide");
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  if (mode === "generate") {
    return (
      <Card className="w-full max-w-md mx-auto border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            QR Code de Présence
          </CardTitle>
          <CardDescription>
            Votre binôme doit scanner ce code pour valider la présence simultanée
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {qrCodeData && (
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white rounded-lg shadow-lg border-2 border-primary/20">
                <img src={qrCodeData} alt="QR Code Présence" className="w-full h-full" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">Code valide pendant 2 minutes</p>
              </div>
              <Button onClick={generateQRCode} variant="outline" size="sm" className="border-primary/20">
                Régénérer le code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Scanner le QR Code
          </CardTitle>
          <CardDescription>
            Scannez le QR Code de votre binôme pour valider votre présence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Étape 1: Vérification biométrique */}
          {!biometricVerified && !scanResult && (
            <div className="space-y-4">
              <div className="p-6 bg-muted/50 rounded-lg border-2 border-dashed border-primary/20 text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Sécurité Renforcée</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pour éviter la fraude, vous devez d'abord vérifier votre identité par biométrie
                </p>
              </div>
              <Button 
                onClick={simulateBiometricAuth} 
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Fingerprint className="w-4 h-4 mr-2" />
                Vérifier ma biométrie
              </Button>
            </div>
          )}

          {/* Étape 2: Scan QR Code (après biométrie) */}
          {biometricVerified && !isScanning && !scanResult && (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Biométrie vérifiée</span>
                </div>
              </div>
              <Button onClick={startScanning} className="w-full bg-primary hover:bg-primary/90">
                <Camera className="w-4 h-4 mr-2" />
                Démarrer le scan
              </Button>
            </div>
          )}

          {isScanning && (
            <div className="space-y-4">
              <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" />
              </div>
              <Button onClick={stopScanning} variant="outline" className="w-full">
                Annuler
              </Button>
            </div>
          )}

          {scanResult && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-primary mx-auto" />
              <div>
                <p className="font-semibold text-primary">Scan réussi !</p>
                <p className="text-sm text-muted-foreground">Présence binôme validée</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de vérification biométrique */}
      <Dialog open={showBiometricDialog} onOpenChange={setShowBiometricDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-primary" />
              Vérification Biométrique
            </DialogTitle>
            <DialogDescription>
              Vérification de votre identité en cours...
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <Fingerprint className="w-24 h-24 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            </div>
            <p className="mt-6 text-sm text-muted-foreground text-center">
              Placez votre doigt sur le capteur biométrique
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}