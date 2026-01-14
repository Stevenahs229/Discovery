import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Fingerprint, Camera, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/app/components/ui/progress";
import { mlApi } from "@/lib/ml-api";

interface BiometricChoiceProps {
  onSuccess: (method: 'fingerprint' | 'facial') => void;
  onBack: () => void;
  accessToken: string | null;
  userId?: string;
}

export function BiometricChoice({ onSuccess, onBack, accessToken, userId }: BiometricChoiceProps) {
  const [method, setMethod] = useState<'fingerprint' | 'facial' | null>(null);
  const [validating, setValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFingerprintAuth = async () => {
    setMethod('fingerprint');
    setValidating(true);
    setProgress(0);
    toast.info("Authentification par empreinte digitale en cours...");
    
    // Simuler l'authentification biométrique
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    // Attendre la fin de l'animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setValidating(false);
    toast.success("Empreinte digitale validée!");
    onSuccess('fingerprint');
  };

  const startCamera = async () => {
    setMethod('facial');
    setShowCamera(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      toast.info("Positionnez votre visage dans le cadre");
    } catch (error) {
      console.error("Erreur d'accès à la caméra:", error);
      toast.error("Impossible d'accéder à la caméra. Veuillez autoriser l'accès.");
      setShowCamera(false);
      setMethod(null);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
    setCapturedImage(null);
    setMethod(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        
        toast.success("Photo capturée! Vérification en cours...");
        verifyFacialRecognition(imageData);
      }
    }
  };

  const verifyFacialRecognition = async (imageData: string) => {
    setValidating(true);
    setProgress(0);

    // Convertir base64 en File
    const blob = await (await fetch(imageData)).blob();
    const file = new File([blob], 'face-capture.jpg', { type: 'image/jpeg' });

    // Simuler la progression
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      if (accessToken) {
        // Vérifier avec le backend ML Python
        const result = await mlApi.verifyFace(file, accessToken);
        
        clearInterval(interval);
        setProgress(100);

        if (result.success) {
          toast.success(`Visage reconnu avec ${Math.round(result.confidence * 100)}% de confiance!`);
          stopCamera();
          setTimeout(() => onSuccess('facial'), 1000);
        } else {
          toast.error(result.message || "Visage non reconnu. Veuillez réessayer.");
          setValidating(false);
          setCapturedImage(null);
        }
      } else {
        // Mode démo sans backend
        await new Promise(resolve => setTimeout(resolve, 1500));
        clearInterval(interval);
        setProgress(100);
        toast.success("Reconnaissance faciale validée! (Mode démo)");
        stopCamera();
        setTimeout(() => onSuccess('facial'), 1000);
      }
    } catch (error) {
      clearInterval(interval);
      console.error("Erreur de reconnaissance faciale:", error);
      toast.error("Erreur lors de la reconnaissance faciale. Veuillez réessayer.");
      setValidating(false);
      setCapturedImage(null);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setValidating(false);
    setProgress(0);
  };

  if (showCamera) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-6 h-6 text-primary" />
              Reconnaissance Faciale
            </CardTitle>
            <CardDescription>
              Positionnez votre visage dans le cadre et cliquez pour capturer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {capturedImage ? (
              <div className="space-y-4">
                <img 
                  src={capturedImage} 
                  alt="Captured face" 
                  className="w-full rounded-lg border-2 border-primary"
                />
                
                {validating && (
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-center text-muted-foreground">
                      Vérification en cours... {progress}%
                    </p>
                  </div>
                )}

                {!validating && (
                  <div className="flex gap-3">
                    <Button 
                      onClick={retakePhoto}
                      variant="outline"
                      className="flex-1"
                    >
                      Reprendre la photo
                    </Button>
                    <Button 
                      onClick={stopCamera}
                      variant="ghost"
                    >
                      Annuler
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border-4 border-primary/20">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full"
                  />
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 border-4 border-primary/30 rounded-full m-12"></div>
                  </div>
                </div>
                
                <canvas ref={canvasRef} className="hidden" />
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Assurez-vous que votre visage est bien éclairé et centré dans le cercle
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3">
                  <Button 
                    onClick={capturePhoto}
                    className="flex-1"
                    size="lg"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capturer
                  </Button>
                  <Button 
                    onClick={stopCamera}
                    variant="outline"
                    size="lg"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="w-fit mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <CardTitle>Validation Biométrique</CardTitle>
          <CardDescription>
            Choisissez votre méthode d'authentification biométrique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              L'authentification biométrique est obligatoire avant de scanner le QR code
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <Button
                  onClick={handleFingerprintAuth}
                  disabled={validating}
                  className="w-full h-auto py-8 flex flex-col gap-3"
                  size="lg"
                >
                  {validating && method === 'fingerprint' ? (
                    <>
                      <Loader2 className="w-12 h-12 animate-spin" />
                      <div className="w-full px-4">
                        <Progress value={progress} className="h-2 mb-2" />
                        <span className="text-sm">Validation en cours... {progress}%</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-12 h-12" />
                      <div>
                        <div className="font-semibold text-lg">Empreinte Digitale</div>
                        <div className="text-sm opacity-80">Méthode rapide et sécurisée</div>
                      </div>
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <Button
                  onClick={startCamera}
                  disabled={validating}
                  className="w-full h-auto py-8 flex flex-col gap-3"
                  variant="secondary"
                  size="lg"
                >
                  <Camera className="w-12 h-12" />
                  <div>
                    <div className="font-semibold text-lg">Reconnaissance Faciale</div>
                    <div className="text-sm opacity-80">Utilise la caméra frontale</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Alert className="bg-primary/5 border-primary/20">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              <strong>Sécurité renforcée :</strong> Vos données biométriques sont chiffrées et jamais partagées
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
