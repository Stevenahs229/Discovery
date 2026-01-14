# 🚀 TwoInOne - Guide de Démarrage Rapide (5 minutes)

Ce guide vous permettra de lancer TwoInOne **en 5 minutes** avec toutes les fonctionnalités !

---

## 📋 Checklist Pré-démarrage

Avant de commencer, assurez-vous d'avoir :

- [ ] **Node.js 18+** installé ([nodejs.org](https://nodejs.org/))
- [ ] **Python 3.11+** installé ([python.org](https://www.python.org/))
- [ ] **Git** installé ([git-scm.com](https://git-scm.com/))
- [ ] **Un éditeur de code** (VS Code recommandé)
- [ ] **Google Cloud Account** (gratuit) pour Google Maps

---

## ⚡ Installation Express

### Étape 1 : Cloner et Installer (30 secondes)

```bash
# Cloner le projet
git clone https://github.com/votre-org/twoinone.git
cd twoinone

# Installer les dépendances frontend
npm install
```

✅ **Attendu** : Toutes les dépendances installées sans erreur

---

### Étape 2 : Configuration Minimale (1 minute)

#### Frontend `.env`

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Éditer le fichier
nano .env
```

Contenu minimal :

```env
# Google Maps (optionnel pour démarrage)
VITE_GOOGLE_MAPS_API_KEY=

# Backend ML Python (optionnel pour démarrage)
VITE_ML_API_URL=http://localhost:8000
```

💡 **Note** : Vous pouvez laisser vide pour l'instant et configurer après.

---

### Étape 3 : Lancer le Frontend (10 secondes)

```bash
npm run dev
```

✅ **Résultat** :

```
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.x:5173/
```

🎉 **L'application est accessible sur http://localhost:5173** !

---

### Étape 4 : Créer un Compte (30 secondes)

1. **Ouvrir** : http://localhost:5173
2. **Cliquer** : "S'inscrire"
3. **Remplir** :
   - Email : `test@example.com`
   - Mot de passe : `Test123456!`
   - Nom : `Test`
   - Prénom : `User`
   - Téléphone : `0612345678`
   - Binôme : `Binôme Test`
4. **Valider** ✓

✅ **Vous êtes connecté !**

---

### Étape 5 : Tester la Validation Biométrique (1 minute)

#### Option A : Empreinte Digitale (Simulation)

1. **Aller** dans "Déclarer ma présence"
2. **Choisir** "Empreinte Digitale"
3. **Attendre** 1.5 secondes (animation)
4. ✅ **Validé !**

#### Option B : Reconnaissance Faciale (Nécessite Backend ML)

Si vous voulez tester la reconnaissance faciale, **lancez d'abord le backend ML Python** :

```bash
# Dans un nouveau terminal
cd backend-ml-python

# Installation rapide
pip install fastapi uvicorn pillow numpy

# Démarrage
uvicorn main:app --reload
```

Puis :

1. **Choisir** "Reconnaissance Faciale"
2. **Autoriser** l'accès à la caméra
3. **Capturer** une photo
4. ✅ **Validé !** (si visage détecté)

---

## 🎯 Fonctionnalités à Tester

### ✅ Interface Utilisateur

1. **Accueil** :
   - Statut du jour (Présent/Absent/En attente)
   - Carte du binôme

2. **Validation Présence** :
   - Biométrie (empreinte ou faciale)
   - QR Code scanner

3. **Déclaration Absence** :
   - Formulaire d'absence
   - Réaffectation de binôme
   - Absence du binôme

4. **Profil** :
   - Informations personnelles
   - Déconnexion

---

### ✅ Interface Admin

1. **Se déconnecter** de l'interface utilisateur
2. **Aller** à : http://localhost:5173/admin
3. **Connexion** :
   - Email : `admin@twoinone.app`
   - Mot de passe : `Admin123!` (à créer d'abord)

4. **Tester** :
   - **Tableau de bord** : Stats en temps réel
   - **Gestion Sites** : Carte Google Maps
   - **Gestion Agents** : Liste des agents
   - **Rapports** : Statistiques

---

## 🗺️ Activer Google Maps (Optionnel - 3 minutes)

Pour afficher la vraie carte Google Maps :

### 1. Créer une Clé API

1. **Aller** sur [console.cloud.google.com](https://console.cloud.google.com/)
2. **Créer un projet** : "TwoInOne"
3. **Activer l'API** : Maps JavaScript API
4. **Créer une clé** API
5. **Copier** la clé : `AIzaSy...`

### 2. Configurer dans TwoInOne

```bash
# Éditer .env
nano .env
```

Ajouter :

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...votre-cle
```

### 3. Redémarrer

```bash
# Arrêter (Ctrl+C)
# Relancer
npm run dev
```

### 4. Vérifier

1. **Aller** dans Interface Admin → Gestion Sites
2. **La carte Google Maps devrait s'afficher** ✅
3. **Ajouter un site** de test avec coordonnées GPS

**Guide complet** : [Google Maps Configuration](/docs/GOOGLE_MAPS_CONFIGURATION.md)

---

## 🤖 Activer la Reconnaissance Faciale (Optionnel - 5 minutes)

Pour utiliser la vraie reconnaissance faciale avec IA :

### 1. Installer le Backend ML Python

```bash
cd backend-ml-python

# Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer dépendances (peut prendre 2-3 minutes)
pip install -r requirements.txt
```

### 2. Configurer

```bash
cp .env.example .env
nano .env
```

Contenu minimal :

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
```

### 3. Démarrer

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ **Backend ML accessible sur http://localhost:8000**

### 4. Tester

```bash
# Health check
curl http://localhost:8000/ml/health
```

**Réponse attendue** :

```json
{
  "status": "healthy",
  "ml_libraries": {
    "face_recognition": "installed",
    "opencv": "installed"
  }
}
```

### 5. Utiliser dans l'app

1. **Aller** dans TwoInOne
2. **Validation Présence** → **Reconnaissance Faciale**
3. **Capture** de votre visage
4. **Vérification** automatique par l'IA ✨

**Guide complet** : [Backend ML Python](/backend-ml-python/README_DETAILLE.md)

---

## 📱 Installer comme PWA (Optionnel - 30 secondes)

### Sur Chrome Desktop

1. **Ouvrir** l'app dans Chrome
2. **Cliquer** sur l'icône d'installation (en haut à droite de la barre d'adresse)
3. **"Installer"**
4. **L'app s'ouvre dans sa propre fenêtre** ✅

### Sur Smartphone

1. **Ouvrir** dans Chrome (Android) ou Safari (iOS)
2. **Menu** → "Ajouter à l'écran d'accueil"
3. **L'icône TwoInOne apparaît** sur votre écran d'accueil
4. **Cliquer** → L'app s'ouvre comme une app native 📱

**Guide complet** : [Installation PWA](/docs/PWA_INSTALLATION_GUIDE.md)

---

## 🐛 Problèmes Courants

### Problème 1 : "npm install" échoue

**Solution** :

```bash
# Nettoyer cache
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

### Problème 2 : "Port 5173 already in use"

**Solution** :

```bash
# Tuer le processus
killall node
# OU spécifier un autre port
npm run dev -- --port 3000
```

---

### Problème 3 : Google Maps ne s'affiche pas

**Solutions** :

1. ✅ Vérifier que la clé API est dans `.env`
2. ✅ Vérifier le format : `VITE_GOOGLE_MAPS_API_KEY=...`
3. ✅ Redémarrer l'application (`Ctrl+C` puis `npm run dev`)
4. ✅ Vider le cache du navigateur (`Ctrl+Shift+Delete`)

---

### Problème 4 : Backend ML Python - "ModuleNotFoundError"

**Solution** :

```bash
# Installer les dépendances manquantes
pip install face_recognition opencv-python numpy pillow fastapi uvicorn

# Si erreur dlib (requis pour face_recognition)
# Sur Ubuntu/Debian :
sudo apt-get install cmake libboost-all-dev
# Sur macOS :
brew install cmake boost
```

---

### Problème 5 : Caméra ne fonctionne pas

**Solutions** :

1. ✅ Autoriser l'accès caméra dans le navigateur
2. ✅ Utiliser **HTTPS** (ou localhost pour dev)
3. ✅ Vérifier qu'aucune autre app n'utilise la caméra
4. ✅ Essayer un autre navigateur (Chrome recommandé)

---

## 📚 Documentation Complète

Vous avez maintenant TwoInOne opérationnel ! Pour aller plus loin :

### Guides Complets

- [Configuration Complète](/docs/CONFIGURATION_COMPLETE.md) - Setup détaillé A-Z
- [Architecture](/docs/ARCHITECTURE.md) - Architecture microservices
- [Google Maps Setup](/docs/GOOGLE_MAPS_CONFIGURATION.md) - Config Google Maps détaillée
- [Backend ML Python](/backend-ml-python/README_DETAILLE.md) - IA et reconnaissance faciale

### Guides PWA

- [Guide PWA](/docs/PWA_GUIDE.md) - Fonctionnalités PWA
- [Installation PWA](/docs/PWA_INSTALLATION_GUIDE.md) - Installer sur tous appareils

---

## 🎉 Prochaines Étapes

Maintenant que TwoInOne fonctionne, vous pouvez :

1. **✅ Créer des agents** supplémentaires
2. **✅ Ajouter des sites** avec Google Maps
3. **✅ Tester la réaffectation** de binôme
4. **✅ Installer la PWA** sur votre smartphone
5. **✅ Configurer la reconnaissance faciale** complète
6. **✅ Personnaliser** les thèmes et couleurs
7. **✅ Déployer** sur Vercel + Render.com

---

## 💬 Besoin d'Aide ?

- 📖 **Documentation** : Voir les guides dans `/docs/`
- 💬 **Support** : support@twoinone.app
- 🐛 **Bugs** : [Créer une issue](https://github.com/votre-org/twoinone/issues)
- 📧 **Contact** : contact@twoinone.app

---

## ⭐ Feedback

Ce guide vous a aidé ? **Donnez-nous une ⭐ sur GitHub !**

Des suggestions ? **Ouvrez une issue ou envoyez un email.**

---

<div align="center">

**🎉 Félicitations ! Vous avez configuré TwoInOne avec succès ! 🎉**

[README Principal](/README.md) • [Documentation](/docs/) • [Support](mailto:support@twoinone.app)

</div>
