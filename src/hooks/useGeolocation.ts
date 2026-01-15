import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
  permissionGranted: boolean;
}

interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export function useGeolocation(requestOnMount = true) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false,
    permissionGranted: false,
  });

  // Demander la permission au démarrage
  const requestPermission = async () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'La géolocalisation n\'est pas supportée par votre navigateur',
        loading: false,
      }));
      toast.error('Géolocalisation non supportée', {
        description: 'Votre navigateur ne supporte pas la géolocalisation',
      });
      return false;
    }

    try {
      setState(prev => ({ ...prev, loading: true }));

      // Vérifier la permission
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permission.state === 'denied') {
          setState(prev => ({
            ...prev,
            error: 'Permission de géolocalisation refusée',
            loading: false,
            permissionGranted: false,
          }));
          
          toast.error('Permission refusée', {
            description: 'Veuillez activer la géolocalisation dans les paramètres de votre navigateur',
            duration: 5000,
          });
          return false;
        }
      }

      // Demander la position pour obtenir la permission
      return new Promise<boolean>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const data: GeolocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            };

            // Stocker en localStorage pour mode offline
            localStorage.setItem('last_geolocation', JSON.stringify(data));

            setState({
              latitude: data.latitude,
              longitude: data.longitude,
              accuracy: data.accuracy,
              error: null,
              loading: false,
              permissionGranted: true,
            });

            toast.success('Géolocalisation activée', {
              description: `Position: ${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`,
            });

            resolve(true);
          },
          (error) => {
            let errorMessage = 'Erreur de géolocalisation';
            
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Permission de géolocalisation refusée';
                toast.error('Permission refusée', {
                  description: 'Veuillez autoriser l\'accès à votre position',
                  duration: 5000,
                });
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Position non disponible';
                toast.error('Position indisponible', {
                  description: 'Impossible de déterminer votre position',
                });
                break;
              case error.TIMEOUT:
                errorMessage = 'Délai d\'attente dépassé';
                toast.error('Timeout', {
                  description: 'La demande de position a expiré',
                });
                break;
            }

            setState(prev => ({
              ...prev,
              error: errorMessage,
              loading: false,
              permissionGranted: false,
            }));

            resolve(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erreur lors de la demande de permission',
        loading: false,
        permissionGranted: false,
      }));
      
      toast.error('Erreur', {
        description: 'Impossible de demander la permission de géolocalisation',
      });
      
      return false;
    }
  };

  // Obtenir la position actuelle
  const getCurrentPosition = (): Promise<GeolocationData | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        // Mode offline: récupérer la dernière position connue
        const lastPos = localStorage.getItem('last_geolocation');
        if (lastPos) {
          const data = JSON.parse(lastPos);
          resolve(data);
        } else {
          resolve(null);
        }
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const data: GeolocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };

          // Stocker pour usage offline
          localStorage.setItem('last_geolocation', JSON.stringify(data));

          setState(prev => ({
            ...prev,
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: data.accuracy,
            error: null,
          }));

          resolve(data);
        },
        (error) => {
          console.error('Geolocation error:', error);
          
          // En cas d'erreur, utiliser la dernière position connue
          const lastPos = localStorage.getItem('last_geolocation');
          if (lastPos) {
            const data = JSON.parse(lastPos);
            toast.warning('Position sauvegardée utilisée', {
              description: 'Impossible d\'obtenir la position actuelle, utilisation de la dernière position connue',
            });
            resolve(data);
          } else {
            resolve(null);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // Accepter une position de moins de 1 minute
        }
      );
    });
  };

  // Surveiller la position en continu
  const watchPosition = () => {
    if (!navigator.geolocation) return null;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const data: GeolocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        localStorage.setItem('last_geolocation', JSON.stringify(data));

        setState(prev => ({
          ...prev,
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy,
          error: null,
        }));
      },
      (error) => {
        console.error('Watch position error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return watchId;
  };

  // Arrêter la surveillance
  const stopWatching = (watchId: number) => {
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  };

  // Demander automatiquement au montage
  useEffect(() => {
    if (requestOnMount) {
      requestPermission();
    }
  }, [requestOnMount]);

  return {
    ...state,
    requestPermission,
    getCurrentPosition,
    watchPosition,
    stopWatching,
  };
}
