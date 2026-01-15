import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Shield, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { BrandingLogo } from "@/app/components/BrandingLogo";

interface AdminOnboardingProps {
  onLogin: () => void;
  onCreateAccount: () => void;
  onBack: () => void;
}

export function AdminOnboarding({ onLogin, onCreateAccount, onBack }: AdminOnboardingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au mode utilisateur
        </Button>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-10 w-10 text-primary" />
              </div>
            </div>
            <div className="text-center">
              <BrandingLogo className="mx-auto mb-4" />
              <CardTitle className="text-3xl font-bold">
                Interface Administrateur
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Gérez les agents, sites et anomalies de la plateforme TwoInOne
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              onClick={onLogin}
              className="w-full h-14 text-lg"
              variant="default"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Se Connecter
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  ou
                </span>
              </div>
            </div>

            <Button
              onClick={onCreateAccount}
              className="w-full h-14 text-lg"
              variant="outline"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Créer un Compte Admin
            </Button>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-center text-muted-foreground">
                <Shield className="w-3 h-3 inline mr-1" />
                Réservé aux administrateurs autorisés
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
