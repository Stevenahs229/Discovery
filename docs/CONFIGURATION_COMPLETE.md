# 🚀 Guide de Configuration Complète - TwoInOne

## Architecture Microservices

TwoInOne utilise maintenant une **architecture microservices** avec :

```
┌─────────────────────────────────────────────────────────┐
│                 FRONTEND PWA (React)                    │
│         TypeScript + Tailwind CSS + Supabase            │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                      │
        ▼                                      ▼
┌───────────────────┐              ┌─────────────────────┐
│  BACKEND API      │              │  BACKEND IA/ML      │
│  (TypeScript)     │◄────────────►│   (Python)          │
│                   │              │                     │
│ - Supabase Edge   │              │ - FastAPI           │
│ - Auth            │              │ - TensorFlow        │
│ - CRUD            │              │ - OpenCV            │
│ - Binômes         │              │ - Reconnaissance    │
│ - Google Maps     │              │   Faciale           │
└───────────────────┘              └─────────────────────┘
        │                                      │
        └──────────────┬──────────────────────┘
                       ▼
              ┌────────────────┐
              │  PostgreSQL    │
              │  (Supabase)    │
              └────────────────┘
```

---

## 📦 1. Installation du Frontend

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le projet
cd twoinone-frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

### Configuration `.env`

```env
# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...votre-cle

# Backend ML Python (si déployé)
VITE_ML_API_URL=https://votre-ml-api.com

# Supabase (automatique depuis Figma Make)
# Ces variables sont déjà configurées
```

### Démarrer le frontend

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

---

## 🐍 2. Déploiement du Backend ML Python

### Option A : Déploiement Local

```bash
cd backend-ml-python

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
nano .env

# Lancer le serveur
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Le backend ML sera disponible sur `http://localhost:8000`

### Option B : Déploiement avec Docker

```bash
cd backend-ml-python

# Construire l'image
docker build -t twoinone-ml .

# Lancer le conteneur
docker run -d -p 8000:8000 --env-file .env twoinone-ml

# OU avec docker-compose
docker-compose up -d
```

### Option C : Déploiement sur Render.com (Gratuit)

1. **Créer un compte** sur [render.com](https://render.com)
2. **New Web Service**
3. **Connecter** votre repo GitHub contenant `backend-ml-python/`
4. **Configuration** :
   - **Environment**: Docker
   - **Instance Type**: Free
   - **Docker Command**: (laisser par défaut)
5. **Variables d'environnement** :
   ```
   DATABASE_URL=postgresql://...
   SUPABASE_URL=https://...
   SUPABASE_ANON_KEY=eyJhb...
   ```
6. **Déployer** !

Render vous donnera une URL : `https://twoinone-ml.onrender.com`

**⚠️ Important** : Mettez à jour `VITE_ML_API_URL` dans le frontend avec cette URL.

---

## 🗺️ 3. Configuration Google Maps API

### Étape 1 : Créer une clé API

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. **Créer un projet** (ex: "TwoInOne")
3. **Activer l'API** :
   - Aller dans "APIs & Services" → "Library"
   - Rechercher "Maps JavaScript API"
   - Cliquer "Enable"
4. **Créer des identifiants** :
   - "APIs & Services" → "Credentials"
   - "Create Credentials" → "API Key"
   - Copier la clé générée

### Étape 2 : Restreindre la clé (Sécurité)

1. Cliquer sur la clé créée
2. **Restrictions d'application** :
   - Sélectionner "HTTP referrers (web sites)"
   - Ajouter vos domaines :
     ```
     http://localhost:5173/*
     https://votre-domaine.com/*
     ```
3. **Restrictions d'API** :
   - Sélectionner "Restrict key"
   - Cocher uniquement "Maps JavaScript API"
4. **Enregistrer**

### Étape 3 : Configurer dans TwoInOne

```env
# .env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyC...votre-cle-ici
```

**Redémarrer l'application** :

```bash
npm run dev
```

### Test de la configuration

1. Aller dans **Interface Admin** → **Gestion des Sites**
2. La carte Google Maps devrait s'afficher
3. Ajouter un site avec des coordonnées GPS
4. Le marqueur devrait apparaître sur la carte

---

## 🔐 4. Configuration de la Reconnaissance Faciale

### Étape 1 : Vérifier le Backend ML

```bash
# Tester le backend ML
curl http://localhost:8000/ml/health

# Réponse attendue :
{
  "status": "healthy",
  "ml_libraries": {
    "face_recognition": "installed",
    "opencv": "installed",
    "numpy": "installed"
  },
  "models_loaded": 0
}
```

### Étape 2 : Enregistrer un visage

1. **Se connecter** à TwoInOne
2. **Aller dans Validation de Présence**
3. **Choisir "Reconnaissance Faciale"**
4. **Autoriser l'accès** à la caméra
5. **Capturer une photo** de votre visage
6. Le système enregistrera votre visage

### Étape 3 : Vérifier l'enregistrement

```bash
# API: Lister les utilisateurs enregistrés
curl http://localhost:8000/ml/users-enrolled \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Troubleshooting

**Problème** : "Erreur d'accès à la caméra"
- **Solution** : Autoriser l'accès caméra dans les paramètres du navigateur

**Problème** : "Backend ML non accessible"
- **Solution** : Vérifier que le backend Python est lancé sur port 8000

**Problème** : "Visage non reconnu"
- **Solution** : Ré-enregistrer le visage avec une meilleure luminosité

---

## 👥 5. Configuration de la Réaffectation de Binôme

### Fonctionnement

Lorsqu'un agent déclare une absence, il peut :
1. **Réaffecter son binôme** à un autre agent temporairement
2. Le système enregistre la réaffectation
3. Le nouveau binôme reçoit une notification

### Utilisation

1. **Déclarer une absence** :
   - Aller dans "Déclarer une absence"
   - Remplir les dates et le motif
   - ✅ Cocher "Réaffecter mon binôme"
   - Sélectionner le nouvel agent dans la liste
   - Envoyer

2. **Voir les réaffectations** :
   - Les réaffectations sont visibles dans l'historique
   - Le binôme original voit qu'il a été temporairement réaffecté

### API Endpoints

```bash
# Obtenir les agents disponibles
GET /make-server-643544a8/agents/available

# Déclarer une absence avec réaffectation
POST /make-server-643544a8/absence
{
  "motif": "conge",
  "dateDebut": "2026-01-20",
  "dateFin": "2026-01-25",
  "commentaire": "Vacances",
  "nouveauBinomeId": "user-id-123"
}

# Voir les réaffectations
GET /make-server-643544a8/binome/reassignments
```

---

## 🎯 6. Fonctionnalités Principales

### ✅ Biométrie Double Choix

- **Empreinte digitale** : Méthode rapide (simulée)
- **Reconnaissance faciale** : Utilise la caméra + IA

**Flow** :
1. Validation biométrique (choix entre empreinte ou facial)
2. Si validé → Génération QR Code
3. Scan QR Code → Présence enregistrée

### ✅ Géolocalisation Google Maps

- **Visualisation temps réel** des sites sur carte
- **Coordonnées GPS précises**
- **Markers avec nombre d'agents**
- **Zoom automatique** sur la zone

### ✅ Réaffectation de Binôme

- **Temporaire** : pendant l'absence
- **Notification** automatique
- **Historique** des réaffectations

### ✅ Mode Hors Ligne (PWA)

- **Installation** sur smartphone
- **Fonctionne sans internet** (mode lecture seule)
- **Synchronisation** automatique au retour en ligne

---

## 🧪 7. Tests

### Test de la reconnaissance faciale

```bash
cd backend-ml-python

# Tester l'enregistrement
curl -X POST http://localhost:8000/ml/enroll-face \
  -H "user_id: test-user-123" \
  -H "authorization: Bearer YOUR_TOKEN" \
  -F "file=@photo-test.jpg"

# Tester la vérification
curl -X POST http://localhost:8000/ml/verify-face \
  -H "authorization: Bearer YOUR_TOKEN" \
  -F "file=@photo-verification.jpg"
```

### Test Google Maps

```javascript
// Console du navigateur
console.log('Google Maps API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

// Vérifier que la carte charge
// Ouvrir l'onglet Réseau et chercher : maps.googleapis.com
```

### Test Backend Principal

```bash
# Health check
curl https://your-project.supabase.co/functions/v1/make-server-643544a8/agents/available \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📱 8. Installation PWA

### Sur Android

1. **Ouvrir** l'app dans Chrome
2. **Cliquer** sur le menu (⋮)
3. **"Ajouter à l'écran d'accueil"**
4. L'icône TwoInOne apparaît sur votre écran d'accueil

### Sur iOS

1. **Ouvrir** dans Safari
2. **Appuyer** sur le bouton Partager (□↑)
3. **"Sur l'écran d'accueil"**
4. L'app s'installe comme une app native

### Sur Desktop

1. **Chrome/Edge** : Icône d'installation dans la barre d'adresse
2. **Cliquer** sur l'icône
3. **"Installer"**
4. L'app s'ouvre dans sa propre fenêtre

---

## 🐛 9. Troubleshooting

### Frontend ne démarre pas

```bash
# Nettoyer node_modules
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend ML Python erreurs

```bash
# Réinstaller les dépendances
pip uninstall -y -r requirements.txt
pip install -r requirements.txt

# Vérifier OpenCV
python -c "import cv2; print(cv2.__version__)"

# Vérifier face_recognition
python -c "import face_recognition; print('OK')"
```

### Google Maps ne charge pas

1. **Vérifier la clé API** dans `.env`
2. **Vérifier les restrictions** dans Google Cloud Console
3. **Vérifier le quota** (Google Maps a un quota gratuit)
4. **Console navigateur** : chercher les erreurs Google Maps

### Reconnaissance faciale ne fonctionne pas

1. **Vérifier le backend ML** : `curl http://localhost:8000/ml/health`
2. **Autoriser la caméra** dans le navigateur
3. **HTTPS requis** en production (WebRTC)
4. **Bonne luminosité** pour la capture

---

## 🚀 10. Déploiement Production

### Frontend (Vercel)

```bash
# Connecter GitHub à Vercel
# https://vercel.com/new

# Variables d'environnement à configurer :
VITE_GOOGLE_MAPS_API_KEY=...
VITE_ML_API_URL=https://your-ml-api.onrender.com
```

### Backend ML (Render.com)

1. **Créer un Web Service**
2. **Docker** comme environnement
3. **Variables d'environnement** :
   ```
   DATABASE_URL=...
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   ```
4. **Déployer**

### Backend Principal (Supabase)

Déjà déployé automatiquement via Supabase Edge Functions !

---

## 📚 11. Ressources

### Documentation

- [Guide PWA](/docs/PWA_GUIDE.md)
- [Guide Installation PWA](/docs/PWA_INSTALLATION_GUIDE.md)
- [API Backend ML](/backend-ml-python/README.md)

### APIs Externes

- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Supabase Documentation](https://supabase.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

### Support

Pour toute question :
- ✉️ Email : support@twoinone.app
- 📱 Téléphone : +33 X XX XX XX XX
- 💬 Chat : Dans l'application

---

## ✅ Checklist de Configuration Complète

- [ ] Frontend installé et démarré
- [ ] Backend ML Python déployé
- [ ] Google Maps API configurée
- [ ] Reconnaissance faciale testée
- [ ] Réaffectation de binôme testée
- [ ] PWA installée sur smartphone
- [ ] Mode hors ligne testé
- [ ] Production déployée

---

**TwoInOne © 2026** - Application de Présence Sécurisée avec IA
