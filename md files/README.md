# 🛡️ TwoInOne - Application de Présence Sécurisée avec IA

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11-green)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Enabled-orange)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-purple)](https://web.dev/progressive-web-apps/)

Application Progressive Web App (PWA) de gestion de présence avec **validation biométrique** (empreinte digitale + reconnaissance faciale), **travail en binôme obligatoire**, **géolocalisation Google Maps**, et **mode hors ligne**.

---

## 🚨 Problème de Connexion ? → [LISEZ CECI](/FIXES.md)

**Erreur "Invalid login credentials" ?** → Créez un compte de test en 30 secondes ! [Guide Rapide](/FIXES.md)

---

## ✨ Fonctionnalités Principales

### 🔐 Authentification & Sécurité

- ✅ **Connexion sécurisée** (Supabase Auth)
- ✅ **Biométrie avancée** :
  - **Empreinte digitale** (simulation)
  - **Reconnaissance faciale** (IA - OpenCV + face_recognition)
- ✅ **Validation en deux étapes** : Biométrie → QR Code
- ✅ **JWT tokens** pour API sécurisées
- ✅ **Gestion des rôles** (Agent / Admin)

### 👥 Gestion des Présences

- ✅ **Déclaration de présence** avec validation biométrique
- ✅ **Travail en binôme obligatoire** avec double validation
- ✅ **Statut en temps réel** : Présent / Absent / En attente
- ✅ **Déclaration d'absence** avec motifs
- ✅ **Réaffectation de binôme** pendant les absences (NEW)
- ✅ **Historique complet** des présences/absences
- ✅ **Déclaration d'absence par le binôme** si partenaire absent

### 🗺️ Géolocalisation & Sites

- ✅ **Carte Google Maps interactive** (NEW - Configurée)
- ✅ **Gestion des sites** avec coordonnées GPS
- ✅ **Visualisation en temps réel** de la position des agents
- ✅ **Markers** avec nombre d'agents par site
- ✅ **Barre de recherche** des sites
- ✅ **Calcul automatique** du centre et zoom de la carte

### 🤖 Intelligence Artificielle

- ✅ **Reconnaissance faciale** (Python ML Backend)
- ✅ **Enregistrement multi-photos** (jusqu'à 5 par utilisateur)
- ✅ **Vérification d'identité** avec score de confiance
- ✅ **Détection de visages** en temps réel
- 🔜 **Détection d'anomalies** dans les présences
- 🔜 **Prédictions ML** des absences futures

### 📱 Progressive Web App (PWA)

- ✅ **Installable** sur smartphone (Android/iOS/Desktop)
- ✅ **Mode hors ligne** fonctionnel
- ✅ **Service Worker** avec cache intelligent
- ✅ **Notifications** push (navigateur)
- ✅ **Icônes personnalisées** haute résolution
- ✅ **Modal de bienvenue** avec onboarding
- ✅ **Instructions d'installation** contextuelles

### 🎨 Interface Utilisateur

- ✅ **Design moderne** avec Tailwind CSS
- ✅ **Responsive** (mobile-first)
- ✅ **Interface Admin** complète
- ✅ **Thème personnalisé** (couleurs TwoInOne)
- ✅ **Composants réutilisables** (shadcn/ui)
- ✅ **Animations fluides** (Framer Motion)
- ✅ **Calendrier intégré** (date-fns)

---

## 🏗️ Architecture Microservices

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND PWA (React)                  │
│              TypeScript + Tailwind CSS                  │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                      │
        ▼                                      ▼
┌───────────────────┐              ┌─────────────────────┐
│  BACKEND API      │              │  BACKEND IA/ML      │
│  (TypeScript)     │◄────────────►│   (Python)          │
│  Supabase Edge    │              │  FastAPI            │
│  Functions        │              │  TensorFlow         │
└───────────────────┘              │  OpenCV             │
        │                          │  face_recognition   │
        │                          └─────────────────────┘
        ▼                                      │
┌───────────────────┐                         │
│  PostgreSQL       │◄────────────────────────┘
│  (Supabase)       │
└───────────────────┘
```

**Voir** : [Architecture détaillée](/docs/ARCHITECTURE.md)

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** 18+
- **Python** 3.11+ (pour backend ML)
- **npm** ou **yarn**
- **Docker** (optionnel, pour backend ML)

### Installation Frontend

```bash
# Cloner le projet
git clone https://github.com/votre-org/twoinone.git
cd twoinone

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env

# Configurer les API Keys
nano .env

# Démarrer l'application
npm run dev
```

L'application sera disponible sur **http://localhost:5173**

### Installation Backend ML Python

```bash
cd backend-ml-python

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer l'environnement
cp .env.example .env
nano .env

# Démarrer le serveur
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Le backend ML sera disponible sur **http://localhost:8000**

**Documentation complète** : [Configuration](/docs/CONFIGURATION_COMPLETE.md)

---

## ⚙️ Configuration

### 1. Google Maps API

Créer une clé API Google Maps :

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un projet
3. Activer **Maps JavaScript API**
4. Créer une clé API
5. Restreindre la clé (domaines + APIs)

Ajouter dans `.env` :

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...votre-cle
```

**Guide détaillé** : [Google Maps Configuration](/docs/GOOGLE_MAPS_CONFIGURATION.md)

---

### 2. Backend ML Python

Ajouter l'URL du backend dans `.env` :

```env
VITE_ML_API_URL=http://localhost:8000
# OU en production :
VITE_ML_API_URL=https://votre-ml-api.onrender.com
```

---

### 3. Supabase (Automatique)

Les variables Supabase sont déjà configurées via Figma Make :

```env
# Automatiquement configurées :
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## 📱 Installation PWA

### Sur Android

1. Ouvrir l'app dans **Chrome**
2. Menu **⋮** → **"Ajouter à l'écran d'accueil"**
3. L'icône TwoInOne apparaît sur votre écran d'accueil

### Sur iOS

1. Ouvrir dans **Safari**
2. Bouton **Partager** (□↑) → **"Sur l'écran d'accueil"**
3. L'app s'installe comme une app native

### Sur Desktop

1. **Chrome/Edge** : Icône d'installation dans la barre d'adresse
2. Cliquer sur l'icône → **"Installer"**
3. L'app s'ouvre dans sa propre fenêtre

**Guide complet** : [Installation PWA](/docs/PWA_INSTALLATION_GUIDE.md)

---

## 📚 Documentation

### Guides Utilisateur

- [Guide PWA](/docs/PWA_GUIDE.md) - Fonctionnalités PWA compl��tes
- [Installation PWA](/docs/PWA_INSTALLATION_GUIDE.md) - Installer sur tous les appareils
- [Utilisation de l'app](#) - Guide utilisateur final (à venir)

### Guides Technique

- [Architecture](/docs/ARCHITECTURE.md) - Architecture microservices complète
- [Configuration Complète](/docs/CONFIGURATION_COMPLETE.md) - Setup de A à Z
- [Google Maps Configuration](/docs/GOOGLE_MAPS_CONFIGURATION.md) - Setup Google Maps
- [Backend ML Python](/backend-ml-python/README_DETAILLE.md) - Documentation IA

### API Documentation

- **Backend TypeScript** : Routes Supabase Edge Functions
- **Backend ML Python** : http://localhost:8000/docs (Swagger UI)

---

## 🧪 Tests

### Frontend

```bash
npm run test          # Tests unitaires (à implémenter)
npm run test:e2e      # Tests E2E (à implémenter)
npm run lint          # Linter
```

### Backend ML Python

```bash
cd backend-ml-python

# Tests automatisés
python test_ml_api.py

# Tests manuels
curl http://localhost:8000/ml/health
```

---

## 🚢 Déploiement

### Frontend → Vercel

```bash
# Connecter GitHub à Vercel
# https://vercel.com/new

# Variables d'environnement à configurer :
VITE_GOOGLE_MAPS_API_KEY=...
VITE_ML_API_URL=https://ml-api.onrender.com
```

**URL** : `https://twoinone.vercel.app`

---

### Backend ML → Render.com

1. **Créer un Web Service** sur [render.com](https://render.com)
2. **Connecter** votre repo GitHub
3. **Environment** : Docker
4. **Variables d'environnement** :
   ```
   DATABASE_URL=...
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   ```
5. **Deploy** !

**URL** : `https://twoinone-ml.onrender.com`

---

### Backend TypeScript → Supabase

Déployé automatiquement via **Supabase Edge Functions**.

**URL** : `https://{project}.supabase.co/functions/v1/make-server-643544a8`

---

## 🛠️ Technologies Utilisées

### Frontend

| Technologie | Version | Usage |
|-------------|---------|-------|
| **React** | 18.2 | Framework UI |
| **TypeScript** | 5.0 | Typage statique |
| **Vite** | 5.0 | Build tool |
| **Tailwind CSS** | 4.0 | Styling |
| **shadcn/ui** | - | Composants UI |
| **React Router** | 6.0 | Routing |
| **date-fns** | 3.0 | Manipulation dates |
| **Sonner** | - | Notifications toast |
| **Lucide React** | - | Icônes |
| **@react-google-maps/api** | - | Google Maps |

### Backend TypeScript

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Deno** | - | Runtime |
| **Hono** | - | Framework web |
| **Supabase** | - | Auth + Database |
| **PostgreSQL** | - | Base de données |

### Backend ML Python

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Python** | 3.11 | Language |
| **FastAPI** | 0.109 | Framework web |
| **face_recognition** | 1.3.0 | Reconnaissance faciale |
| **OpenCV** | 4.9.0 | Traitement d'images |
| **NumPy** | 1.26 | Calculs scientifiques |
| **Uvicorn** | 0.27 | Serveur ASGI |
| **Pillow** | 10.2 | Manipulation d'images |

---

## 🔮 Roadmap

### ✅ Complétées

- [x] Interface utilisateur et admin
- [x] Authentification Supabase
- [x] Validation biométrique (empreinte + faciale)
- [x] QR Code Scanner
- [x] Gestion des présences/absences
- [x] Travail en binôme
- [x] Réaffectation de binôme
- [x] Backend TypeScript complet
- [x] Backend ML Python (reconnaissance faciale)
- [x] Google Maps intégré
- [x] PWA complète (offline, installable)
- [x] Documentation complète

### 🚧 En cours

- [ ] Notifications push (PWA)
- [ ] Tests E2E (Cypress)
- [ ] CI/CD (GitHub Actions)

### 🔜 Prochainement

- [ ] Détection de liveness (anti-spoofing)
- [ ] Détection d'anomalies ML
- [ ] Prédictions d'absences ML
- [ ] Export PDF des rapports
- [ ] Géofencing automatique
- [ ] App mobile native (React Native)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. **Créer une branche** : `git checkout -b feature/amelioration`
3. **Commit** : `git commit -m "Ajout fonctionnalité X"`
4. **Push** : `git push origin feature/amelioration`
5. **Pull Request**

### Code de Conduite

- Respecter les conventions de code (ESLint + Prettier)
- Écrire des tests pour les nouvelles fonctionnalités
- Documenter les changements importants
- Être respectueux dans les discussions

---

## 🐛 Signaler un Bug

Trouvé un bug ? [Créer une issue](https://github.com/votre-org/twoinone/issues)

Inclure :
- Description du bug
- Étapes pour reproduire
- Comportement attendu
- Screenshots (si applicable)
- Environnement (navigateur, OS, version)

---

## 📄 Licence

**Propriétaire** - TwoInOne © 2026

Tous droits réservés.

---

## 💬 Support

Besoin d'aide ?

- 📧 **Email** : support@twoinone.app
- 💬 **Discord** : [discord.gg/twoinone](https://discord.gg/twoinone)
- 📖 **Documentation** : [docs.twoinone.app](https://docs.twoinone.app)
- 🐛 **Issues** : [github.com/twoinone/issues](https://github.com/twoinone/issues)

---

## 🙏 Remerciements

- [Supabase](https://supabase.com/) - Backend as a Service
- [Google Maps](https://developers.google.com/maps) - API de cartographie
- [face_recognition](https://github.com/ageitgey/face_recognition) - Bibliothèque ML
- [FastAPI](https://fastapi.tiangolo.com/) - Framework Python
- [shadcn/ui](https://ui.shadcn.com/) - Composants UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS

---

## ⭐ Star History

Si ce projet vous a aidé, n'hésitez pas à lui donner une ⭐ !

---

<div align="center">

**Développé avec ❤️ par l'équipe TwoInOne**

[Website](https://twoinone.app) • [Documentation](https://docs.twoinone.app) • [Support](mailto:support@twoinone.app)

</div>