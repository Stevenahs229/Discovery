import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Header } from "@/app/components/Header";
import { SafeZone } from "@/app/components/SafeZone";
import { AgendaIntegre } from "@/app/components/AgendaIntegre";
import { useRappelPresence } from "@/app/components/RappelPresence";
import { MapPin, CheckCircle, XCircle, Clock, Users, LogOut, QrCode, Calendar } from "lucide-react";
import { api } from "@/lib/supabase";

interface AccueilProps {
  userName: string;
  isPresent: boolean;
  onDeclarePresence: () => void;
  onDeclareAbsence: () => void;
  onLogout: () => void;
  accessToken: string | null;
}

export function Accueil({ userName, isPresent, onDeclarePresence, onDeclareAbsence, onLogout, accessToken }: AccueilProps) {
  const [history, setHistory] = useState<any[]>([]);
  const { RappelComponent, activateRappels } = useRappelPresence();
  
  // Safe zone du site actuel
  const currentSite = {
    id: "1",
    name: "Paris - Bâtiment A",
    latitude: 48.8566,
    longitude: 2.3522,
    radius: 100, // 100 mètres
  };

  useEffect(() => {
    if (accessToken) {
      loadHistory();
      // Activer les rappels si présent
      if (isPresent) {
        activateRappels();
      }
    }
  }, [accessToken, isPresent]);

  const loadHistory = async () => {
    if (!accessToken) return;
    
    try {
      const data = await api.getHistory(accessToken);
      setHistory(data.records || []);
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showThemeToggle={true} />
      <RappelComponent />
      
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header utilisateur */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Bonjour, {userName}</h1>
            <p className="text-sm text-muted-foreground">Mardi 13 janvier 2026</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>

        {/* Status Card */}
        <Card className="shadow-lg border-2 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Statut actuel</CardTitle>
              <Badge 
                variant={isPresent ? "default" : "secondary"}
                className={isPresent ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}
              >
                {isPresent ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Présent
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    Non pointé
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {isPresent ? (
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-foreground">
                  Présence confirmée à 08:42 - Validé par empreinte biométrique
                </p>
              </div>
            ) : (
              <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <p className="text-sm text-foreground">
                  Veuillez déclarer votre présence ou votre absence
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            onClick={onDeclarePresence}
            className="h-auto py-8 bg-primary hover:bg-primary/90"
            disabled={isPresent}
          >
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="w-8 h-8" />
              <div>
                <p className="font-semibold text-lg">Déclarer ma présence</p>
                <p className="text-xs opacity-90">Avec QR Code + Biométrie</p>
              </div>
            </div>
          </Button>
          <Button
            onClick={onDeclareAbsence}
            variant="outline"
            className="h-auto py-8 border-2"
          >
            <div className="flex flex-col items-center gap-3">
              <XCircle className="w-8 h-8" />
              <div>
                <p className="font-semibold text-lg">Déclarer une absence</p>
                <p className="text-xs opacity-70">Avec justificatif</p>
              </div>
            </div>
          </Button>
        </div>

        {/* Tabs pour les différentes fonctionnalités */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="zone">Safe Zone</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            {/* Binome Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Mon binôme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Jean Martin</p>
                    <p className="text-sm text-muted-foreground">Département Technique</p>
                  </div>
                  <Badge className="bg-primary">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Présent
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((record, index) => (
                      <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          record.type === 'presence' ? 'bg-primary' : 'bg-secondary'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm">
                            {record.type === 'presence' 
                              ? 'Présence validée' 
                              : `Absence déclarée${record.motif ? ` - ${record.motif}` : ''}`
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(record.date || record.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune activité récente</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agenda" className="space-y-4 mt-6">
            <AgendaIntegre accessToken={accessToken} />
          </TabsContent>

          <TabsContent value="zone" className="space-y-4 mt-6">
            <SafeZone currentSite={currentSite} isWorkTime={isPresent} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}