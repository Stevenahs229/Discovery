import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { BrandingLogo } from '@/app/components/BrandingLogo';
import { AlertCircle, RefreshCw, UserPlus, LogIn } from 'lucide-react';

interface AdminAuthErrorProps {
  onRetry: () => void;
  onGoToSignup: () => void;
  onGoToLogin: () => void;
}

export function AdminAuthError({ onRetry, onGoToSignup, onGoToLogin }: AdminAuthErrorProps) {
  const handleClearAndRestart = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-orange-50 dark:from-red-950/20 dark:via-background dark:to-orange-950/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-red-200 dark:border-red-800">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center animate-pulse">
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <BrandingLogo className="mx-auto" />
          <CardTitle className="text-2xl text-red-700 dark:text-red-400">
            Erreur d'Authentification
          </CardTitle>
          <CardDescription className="text-base">
            Votre session est invalide ou expirée
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Explication du problème */}
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Token JWT invalide :</strong> Vous essayez d'accéder à l'interface admin avec un token d'authentification invalide, expiré ou incorrect.
            </AlertDescription>
          </Alert>

          {/* Causes possibles */}
          <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-orange-900 dark:text-orange-200">
              Pourquoi cette erreur se produit ?
            </h3>
            <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-300">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Vous n'avez jamais créé de compte admin</strong> - Vous devez créer un compte via l'inscription admin, pas l'inscription utilisateur</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Vous utilisez un token utilisateur</strong> - Les comptes utilisateur et admin sont séparés, même avec le même email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Votre session a expiré</strong> - Les tokens ont une durée de vie limitée</span>
              </li>
            </ul>
          </div>

          {/* Solution recommandée */}
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-green-900 dark:text-green-200 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              Solution Recommandée
            </h3>
            <ol className="space-y-3 text-sm text-green-800 dark:text-green-300">
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600 dark:text-green-400 min-w-[20px]">1.</span>
                <span><strong>Nettoyez votre session</strong> en cliquant sur "Tout Effacer et Recommencer" ci-dessous</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600 dark:text-green-400 min-w-[20px]">2.</span>
                <span><strong>Créez un nouveau compte admin</strong> avec l'email <code className="bg-green-200 dark:bg-green-900 px-1 rounded">joachimgoehakue05@gmail.com</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600 dark:text-green-400 min-w-[20px]">3.</span>
                <span><strong>Connectez-vous</strong> avec votre nouveau compte admin</span>
              </li>
            </ol>
          </div>

          {/* Email spécial */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-200">
              🌟 Email Spécial
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
              L'email <strong>joachimgoehakue05@gmail.com</strong> est configuré comme administrateur principal.
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              En créant un compte avec cet email, vous recevrez automatiquement le rôle <strong>Modérateur</strong> (accès complet).
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={handleClearAndRestart}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Tout Effacer et Recommencer
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={onGoToSignup}
                variant="default"
                className="w-full"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Créer un compte admin
              </Button>

              <Button 
                onClick={onGoToLogin}
                variant="outline"
                className="w-full"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </Button>
            </div>

            <Button 
              onClick={onRetry}
              variant="ghost"
              className="w-full"
              size="sm"
            >
              Réessayer avec ma session actuelle
            </Button>
          </div>

          {/* Info technique */}
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer hover:text-foreground mb-2">
              Informations techniques (pour débogage)
            </summary>
            <div className="bg-black text-green-400 p-3 rounded font-mono space-y-1">
              <p>Token présent: {localStorage.getItem('access_token') ? 'Oui ✓' : 'Non ✗'}</p>
              <p>Email admin: {localStorage.getItem('admin_email') || 'Non défini'}</p>
              <p>Erreur: Invalid JWT (401)</p>
              <p className="mt-2 text-yellow-400">→ Solution: Créer un nouveau compte admin</p>
            </div>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}
