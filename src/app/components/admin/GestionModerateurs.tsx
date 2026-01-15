import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { UserPlus, Shield, ShieldCheck, Crown, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Moderateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'moderateur' | 'superadmin' | 'admin';
  linkedUserId: string | null;
  createdAt: string;
}

interface GestionModerateurProps {
  onAuthError?: () => void;
  adminProfile?: any;
}

const ROLE_LABELS: Record<string, string> = {
  moderateur: 'Modérateur',
  superadmin: 'Super Admin',
  admin: 'Admin',
};

const ROLE_COLORS: Record<string, 'default' | 'destructive' | 'secondary'> = {
  moderateur: 'destructive',
  superadmin: 'default',
  admin: 'secondary',
};

const ROLE_ICONS: Record<string, any> = {
  moderateur: Crown,
  superadmin: ShieldCheck,
  admin: Shield,
};

export function GestionModerateurs({ onAuthError, adminProfile }: GestionModerateurProps) {
  const [moderateurs, setModerateurs] = useState<Moderateur[]>([]);
  const [loading, setLoading] = useState(true); // Changed back to true for initial loading
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMod, setEditingMod] = useState<Moderateur | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [currentUserInfo, setCurrentUserInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: '',
    role: 'admin' as 'moderateur' | 'superadmin' | 'admin',
    linkToUserId: '',
  });

  // Vérifier le profil de l'utilisateur actuel
  const checkCurrentUser = async () => {
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        console.error('No access token found');
        toast.error('Aucun token trouvé. Veuillez vous reconnecter.');
        return;
      }

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
        console.error('Error fetching current user profile:', response.status, errorText);
        toast.error('Erreur lors de la récupération du profil utilisateur');
        return;
      }

      const data = await response.json();
      setCurrentUserInfo(data);
      console.log('Current user info:', data);

      if (!data.role || data.role === 'user') {
        toast.error(`Votre rôle actuel est "${data.role || 'user'}" - Vous devez être admin minimum pour accéder à cette section`);
      } else {
        toast.success(`Rôle vérifié : ${data.role}`);
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la vérification du profil');
    }
  };

  // Récupérer la liste des modérateurs
  const fetchModerateurs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');

      if (!token) {
        console.error('No access token found');
        toast.error('Vous devez être connecté pour accéder à cette page');
        setModerateurs([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-643544a8/admin/list`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Erreur lors du chargement';
        let errorDetails = '';

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
          errorDetails = errorData.error || '';
        } catch (e) {
          // Si pas de JSON, utiliser le texte brut
          errorMessage = errorText || errorMessage;
          errorDetails = errorText || '';
        }

        console.error('Error fetching moderateurs:', response.status, errorMessage);

        // Si erreur 401 ou 403, c'est probablement un problème de permissions
        if (response.status === 401 || response.status === 403) {
          // Afficher un message spécifique pour les permissions
          toast.error('Accès refusé : vous devez être administrateur pour accéder à cette section');
          console.log('Permission details:', errorDetails);

          // Ne pas throw l'erreur, juste afficher un état vide
          setModerateurs([]);
          setLoading(false);
          return;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      setModerateurs(data.admins || []);
    } catch (error: any) {
      console.error('Erreur:', error);

      // Ne pas afficher de toast si on a déjà affiché le message de permissions
      if (!error.message.includes('Accès refusé')) {
        toast.error(error.message || 'Erreur lors du chargement des modérateurs');
      }

      setModerateurs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Charger automatiquement les données au montage
    console.log('📍 GestionModerateurs mounted, adminProfile:', adminProfile);

    // Si on a un profil admin, l'utiliser
    if (adminProfile) {
      console.log('✅ Using adminProfile from props:', adminProfile);
      setCurrentUserInfo(adminProfile);
    }

    // Charger la liste des modérateurs
    fetchModerateurs();
  }, [adminProfile]);

  // Créer un modérateur
  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-643544a8/admin/create`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }

      const data = await response.json();
      toast.success(data.message || 'Modérateur créé avec succès');

      // Reset form
      setFormData({
        email: '',
        password: '',
        nom: '',
        prenom: '',
        telephone: '',
        role: 'admin',
        linkToUserId: '',
      });
      setIsCreateDialogOpen(false);

      // Refresh list
      fetchModerateurs();
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de la création');
    }
  };

  // Modifier le rôle
  const handleChangeRole = async (modId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-643544a8/admin/change-role/${modId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newRole }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la modification');
      }

      const data = await response.json();
      toast.success(data.message || 'Rôle modifié avec succès');

      // Refresh list
      fetchModerateurs();
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de la modification du rôle');
    }
  };

  // Supprimer un modérateur
  const handleDelete = async (modId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce modérateur ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-643544a8/admin/delete/${modId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }

      const data = await response.json();
      toast.success(data.message || 'Modérateur supprimé avec succès');

      // Refresh list
      fetchModerateurs();
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  // Bootstrap : Promouvoir l'utilisateur actuel en modérateur (premier démarrage)
  const handleBootstrap = async () => {
    if (!confirm('Êtes-vous sûr de vouloir vous promouvoir en modérateur ? Cette action ne fonctionne que si aucun modérateur n\'existe.')) {
      return;
    }

    try {
      setIsBootstrapping(true);
      const token = localStorage.getItem('access_token');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-643544a8/bootstrap-first-moderator`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la promotion');
      }

      const data = await response.json();
      toast.success(data.message || 'Vous êtes maintenant modérateur !');

      // Refresh list
      setTimeout(() => {
        fetchModerateurs();
      }, 1000);
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de la promotion');
    } finally {
      setIsBootstrapping(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement des modérateurs...</p>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur a les permissions nécessaires
  const userHasPermissions = currentUserInfo?.role && currentUserInfo.role !== 'user';

  // Afficher l'avertissement seulement si l'utilisateur n'a PAS de permissions
  const showPermissionWarning = !userHasPermissions;

  return (
    <div className="space-y-6">
      {/* Avertissement de permissions */}
      {showPermissionWarning && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-600" />
              Accès Restreint
            </CardTitle>
            <CardDescription>
              Cette section nécessite un rôle administrateur pour être accessible.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <p className="mb-2">Votre compte actuel ne dispose pas des permissions nécessaires pour gérer les modérateurs.</p>
              <p className="font-semibold">Rôles requis :</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li><strong>Modérateur</strong> - Accès complet, peut gérer tous les rôles</li>
                <li><strong>Super Admin</strong> - Peut gérer les admins et utilisateurs</li>
                <li><strong>Admin</strong> - Peut gérer les utilisateurs uniquement</li>
              </ul>
            </div>

            {/* Informations utilisateur actuel */}
            {currentUserInfo && (
              <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-4 rounded-lg text-sm">
                <p className="font-semibold mb-2">Votre profil actuel :</p>
                <ul className="space-y-1 text-xs">
                  <li><strong>Email:</strong> {currentUserInfo.email}</li>
                  <li><strong>Nom:</strong> {currentUserInfo.prenom} {currentUserInfo.nom}</li>
                  <li><strong>Rôle actuel:</strong> <Badge variant={currentUserInfo.role === 'user' ? 'secondary' : 'default'}>{currentUserInfo.role || 'user'}</Badge></li>
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={checkCurrentUser} variant="outline" size="sm" className="flex-1">
                Vérifier Mon Rôle
              </Button>
              <Button onClick={() => setShowDebug(!showDebug)} variant="outline" size="sm" className="flex-1">
                {showDebug ? 'Masquer' : 'Afficher'} Debug
              </Button>
            </div>

            {showDebug && (
              <div className="bg-black text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto">
                <p className="mb-2"># Informations de débogage :</p>
                <p>Token présent: {localStorage.getItem('access_token') ? 'Oui ✓' : 'Non ✗'}</p>
                <p>Email admin: {localStorage.getItem('admin_email') || 'Non défini'}</p>
                <p className="mt-2"># Pour tester en local :</p>
                <p>1. Créez un compte via /admin/signup</p>
                <p>2. Connectez-vous avec ce compte</p>
                <p>3. Le premier compte créé sera modérateur</p>
              </div>
            )}

            <div className="bg-muted p-4 rounded-lg text-sm">
              <p className="font-semibold mb-2">Comment obtenir ces permissions ?</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Contactez un modérateur ou super admin existant</li>
                <li>Demandez l'élévation de votre rôle</li>
                <li>Ou utilisez la console Supabase pour modifier votre rôle manuellement</li>
              </ol>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/50 p-4 rounded-lg text-sm">
              <p className="font-semibold mb-2">🚀 Solution Rapide :</p>
              <p className="mb-2">Si vous êtes joachimgoehakue05@gmail.com :</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Allez à la page d'inscription admin (/admin/signup)</li>
                <li>Créez un compte avec votre email</li>
                <li>Vous serez automatiquement modérateur</li>
              </ol>
            </div>

            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg text-sm">
              <p className="font-semibold mb-2 text-red-700 dark:text-red-400">⚠�� Erreur \"Invalid JWT\" ?</p>
              <p className="mb-2 text-red-600 dark:text-red-300">Votre token d'authentification est invalide ou expiré.</p>
              <p className="font-semibold mb-2">Solution :</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Déconnectez-vous complètement (bouton en bas de la sidebar)</li>
                <li>Retournez à l'interface Admin</li>
                <li>Cliquez sur \"Créer un compte admin\"</li>
                <li>Créez un nouveau compte avec joachimgoehakue05@gmail.com</li>
                <li>Connectez-vous avec ce nouveau compte</li>
              </ol>
              <Button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('access_token');
                    const response = await fetch(
                      `https://${projectId}.supabase.co/functions/v1/make-server-643544a8/fix-my-role`,
                      {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`,
                        },
                      }
                    );

                    if (!response.ok) {
                      const error = await response.json();
                      throw new Error(error.error || 'Erreur lors de la mise à jour du rôle');
                    }

                    const data = await response.json();
                    toast.success(data.message || 'Rôle mis à jour avec succès!');

                    // Refresh the page to reload with new role
                    setTimeout(() => {
                      window.location.reload();
                    }, 1500);
                  } catch (error: any) {
                    console.error('Error fixing role:', error);
                    toast.error(error.message || 'Erreur lors de la mise à jour du rôle');
                  }
                }}
                variant="default"
                size="sm"
                className="mt-3 w-full bg-green-600 hover:bg-green-700"
              >
                🔧 Corriger Mon Rôle Automatiquement
              </Button>
              <Button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
                variant="destructive"
                size="sm"
                className="mt-3 w-full"
              >
                Déconnecter et Recommencer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gestion des Modérateurs</h2>
          <p className="text-muted-foreground mt-1">
            Gérer les administrateurs et modérateurs de la plateforme
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Créer un Modérateur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un Modérateur/Admin</DialogTitle>
              <DialogDescription>
                Créer un nouveau compte administrateur avec des droits spécifiques
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    placeholder="Jean"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@entreprise.fr"
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="moderateur">Modérateur</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {formData.role === 'moderateur' && 'Accès complet - Peut gérer tous les rôles'}
                  {formData.role === 'superadmin' && 'Peut gérer les admins et utilisateurs'}
                  {formData.role === 'admin' && 'Peut gérer les utilisateurs uniquement'}
                </p>
              </div>

              <Button onClick={handleCreate} className="w-full">
                Créer le Compte
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modérateurs</CardTitle>
            <Crown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moderateurs.filter(m => m.role === 'moderateur').length}
            </div>
            <p className="text-xs text-muted-foreground">Accès complet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <ShieldCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moderateurs.filter(m => m.role === 'superadmin').length}
            </div>
            <p className="text-xs text-muted-foreground">Gestion étendue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moderateurs.filter(m => m.role === 'admin').length}
            </div>
            <p className="text-xs text-muted-foreground">Gestion basique</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des modérateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Modérateurs et Admins</CardTitle>
          <CardDescription>
            Total: {moderateurs.length} compte(s) administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moderateurs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aucun modérateur trouvé. Créez-en un pour commencer.
              </div>
            ) : (
              moderateurs.map((mod) => {
                const RoleIcon = ROLE_ICONS[mod.role];
                return (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <RoleIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">
                          {mod.prenom} {mod.nom}
                        </div>
                        <div className="text-sm text-muted-foreground">{mod.email}</div>
                        {mod.telephone && (
                          <div className="text-xs text-muted-foreground">{mod.telephone}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <Badge variant={ROLE_COLORS[mod.role]}>
                          {ROLE_LABELS[mod.role]}
                        </Badge>
                      </div>

                      {/* Modifier le rôle */}
                      <Select
                        value={mod.role}
                        onValueChange={(value) => handleChangeRole(mod.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <Edit className="mr-2 h-4 w-4" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">Super Admin</SelectItem>
                          <SelectItem value="moderateur">Modérateur</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Supprimer */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(mod.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}