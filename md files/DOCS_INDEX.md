# 📚 Index de la Documentation - TwoInOne

Bienvenue ! Ce fichier vous guide vers la bonne documentation selon vos besoins.

---

## 🎯 Vous voulez...

### ⚡ Démarrer rapidement l'application
→ **[QUICKSTART.md](./QUICKSTART.md)**

Installation en 3 étapes simples avec les scripts automatiques.

---

### 🔧 Résoudre une erreur
→ **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

Guide complet de dépannage avec solutions pour tous les problèmes courants :
- Erreur `react/jsx-dev-runtime`
- Conflits de peer dependencies
- Problèmes de port
- Cache corrompu
- Erreurs TypeScript

---

### 📖 Comprendre l'application
→ **[README.md](./README.md)**

Documentation complète incluant :
- Architecture du projet
- Technologies utilisées
- Fonctionnalités détaillées
- Notes de sécurité

---

### ⚙️ Comprendre la configuration
→ **[CONFIGURATION_SUMMARY.md](./CONFIGURATION_SUMMARY.md)**

Résumé technique de toute la configuration :
- Fichiers de configuration modifiés
- Raisons des changements
- Checklist de vérification
- État détaillé de la config

---

## 📋 Fichiers par Catégorie

### 🚀 Installation

| Fichier | Description | Plateforme |
|---------|-------------|------------|
| `install.sh` | Script d'installation automatique | Linux/Mac |
| `install.bat` | Script d'installation automatique | Windows |
| `verify.js` | Script de vérification de l'installation | Toutes |
| `.npmrc` | Configuration npm pour peer deps | Toutes |

### 📝 Documentation

| Fichier | Type | Pour qui ? |
|---------|------|-----------|
| `README.md` | Documentation complète | Tous |
| `QUICKSTART.md` | Guide démarrage rapide | Débutants |
| `TROUBLESHOOTING.md` | Guide de dépannage | Si problème |
| `CONFIGURATION_SUMMARY.md` | Résumé technique | Développeurs |
| `DOCS_INDEX.md` | Index (ce fichier) | Navigation |

### ⚙️ Configuration

| Fichier | Rôle |
|---------|------|
| `vite.config.ts` | Configuration Vite + React |
| `tsconfig.json` | Configuration TypeScript |
| `tsconfig.node.json` | Config TS pour fichiers config |
| `package.json` | Dépendances et scripts |
| `.gitignore` | Fichiers à ignorer Git |
| `.env.example` | Exemple variables env |

### 📱 Application

| Fichier | Rôle |
|---------|------|
| `index.html` | Point d'entrée HTML |
| `src/main.tsx` | Point d'entrée React |
| `src/app/App.tsx` | App principale (utilisateur) |
| `src/app/AdminApp.tsx` | Interface admin |
| `src/styles/theme.css` | Thème mode clair |

---

## 🎓 Parcours Recommandés

### 👨‍💻 Nouveau Développeur
1. **[QUICKSTART.md](./QUICKSTART.md)** - Installer et lancer
2. **[README.md](./README.md)** - Comprendre l'app
3. **[CONFIGURATION_SUMMARY.md](./CONFIGURATION_SUMMARY.md)** - Comprendre la config

### 🔧 Problème à Résoudre
1. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Trouver la solution
2. Si non résolu → `npm run verify`
3. Si toujours pas résolu → Réinstallation avec `install.sh`

### 📊 Audit Technique
1. **[CONFIGURATION_SUMMARY.md](./CONFIGURATION_SUMMARY.md)** - État de la config
2. **[README.md](./README.md)** - Architecture
3. Fichiers de config (`vite.config.ts`, `tsconfig.json`)

---

## 🔍 Recherche Rapide

### Erreurs Courantes

| Erreur | Solution Rapide | Voir |
|--------|----------------|------|
| `react/jsx-dev-runtime not found` | `npm install --legacy-peer-deps` | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#-erreur--failed-to-resolve-import-reactjsx-dev-runtime) |
| `Peer dependencies conflict` | Déjà configuré dans `.npmrc` | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#-erreur--peer-dependencies-conflicts) |
| `Port 5173 already in use` | `npm run dev -- --port 3000` | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#-erreur--port-5173-is-already-in-use) |
| `Module not found: @/...` | Alias déjà configuré, redémarrer | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#-erreur--module-not-found-cant-resolve-) |

### Commandes Essentielles

| Commande | Action | Détails |
|----------|--------|---------|
| `bash install.sh` | Installer tout | [QUICKSTART.md](./QUICKSTART.md#-installation-en-3-étapes) |
| `npm run verify` | Vérifier installation | [QUICKSTART.md](./QUICKSTART.md#étape-2--vérifier-linstallation) |
| `npm run dev` | Lancer en dev | [QUICKSTART.md](./QUICKSTART.md#étape-3--lancer-lapplication) |
| `npm run build` | Build production | [README.md](./README.md#-installation-et-démarrage) |

### Fonctionnalités

| Fonctionnalité | Emplacement Code | Documentation |
|----------------|-----------------|---------------|
| Biométrie | `src/app/components/ValidationPresence.tsx` | [README.md](./README.md#interface-utilisateur) |
| Scan QR Code | `src/app/components/QRCodeScanner.tsx` | [README.md](./README.md#interface-utilisateur) |
| OTP | `src/app/components/ValidationPresence.tsx` | [README.md](./README.md#-notes-importantes) |
| Google Maps | `src/app/components/admin/GoogleMapsView.tsx` | [README.md](./README.md#interface-administrateur) |
| Dashboard Admin | `src/app/components/admin/Dashboard.tsx` | [README.md](./README.md#interface-administrateur) |

---

## 💡 Conseils de Navigation

1. **Première visite** → Commencez par [QUICKSTART.md](./QUICKSTART.md)
2. **Problème** → Allez directement à [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. **Comprendre la config** → Lisez [CONFIGURATION_SUMMARY.md](./CONFIGURATION_SUMMARY.md)
4. **Documentation générale** → Consultez [README.md](./README.md)

---

## 🎯 Objectifs par Document

| Document | Objectif | Temps de lecture |
|----------|----------|-----------------|
| QUICKSTART.md | Lancer en 5 min | ⏱️ 3 min |
| TROUBLESHOOTING.md | Débloquer rapidement | ⏱️ 5-10 min |
| README.md | Vue d'ensemble | ⏱️ 10 min |
| CONFIGURATION_SUMMARY.md | Compréhension technique | ⏱️ 5 min |
| DOCS_INDEX.md | Navigation | ⏱️ 2 min |

---

## ❓ FAQ Documentation

**Q: Par où commencer ?**  
A: [QUICKSTART.md](./QUICKSTART.md) pour installer et lancer en 3 étapes.

**Q: J'ai une erreur, que faire ?**  
A: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) contient toutes les solutions.

**Q: Comment fonctionne la configuration Vite ?**  
A: [CONFIGURATION_SUMMARY.md](./CONFIGURATION_SUMMARY.md) explique tout en détail.

**Q: Où trouver les codes de test ?**  
A: [README.md](./README.md#-notes-importantes) - OTP: 999999

**Q: Comment vérifier que tout est OK ?**  
A: Lancez `npm run verify`

---

**Navigation rapide** :  
[⚡ Quickstart](./QUICKSTART.md) | [🔧 Dépannage](./TROUBLESHOOTING.md) | [📖 README](./README.md) | [⚙️ Config](./CONFIGURATION_SUMMARY.md)
