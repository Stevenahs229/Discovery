import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { ArrowLeft, LogIn } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/supabase";

interface LoginProps {
  onBack: () => void;
  onSuccess: (accessToken: string) => void;
}

export function Login({ onBack, onSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await api.login(email, password);

      if (error || !data.session) {
        console.error("Login error:", error);
        toast.error("Email ou mot de passe incorrect");
        setIsSubmitting(false);
        return;
      }

      toast.success("Connexion réussie!");
      onSuccess(data.session.access_token);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erreur lors de la connexion");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-fit mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@entreprise.fr"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700" 
              size="lg"
              disabled={isSubmitting}
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
