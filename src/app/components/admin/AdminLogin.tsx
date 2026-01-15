import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Shield, AlertCircle } from 'lucide-react';
import { api } from '@/lib/supabase';
import { BrandingLogo } from '@/app/components/BrandingLogo';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  onBack: () => void;
}

export function AdminLogin({ onLoginSuccess, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('=== TENTATIVE DE CONNEXION ADMIN ===');
      console.log('📧 Email:', email);
      
      const { data, error: loginError } = await api.login(email, password);

      console.log('📥 Réponse de login:', { 
        hasData: !!data, 
        hasSession: !!data?.session,
        hasAccessToken: !!data?.session?.access_token,
        hasUser: !!data?.user,
        hasError: !!loginError 
      });

      if (loginError) {
        console.error('❌ Erreur de connexion:', loginError);
        
        // Message d'erreur personnalisé selon le type d'erreur
        let errorMessage = loginError.message;
        if (loginError.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou mot de passe incorrect. Avez-vous créé un compte admin ?';
        } else if (loginError.message.includes('Email not confirmed')) {
          errorMessage = 'Email non confirmé. Veuillez vérifier votre boîte mail.';
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }

      if (!data?.session?.access_token) {
        console.error('❌ Pas de token dans la réponse');
        setError('Erreur de connexion: pas de session créée. Veuillez créer un compte admin.');
        setLoading(false);
        return;
      }

      const token = data.session.access_token;
      console.log('✅ Token reçu!');
      console.log('   Longueur:', token.length);
      console.log('   Preview:', token.substring(0, 30) + '...');
      console.log('   User ID:', data.user?.id);
      console.log('   User Email:', data.user?.email);

      // Stocker le token
      localStorage.setItem('access_token', token);
      localStorage.setItem('admin_email', email);

      console.log('💾 Token stocké dans localStorage');
      console.log('🚀 Redirection vers dashboard...');
      
      onLoginSuccess(token);
    } catch (err: any) {
      console.error('❌ Exception lors de la connexion:', err);
      setError(err.message || 'Erreur lors de la connexion. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="text-center">
            <BrandingLogo className="mx-auto mb-4" />
            <CardTitle className="text-2xl">Interface Admin</CardTitle>
            <CardDescription>
              Connectez-vous avec votre compte administrateur
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@entreprise.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={loading}
                className="flex-1"
              >
                Retour
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Connexion...' : 'Se Connecter'}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Réservé aux administrateurs de la plateforme
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}