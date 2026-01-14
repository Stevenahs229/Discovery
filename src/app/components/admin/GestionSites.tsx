import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { MapPin, Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { GoogleMapsView } from "@/app/components/admin/GoogleMapsView";

interface Site {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  agentsCount: number;
}

interface GestionSitesProps {
  sites: Site[];
  onAddSite: (site: Omit<Site, 'id'>) => void;
  onUpdateSite: (id: string, site: Partial<Site>) => void;
  onDeleteSite: (id: string) => void;
}

export function GestionSites({ sites, onAddSite, onUpdateSite, onDeleteSite }: GestionSitesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    lat: 48.8566,
    lng: 2.3522,
  });

  // Filtrer les sites selon la recherche
  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSite) {
      onUpdateSite(editingSite.id, formData);
      toast.success("Site modifié avec succès");
    } else {
      onAddSite({ ...formData, agentsCount: 0 });
      toast.success("Site ajouté avec succès");
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      lat: 48.8566,
      lng: 2.3522,
    });
    setEditingSite(null);
  };

  const handleEdit = (site: Site) => {
    setEditingSite(site);
    setFormData({
      name: site.name,
      address: site.address,
      lat: site.lat,
      lng: site.lng,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce site ?")) {
      onDeleteSite(id);
      toast.success("Site supprimé avec succès");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Gestion des Sites</h2>
          <p className="text-muted-foreground">Gérez les sites et leur localisation</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un site
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSite ? "Modifier le site" : "Créer un site"}</DialogTitle>
              <DialogDescription>
                Remplissez les informations du site
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du site *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Paris - Bâtiment A"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Avenue des Entreprises, 75001 Paris"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude *</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude *</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="0.0001"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingSite ? "Modifier" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un site par nom ou adresse..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-6">
        {/* Carte Google Maps */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sites géolocalisés</CardTitle>
            <CardDescription>Visualisation en temps réel des sites sur la carte</CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleMapsView sites={filteredSites} />
          </CardContent>
        </Card>

        {/* Liste des sites */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredSites.map((site) => (
            <Card key={site.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="line-clamp-1">{site.name}</span>
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">{site.address}</CardDescription>
                  </div>
                  <div className="flex gap-1 flex-shrink-0 ml-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(site)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(site.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Coordonnées</span>
                    <span className="font-mono text-xs">
                      {site.lat.toFixed(4)}, {site.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Agents assignés</span>
                    <span className="font-semibold text-primary">{site.agentsCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredSites.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun site trouvé</p>
                {searchQuery && (
                  <p className="text-sm mt-2">Essayez une autre recherche</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}