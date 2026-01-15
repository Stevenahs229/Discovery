import { useState, useEffect } from "react";
import { Dashboard } from "@/app/components/admin/Dashboard";
import { GestionAgents } from "@/app/components/admin/GestionAgents";
import { GestionSites } from "@/app/components/admin/GestionSites";
import { IAnomalies } from "@/app/components/admin/IAnomalies";
import { GestionModerateurs } from "@/app/components/admin/GestionModerateurs";
import { AdminOnboarding } from "@/app/components/admin/AdminOnboarding";
import { AdminLogin } from "@/app/components/admin/AdminLogin";
import { AdminSignup } from "@/app/components/admin/AdminSignup";
import { Button } from "@/app/components/ui/button";
import { BrandingLogo } from "@/app/components/BrandingLogo";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { LayoutDashboard, Users, MapPin, AlertTriangle, LogOut, Menu, User, Shield } from "lucide-react";
import { Toaster } from "@/app/components/ui/sonner";
import { api } from "@/lib/supabase";
import { projectId } from '/utils/supabase/info';
import { cleanInvalidTokens } from '@/lib/auth-checker';

type Screen = "onboarding" | "login" | "signup" | "dashboard" | "agents" | "sites" | "anomalies" | "moderateurs";

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
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [adminProfile, setAdminProfile] = useState<any>(null);

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
      status: 'waiting'
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
      timestamp: '13/01/2026 09:15',
      description: 'Déclaration de présence sans validation du binôme. Réaffectation automatique nécessaire.',
      status: 'pending'
    },
  ]);

  const stats = {
    totalAgents: agents.length,
    presentToday: agents.filter(a => a.status === 'active').length,
    waitingValidation: agents.filter(a => a.status === 'waiting').length,
    anomalies: anomalies.filter(a => a.status === 'pending').length,
    coherenceScore: 87
  };

  // Vérifier l'authentification au montage
  useEffect(() => {
    console.log('🔄 AdminApp mounting - Checking for existing authentication');

    const initializeAuth = async () => {
      // Check if we have a stored token
      const storedToken = localStorage.getItem('access_token');

      if (!storedToken) {
        console.log('ℹ️ No stored token found - showing onboarding');
        setAccessToken(null);
        setIsAuthenticated(false);
        setAdminProfile(null);
        setCurrentScreen("onboarding");
        return;
      }

      console.log('🔍 Found stored token, validating...');
      console.log('   Token length:', storedToken.length);
      console.log('   Token preview:', storedToken.substring(0, 30) + '...');

      try {
        // Validate the token by trying to load the profile
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-643544a8/profile`,
          {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Stored token is invalid:', response.status, errorText);
          console.log('🧹 Clearing invalid token and showing onboarding');

          // Token is invalid, clear everything
          localStorage.removeItem('access_token');
          localStorage.removeItem('admin_email');
          setAccessToken(null);
          setIsAuthenticated(false);
          setAdminProfile(null);
          setCurrentScreen("onboarding");
          return;
        }

        // Token is valid, restore the session
        const profile = await response.json();
        console.log('✅ Stored token is valid! Restoring session...');
        console.log('   User ID:', profile.id);
        console.log('   Email:', profile.email);
        console.log('   Nom:', profile.prenom, profile.nom);
        console.log('   Rôle:', profile.role);

        setAdminProfile(profile);
        setAccessToken(storedToken);
        setIsAuthenticated(true);
        setCurrentScreen("dashboard");

        // Save email for convenience
        if (profile.email) {
          localStorage.setItem('admin_email', profile.email);
        }

        console.log('🎉 Session restored successfully!');
      } catch (error) {
        console.error('❌ Error validating token:', error);
        console.log('🧹 Clearing invalid token and showing onboarding');

        // Error validating token, clear everything
        localStorage.removeItem('access_token');
        localStorage.removeItem('admin_email');
        setAccessToken(null);
        setIsAuthenticated(false);
        setAdminProfile(null);
        setCurrentScreen("onboarding");
      }
    };

    initializeAuth();
  }, []);

  // Valider le token et charger le profil
  const validateTokenAndLoadProfile = async (token: string) => {
    try {
      console.log('🔍 Validation du token...');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-643544a8/profile`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Token invalide détecté:', response.status, errorText);

        // Token invalide, nettoyer et rester sur onboarding
        console.log('🧹 Nettoyage du token invalide...');
        localStorage.removeItem('access_token');
        localStorage.removeItem('admin_email');
        setAccessToken(null);
        setIsAuthenticated(false);
        setCurrentScreen("onboarding");
        return;
      }

      // Token valide, charger le profil
      const profile = await response.json();
      console.log('✅ Token valide, profil chargé:', profile);

      setAdminProfile(profile);
      setAccessToken(token);
      setIsAuthenticated(true);
      setCurrentScreen("dashboard");

      // Sauvegarder l'email
      if (profile.email) {
        localStorage.setItem('admin_email', profile.email);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la validation du token:', error);

      // En cas d'erreur, nettoyer et rester sur onboarding
      localStorage.removeItem('access_token');
      localStorage.removeItem('admin_email');
      setAccessToken(null);
      setIsAuthenticated(false);
      setCurrentScreen("onboarding");
    }
  };

  // Charger le profil de l'administrateur
  const loadAdminProfile = async (token: string) => {
    try {
      console.log('📋 Chargement du profil admin avec token...');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-643544a8/profile`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur lors du chargement du profil admin:', response.status, errorText);

        // Si le token est invalide (401), c'est probablement que le compte n'existe pas dans le KV store
        if (response.status === 401) {
          console.log('🔄 Token invalide détecté');
          console.log('⚠️ ATTENTION: Cela signifie probablement que:');
          console.log('   1. Le compte n\'existe pas dans la base de données');
          console.log('   2. Le compte a été créé dans l\'interface utilisateur, pas admin');
          console.log('   3. Le token Supabase n\'est pas valide');
          throw new Error('Token invalide - Le compte admin n\'existe pas dans la base de données');
        }

        if (response.status === 404) {
          console.log('⚠️ Profil non trouvé dans le KV store');
          console.log('💡 Solution: Recréez votre compte via "Créer un compte admin"');
          throw new Error('Profil admin introuvable - Veuillez créer un compte admin');
        }

        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const profile = await response.json();
      console.log('✅ Profil admin chargé avec succès!');
      console.log('   ID:', profile.id);
      console.log('   Email:', profile.email);
      console.log('   Nom:', profile.prenom, profile.nom);
      console.log('   Rôle:', profile.role);

      setAdminProfile(profile);

      // Sauvegarder l'email dans localStorage pour faciliter le débogage
      if (profile.email) {
        localStorage.setItem('admin_email', profile.email);
      }
    } catch (error) {
      console.error('❌ Exception lors du chargement du profil admin:', error);
      console.log('');
      console.log('╔════════════════════════════════════════════════════════════╗');
      console.log('║  ERREUR DE CHARGEMENT DU PROFIL ADMINISTRATEUR            ║');
      console.log('╠════════════════════════════════════════════════════════════╣');
      console.log('║  Cause probable:                                           ║');
      console.log('║  • Vous n\'avez pas encore créé de compte admin             ║');
      console.log('║  • Le compte existe mais pas dans la base de données admin ║');
      console.log('║                                                            ║');
      console.log('║  Solution:                                                 ║');
      console.log('║  1. Retournez à l\'écran d\'accueil                          ║');
      console.log('║  2. Cliquez sur "Créer un compte admin"                    ║');
      console.log('║  3. Utilisez: joachimgoehakue05@gmail.com                  ║');
      console.log('║  4. Mot de passe: jo@chim31                                ║');
      console.log('╚════════════════════════════════════════════════════════════╝');
      console.log('');

      // Propager l'erreur pour que le useEffect puisse la gérer
      throw error;
    }
  };

  const handleLoginSuccess = async (token: string) => {
    console.log('✅ Connexion réussie, token reçu');

    try {
      // Load the profile immediately
      console.log('📋 Chargement du profil admin...');
      await loadAdminProfile(token);

      // Set authentication state
      setAccessToken(token);
      setIsAuthenticated(true);
      setCurrentScreen("dashboard");

      console.log('🎉 Connexion et chargement du profil réussis!');
    } catch (error) {
      console.error('❌ Erreur lors du chargement du profil après login:', error);
      // If profile loading fails, still try to authenticate but show error
      setAccessToken(token);
      setIsAuthenticated(true);
      setCurrentScreen("dashboard");
    }
  };

  const handleLogout = async () => {
    await api.logout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('admin_email');
    setAccessToken(null);
    setIsAuthenticated(false);
    setCurrentScreen("onboarding");
  };

  const handleAuthError = () => {
    // Appelé quand une erreur d'authentification se produit
    console.log('Auth error detected, logging out');
    localStorage.removeItem('access_token');
    localStorage.removeItem('admin_email');
    setAccessToken(null);
    setIsAuthenticated(false);
    setCurrentScreen("login");
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

  // Afficher l'onboarding si pas authentifié
  if (currentScreen === "onboarding") {
    return (
      <AdminOnboarding
        onLogin={() => setCurrentScreen("login")}
        onCreateAccount={() => setCurrentScreen("signup")}
        onBack={onSwitchToUserMode}
      />
    );
  }

  // Afficher le login
  if (currentScreen === "login") {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBack={() => setCurrentScreen("onboarding")}
      />
    );
  }

  // Afficher le signup
  if (currentScreen === "signup") {
    return (
      <AdminSignup
        onSignupSuccess={() => setCurrentScreen("login")}
        onBack={() => setCurrentScreen("onboarding")}
      />
    );
  }

  // Interface admin principale
  const navItems = [
    { id: "dashboard" as Screen, label: "Dashboard", icon: LayoutDashboard },
    { id: "agents" as Screen, label: "Agents", icon: Users },
    { id: "sites" as Screen, label: "Sites", icon: MapPin },
    { id: "anomalies" as Screen, label: "Anomalies IA", icon: AlertTriangle },
    { id: "moderateurs" as Screen, label: "Modérateurs", icon: Shield },
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
            className={`w-full justify-start ${currentScreen === item.id ? "bg-primary hover:bg-primary/90" : ""
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
        <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
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
          {currentScreen === "moderateurs" && (
            <GestionModerateurs adminProfile={adminProfile} />
          )}
        </div>
      </div>

      <Toaster />
    </div>
  );
}