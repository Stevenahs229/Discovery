import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Header } from "@/app/components/Header";
import { QRCodeScanner } from "@/app/components/QRCodeScanner";
import { AuthAlternative } from "@/app/components/AuthAlternative";
import { Fingerprint, ArrowLeft, CheckCircle2, Shield, QrCode, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/app/components/ui/progress";
import { api } from "@/lib/supabase";

interface ValidationPresenceProps {
  onBack: () => void;
  onSuccess: () => void;
  accessToken: string | null;
}

export function ValidationPresence({ onBack, onSuccess, accessToken }: ValidationPresenceProps) {
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showQRGen, setShowQRGen] = useState(false);
  const [showQRScan, setShowQRScan] = useState(false);

  const handleBiometricAuth = async () => {
    setValidating(true);
    setProgress(0);
    toast.info("Authentification en cours...");
    
    // Simulate biometric authentication
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show QR Code generation after biometric
    setValidating(false);
    setShowQRGen(true);
    toast.success("Empreinte biométrique validée! Générez maintenant votre QR Code.");
  };

  const handleQRScanSuccess = async (data: string) => {
    // Record presence in backend
    if (accessToken) {
      try {
        const result = await api.declarePresence(accessToken, 'qr_biometric');
        if (result.success) {
          setValidated(true);
          toast.success("Présence validée avec succès!");
          setTimeout(() => onSuccess(), 2000);
        } else {
          toast.error("Erreur lors de la validation");
        }
      } catch (error) {
        console.error("Error declaring presence:", error);
        toast.error("Erreur lors de l'enregistrement");
      }
    }
  };

  const handleAlternativeSuccess = async (token: string) => {
    // Record presence avec méthode alternative
    if (accessToken) {
      try {
        const result = await api.declarePresence(accessToken, 'alternative');
        if (result.success) {
          setValidated(true);
          toast.success("Présence validée avec méthode alternative!");
          setTimeout(() => onSuccess(), 2000);
        } else {
          toast.error("Erreur lors de la validation");
        }
      } catch (error) {
        console.error("Error declaring presence:", error);
        toast.error("Erreur lors de l'enregistrement");
      }
    }
  };

  if (validated) {
    return (
      <div className="min-h-screen bg-background">
        <Header showThemeToggle={true} />
        <div className="flex items-center justify-center p-4 mt-20">
          <Card className="w-full max-w-md shadow-lg border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Présence validée avec succès</h2>
                <p className="text-muted-foreground">
                  Votre présence a ét�� enregistrée à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-foreground">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Authentification sécurisée confirmée
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showThemeToggle={true} />
      <div className="max-w-4xl mx-auto p-4 space-y-6 mt-6">
        <Card className="shadow-lg">
          <CardHeader>
            <Button
              variant="ghost"
              onClick={onBack}
              className="w-fit mb-2"
              disabled={validating}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <CardTitle className="text-2xl">Validation de présence</CardTitle>
            <CardDescription>
              Plusieurs méthodes de validation disponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="biometric" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="biometric">Biométrie + QR</TabsTrigger>
                <TabsTrigger value="qr">Scanner QR</TabsTrigger>
                <TabsTrigger value="alternative">Alternative</TabsTrigger>
              </TabsList>

              {/* Biométrie + QR Code */}
              <TabsContent value="biometric" className="space-y-6">
                {!showQRGen ? (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center space-y-4">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                        validating ? "bg-primary/20 animate-pulse" : "bg-muted"
                      }`}>
                        <Fingerprint className={`w-16 h-16 ${
                          validating ? "text-primary" : "text-muted-foreground"
                        }`} />
                      </div>
                      
                      {validating && (
                        <div className="w-full space-y-2">
                          <Progress value={progress} className="h-2" />
                          <p className="text-sm text-center text-muted-foreground">
                            Lecture en cours... {progress}%
                          </p>
                        </div>
                      )}

                      {!validating && (
                        <>
                          <Button
                            onClick={handleBiometricAuth}
                            className="bg-primary hover:bg-primary/90"
                            size="lg"
                          >
                            <Fingerprint className="w-5 h-5 mr-2" />
                            Confirmer avec empreinte
                          </Button>
                          <p className="text-xs text-muted-foreground text-center">
                            Étape 1/2 : Validation biométrique
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-foreground font-medium">
                        ✓ Étape 1 validée : Biométrie confirmée
                      </p>
                    </div>
                    <QRCodeScanner
                      onScanSuccess={handleQRScanSuccess}
                      userId="user-123"
                      userName="Jean Dupont"
                      mode="generate"
                    />
                    <p className="text-sm text-muted-foreground text-center">
                      Votre binôme doit scanner ce code pour valider la présence simultanée
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Scanner QR Code du binôme */}
              <TabsContent value="qr" className="space-y-4">
                <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <p className="text-sm text-foreground">
                    Scannez le QR Code de votre binôme pour valider votre présence simultanée
                  </p>
                </div>
                <QRCodeScanner
                  onScanSuccess={handleQRScanSuccess}
                  userId="user-123"
                  userName="Jean Dupont"
                  mode="scan"
                />
              </TabsContent>

              {/* Authentification alternative */}
              <TabsContent value="alternative" className="space-y-4">
                <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <p className="text-sm text-foreground">
                    <Smartphone className="w-4 h-4 inline mr-2" />
                    Pour les appareils sans biométrie : OTP + Signature comportementale
                  </p>
                </div>
                <AuthAlternative
                  onSuccess={handleAlternativeSuccess}
                  userId="user-123"
                  requireBinomeValidation={true}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}