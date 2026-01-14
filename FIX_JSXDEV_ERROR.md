# 🔧 Fix: jsxDEV Export Error

## ❌ Erreur

```
SyntaxError: The requested module '/node_modules/.pnpm/react@18.3.1/node_modules/react/jsx-dev-runtime.js?v=81efb02d' 
does not provide an export named 'jsxDEV'
```

## ✅ Solution

Cette erreur est causée par une configuration incorrecte du plugin React dans Vite. 
Le problème a été corrigé dans `vite.config.ts`.

### Étapes pour Résoudre (3 commandes)

#### Méthode 1 : Script Automatique (Recommandé)

**Linux/Mac :**
```bash
bash clean.sh
npm install --legacy-peer-deps
npm run dev
```

**Windows :**
```batch
clean.bat
npm install --legacy-peer-deps
npm run dev
```

#### Méthode 2 : Manuelle

```bash
# 1. Nettoyer
rm -rf node_modules package-lock.json .vite
npm cache clean --force

# 2. Réinstaller
npm install --legacy-peer-deps

# 3. Lancer
npm run dev
```

#### Méthode 3 : Script npm

```bash
npm run clean
npm install --legacy-peer-deps
npm run dev
```

---

## 🔍 Explication Technique

### Avant (INCORRECT)

```typescript
// vite.config.ts - Version avec erreur
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react/jsx-dev-runtime': path.resolve(__dirname, './node_modules/react/jsx-dev-runtime.js'),
      'react/jsx-runtime': path.resolve(__dirname, './node_modules/react/jsx-runtime.js'),
    },
  },
})
```

**Problème :** Les alias interfèrent avec le plugin React de Vite qui gère automatiquement le JSX runtime.

### Après (CORRECT)

```typescript
// vite.config.ts - Version corrigée
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',  // ✅ Configuration explicite
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // Seulement l'alias @
    },
  },
})
```

**Solution :** Laisser le plugin React gérer automatiquement le JSX runtime sans alias personnalisés.

---

## ✅ Vérification

Après avoir suivi les étapes, vérifiez que tout fonctionne :

```bash
npm run verify
```

Si le script de vérification affiche des ✓ partout, c'est bon ! 🎉

---

## 🐛 Si l'Erreur Persiste

### 1. Vérifier la version de Node.js

```bash
node -v
# Doit être >= 18.0.0
```

Si < 18.0.0, mettez à jour Node.js : https://nodejs.org

### 2. Vérifier que React est bien installé

```bash
ls -la node_modules/react/jsx-dev-runtime.js
ls -la node_modules/react/jsx-runtime.js
```

Les deux fichiers doivent exister.

### 3. Supprimer TOUS les caches

```bash
# Cache npm
npm cache clean --force

# Cache Vite
rm -rf .vite

# Cache pnpm (si vous utilisez pnpm)
rm -rf node_modules/.cache

# Réinstaller
rm -rf node_modules
npm install --legacy-peer-deps
```

### 4. Vérifier le fichier vite.config.ts

```bash
cat vite.config.ts
```

Il doit contenir :
```typescript
react({
  jsxRuntime: 'automatic',
}),
```

### 5. Vérifier tsconfig.json

```bash
cat tsconfig.json | grep jsx
```

Doit afficher :
```json
"jsx": "react-jsx",
```

---

## 🎯 Causes Communes

| Cause | Solution |
|-------|----------|
| Alias React incorrects dans vite.config.ts | ✅ Corrigé - Suppression des alias |
| Plugin React mal configuré | ✅ Corrigé - `jsxRuntime: 'automatic'` |
| Cache Vite corrompu | Supprimer `.vite/` |
| Cache npm corrompu | `npm cache clean --force` |
| Mauvaise version de React | Réinstaller avec `--legacy-peer-deps` |
| node_modules corrompus | Supprimer et réinstaller |

---

## 📊 Checklist de Résolution

Cochez au fur et à mesure :

- [ ] J'ai exécuté `bash clean.sh` ou `clean.bat`
- [ ] J'ai réinstallé avec `npm install --legacy-peer-deps`
- [ ] Le fichier `vite.config.ts` contient `jsxRuntime: 'automatic'`
- [ ] Le fichier `tsconfig.json` contient `"jsx": "react-jsx"`
- [ ] `node_modules/react` existe
- [ ] `node_modules/react/jsx-dev-runtime.js` existe
- [ ] `node_modules/react/jsx-runtime.js` existe
- [ ] J'ai lancé `npm run dev`
- [ ] L'application démarre sans erreur

---

## 🚀 Commandes Rapides

```bash
# Solution Express (une seule ligne)
rm -rf node_modules package-lock.json .vite && npm cache clean --force && npm install --legacy-peer-deps && npm run dev

# Pour Windows (PowerShell)
Remove-Item -Recurse -Force node_modules, package-lock.json, .vite -ErrorAction SilentlyContinue; npm cache clean --force; npm install --legacy-peer-deps; npm run dev
```

---

## ✅ Résultat Attendu

Après avoir suivi ces étapes, vous devriez voir :

```
VITE v6.3.5  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

🎉 **Succès !** L'application est lancée.

---

## 📞 Support

Si le problème persiste après avoir suivi TOUTES ces étapes :

1. Vérifiez [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Lancez `npm run verify` pour diagnostiquer
3. Vérifiez que Node.js >= 18.0.0
4. Vérifiez que npm >= 8.0.0

---

**Dernière mise à jour :** 14 Janvier 2026  
**Statut :** ✅ Corrigé dans vite.config.ts
