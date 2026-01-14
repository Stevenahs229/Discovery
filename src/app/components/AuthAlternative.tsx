import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/app/components/ui/input-otp";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Shield, Smartphone, Fingerprint, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface BehavioralSignature {
  typingSpeed: number[];
  clickPattern: number[];
  deviceAngle: number[];
  movementPattern: number[];
}

interface AuthAlternativeProps {
  onSuccess: (token: string) => void;
  userId: string;
  requireBinomeValidation?: boolean;
}

export function AuthAlternative({ onSuccess, userId, requireBinomeValidation = false }: AuthAlternativeProps) {
  const [step, setStep] = useState<"password" | "otp" | "behavioral" | "binome">("password");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // Signature comportementale
  const [behavioral, setBehavioral] = useState<BehavioralSignature>({
    typingSpeed: [],
    clickPattern: [],
    deviceAngle: [],
    movementPattern: [],
  });
  
  const [behavioralScore, setBehavioralScore] = useState(0);
  const lastKeyTime = useRef<number>(0);
  const clickTimes = useRef<number[]>([]);

  // Countdown pour OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Capturer la signature comportementale
  useEffect(() => {
    // Capturer l'orientation du téléphone
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null) {
        setBehavioral((prev) => ({
          ...prev,
          deviceAngle: [...prev.deviceAngle.slice(-9), event.beta],
        }));
      }
    };

    // Capturer les mouvements
    const handleMotion = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
        const movement = Math.sqrt(
          Math.pow(event.accelerationIncludingGravity.x || 0, 2) +
          Math.pow(event.accelerationIncludingGravity.y || 0, 2) +
          Math.pow(event.accelerationIncludingGravity.z || 0, 2)
        );
        setBehavioral((prev) => ({
          ...prev,
          movementPattern: [...prev.movementPattern.slice(-9), movement],
        }));
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);
    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, []);

  // Analyser la vitesse de frappe
  const handleKeyPress = () => {
    const now = Date.now();
    if (lastKeyTime.current > 0) {
      const speed = now - lastKeyTime.current;
      setBehavioral((prev) => ({
        ...prev,
        typingSpeed: [...prev.typingSpeed.slice(-9), speed],
      }));
    }
    lastKeyTime.current = now;
  };

  // Analyser le pattern de clic
  const handleClick = () => {
    const now = Date.now();
    clickTimes.current.push(now);
    
    if (clickTimes.current.length > 1) {
      const pattern = clickTimes.current
        .slice(-5)
        .reduce((acc, time, i, arr) => {
          if (i === 0) return acc;
          return [...acc, time - arr[i - 1]];
        }, [] as number[]);

      setBehavioral((prev) => ({
        ...prev,
        clickPattern: pattern,
      }));
    }
  };

  // Calculer le score comportemental
  useEffect(() => {
    let score = 0;

    // Vérifier la cohérence de la vitesse de frappe
    if (behavioral.typingSpeed.length >= 5) {
      const avg = behavioral.typingSpeed.reduce((a, b) => a + b, 0) / behavioral.typingSpeed.length;
      const variance = behavioral.typingSpeed.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / behavioral.typingSpeed.length;
      
      // Une variance faible indique un comportement humain cohérent
      if (variance < 10000) score += 25;
    }

    // Vérifier le pattern de clic
    if (behavioral.clickPattern.length >= 3) {
      score += 25;
    }

    // Vérifier les mouvements du téléphone (présence de micro-mouvements naturels)
    if (behavioral.movementPattern.length >= 5) {
      const hasMovement = behavioral.movementPattern.some((m) => m > 0.5);
      if (hasMovement) score += 25;
    }

    // Vérifier l'orientation du téléphone
    if (behavioral.deviceAngle.length >= 5) {
      score += 25;
    }

    setBehavioralScore(score);
  }, [behavioral]);

  const handleSendOTP = async () => {
    if (!password) {
      toast.error("Veuillez entrer votre mot de passe");
      return;
    }

    // Simuler l'envoi d'OTP
    setOtpSent(true);
    setCountdown(120); // 2 minutes
    setStep("otp");
    toast.success("Code OTP envoyé par SMS");
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Code OTP incomplet");
      return;
    }

    // Vérifier l'OTP
    // Code de test: 999999 pour simulation/demo
    // En production, appeler l'API backend
    if (otp === "123456" || otp === "999999") {
      setStep("behavioral");
      if (otp === "999999") {
        toast.success("Code OTP validé (Mode Test - 999999)");
      } else {
        toast.success("Code OTP validé");
      }
    } else {
      toast.error("Code OTP invalide");
    }
  };

  const handleValidateBehavioral = async () => {
    if (behavioralScore < 50) {
      toast.error("Signature comportementale insuffisante. Continuez à interagir avec l'application.");
      return;
    }

    if (requireBinomeValidation) {
      setStep("binome");
      toast.success("Signature comportementale validée");
    } else {
      // Authentification réussie
      const fakeToken = "auth_token_" + Date.now();
      onSuccess(fakeToken);
      toast.success("Authentification réussie");
    }
  };

  const handleBinomeValidation = async () => {
    // En production, vérifier que le binôme a aussi validé dans la fenêtre temporelle
    const fakeToken = "auth_token_" + Date.now();
    onSuccess(fakeToken);
    toast.success("Validation binôme confirmée - Authentification réussie");
  };

  return (
    <div className="space-y-6">
      {/* Indicateur de progression */}
      <div className="flex items-center justify-center gap-2">
        {["password", "otp", "behavioral", requireBinomeValidation ? "binome" : null]
          .filter(Boolean)
          .map((s, i) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s
                  ? "bg-orange-500 text-white"
                  : ["password", "otp", "behavioral"].indexOf(step) > i
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {["password", "otp", "behavioral"].indexOf(step) > i ? "✓" : i + 1}
            </div>
          ))}
      </div>

      {/* Étape 1: Mot de passe */}
      {step === "password" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" />
              Étape 1: Mot de passe
            </CardTitle>
            <CardDescription>
              Entrez votre mot de passe personnel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" onClick={handleClick}>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  handleKeyPress();
                }}
                placeholder="Entrez votre mot de passe"
              />
            </div>
            <Button
              onClick={handleSendOTP}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Continuer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Étape 2: OTP */}
      {step === "otp" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-orange-500" />
              Étape 2: Code OTP
            </CardTitle>
            <CardDescription>
              Entrez le code à 6 chiffres envoyé par SMS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" onClick={handleClick}>
            {/* Info pour mode test */}
            <Alert className="bg-secondary/10 border-secondary/30">
              <AlertCircle className="h-4 w-4 text-secondary" />
              <AlertDescription className="text-sm">
                <strong>Mode Test :</strong> Utilisez le code <strong>999999</strong> pour tester rapidement toutes les étapes
              </AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  handleKeyPress();
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {countdown > 0 && (
              <p className="text-center text-sm text-gray-600">
                Code valide pendant {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
              </p>
            )}

            <Button
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Vérifier le code
            </Button>

            {countdown === 0 && (
              <Button
                onClick={handleSendOTP}
                variant="outline"
                className="w-full"
              >
                Renvoyer le code
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Étape 3: Signature comportementale */}
      {step === "behavioral" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-orange-500" />
              Étape 3: Signature Comportementale
            </CardTitle>
            <CardDescription>
              Analyse de votre comportement utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" onClick={handleClick}>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Continuez à interagir avec l'application. Nous analysons votre vitesse de frappe,
                vos patterns de clic et les mouvements de votre appareil.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Vitesse de frappe</span>
                <Badge variant={behavioral.typingSpeed.length >= 5 ? "default" : "secondary"}>
                  {behavioral.typingSpeed.length >= 5 ? "✓" : "..."}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Pattern de clic</span>
                <Badge variant={behavioral.clickPattern.length >= 3 ? "default" : "secondary"}>
                  {behavioral.clickPattern.length >= 3 ? "✓" : "..."}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Mouvements appareil</span>
                <Badge variant={behavioral.movementPattern.length >= 5 ? "default" : "secondary"}>
                  {behavioral.movementPattern.length >= 5 ? "✓" : "..."}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Orientation</span>
                <Badge variant={behavioral.deviceAngle.length >= 5 ? "default" : "secondary"}>
                  {behavioral.deviceAngle.length >= 5 ? "✓" : "..."}
                </Badge>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Score de confiance</span>
                <span className="text-2xl font-bold text-orange-600">{behavioralScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${behavioralScore}%` }}
                />
              </div>
            </div>

            <Button
              onClick={handleValidateBehavioral}
              disabled={behavioralScore < 50}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              {behavioralScore >= 50 ? "Valider" : "En cours d'analyse..."}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Étape 4: Validation binôme */}
      {step === "binome" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              Étape 4: Validation Binôme
            </CardTitle>
            <CardDescription>
              Co-présence avec votre binôme requise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Votre binôme doit également valider sa présence dans une fenêtre temporelle
                courte et dans la même zone géographique.
              </AlertDescription>
            </Alert>

            <div className="text-center py-8">
              <div className="animate-pulse mb-4">
                <Shield className="w-16 h-16 text-orange-500 mx-auto" />
              </div>
              <p className="font-medium mb-2">En attente de la validation binôme...</p>
              <p className="text-sm text-gray-600">
                Demandez à votre binôme de valider également sa présence
              </p>
            </div>

            <Button
              onClick={handleBinomeValidation}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Simuler validation binôme (Demo)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}