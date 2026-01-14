import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { ArrowLeft, Fingerprint, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/supabase";

interface InscriptionProps {
  onBack: () => void;
  onComplete: () => void;
}

export function Inscription({ onBack, onComplete }: InscriptionProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    binome: "",
    password: "",
  });
  const [biometricCaptured, setBiometricCaptured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBiometricCapture = () => {
    // Simulate biometric capture
    toast.info("Simulation de la capture d'empreinte...");
    setTimeout(() => {
      setBiometricCaptured(true);
      toast.success("Empreinte biométrique enregistrée avec succès");
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!biometricCaptured) {
      toast.error("Veuillez enregistrer votre empreinte biométrique");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await api.signup({
        email: formData.email,
        password: formData.password,
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        binome: formData.binome,
      });

      if (result.error) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      toast.success("Inscription finalisée avec succès!");
      setTimeout(() => onComplete(), 1000);
    } catch (error) {
      console.error("Inscription error:", error);
      toast.error("Erreur lors de l'inscription");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-fit mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <CardTitle>Inscription</CardTitle>
          <CardDescription>
            Créez votre compte pour accéder au système de présence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="Dupont"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                placeholder="Marie"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="marie.dupont@entreprise.fr"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Numéro de téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                placeholder="+33 6 12 34 56 78"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="binome">Binôme associé</Label>
              <Select value={formData.binome} onValueChange={(value) => setFormData({ ...formData, binome: value })}>
                <SelectTrigger id="binome">
                  <SelectValue placeholder="Sélectionnez votre binôme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jean-martin">Jean Martin</SelectItem>
                  <SelectItem value="sophie-bernard">Sophie Bernard</SelectItem>
                  <SelectItem value="luc-petit">Luc Petit</SelectItem>
                  <SelectItem value="claire-dubois">Claire Dubois</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Empreinte biométrique</Label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center space-y-3">
                {biometricCaptured ? (
                  <>
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                    <p className="text-sm text-green-700">Empreinte enregistrée</p>
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-12 h-12 text-gray-400" />
                    <Button
                      type="button"
                      onClick={handleBiometricCapture}
                      variant="outline"
                    >
                      Enregistrer empreinte biométrique
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Simulation : Cliquez pour enregistrer votre empreinte
                    </p>
                  </>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Inscription en cours..." : "Finaliser l'inscription"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}