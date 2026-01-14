import { useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { MapPin } from "lucide-react";

interface Site {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  agentsCount: number;
}

interface GoogleMapsViewProps {
  sites: Site[];
}

const mapContainerStyle = {
  width: "100%",
  height: "384px"
};

const defaultCenter = {
  lat: 48.8566,
  lng: 2.3522
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
};

export function GoogleMapsView({ sites }: GoogleMapsViewProps) {
  // Essayer de récupérer la clé API depuis les variables d'environnement
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
                 import.meta.env.GOOGLE_MAPS_API_KEY || "";

  // Si pas de clé API, afficher une carte simulée
  if (!apiKey) {
    return (
      <div className="relative w-full h-96 bg-muted/50 rounded-lg overflow-hidden border">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="w-12 h-12 text-primary mx-auto" />
            <p className="text-sm font-medium">Carte interactive des sites</p>
            <p className="text-xs text-muted-foreground">
              Visualisation de {sites.length} site{sites.length > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-destructive mt-2">
              Clé API Google Maps non configurée
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Ajoutez VITE_GOOGLE_MAPS_API_KEY dans votre fichier .env
            </p>
          </div>
        </div>
        {/* Grid pattern for map effect */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Site markers simulés */}
        {sites.map((site, index) => (
          <div
            key={site.id}
            className="absolute w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg cursor-pointer hover:scale-110 transition-transform"
            style={{
              left: `${20 + (index * 15) % 60}%`,
              top: `${30 + (index % 3) * 20}%`,
            }}
            title={site.name}
          >
            <MapPin className="w-4 h-4" />
          </div>
        ))}
      </div>
    );
  }

  // Calculer le centre de la carte
  const center = sites.length > 0
    ? {
        lat: sites.reduce((sum, site) => sum + site.lat, 0) / sites.length,
        lng: sites.reduce((sum, site) => sum + site.lng, 0) / sites.length,
      }
    : defaultCenter;

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={sites.length > 0 ? 6 : 5}
        options={mapOptions}
      >
        {sites.map((site) => (
          <Marker
            key={site.id}
            position={{ lat: site.lat, lng: site.lng }}
            title={`${site.name} - ${site.agentsCount} agent(s)`}
            label={{
              text: site.agentsCount.toString(),
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}