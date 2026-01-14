import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { BrandingLogo } from "@/app/components/BrandingLogo";
import { QuickTestAccount } from "@/app/components/QuickTestAccount";
import { Shield, Users } from "lucide-react";

interface OnboardingProps {
  onCreateAccount: () => void;
  onLogin: () => void;
}

export function Onboarding({ onCreateAccount, onLogin }: OnboardingProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <Card className="w-full shadow-lg">
          <CardHeader className="text-center space-y-6">
            <div className="flex justify-center">
              <BrandingLogo size="lg" showText={true} />
            </div>
            <CardDescription className="text-base">
              Bienvenue sur l'application de présence sécurisée
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg border border-primary/20">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                Système de pointage sécurisé avec validation binôme obligatoire
              </p>
            </div>
            <Button 
              onClick={onCreateAccount}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              Créer un compte
            </Button>
            <Button 
              onClick={onLogin}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Se connecter
            </Button>
          </CardContent>
        </Card>

        {/* Compte de test rapide */}
        <QuickTestAccount />
      </div>
    </div>
  );
}