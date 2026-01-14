import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Copy, CheckCircle2, AlertCircle, User, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/supabase";

export function QuickTestAccount() {
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const testAccount = {
    email: "test@twoinone.app",
    password: "Test123456!",
    nom: "Test",
    prenom: "User",
    telephone: "0612345678",
    binome: "Binôme Test"
  };

  const createTestAccount = async () => {
    setCreating(true);
    
    try {
      const result = await api.signup(testAccount);
      
      if (result.error) {
        if (result.error.includes("already registered")) {
          toast.info("Le compte test existe déjà. Vous pouvez vous connecter directement.");
          setCreated(true);
        } else {
          toast.error(result.error);
        }
      } else {
        toast.success("Compte test créé avec succès !");
        setCreated(true);
      }
    } catch (error) {
      console.error("Create test account error:", error);
      toast.error("Erreur lors de la création du compte test");
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Compte de Test Rapide
        </CardTitle>
        <CardDescription>
          Créez instantanément un compte pour tester TwoInOne
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!created ? (
          <>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Cliquez ci-dessous pour créer automatiquement un compte de test.
                Vous pourrez ensuite vous connecter avec les identifiants générés.
              </AlertDescription>
            </Alert>

            <Button
              onClick={createTestAccount}
              disabled={creating}
              className="w-full"
              size="lg"
            >
              {creating ? "Création en cours..." : "Créer un compte de test"}
            </Button>
          </>
        ) : (
          <>
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Compte de test créé ! Utilisez ces identifiants pour vous connecter.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-mono font-semibold">{testAccount.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(testAccount.email, "Email")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Mot de passe</p>
                      <p className="font-mono font-semibold">{testAccount.password}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(testAccount.password, "Mot de passe")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800 text-sm">
                💡 <strong>Astuce :</strong> Copiez ces identifiants et utilisez-les sur la page de connexion.
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
}
