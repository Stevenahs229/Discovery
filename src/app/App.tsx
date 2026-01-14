import { useState, useEffect } from "react";
import { Onboarding } from "@/app/components/Onboarding";
import { Inscription } from "@/app/components/Inscription";
import { Login } from "@/app/components/Login";
import { Accueil } from "@/app/components/Accueil";
import { ValidationPresence } from "@/app/components/ValidationPresence";
import { Absence } from "@/app/components/Absence";
import { Toaster } from "@/app/components/ui/sonner";
import { Button } from "@/app/components/ui/button";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import { PWAInstallPrompt } from "@/app/components/PWAInstallPrompt";
import { PWAWelcomeModal } from "@/app/components/PWAWelcomeModal";
import { OfflineBanner } from "@/app/components/PWAHelpers";
import { PWADebugPanel } from "@/app/components/PWADebugPanel";
import AdminApp from "@/app/AdminApp";
import { api } from "@/lib/supabase";
import { Shield } from "lucide-react";

type Screen = "onboarding" | "inscription" | "login" | "accueil" | "validation" | "absence";
type AppMode = "user" | "admin";

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>("user");
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
  const [isPresent, setIsPresent] = useState(false);
  const [userName, setUserName] = useState("Utilisateur");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data, error } = await api.getSession();
    
    if (data?.session?.access_token) {
      setAccessToken(data.session.access_token);
      await loadUserProfile(data.session.access_token);
      await loadTodayStatus(data.session.access_token);
      setCurrentScreen("accueil");
    }
    setLoading(false);
  };

  const loadUserProfile = async (token: string) => {
    try {
      console.log('Loading user profile with token:', token ? 'token exists' : 'no token');
      
      // First, try to get user metadata from Supabase Auth directly
      const { data: sessionData } = await api.getSession();
      if (sessionData?.session?.user?.user_metadata) {
        const { nom, prenom } = sessionData.session.user.user_metadata;
        if (nom && prenom) {
          const fullName = `${prenom} ${nom}`;
          console.log('Setting userName from session metadata:', fullName);
          setUserName(fullName);
          return;
        }
      }
      
      // Fallback to API call
      const profile = await api.getProfile(token);
      console.log('Profile received:', profile);
      if (profile.nom && profile.prenom) {
        const fullName = `${profile.prenom} ${profile.nom}`;
        console.log('Setting userName to:', fullName);
        setUserName(fullName);
      } else {
        console.log('Profile missing nom or prenom:', profile);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const loadTodayStatus = async (token: string) => {
    try {
      const status = await api.getTodayStatus(token);
      setIsPresent(status.status === 'present');
    } catch (error) {
      console.error("Error loading today status:", error);
    }
  };

  const handleCreateAccount = () => {
    setCurrentScreen("inscription");
  };

  const handleLogin = () => {
    setCurrentScreen("login");
  };

  const handleLoginSuccess = async (token: string) => {
    setAccessToken(token);
    await loadUserProfile(token);
    await loadTodayStatus(token);
    setCurrentScreen("accueil");
  };

  const handleInscriptionComplete = () => {
    // After signup, redirect to login
    setCurrentScreen("login");
  };

  const handleDeclarePresence = () => {
    setCurrentScreen("validation");
  };

  const handleDeclareAbsence = () => {
    setCurrentScreen("absence");
  };

  const handleValidationSuccess = async () => {
    if (accessToken) {
      await loadTodayStatus(accessToken);
    }
    setCurrentScreen("accueil");
  };

  const handleAbsenceSubmit = async () => {
    if (accessToken) {
      await loadTodayStatus(accessToken);
    }
    setCurrentScreen("accueil");
  };

  const handleLogout = async () => {
    await api.logout();
    setAccessToken(null);
    setIsPresent(false);
    setUserName("Utilisateur");
    setCurrentScreen("onboarding");
  };

  const handleBack = () => {
    setCurrentScreen("accueil");
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </ThemeProvider>
    );
  }

  // Mode selector on onboarding screen
  if (currentScreen === "onboarding" && appMode === "user") {
    return (
      <ThemeProvider>
        <div className="relative">
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="outline"
              onClick={() => setAppMode("admin")}
              className="gap-2"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Button>
          </div>
          <Onboarding 
            onCreateAccount={handleCreateAccount}
            onLogin={handleLogin}
          />
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  // Admin mode
  if (appMode === "admin") {
    return (
      <ThemeProvider>
        <AdminApp onSwitchToUserMode={() => {
          setAppMode("user");
          setCurrentScreen("onboarding");
        }} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      {currentScreen === "inscription" && (
        <Inscription 
          onBack={() => setCurrentScreen("onboarding")}
          onComplete={handleInscriptionComplete}
        />
      )}

      {currentScreen === "login" && (
        <Login 
          onBack={() => setCurrentScreen("onboarding")}
          onSuccess={handleLoginSuccess}
        />
      )}

      {currentScreen === "accueil" && (
        <Accueil 
          userName={userName}
          isPresent={isPresent}
          onDeclarePresence={handleDeclarePresence}
          onDeclareAbsence={handleDeclareAbsence}
          onLogout={handleLogout}
          accessToken={accessToken}
        />
      )}

      {currentScreen === "validation" && (
        <ValidationPresence 
          onBack={handleBack}
          onSuccess={handleValidationSuccess}
          accessToken={accessToken}
        />
      )}

      {currentScreen === "absence" && (
        <Absence 
          onBack={handleBack}
          onSubmit={handleAbsenceSubmit}
          accessToken={accessToken}
        />
      )}

      <Toaster />
      <PWAInstallPrompt />
      <PWAWelcomeModal />
      <OfflineBanner />
      <PWADebugPanel />
    </ThemeProvider>
  );
}