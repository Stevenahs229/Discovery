import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { UserPlus, Edit, Trash2, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

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

interface GestionAgentsProps {
  agents: Agent[];
  onAddAgent: (agent: Omit<Agent, 'id'>) => void;
  onUpdateAgent: (id: string, agent: Partial<Agent>) => void;
  onDeleteAgent: (id: string) => void;
}

export function GestionAgents({ agents, onAddAgent, onUpdateAgent, onDeleteAgent }: GestionAgentsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    binome: "",
    site: "",
    biometricStatus: "pending" as Agent['biometricStatus'],
    status: "waiting" as Agent['status'], // Par défaut en attente jusqu'à activation de la présence
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAgent) {
      onUpdateAgent(editingAgent.id, formData);
      toast.success("Agent modifié avec succès");
    } else {
      onAddAgent(formData);
      toast.success("Agent ajouté avec succès");
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      binome: "",
      site: "",
      biometricStatus: "pending",
      status: "waiting", // Par défaut en attente jusqu'à activation de la présence
    });
    setEditingAgent(null);
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      nom: agent.nom,
      prenom: agent.prenom,
      email: agent.email,
      telephone: agent.telephone,
      binome: agent.binome,
      site: agent.site,
      biometricStatus: agent.biometricStatus,
      status: agent.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet agent ?")) {
      onDeleteAgent(id);
      toast.success("Agent supprimé avec succès");
    }
  };

  const getBiometricStatusIcon = (status: Agent['biometricStatus']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getBiometricStatusText = (status: Agent['biometricStatus']) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échec';
    }
  };

  const getStatusBadge = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-primary">Actif</Badge>;
      case 'waiting':
        return <Badge variant="secondary" className="bg-secondary text-secondary-foreground">En attente</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactif</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Gestion des Agents</h2>
          <p className="text-muted-foreground">Gérez les agents et leurs informations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Ajouter un agent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAgent ? "Modifier l'agent" : "Ajouter un agent"}</DialogTitle>
              <DialogDescription>
                Remplissez les informations de l'agent
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="binome">Binôme</Label>
                  <Select value={formData.binome} onValueChange={(value) => setFormData({ ...formData, binome: value })}>
                    <SelectTrigger id="binome">
                      <SelectValue placeholder="Sélectionnez un binôme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      {agents.filter(a => a.id !== editingAgent?.id).map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.prenom} {agent.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site">Site *</Label>
                  <Select value={formData.site} onValueChange={(value) => setFormData({ ...formData, site: value })}>
                    <SelectTrigger id="site">
                      <SelectValue placeholder="Sélectionnez un site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="site-paris">Paris - Bâtiment A</SelectItem>
                      <SelectItem value="site-lyon">Lyon - Centre</SelectItem>
                      <SelectItem value="site-marseille">Marseille - Port</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="biometricStatus">Statut Biométrique</Label>
                  <Select value={formData.biometricStatus} onValueChange={(value: Agent['biometricStatus']) => setFormData({ ...formData, biometricStatus: value })}>
                    <SelectTrigger id="biometricStatus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="failed">Échec</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Statut Agent</Label>
                  <Select value={formData.status} onValueChange={(value: Agent['status']) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif (Présence validée)</SelectItem>
                      <SelectItem value="waiting">En attente (Validation binôme)</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingAgent ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des agents</CardTitle>
          <CardDescription>
            {agents.length} agent{agents.length > 1 ? 's' : ''} enregistré{agents.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Téléphone</TableHead>
                  <TableHead className="hidden md:table-cell">Binôme</TableHead>
                  <TableHead className="hidden lg:table-cell">Site</TableHead>
                  <TableHead className="hidden md:table-cell">Biométrie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{agent.prenom} {agent.nom}</p>
                        <p className="text-xs text-muted-foreground md:hidden">{agent.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{agent.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">{agent.telephone}</TableCell>
                    <TableCell className="hidden md:table-cell">{agent.binome || '-'}</TableCell>
                    <TableCell className="hidden lg:table-cell">{agent.site}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        {getBiometricStatusIcon(agent.biometricStatus)}
                        <span className="text-sm">{getBiometricStatusText(agent.biometricStatus)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(agent.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(agent)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(agent.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}