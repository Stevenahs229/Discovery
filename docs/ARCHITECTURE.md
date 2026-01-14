# 🏗️ Architecture TwoInOne - Documentation Technique

## Vue d'ensemble

TwoInOne est une **application PWA** de gestion de présence avec **biométrie avancée** utilisant une **architecture microservices**.

```
┌────────────────────────────────────────────────────────────────┐
│                      FRONTEND PWA                              │
│           React 18 + TypeScript + Tailwind CSS                 │
│                                                                 │
│  Features:                                                      │
│  • Interface Utilisateur (déclaration présence/absence)        │
│  • Interface Admin (gestion sites, agents, rapports)           │
│  • Biométrie: Empreinte digitale + Reconnaissance faciale      │
│  • QR Code Scanner                                             │
│  • Google Maps intégré                                         │
│  • Mode Hors Ligne (Service Worker)                           │
│  • Installable sur smartphone (PWA)                            │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌───────────────────────────┐
│   BACKEND API (Node)    │     │  BACKEND ML (Python)      │
│   TypeScript + Deno     │◄───►│  FastAPI + TensorFlow     │
│                         │     │                           │
│  Routes:                │     │  Endpoints:               │
│  • Auth (Supabase)      │     │  • /ml/enroll-face        │
│  • CRUD Présences       │     │  • /ml/verify-face        │
│  • CRUD Absences        │     │  • /ml/users-enrolled     │
│  • Réaffectation binôme │     │  • /ml/detect-anomalies   │
│  • Gestion sites        │     │  • /ml/predict-absence    │
│  • API Google Maps      │     │                           │
│  • Historiques          │     │  Technologies:            │
│                         │     │  • face_recognition       │
│  Technologies:          │     │  • OpenCV                 │
│  • Hono (framework)     │     │  • NumPy/Pandas           │
│  • Supabase Edge Func   │     │  • scikit-learn           │
│  • KV Store             │     │  • PyTorch (futur)        │
└─────────────────────────┘     └───────────────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
                  ┌───────────────────────┐
                  │  BASE DE DONNÉES      │
                  │  PostgreSQL           │
                  │  (Supabase)           │
                  │                       │
                  │  Tables:              │
                  │  • kv_store (clé/val) │
                  │  • auth.users         │
                  │  • storage.objects    │
                  └───────────────────────┘
```

---

## 📁 Structure des Fichiers

```
twoinone/
│
├── src/                          # Frontend React
│   ├── app/
│   │   ├── App.tsx              # App principale (utilisateur)
│   │   ├── AdminApp.tsx         # Interface admin
│   │   └── components/
│   │       ├── Accueil.tsx      # Écran d'accueil
│   │       ├── ValidationPresence.tsx  # Validation présence
│   │       ├── BiometricChoice.tsx     # Choix biométrique (NEW)
│   │       ├── Absence.tsx      # Déclaration absence (UPDATED)
│   │       ├── QRCodeScanner.tsx
│   │       ├── Header.tsx
│   │       ├── PWAInstallPrompt.tsx
│   │       ├── PWAWelcomeModal.tsx
│   │       └── admin/
│   │           ├── GestionSites.tsx
│   │           ├── GoogleMapsView.tsx  # Carte Google Maps (UPDATED)
│   │           └── ...
│   │
│   ├── lib/
│   │   ├── supabase.ts          # API Backend TypeScript (UPDATED)
│   │   └── ml-api.ts            # API Backend Python ML (NEW)
│   │
│   ├── styles/
│   │   ├── theme.css
│   │   └── fonts.css
│   │
│   └── utils/
│       └── supabase/
│           └── info.tsx         # Configuration Supabase
│
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx        # Backend API principal (UPDATED)
│           └── kv_store.tsx     # KV Store (protected)
│
├── backend-ml-python/           # Backend ML Python (NEW)
│   ├── main.py                  # FastAPI app
│   ├── requirements.txt         # Dépendances Python
│   ├── Dockerfile              # Conteneurisation
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── test_ml_api.py          # Tests automatisés
│   ├── README.md
│   └── README_DETAILLE.md
│
├── public/
│   ├── manifest.json            # PWA Manifest
│   ├── sw.js                    # Service Worker
│   ├── icons/                   # Icônes PWA
│   └── index.html
│
├── docs/                        # Documentation (NEW)
│   ├── PWA_GUIDE.md
│   ├── PWA_INSTALLATION_GUIDE.md
│   ├── CONFIGURATION_COMPLETE.md
│   ├── GOOGLE_MAPS_CONFIGURATION.md
│   └── ARCHITECTURE.md          # Ce fichier
│
├── .env.example                 # Variables d'environnement
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

---

## 🔄 Flux de Données

### 1. Déclaration de Présence avec Biométrie

```
┌──────────────┐
│ Utilisateur  │
│  ouvre app   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ Choix méthode biométrique│
│ • Empreinte digitale     │
│ • Reconnaissance faciale │
└──────┬───────────────────┘
       │
       ├─ Si Empreinte ──────────────────┐
       │                                  │
       │  1. Simulation empreinte         │
       │  2. Validation (1.5s)            │
       │  3. ✓ Validé                     │
       │                                  │
       └─ Si Facial ─────────────────────┤
                                          │
          1. Activer caméra               │
          2. Capturer photo               │
          3. POST /ml/verify-face         │
          4. Backend ML Python analyse    │
          5. Vérification identité        │
          6. ✓ Validé si reconnu          │
                                          │
       ┌──────────────────────────────────┘
       │
       ▼
┌──────────────────┐
│ Génération QR    │
│ Code unique      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Scan QR Code     │
│ (binôme)         │
└──────┬───────────┘
       │
       ▼
┌──────────────────────────┐
│ POST /presence           │
│ Backend TypeScript       │
│ • Enregistre KV Store    │
│ • Update status today    │
└──────┬───────────────────┘
       │
       ▼
┌──────────────┐
│ ✓ Présence   │
│   validée    │
└──────────────┘
```

---

### 2. Déclaration d'Absence avec Réaffectation

```
┌──────────────┐
│ Utilisateur  │
│  déclare     │
│  absence     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│ Formulaire Absence           │
│ • Motif                      │
│ • Date début/fin             │
│ • Commentaire                │
│ ☑ Réaffecter mon binôme ?    │
└──────┬───────────────────────┘
       │
       │ Si réaffectation cochée
       ▼
┌──────────────────────────────┐
│ GET /agents/available        │
│ Backend TypeScript           │
│ • Récupère liste agents      │
│ • Filtre agent actuel        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Sélection nouveau binôme     │
│ (dropdown)                   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ POST /absence                │
│ Body: {                      │
│   motif,                     │
│   dateDebut,                 │
│   dateFin,                   │
│   nouveauBinomeId (opt)      │
│ }                            │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Backend TypeScript           │
│ • Enregistre absence         │
│ • Si réaffectation:          │
│   - Crée binome:reassignment │
│   - Notifie ancien binôme    │
│   - Notifie nouveau binôme   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────┐
│ ✓ Absence    │
│   déclarée   │
└──────────────┘
```

---

### 3. Affichage Carte Google Maps

```
┌──────────────┐
│  Admin       │
│  accède      │
│  sites       │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│ Composant GestionSites       │
│ • Liste sites                │
│ • Carte Google Maps          │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ GoogleMapsView.tsx           │
│ • Charge API Key depuis env  │
│ • LoadScript                 │
│ • GoogleMap component        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Google Maps JavaScript API   │
│ • Charge carte interactive   │
│ • Affiche markers            │
│ • Calcule centre/zoom        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────┐
│ ✓ Carte      │
│   affichée   │
└──────────────┘
```

---

## 🔐 Authentification et Sécurité

### Flow d'authentification

```
┌──────────────┐
│ Utilisateur  │
│  login       │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│ POST /signup (si nouveau)    │
│ Supabase Auth                │
│ • Créer user                 │
│ • Email confirmé auto        │
│ • Enregistrer métadonnées KV │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ supabase.auth               │
│  .signInWithPassword()       │
│ • Vérifier credentials       │
│ • Générer JWT access_token   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Frontend stocke token        │
│ localStorage / sessionStorage│
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Toutes requêtes API:         │
│ Authorization: Bearer TOKEN  │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Backend vérifie JWT          │
│ getAuthenticatedUser()       │
│ • Décode token               │
│ • Vérifie signature          │
│ • Extrait user.id            │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────┐
│ ✓ Requête    │
│   autorisée  │
└──────────────┘
```

---

## 🗄️ Modèle de Données (KV Store)

### Structure des clés

```javascript
// Utilisateurs
"user:{userId}" → {
  nom: string,
  prenom: string,
  email: string,
  telephone: string,
  binome: string,
  createdAt: ISO datetime
}

// Présences
"presence:{userId}:{date}" → {
  userId: string,
  date: ISO datetime,
  validationType: 'biometric' | 'qr_biometric' | 'alternative',
  status: 'present'
}

// Statut du jour
"status:{userId}:today" → {
  status: 'present' | 'absent' | 'not_declared',
  timestamp: ISO datetime,
  motif?: string  // si absent
}

// Absences
"absence:{userId}:{timestamp}" → {
  userId: string,
  motif: string,
  dateDebut: ISO datetime,
  dateFin: ISO datetime,
  commentaire: string,
  nouveauBinomeId?: string,  // si réaffectation
  createdAt: ISO datetime
}

// Réaffectations de binôme
"binome:reassignment:{ancienBinome}:{timestamp}" → {
  ancienPartenaire: string,
  nouveauPartenaire: string,
  dateDebut: ISO datetime,
  dateFin: ISO datetime,
  raison: string,
  createdAt: ISO datetime
}

// Encodages faciaux (backend ML Python - mémoire)
// En production: stocker dans PostgreSQL
{userId}: [encoding1, encoding2, ...]
```

---

## 🌐 APIs Externes

### 1. Google Maps JavaScript API

**Usage** :
- Affichage carte interactive
- Markers des sites
- Géocodage (adresse → coordonnées)
- Calcul distances/itinéraires

**Configuration** :
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
```

**Quota gratuit** :
- 28 000 chargements de carte / mois
- 40 000 géocodages / mois

---

### 2. Supabase APIs

**Auth API** :
- Authentification utilisateurs
- Gestion sessions JWT
- OAuth (optionnel)

**Storage API** (futur) :
- Stockage photos agents
- Stockage documents

**Database API** :
- PostgreSQL via KV Store
- Requêtes REST

---

### 3. Backend ML Python (Interne)

**Endpoints** :
```
POST /ml/enroll-face          # Enregistrer visage
POST /ml/verify-face          # Vérifier identité
GET  /ml/users-enrolled       # Liste utilisateurs
DELETE /ml/delete-face/:id    # Supprimer enregistrement
POST /ml/detect-anomalies     # Détection anomalies (futur)
POST /ml/predict-absence      # Prédictions (futur)
```

---

## 🚀 Déploiement

### Frontend (Vercel)

```bash
# GitHub → Vercel auto-deploy
# Variables d'environnement :
VITE_GOOGLE_MAPS_API_KEY=...
VITE_ML_API_URL=https://ml-api.onrender.com
```

**URL** : `https://twoinone.vercel.app`

---

### Backend TypeScript (Supabase)

Déployé automatiquement via **Supabase Edge Functions**.

**URL** : `https://{project}.supabase.co/functions/v1/make-server-643544a8`

---

### Backend ML Python (Render.com)

```bash
# Docker auto-deploy depuis GitHub
# Variables d'environnement :
DATABASE_URL=postgresql://...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

**URL** : `https://twoinone-ml.onrender.com`

---

## 📊 Monitoring et Logs

### Frontend

- **Console navigateur** : Logs React
- **Sentry** (optionnel) : Crash reporting
- **Google Analytics** (optionnel) : Usage stats

### Backend TypeScript

```typescript
// Logs automatiques via Hono logger
app.use('*', logger(console.log));

// Console Supabase : voir les logs en temps réel
```

### Backend ML Python

```python
# Logs structurés avec logging
import logging
logger = logging.getLogger(__name__)
logger.info("Action effectuée")
logger.error("Erreur détectée")

# Voir logs :
docker logs -f twoinone-ml
```

---

## 🧪 Tests

### Frontend

```bash
npm run test                # Tests unitaires (à implémenter)
npm run test:e2e            # Tests E2E Cypress (à implémenter)
```

### Backend TypeScript

Tests manuels via API :
```bash
curl https://.../make-server-643544a8/profile \
  -H "Authorization: Bearer TOKEN"
```

### Backend ML Python

```bash
cd backend-ml-python
python test_ml_api.py       # Tests automatisés
```

---

## 🔮 Fonctionnalités Futures

### Court Terme (1-2 mois)

- [ ] **Notifications Push** (PWA)
- [ ] **Mode Hors Ligne complet** (sync différée)
- [ ] **Rapports PDF** générés
- [ ] **Export Excel** des présences
- [ ] **Graphiques statistiques** avancés

### Moyen Terme (3-6 mois)

- [ ] **Détection de liveness** (anti-spoofing facial)
- [ ] **Reconnaissance vocale** (biométrie voix)
- [ ] **Géofencing** (validation auto si dans zone)
- [ ] **API mobile native** (React Native)
- [ ] **Intégration Slack/Teams** (notifications)

### Long Terme (6-12 mois)

- [ ] **Détection d'anomalies ML** (patterns suspects)
- [ ] **Prédictions absences** (ML)
- [ ] **Planification automatique** des binômes
- [ ] **Analyse comportementale** IA
- [ ] **Multi-tenancy** (plusieurs entreprises)

---

## 📚 Documentation Complète

- [Guide PWA](/docs/PWA_GUIDE.md)
- [Installation PWA](/docs/PWA_INSTALLATION_GUIDE.md)
- [Configuration Complète](/docs/CONFIGURATION_COMPLETE.md)
- [Google Maps Setup](/docs/GOOGLE_MAPS_CONFIGURATION.md)
- [Backend ML README](/backend-ml-python/README_DETAILLE.md)

---

## 🤝 Contribution

Pour contribuer au projet :

1. **Fork** le repo
2. **Créer une branche** : `git checkout -b feature/nom`
3. **Commit** : `git commit -m "Description"`
4. **Push** : `git push origin feature/nom`
5. **Pull Request**

---

## 📄 Licence

**Propriétaire** - TwoInOne © 2026

Tous droits réservés.

---

## 💬 Support

- 📧 Email : support@twoinone.app
- 💬 Discord : [discord.gg/twoinone](https://discord.gg/twoinone)
- 📖 Docs : [docs.twoinone.app](https://docs.twoinone.app)
- 🐛 Issues : [github.com/twoinone/issues](https://github.com/twoinone/issues)

---

**TwoInOne** - Application de Présence Sécurisée avec IA 🚀✨
