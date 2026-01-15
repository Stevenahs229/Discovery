import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import { BrandingLogo } from '@/app/components/BrandingLogo';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface AdminSignupProps {
  onSignupSuccess: () => void;
  onBack: () => void;
}

export function AdminSignup({ onSignupSuccess, onBack }: AdminSignupProps) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      // Call backend to create admin account
      const supabaseUrl = `https://${projectId}.supabase.co`;
      const serverUrl = `${supabaseUrl}/functions/v1/make-server-643544a8`;
      
      console.log('=== CRÉATION DU COMPTE ADMIN ===');
      console.log('📧 Email:', formData.email);
      console.log('👤 Nom:', formData.nom, formData.prenom);
      console.log('📞 Téléphone:', formData.telephone);
      console.log('🔗 URL:', `${serverUrl}/admin/signup`);
      
      const response = await fetch(`${serverUrl}/admin/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone,
        }),
      });

      console.log('📡 Statut de la réponse:', response.status);
      
      const data = await response.json();
      console.log('📦 Données reçues:', data);

      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Erreur lors de la création du compte';
        console.error('❌ Erreur signup:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('✅ Compte admin créé avec succès!');
      console.log('   User ID:', data.userId);
      console.log('   Rôle:', data.role);
      console.log('⏳ Redirection vers login dans 2 secondes...');
      
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onSignupSuccess();
      }, 2000);
    } catch (err: any) {
      console.error('❌ Exception lors du signup:', err);
      const errorMessage = err.message || 'Erreur lors de la création du compte';
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <AlertDescription className="text-green-800 dark:text-green-200">
                Compte administrateur créé avec succès ! Redirection vers la page de connexion...
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="text-center">
            <BrandingLogo className="mx-auto mb-4" />
            <CardTitle className="text-2xl">Créer un Compte Admin</CardTitle>
            <CardDescription>
              Créez votre compte administrateur pour gérer la plateforme
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  name="prenom"
                  type="text"
                  placeholder="Jean"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  placeholder="Martin"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@entreprise.fr"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input
                id="telephone"
                name="telephone"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                value={formData.telephone}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">
                Minimum 6 caractères
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={loading}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Création...' : 'Créer le Compte'}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              En créant un compte, vous acceptez nos conditions d'utilisation
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}