# ⚡ Guide de Démarrage Rapide - TwoInOne

## 🎯 Installation en 3 étapes

### Étape 1 : Installation des dépendances

#### Option A : Utiliser le script d'installation (Recommandé)

**Linux/Mac :**
```bash
bash install.sh
```

**Windows :**
```batch
install.bat
```

#### Option B : Installation manuelle

```bash
# Nettoyer (si nécessaire)
rm -rf node_modules package-lock.json .vite

# Installer les dépendances
npm install --legacy-peer-deps
```

### Étape 2 : Vérifier l'installation

```bash
npm run verify
```

✅ Si tout est OK, passez à l'étape 3
❌ Si des erreurs apparaissent, consultez [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Étape 3 : Lancer l'application

```bash
npm run dev
```

🎉 Ouvrez votre navigateur sur **http://localhost:5173**

---

## 🚀 Commandes Principales

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile pour la production |
| `npm run preview` | Prévisualise le build de production |
| `npm run verify` | Vérifie que tout est correctement installé |

---

## 📱 Utilisation de l'Application

### Interface Utilisateur

1. **Onboarding** - Présentation de l'app
2. **Inscription** - Créer un compte
3. **Connexion** - Se connecter
4. **Biométrie** - Validation biométrique (simulée)
5. **Scan QR Code** - Scanner le code du site
6. **Validation OTP** - Entrer le code (test: **999999**)
7. **Déclaration d'absence** - Déclarer son absence ou celle du binôme

### Interface Admin

1. Cliquez sur **"Mode Utilisateur"** en bas de la sidebar (desktop) ou dans le menu (mobile)
2. Accédez au dashboard avec les statistiques
3. Gérez les agents, les sites et consultez les anomalies

---

## 🔑 Codes de Test

- **OTP** : `999999`
- **Binôme test** : Marie Dupont / Jean Martin

---

## 🎨 Fonctionnalités Clés

✅ **Biométrie** avant scan QR code  
✅ **Validation en binôme** obligatoire  
✅ **Déclaration d'absence** du partenaire  
✅ **Google Maps** pour visualiser les sites  
✅ **Détection d'anomalies IA**  
✅ **Interface responsive**  
✅ **Mode clair uniquement**  

---

## 🛠️ Structure du Projet

```
TwoInOne/
├── src/
│   ├── app/
│   │   ├── App.tsx              # App principale (utilisateur)
│   │   ├── AdminApp.tsx         # Interface admin
│   │   └── components/          # Composants React
│   ├── lib/
│   │   └── supabase.ts          # Client Supabase
│   ├── styles/                  # Styles CSS
│   └── main.tsx                 # Point d'entrée
├── index.html                   # HTML principal
├── vite.config.ts              # Config Vite
├── tsconfig.json               # Config TypeScript
├── package.json                # Dépendances
├── .npmrc                      # Config npm
├── README.md                   # Documentation complète
├── TROUBLESHOOTING.md          # Guide de dépannage
└── QUICKSTART.md              # Ce fichier
```

---

## ❓ Problèmes Fréquents

### Erreur "react/jsx-dev-runtime not found"

**Solution rapide :**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

**Solution détaillée :** Voir [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Port 5173 déjà utilisé

```bash
npm run dev -- --port 3000
```

### Cache corrompu

```bash
rm -rf .vite
npm run dev
```

---

## 📚 Documentation

- **[README.md](./README.md)** - Documentation complète
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Guide de dépannage détaillé

---

## 🎯 Prochaines Étapes

1. ✅ Lancer l'application avec `npm run dev`
2. 📱 Tester l'interface utilisateur
3. 👨‍💼 Passer en mode admin
4. 🗺️ Vérifier Google Maps
5. 🔍 Tester la détection d'anomalies

---

## 💡 Conseils

- Utilisez **Chrome** ou **Firefox** pour une meilleure expérience
- Activez les **DevTools** pour voir les logs
- Le code OTP de test est **999999**
- Les données sont stockées en mémoire (mock data)

---

**Besoin d'aide ?** Consultez [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
