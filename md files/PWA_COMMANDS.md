# 🚀 TwoInOne PWA - Commandes Rapides

## 📦 Installation

```bash
# Installer les dépendances
npm install
```

---

## 🔨 Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Ouvre sur http://localhost:5173
```

**⚠️ Note** : Le Service Worker ne fonctionnera pas complètement en mode dev.

---

## 🏗️ Build Production

```bash
# Builder l'application pour la production
npm run build

# Prévisualiser le build (avec Service Worker actif)
npm run preview

# Ouvre sur http://localhost:4173
```

---

## 🧪 Test PWA

### Script automatique

**Linux/Mac :**
```bash
chmod +x build-pwa.sh
./build-pwa.sh
```

**Windows :**
```cmd
build-pwa.bat
```

### Manuel

```bash
# 1. Build
npm run build

# 2. Preview
npm run preview

# 3. Ouvrir http://localhost:4173
```

---

## 📱 Test sur Mobile

### 1. Trouver votre IP

**Windows :**
```cmd
ipconfig
```
Cherchez "IPv4 Address" (ex: 192.168.1.100)

**Mac/Linux :**
```bash
ifconfig
# ou
ip addr show
```
Cherchez "inet" (ex: 192.168.1.100)

### 2. Sur votre smartphone

Ouvrez le navigateur et allez à :
```
http://[VOTRE_IP]:4173
```

Exemple : `http://192.168.1.100:4173`

---

## 🔍 Vérification PWA

### Console Browser

```javascript
// Vérifier si le Service Worker est actif
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('SW Status:', reg?.active?.state);
});

// Vérifier si installé
window.matchMedia('(display-mode: standalone)').matches
// true = installé, false = navigateur
```

### Chrome DevTools

1. **F12** → Onglet **Application**
2. Sections à vérifier :
   - **Manifest** : Métadonnées de l'app
   - **Service Workers** : État du SW
   - **Cache Storage** : Fichiers cachés
   - **Storage** : localStorage/sessionStorage

### Panel de Debug

Dans l'application :
```
Ctrl + Shift + P
```

Affiche le score PWA et l'état de tous les composants.

---

## 📊 Audit Lighthouse

### Via DevTools

1. **F12** → Onglet **Lighthouse**
2. Cocher **Progressive Web App**
3. **Generate report**
4. Score attendu : **90+** / 100

### Via CLI

```bash
# Installer Lighthouse
npm install -g lighthouse

# Lancer l'audit
lighthouse http://localhost:4173 --view

# Audit PWA seulement
lighthouse http://localhost:4173 --only-categories=pwa --view
```

---

## 🧹 Nettoyage

### Effacer le cache

**Browser :**
1. DevTools → Application → Cache Storage
2. Clic droit sur "twoinone-v1" → Delete

**Ou via Console :**
```javascript
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

### Désinstaller le Service Worker

```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
});
```

### Reset complet

```bash
# Supprimer node_modules et package-lock
rm -rf node_modules package-lock.json

# Windows
rmdir /s /q node_modules
del package-lock.json

# Réinstaller
npm install
```

---

## 🔄 Mise à Jour

### Forcer une mise à jour du SW

**Via Panel Debug :**
- Ctrl+Shift+P → "Forcer la mise à jour"

**Via DevTools :**
- Application → Service Workers → "Update"

**Via Console :**
```javascript
navigator.serviceWorker.getRegistration().then(reg => {
  reg?.update();
  location.reload();
});
```

### Versionning du SW

Dans `/public/sw.js`, changer :
```javascript
const CACHE_NAME = 'twoinone-v1';  // Incrémenter : v2, v3, etc.
```

---

## 🐛 Dépannage

### Le SW ne s'active pas

```bash
# Vérifier les erreurs
npm run build
npm run preview

# Console → vérifier les messages
```

### Le prompt d'installation n'apparaît pas

**Android :**
- Vérifier que le manifest est valide
- Le SW doit être actif
- Critères PWA doivent être satisfaits

**iOS :**
- Pas de prompt automatique
- Utiliser : Partager → Sur l'écran d'accueil

### L'app ne fonctionne pas hors ligne

```javascript
// Console → vérifier le cache
caches.keys().then(console.log);

// Vérifier les fichiers cachés
caches.open('twoinone-v1').then(cache => {
  cache.keys().then(requests => {
    console.log('Cached:', requests.map(r => r.url));
  });
});
```

---

## 📖 Documentation

### Guides disponibles

- **README Principal** : `/PWA_README.md`
- **Guide Utilisateur** : `/PWA_INSTALLATION_GUIDE.md`
- **Guide Test** : `/PWA_TESTING_GUIDE.md`
- **Checklist** : `/PWA_CHECKLIST.md`
- **Commandes** : `/PWA_COMMANDS.md` (ce fichier)

### Ouvrir la documentation

```bash
# Linux/Mac
open PWA_README.md

# Windows
start PWA_README.md
```

---

## 🌐 Déploiement

### Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

### Netlify

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Déployer
netlify deploy --prod --dir=dist
```

### Build manuel

```bash
# Build
npm run build

# Le dossier /dist contient tous les fichiers
# Uploader sur votre hébergeur
```

---

## 🔑 Variables d'Environnement

Les secrets Supabase sont déjà configurés :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`
- `GOOGLE_MAPS_API_KEY`

Pas besoin de les reconfigurer.

---

## 🎯 Raccourcis Utiles

| Action | Raccourci |
|--------|-----------|
| DevTools | F12 |
| Debug Panel | Ctrl+Shift+P |
| Rafraîchir | Ctrl+R |
| Hard Refresh | Ctrl+Shift+R |
| Inspecter élément | Ctrl+Shift+C |
| Console | Ctrl+Shift+J |
| Lighthouse | Ctrl+Shift+L (dans DevTools) |

---

## 📞 Support

**Problèmes courants résolus :**

```bash
# Erreur npm : "Cannot find module"
npm install

# Erreur build : "out of memory"
export NODE_OPTIONS=--max-old-space-size=4096
npm run build

# Port déjà utilisé
# Changer dans package.json ou kill le process
```

**Logs utiles :**

```bash
# Voir tous les Service Workers actifs
chrome://serviceworker-internals/

# Voir toutes les apps installées
chrome://apps/

# Infos PWA
chrome://webapks/
```

---

## 🎊 Commandes Essentielles (Résumé)

```bash
# Setup
npm install

# Dev
npm run dev

# Test PWA
npm run build && npm run preview

# Sur mobile (même WiFi)
# http://[IP]:4173

# Debug Panel
# Ctrl+Shift+P dans l'app

# Audit
# DevTools → Lighthouse → PWA

# Docs
# Voir /PWA_README.md
```

---

**TwoInOne PWA v1.0** 🚀

*Pour plus d'infos, consultez `/PWA_README.md`*
