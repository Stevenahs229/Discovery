# 🚀 COMMENCEZ ICI - TwoInOne

## ⚠️ ERREUR jsxDEV CORRIGÉE !

L'erreur que vous avez rencontrée :
```
SyntaxError: The requested module does not provide an export named 'jsxDEV'
```

**A été corrigée dans `vite.config.ts` !**

---

## 🎯 3 Commandes pour Lancer l'Application

### Option 1 : Script Automatique (RECOMMANDÉ) ⭐

#### Linux/Mac
```bash
bash clean.sh
npm install --legacy-peer-deps
npm run dev
```

#### Windows
```batch
clean.bat
npm install --legacy-peer-deps
npm run dev
```

### Option 2 : Commande Unique (Express)

```bash
rm -rf node_modules package-lock.json .vite && npm install --legacy-peer-deps && npm run dev
```

### Option 3 : Script d'Installation Complet

```bash
bash install.sh
npm run dev
```

---

## 📋 Ce Qui a Été Corrigé

### ✅ Avant/Après

| Avant (❌ Erreur) | Après (✅ Corrigé) |
|-------------------|-------------------|
| Alias React dans vite.config.ts | Plugin React configuré correctement |
| `react/jsx-dev-runtime` alias manuel | `jsxRuntime: 'automatic'` |
| Conflits avec le plugin React | Configuration standard Vite |

### 🔧 Fichiers Modifiés

1. **`vite.config.ts`** ✅
   - Suppression des alias React problématiques
   - Ajout de `jsxRuntime: 'automatic'`
   - Configuration standard Vite + React

2. **Scripts de Nettoyage Créés** ✅
   - `clean.sh` (Linux/Mac)
   - `clean.bat` (Windows)
   - `npm run clean` (multiplateforme)

3. **Documentation Mise à Jour** ✅
   - `FIX_JSXDEV_ERROR.md` - Guide détaillé de la correction
   - `START_HERE.md` - Ce fichier

---

## 🎓 Comprendre le Problème

### Pourquoi cette erreur ?

Le plugin `@vitejs/plugin-react` gère **automatiquement** le JSX runtime de React. Quand on ajoute des alias manuels pour `react/jsx-dev-runtime`, cela crée un conflit.

### La Solution

Laisser le plugin React gérer lui-même le JSX runtime :

```typescript
// ✅ CORRECT
plugins: [
  react({
    jsxRuntime: 'automatic',
  }),
]

// ❌ INCORRECT (ne pas faire)
resolve: {
  alias: {
    'react/jsx-dev-runtime': '...',  // Conflit !
  }
}
```

---

## 🚨 Si Vous Avez Encore des Erreurs

### Étape 1 : Nettoyage Complet

```bash
# Tout supprimer
rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml .vite

# Nettoyer le cache npm
npm cache clean --force

# Réinstaller
npm install --legacy-peer-deps
```

### Étape 2 : Vérifier la Configuration

```bash
# Vérifier vite.config.ts
cat vite.config.ts | grep -A 5 "react("

# Doit afficher :
# react({
#   jsxRuntime: 'automatic',
# }),
```

### Étape 3 : Diagnostic

```bash
npm run verify
```

---

## 📚 Documentation Complète

| Document | Quand l'utiliser |
|----------|-----------------|
| **[START_HERE.md](./START_HERE.md)** | 🎯 Commencer ici (ce fichier) |
| **[FIX_JSXDEV_ERROR.md](./FIX_JSXDEV_ERROR.md)** | 🔧 Comprendre l'erreur jsxDEV |
| **[QUICKSTART.md](./QUICKSTART.md)** | ⚡ Installation en 3 étapes |
| **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | 🐛 Résoudre d'autres erreurs |
| **[README.md](./README.md)** | 📖 Documentation complète |
| **[DOCS_INDEX.md](./DOCS_INDEX.md)** | 📚 Index de navigation |

---

## ✅ Checklist de Démarrage

Suivez dans l'ordre :

- [ ] **Étape 1** : Lire ce fichier (START_HERE.md)
- [ ] **Étape 2** : Nettoyer avec `bash clean.sh` ou `clean.bat`
- [ ] **Étape 3** : Installer avec `npm install --legacy-peer-deps`
- [ ] **Étape 4** : Vérifier avec `npm run verify` (optionnel)
- [ ] **Étape 5** : Lancer avec `npm run dev`
- [ ] **Étape 6** : Ouvrir http://localhost:5173
- [ ] **Étape 7** : Tester avec OTP: 999999

---

## 🎉 Résultat Attendu

Après `npm run dev`, vous devriez voir :

```
VITE v6.3.5  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**🎊 Félicitations ! L'application fonctionne !**

---

## 💡 Conseils Rapides

### Codes de Test
- **OTP** : `999999`
- **Email test** : n'importe quel email valide
- **Mot de passe test** : minimum 6 caractères

### Navigation
- **Mode Utilisateur** : Interface par défaut
- **Mode Admin** : Cliquer sur "Mode Utilisateur" (bas de la sidebar)

### Fonctionnalités à Tester
1. ✅ Inscription d'un agent
2. ✅ Connexion
3. ✅ Validation biométrique (simulation)
4. ✅ Scan QR code
5. ✅ Validation OTP (999999)
6. ✅ Déclaration d'absence
7. ✅ Interface admin (Dashboard, Agents, Sites, Anomalies)

---

## 🆘 Besoin d'Aide ?

### Problèmes Courants

| Symptôme | Solution |
|----------|----------|
| Erreur jsxDEV | Lire [FIX_JSXDEV_ERROR.md](./FIX_JSXDEV_ERROR.md) |
| Port 5173 occupé | `npm run dev -- --port 3000` |
| Cache corrompu | `rm -rf .vite && npm run dev` |
| Autre erreur | Consulter [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |

### Scripts Utiles

```bash
# Nettoyer tout
npm run clean

# Vérifier l'installation
npm run verify

# Lancer en dev
npm run dev

# Builder pour prod
npm run build

# Prévisualiser le build
npm run preview
```

---

## 🎯 Prochaines Étapes

1. **Maintenant** → Lancer l'application avec les commandes ci-dessus
2. **Ensuite** → Tester toutes les fonctionnalités
3. **Puis** → Lire [README.md](./README.md) pour comprendre l'architecture
4. **Enfin** → Personnaliser selon vos besoins

---

## 📝 Notes Importantes

⚠️ **Développement uniquement**
- Les clés Supabase sont pré-configurées
- La biométrie est simulée
- Le code OTP 999999 est pour les tests

🚀 **Production**
- Remplacer les clés par des variables d'environnement
- Implémenter une vraie biométrie
- Désactiver le code OTP de test

---

**Dernière mise à jour** : 14 Janvier 2026  
**Statut** : ✅ Prêt à l'emploi  
**Version** : 1.0.0

---

🚀 **COMMENCEZ MAINTENANT :**

```bash
bash clean.sh && npm install --legacy-peer-deps && npm run dev
```

Bonne chance ! 🎉
