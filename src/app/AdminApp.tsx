import { useState, useEffect } from "react";
import { Dashboard } from "@/app/components/admin/Dashboard";
import { GestionAgents } from "@/app/components/admin/GestionAgents";
import { GestionSites } from "@/app/components/admin/GestionSites";
import { IAnomalies } from "@/app/components/admin/IAnomalies";
import { Button } from "@/app/components/ui/button";
import { BrandingLogo } from "@/app/components/BrandingLogo";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { LayoutDashboard, Users, MapPin, AlertTriangle, LogOut, Menu, User } from "lucide-react";
import { Toaster } from "@/app/components/ui/sonner";

type Screen = "dashboard" | "agents" | "sites" | "anomalies";

interface Agent {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  binome: string;
  site: string;
  biometricStatus: 'active' | 'pending' | 'failed';
  status: 'active' | 'waiting' | 'inactive';
}

interface Site {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  agentsCount: number;
}

interface Anomaly {
  id: string;
  type: string;
  agent: string;
  binome: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

interface AdminAppProps {
  onSwitchToUserMode: () => void;
}

export default function AdminApp({ onSwitchToUserMode }: AdminAppProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock data - Dans une vraie app, ces données viendraient de Supabase
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      nom: 'Martin',
      prenom: 'Jean',
      email: 'jean.martin@entreprise.fr',
      telephone: '+33 6 12 34 56 78',
      binome: 'Marie Dupont',
      site: 'site-paris',
      biometricStatus: 'active',
      status: 'active'
    },
    {
      id: '2',
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@entreprise.fr',
      telephone: '+33 6 23 45 67 89',
      binome: 'Jean Martin',
      site: 'site-paris',
      biometricStatus: 'active',
      status: 'waiting' // En attente de validation binôme
    },
    {
      id: '3',
      nom: 'Petit',
      prenom: 'Luc',
      email: 'luc.petit@entreprise.fr',
      telephone: '+33 6 34 56 78 90',
      binome: 'Sophie Bernard',
      site: 'site-lyon',
      biometricStatus: 'pending',
      status: 'active'
    },
    {
      id: '4',
      nom: 'Bernard',
      prenom: 'Sophie',
      email: 'sophie.bernard@entreprise.fr',
      telephone: '+33 6 45 67 89 01',
      binome: 'Luc Petit',
      site: 'site-lyon',
      biometricStatus: 'active',
      status: 'waiting'
    },
  ]);

  const [sites, setSites] = useState<Site[]>([
    {
      id: '1',
      name: 'Paris - Bâtiment A',
      address: '123 Avenue des Entreprises, 75001 Paris',
      lat: 48.8566,
      lng: 2.3522,
      agentsCount: 25
    },
    {
      id: '2',
      name: 'Lyon - Centre',
      address: '45 Rue de la République, 69001 Lyon',
      lat: 45.7640,
      lng: 4.8357,
      agentsCount: 18
    },
    {
      id: '3',
      name: 'Marseille - Port',
      address: '78 Quai du Port, 13002 Marseille',
      lat: 43.2965,
      lng: 5.3698,
      agentsCount: 12
    },
  ]);

  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    {
      id: '1',
      type: 'Pointage suspect',
      agent: 'Jean Martin',
      binome: 'Marie Dupont',
      severity: 'high',
      timestamp: '13/01/2026 08:42',
      description: 'Pointage effectué en dehors de la zone géographique autorisée. Distance de 2.5km du site assigné.',
      status: 'pending'
    },
    {
      id: '2',
      type: 'Absence binôme',
      agent: 'Marie Dupont',
      binome: 'Jean Martin',
      severity: 'medium',
      timestamp: '13/01/2026 07:30',
      description: 'Le binôme n\'a pas validé sa présence dans le délai imparti (30 minutes).',
      status: 'reviewed'
    },
    {
      id: '3',
      type: 'Localisation incohérente',
      agent: 'Luc Petit',
      binome: 'Sophie Bernard',
      severity: 'high',
      timestamp: '12/01/2026 16:15',
      description: 'Validation de présence depuis deux localisations différentes en moins de 10 minutes.',
      status: 'pending'
    },
    {
      id: '4',
      type: 'Validation tardive',
      agent: 'Sophie Bernard',
      binome: 'Luc Petit',
      severity: 'low',
      timestamp: '12/01/2026 09:45',
      description: 'Délai de validation supérieur à la normale (45 minutes après le pointage initial).',
      status: 'resolved'
    },
  ]);

  const stats = {
    totalAgents: agents.length,
    presentToday: agents.filter(a => a.status === 'active').length,
    waitingValidation: agents.filter(a => a.status === 'waiting').length,
    anomalies: anomalies.filter(a => a.status === 'pending').length,
    coherenceScore: 87
  };

  const handleAddAgent = (agent: Omit<Agent, 'id'>) => {
    const newAgent = { ...agent, id: Date.now().toString() };
    setAgents([...agents, newAgent]);
  };

  const handleUpdateAgent = (id: string, updates: Partial<Agent>) => {
    setAgents(agents.map(agent => 
      agent.id === id ? { ...agent, ...updates } : agent
    ));
  };

  const handleDeleteAgent = (id: string) => {
    setAgents(agents.filter(agent => agent.id !== id));
  };

  const handleAddSite = (site: Omit<Site, 'id'>) => {
    const newSite = { ...site, id: Date.now().toString() };
    setSites([...sites, newSite]);
  };

  const handleUpdateSite = (id: string, updates: Partial<Site>) => {
    setSites(sites.map(site => 
      site.id === id ? { ...site, ...updates } : site
    ));
  };

  const handleDeleteSite = (id: string) => {
    setSites(sites.filter(site => site.id !== id));
  };

  const handleResolveAnomaly = (id: string) => {
    setAnomalies(anomalies.map(anomaly =>
      anomaly.id === id ? { ...anomaly, status: 'resolved' as const } : anomaly
    ));
  };

  const navItems = [
    { id: "dashboard" as Screen, label: "Dashboard", icon: LayoutDashboard },
    { id: "agents" as Screen, label: "Agents", icon: Users },
    { id: "sites" as Screen, label: "Sites", icon: MapPin },
    { id: "anomalies" as Screen, label: "Anomalies IA", icon: AlertTriangle },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b">
        <BrandingLogo size="sm" showText={true} />
        <p className="text-sm text-muted-foreground mt-2">Administration</p>
      </div>
      
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={currentScreen === item.id ? "default" : "ghost"}
            className={`w-full justify-start ${
              currentScreen === item.id ? "bg-primary hover:bg-primary/90" : ""
            }`}
            onClick={() => {
              setCurrentScreen(item.id);
              setIsMobileMenuOpen(false);
            }}
          >
            <item.icon className="w-4 h-4 mr-2" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-2">
        <Button variant="outline" className="w-full justify-start" onClick={onSwitchToUserMode}>
          <User className="w-4 h-4 mr-2" />
          Mode Utilisateur
        </Button>
        <Button variant="ghost" className="w-full justify-start text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-card border-r shadow-sm">
        <SidebarContent />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-card border-b">
        <div className="flex items-center justify-between p-4">
          <BrandingLogo size="sm" showText={false} />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="relative h-full">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {currentScreen === "dashboard" && <Dashboard stats={stats} />}
          {currentScreen === "agents" && (
            <GestionAgents
              agents={agents}
              onAddAgent={handleAddAgent}
              onUpdateAgent={handleUpdateAgent}
              onDeleteAgent={handleDeleteAgent}
            />
          )}
          {currentScreen === "sites" && (
            <GestionSites
              sites={sites}
              onAddSite={handleAddSite}
              onUpdateSite={handleUpdateSite}
              onDeleteSite={handleDeleteSite}
            />
          )}
          {currentScreen === "anomalies" && (
            <IAnomalies
              anomalies={anomalies}
              onResolve={handleResolveAnomaly}
            />
          )}
        </div>
      </div>

      <Toaster />
    </div>
  );
}