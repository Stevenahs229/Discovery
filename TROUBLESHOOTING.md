# 🔧 Guide de Dépannage - TwoInOne

Ce guide vous aide à résoudre les problèmes courants lors de l'installation et du lancement de l'application.

## 🚨 Erreur : "Failed to resolve import react/jsx-dev-runtime"

### Cause
Vite ne trouve pas les fichiers JSX runtime de React.

### Solution 1 : Réinstallation complète (Recommandée)

#### Linux/Mac :
```bash
# Utiliser le script d'installation
bash install.sh
```

#### Windows :
```batch
REM Utiliser le script d'installation
install.bat
```

#### Ou manuellement :
```bash
# 1. Nettoyer
rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml .vite

# 2. Réinstaller avec --legacy-peer-deps
npm install --legacy-peer-deps

# 3. Vérifier l'installation
npm run verify

# 4. Lancer
npm run dev
```

### Solution 2 : Vérifier la configuration Vite

Vérifiez que `vite.config.ts` contient bien :

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    'react/jsx-dev-runtime': path.resolve(__dirname, './node_modules/react/jsx-dev-runtime.js'),
    'react/jsx-runtime': path.resolve(__dirname, './node_modules/react/jsx-runtime.js'),
    'react': path.resolve(__dirname, './node_modules/react'),
    'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
  },
},
```

### Solution 3 : Forcer la réinstallation de React

```bash
# Supprimer React et React-DOM
npm uninstall react react-dom

# Réinstaller avec la bonne version
npm install react@18.3.1 react-dom@18.3.1 --legacy-peer-deps
```

---

## 🚨 Erreur : "Cannot find module '@vitejs/plugin-react'"

### Solution

```bash
npm install @vitejs/plugin-react --legacy-peer-deps --save-dev
```

---

## 🚨 Erreur : Peer dependencies conflicts

### Solution

Le fichier `.npmrc` est configuré pour gérer automatiquement ces conflits.

Si le problème persiste :

```bash
# Vérifier que .npmrc existe
cat .npmrc

# Si absent, créer le fichier
echo "legacy-peer-deps=true" > .npmrc
echo "auto-install-peers=true" >> .npmrc

# Puis réinstaller
rm -rf node_modules package-lock.json
npm install
```

---

## 🚨 Erreur : "Port 5173 is already in use"

### Solution

#### Option 1 : Changer de port
```bash
npm run dev -- --port 3000
```

#### Option 2 : Tuer le processus
```bash
# Linux/Mac
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## 🚨 Erreur : "Module not found: Can't resolve '@/...'"

### Cause
L'alias `@` n'est pas reconnu.

### Solution

1. Vérifier `vite.config.ts` :
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

2. Vérifier `tsconfig.json` :
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

3. Redémarrer le serveur :
```bash
# Ctrl+C pour arrêter
npm run dev
```

---

## 🚨 Cache Vite corrompu

### Solution

```bash
# Supprimer le cache Vite
rm -rf .vite

# Relancer
npm run dev
```

---

## 🚨 Erreur de TypeScript

### Solution 1 : Vérifier tsconfig.json

Assurez-vous que `tsconfig.json` contient :

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

### Solution 2 : Ignorer les erreurs TS temporairement

Dans `vite.config.ts`, ajoutez :

```typescript
esbuild: {
  jsx: 'automatic',
  logOverride: { 'this-is-undefined-in-esm': 'silent' }
}
```

---

## 🚨 Google Maps ne s'affiche pas

### Cause
Clé API manquante ou invalide.

### Solution

La clé Google Maps est configurée dans le secret Supabase `GOOGLE_MAPS_API_KEY`.

Pour l'utiliser localement, vérifiez que la variable est bien accessible.

---

## 🚨 Problèmes avec Supabase

### Solution

Vérifiez les clés dans `/utils/supabase/info.tsx` :

```typescript
export const projectId = "your-project-id";
export const publicAnonKey = "your-anon-key";
```

Les secrets Supabase doivent être configurés dans l'environnement.

---

## 🔍 Diagnostic Automatique

Utilisez le script de vérification :

```bash
npm run verify
```

Ce script vérifie :
- ✅ Présence des fichiers essentiels
- ✅ Installation de node_modules
- ✅ Présence de React et React-DOM
- ✅ Configuration Vite
- ✅ Scripts package.json

---

## 📞 Aide Supplémentaire

Si aucune de ces solutions ne fonctionne :

1. **Nettoyage complet** :
```bash
rm -rf node_modules package-lock.json .vite
npm cache clean --force
npm install --legacy-peer-deps
```

2. **Vérifier la version de Node.js** :
```bash
node -v
# Doit être >= 18.0.0
```

3. **Vérifier la version de npm** :
```bash
npm -v
# Doit être >= 8.0.0
```

4. **Réinstallation de Node.js** (si nécessaire) :
   - Télécharger depuis https://nodejs.org
   - Version LTS recommandée

---

## ✅ Check-list Finale

Avant de lancer `npm run dev`, vérifiez :

- [ ] Node.js >= 18.0.0 installé
- [ ] npm >= 8.0.0 installé
- [ ] `node_modules/` existe
- [ ] `node_modules/react` existe
- [ ] `node_modules/react-dom` existe
- [ ] `vite.config.ts` configuré avec les alias
- [ ] `tsconfig.json` existe
- [ ] `.npmrc` existe avec `legacy-peer-deps=true`
- [ ] `index.html` existe
- [ ] `src/main.tsx` existe
- [ ] `src/app/App.tsx` existe

---

## 🎯 Commandes Utiles

```bash
# Vérifier l'installation
npm run verify

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Lancer en mode développement
npm run dev

# Builder pour la production
npm run build

# Prévisualiser le build
npm run preview

# Nettoyer le cache npm
npm cache clean --force
```
