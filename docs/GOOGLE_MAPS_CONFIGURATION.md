# 🗺️ Configuration Google Maps API - Guide Détaillé

## Vue d'ensemble

TwoInOne utilise Google Maps JavaScript API pour :
- ✅ Afficher une carte interactive des sites
- ✅ Visualiser la position géographique des agents en temps réel  
- ✅ Gérer les coordonnées GPS des sites
- ✅ Calculer les distances et itinéraires

---

## 📋 Étape 1 : Créer un Projet Google Cloud

### 1.1 Accéder à Google Cloud Console

1. Aller sur [console.cloud.google.com](https://console.cloud.google.com/)
2. Se connecter avec votre compte Google
3. Si premier projet, Google vous guidera automatiquement

### 1.2 Créer un nouveau projet

1. **Cliquer** sur le sélecteur de projet (en haut)
2. **"Nouveau projet"**
3. **Nom du projet** : `TwoInOne` (ou votre choix)
4. **Organisation** : Laisser par défaut
5. **Créer**

⏱️ **Temps d'attente** : ~30 secondes

---

## 🔑 Étape 2 : Activer l'API Google Maps

### 2.1 Accéder à la bibliothèque d'APIs

1. Dans le menu ☰ → **"APIs & Services"** → **"Library"**
2. Rechercher : `Maps JavaScript API`
3. Cliquer sur **"Maps JavaScript API"**
4. **"Enable"** (Activer)

### 2.2 APIs supplémentaires recommandées

Pour des fonctionnalités avancées, activer aussi :

- ✅ **Geocoding API** : Convertir adresses ↔ coordonnées GPS
- ✅ **Places API** : Recherche de lieux
- ✅ **Directions API** : Calcul d'itinéraires
- ✅ **Distance Matrix API** : Calcul de distances

Pour chaque API :
1. Rechercher dans la bibliothèque
2. Cliquer sur l'API
3. **"Enable"**

---

## 🎫 Étape 3 : Créer une Clé API

### 3.1 Générer la clé

1. Menu ☰ → **"APIs & Services"** → **"Credentials"**
2. **"+ CREATE CREDENTIALS"**
3. Sélectionner **"API key"**
4. Google génère une clé : `AIzaSyC...` (copiez-la!)

⚠️ **Important** : Cette clé est visible et copiable une seule fois à la création !

### 3.2 Exemple de clé générée

```
AIzaSyDx3mK8jZ_2pQvY1eR4sT6uV7wX8yZ0aB1
```

---

## 🔒 Étape 4 : Sécuriser la Clé API (OBLIGATOIRE)

### 4.1 Restrictions d'application

1. **Cliquer** sur la clé que vous venez de créer
2. Section **"Application restrictions"**
3. Sélectionner **"HTTP referrers (web sites)"**
4. **"ADD AN ITEM"**
5. Ajouter vos domaines autorisés :

```
http://localhost:5173/*
http://localhost:3000/*
https://votre-domaine.com/*
https://votre-app.vercel.app/*
```

**Pourquoi ?** Empêche d'autres sites d'utiliser votre clé.

### 4.2 Restrictions d'API

1. Section **"API restrictions"**
2. Sélectionner **"Restrict key"**
3. Cocher uniquement les APIs que vous utilisez :
   - ✅ Maps JavaScript API
   - ✅ Geocoding API (optionnel)
   - ✅ Places API (optionnel)

**Pourquoi ?** Limite l'utilisation de votre quota.

### 4.3 Enregistrer

**"SAVE"** en bas de la page.

---

## ⚙️ Étape 5 : Configurer dans TwoInOne

### 5.1 Créer le fichier `.env`

Si pas encore fait :

```bash
cd twoinone-frontend
cp .env.example .env
```

### 5.2 Ajouter la clé API

Ouvrir `.env` et ajouter :

```env
# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDx3mK8jZ_2pQvY1eR4sT6uV7wX8yZ0aB1
```

⚠️ **Remplacer** par votre vraie clé API !

### 5.3 Redémarrer l'application

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer :
npm run dev
```

**Important** : Les variables d'environnement ne sont chargées qu'au démarrage !

---

## ✅ Étape 6 : Tester la Configuration

### 6.1 Vérifier dans l'application

1. **Se connecter** à TwoInOne
2. **Aller** dans l'interface Admin
3. **Cliquer** sur "Gestion des Sites"
4. **La carte Google Maps devrait s'afficher** 🎉

### 6.2 Ajouter un site de test

1. **"Ajouter un site"**
2. **Nom** : `Site Test Paris`
3. **Adresse** : `Tour Eiffel, Paris, France`
4. **Coordonnées GPS** :
   - **Latitude** : `48.8584`
   - **Longitude** : `2.2945`
5. **Enregistrer**

Le marqueur devrait apparaître sur la carte à Paris ! 🗼

### 6.3 Console du navigateur

Ouvrir la console (F12) et vérifier :

```javascript
console.log('Google Maps API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
```

Devrait afficher votre clé API.

---

## 🐛 Troubleshooting

### Problème 1 : "Clé API Google Maps non configurée"

**Symptôme** : Carte grisée avec message d'erreur

**Solutions** :

```bash
# 1. Vérifier que la clé est dans .env
cat .env | grep GOOGLE_MAPS

# 2. Vérifier le format
# ✅ BON : VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
# ❌ MAUVAIS : GOOGLE_MAPS_API_KEY=AIzaSy... (manque VITE_)

# 3. Redémarrer l'application
npm run dev
```

### Problème 2 : Erreur "This API key is not authorized"

**Symptôme** : Console affiche une erreur d'autorisation

**Solutions** :

1. **Vérifier les restrictions de domaine** :
   - Google Cloud Console → Credentials
   - Vérifier que votre domaine est autorisé
   - `http://localhost:5173/*` doit être dans la liste

2. **Attendre** : Les modifications peuvent prendre 5 minutes

3. **Vider le cache** du navigateur :
   - Ctrl+Shift+Delete
   - Cocher "Cached images and files"
   - Clear

### Problème 3 : Carte charge mais reste vide

**Symptôme** : Carte s'affiche mais pas de fond de carte

**Solutions** :

1. **Vérifier la connexion internet**
2. **Console navigateur** : chercher les erreurs
3. **Vérifier le quota** :
   - Google Cloud Console → APIs & Services → Dashboard
   - Voir si quota est dépassé

### Problème 4 : "RefererNotAllowedMapError"

**Symptôme** : Erreur dans la console

**Solution** :

```
L'URL actuelle n'est pas autorisée.

Ajouter dans Google Cloud Console :
- https://votre-nouveau-domaine.com/*
```

### Problème 5 : Quota dépassé

**Symptôme** : "You have exceeded your daily request quota"

**Solution** :

1. **Vérifier l'utilisation** :
   - Google Cloud Console → Billing
   - Voir les stats d'utilisation

2. **Quota gratuit Google Maps** :
   - 28 000 chargements de carte / mois gratuits
   - Au-delà : 7$/1000 requêtes

3. **Activer la facturation** (carte bancaire requise) :
   - Google donne 200$ de crédit gratuit / mois
   - Largement suffisant pour TwoInOne

---

## 💰 Coûts et Quota

### Plan Gratuit

Google Maps offre **généreusement** :

| Service | Quota Gratuit / Mois | Prix au-delà |
|---------|---------------------|--------------|
| Maps JavaScript API | 28 000 chargements | 7$ / 1000 |
| Geocoding API | 40 000 requêtes | 5$ / 1000 |
| Directions API | 40 000 requêtes | 5$ / 1000 |
| Places API | 2 000 requêtes | 32$ / 1000 |

### Pour TwoInOne (estimation)

Scénario : **100 agents**, **10 sites**

- **Chargements de carte** : ~300/jour = 9 000/mois ✅ GRATUIT
- **Geocoding** : ~50/jour = 1 500/mois ✅ GRATUIT

**Verdict** : Totalement gratuit pour 95% des usages ! 🎉

### Activer la Facturation (Recommandé)

Même si gratuit, activer la facturation :

1. **Raison** : Débloquer les 200$/mois de crédit gratuit
2. **Google Cloud Console** → **Billing**
3. **Ajouter une carte bancaire**
4. **Activer**

⚠️ Google ne prélèvera PAS si vous restez dans les quotas gratuits.

---

## 🎨 Personnalisation de la Carte

### Changer le style de la carte

Modifier `/src/app/components/admin/GoogleMapsView.tsx` :

```typescript
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  // Ajouter un style personnalisé
  styles: [
    {
      "featureType": "poi",
      "stylers": [{ "visibility": "off" }]  // Cacher les points d'intérêt
    },
    {
      "featureType": "transit",
      "stylers": [{ "visibility": "off" }]  // Cacher les transports
    }
  ]
};
```

### Ajouter des InfoWindows (info-bulles)

```typescript
<Marker
  key={site.id}
  position={{ lat: site.lat, lng: site.lng }}
  onClick={() => {
    // Afficher une info-bulle au clic
    setSelectedSite(site);
  }}
/>

{selectedSite && (
  <InfoWindow
    position={{ lat: selectedSite.lat, lng: selectedSite.lng }}
    onCloseClick={() => setSelectedSite(null)}
  >
    <div>
      <h3>{selectedSite.name}</h3>
      <p>{selectedSite.address}</p>
    </div>
  </InfoWindow>
)}
```

### Ajouter un cercle de zone (géofencing)

```typescript
<Circle
  center={{ lat: site.lat, lng: site.lng }}
  radius={500}  // 500 mètres
  options={{
    fillColor: '#FF0000',
    fillOpacity: 0.2,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
  }}
/>
```

---

## 📚 Ressources Utiles

### Documentation Officielle

- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Maps API Pricing](https://developers.google.com/maps/billing-and-pricing/pricing)
- [React Google Maps API](https://react-google-maps-api-docs.netlify.app/)

### Outils

- [Google Maps Platform](https://console.cloud.google.com/google/maps-apis)
- [Geocoding Tool](https://www.latlong.net/) - Trouver lat/lng d'une adresse
- [Styling Wizard](https://mapstyle.withgoogle.com/) - Créer des styles de carte

### Support Google

- [Stack Overflow - Google Maps](https://stackoverflow.com/questions/tagged/google-maps)
- [Google Maps Platform Support](https://developers.google.com/maps/support)

---

## ✅ Checklist Finale

- [ ] Projet Google Cloud créé
- [ ] Maps JavaScript API activée
- [ ] Clé API générée
- [ ] Restrictions configurées (domaines + APIs)
- [ ] Clé ajoutée dans `.env` avec préfixe `VITE_`
- [ ] Application redémarrée
- [ ] Carte s'affiche correctement
- [ ] Site de test ajouté avec succès
- [ ] Marqueur visible sur la carte
- [ ] Facturation activée (optionnel mais recommandé)

---

## 🎓 Conseils de Pro

### 1. Sécurité

✅ **TOUJOURS** restreindre votre clé API (domaines + APIs)
❌ **JAMAIS** commiter la clé dans Git (utiliser `.env`)
✅ **TOUJOURS** utiliser des variables d'environnement

### 2. Performance

- Charger la carte **uniquement quand nécessaire**
- Utiliser le **lazy loading** des composants
- **Limiter le nombre de markers** affichés (pagination)

### 3. UX

- **Centrer automatiquement** la carte sur les sites
- **Zoom adaptatif** selon le nombre de sites
- **Markers cliquables** avec InfoWindows
- **Clustering** si beaucoup de markers

---

**Configuration terminée ! 🎉**

Votre carte Google Maps est maintenant opérationnelle dans TwoInOne.

Pour toute question : support@twoinone.app

---

**TwoInOne © 2026** - Géolocalisation Intelligente
