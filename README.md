# TwoInOne - Application de Présence Sécurisée

Application de gestion de présence avec validation biométrique et système de binôme obligatoire.

## 📖 Documentation

- **[DOCS_INDEX.md](./DOCS_INDEX.md)** - 📚 Index de toute la documentation (COMMENCER ICI)
- **[QUICKSTART.md](./QUICKSTART.md)** - ⚡ Guide de démarrage rapide (3 étapes)
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - 🔧 Guide de dépannage détaillé
- **[CONFIGURATION_SUMMARY.md](./CONFIGURATION_SUMMARY.md)** - ⚙️ Résumé de configuration technique
- **[VERSION.md](./VERSION.md)** - 📌 Changelog et notes de version
- **README.md** - 📚 Documentation complète (ce fichier)

## 🚀 Installation et Démarrage

### Méthode Rapide (Recommandée)

**Linux/Mac :**
```bash
bash install.sh
```

**Windows :**
```batch
install.bat
```

### Méthode Manuelle

#### Étape 1 : Nettoyer et réinstaller les dépendances

```bash
# Supprimer node_modules et les fichiers de verrouillage
rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml

# Réinstaller toutes les dépendances
npm install --legacy-peer-deps
```

#### Étape 2 : Vérifier l'installation

```bash
npm run verify
```

#### Étape 3 : Lancer l'application en mode développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

#### Étape 4 : Builder pour la production

```bash
npm run build
```

#### Étape 5 : Prévisualiser le build de production

```bash
npm run preview
```

## 🔧 Configuration

### Fichiers de configuration importants :

- **vite.config.ts** : Configuration Vite avec React et Tailwind CSS
- **tsconfig.json** : Configuration TypeScript
- **package.json** : Dépendances et scripts

### Variables d'environnement Supabase

Les clés Supabase sont déjà configurées dans `/utils/supabase/info.tsx`

## 📱 Fonctionnalités

### Interface Utilisateur
- ✅ Onboarding et inscription
- ✅ Connexion avec email/mot de passe
- ✅ Validation biométrique avant scan QR code
- ✅ Scan de QR code pour pointage
- ✅ Validation OTP (code test : **999999**)
- ✅ Déclaration d'absence
- ✅ Déclaration d'absence du binôme

### Interface Administrateur
- ✅ Dashboard avec statistiques
- ✅ Gestion des agents
- ✅ Gestion des sites avec Google Maps
- ✅ Détection d'anomalies par IA
- ✅ Interface responsive
- ✅ Mode clair uniquement

## 🛠️ Technologies Utilisées

- **React 18.3.1** - Framework UI
- **TypeScript** - Typage statique
- **Vite 6.3.5** - Build tool
- **Tailwind CSS 4.1.12** - Framework CSS
- **Supabase** - Backend (Auth, Database, Storage)
- **Google Maps API** - Visualisation des sites
- **Radix UI** - Composants UI
- **Recharts** - Graphiques
- **QR Scanner** - Scan de QR codes
- **Date-fns** - Gestion des dates

## 📂 Structure du Projet

```
/
├── src/
│   ├── app/
│   │   ├── App.tsx                 # Application principale (mode utilisateur)
│   │   ├── AdminApp.tsx            # Interface administrateur
│   │   └── components/             # Composants React
│   │       ├── ui/                 # Composants UI réutilisables
│   │       ├── admin/              # Composants admin
│   │       └── ...                 # Autres composants
│   ├── lib/
│   │   └── supabase.ts             # Client Supabase
│   ├── styles/
│   │   ├── index.css               # Styles principaux
│   │   ├── theme.css               # Thème (mode clair)
│   │   └── fonts.css               # Polices
│   └── main.tsx                    # Point d'entrée
├── supabase/
│   └── functions/
│       └── server/                 # Edge Functions Supabase
├── utils/
│   └── supabase/
│       └── info.tsx                # Configuration Supabase
├── index.html                      # HTML principal
├── vite.config.ts                  # Configuration Vite
├── tsconfig.json                   # Configuration TypeScript
└── package.json                    # Dépendances

```

## 🐛 Résolution de Problèmes

### Erreur "Failed to resolve import react/jsx-dev-runtime"

Cette erreur est déjà résolue dans la configuration Vite. Si elle persiste :

```bash
# 1. Nettoyer complètement
rm -rf node_modules package-lock.json .vite

# 2. Réinstaller
npm install --legacy-peer-deps

# 3. Relancer
npm run dev
```

### Erreur de dépendances peer

Le fichier `.npmrc` est configuré pour gérer automatiquement les peer dependencies avec `legacy-peer-deps=true`.

## 📝 Notes Importantes

- **Code OTP de test** : Utilisez `999999` pour tester la validation OTP
- **Mode Admin** : Accessible via le bouton "Mode Utilisateur" en haut à droite
- **Google Maps** : Nécessite une clé API Google Maps (déjà configurée)
- **Supabase** : Les clés sont pré-configurées pour le développement

## 🔐 Sécurité

- Biométrie simulée (à remplacer par une vraie biométrie en production)
- Validation en binôme obligatoire
- OTP pour sécuriser les pointages
- Détection d'anomalies par IA
- Auth Supabase pour la gestion des utilisateurs

## 📄 Licence

Propriétaire - Tous droits réservés