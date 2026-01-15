# 🚀 Guide d'Installation Complet - TwoInOne

## ✅ Installation Rapide (5 minutes)

### 1️⃣ Frontend (OBLIGATOIRE)

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier d'environnement
cp .env.example .env

# 3. (Optionnel) Ajouter votre clé Google Maps
nano .env
# Ajouter : VITE_GOOGLE_MAPS_API_KEY=votre-cle

# 4. Démarrer l'application
npm run dev
```

✅ **Frontend prêt sur http://localhost:5173**

---

### 2️⃣ Backend ML Python (OPTIONNEL)

#### Option A : Mode SIMULATION (30 secondes)

```bash
cd backend-ml-python

# Installation automatique
chmod +x install_simple.sh
./install_simple.sh

# Démarrer
source venv/bin/activate
python main_simple.py
```

✅ **Backend ML en mode simulation sur http://localhost:8000**

---

#### Option B : Mode COMPLET avec vraie IA (5-10 minutes)

```bash
cd backend-ml-python

# 1. Installer dépendances système
sudo apt-get install cmake libboost-all-dev build-essential

# 2. Créer environnement virtuel
python3 -m venv venv
source venv/bin/activate

# 3. Installer dépendances Python
pip install --upgrade pip
pip install -r requirements.txt

# 4. Installer face_recognition_models
pip install git+https://github.com/ageitgey/face_recognition_models

# 5. Démarrer
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ **Backend ML complet avec vraie reconnaissance faciale**

---

## 📖 Réponses à Vos Questions

### Q: Pourquoi le backend ML doit être installé séparément ?

**R:** Le backend ML est **optionnel** car :
- Il utilise des dépendances lourdes (OpenCV, TensorFlow)
- Installation peut échouer sur certains systèmes
- L'app fonctionne SANS lui (mode empreinte digitale uniquement)
- Microservices = chaque service indépendant

**Avantage** : Vous pouvez tester l'app IMMÉDIATEMENT sans attendre l'installation ML !

---

### Q: Les deux backends communiquent-ils ?

**R:** OUI ! Voici comment :

```
Frontend (React)
    │
    ├──> Backend API (TypeScript)  ← Auth, CRUD, Base de données
    │
    └──> Backend ML (Python)       ← Reconnaissance faciale uniquement
```

- **Backend API** : Gère TOUT (auth, présences, absences, binômes)
- **Backend ML** : Seulement la reconnaissance faciale
- **Ils sont indépendants** : Si ML est arrêté, l'app fonctionne quand même

---

### Q: Pourquoi les agents créés dans l'admin n'apparaissent pas ?

**R:** **C'EST CORRIGÉ !** 🎉

**Avant** : Bug - les utilisateurs n'étaient pas chargés

**Après** (maintenant) :
- Route `/users/all` créée dans le backend
- Les agents sont persistés dans la base
- Mise à jour automatique dans le formulaire d'inscription

**Comment ça marche** :
1. Admin crée un agent → Stocké dans KV Store
2. Utilisateur va sur inscription → Appel `/users/all`
3. Tous les agents apparaissent dans le select

---

## 🎯 Installation Recommandée

### Pour Tester Rapidement

```bash
# Frontend
npm install && npm run dev

# Backend ML (mode simulation)
cd backend-ml-python
./install_simple.sh
source venv/bin/activate
python main_simple.py
```

**Temps total** : 2 minutes
**Fonctionnalités** : 95% de l'app fonctionne

---

### Pour Production Complète

```bash
# Frontend
npm install && npm run dev

# Backend ML (vraie IA)
cd backend-ml-python
sudo apt-get install cmake libboost-all-dev
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install git+https://github.com/ageitgey/face_recognition_models
uvicorn main:app --reload
```

**Temps total** : 5-10 minutes
**Fonctionnalités** : 100% avec vraie reconnaissance faciale

---

## ✅ Vérification

### 1. Frontend

```bash
# Ouvrir http://localhost:5173
# Vous devriez voir l'écran d'accueil
```

### 2. Backend API (Supabase)

```bash
# Automatique - Déjà déployé par Figma Make
```

### 3. Backend ML

```bash
# Test
curl http://localhost:8000/ml/health

# Réponse attendue :
{
  "status": "healthy",
  "mode": "simulation"  # ou "production"
}
```

---

## 📚 Fichiers Clés Créés

| Fichier | Description |
|---------|-------------|
| `/backend-ml-python/main_simple.py` | Backend ML mode SIMULATION |
| `/backend-ml-python/main.py` | Backend ML mode COMPLET |
| `/backend-ml-python/requirements_simple.txt` | Dépendances légères |
| `/backend-ml-python/requirements.txt` | Dépendances complètes |
| `/backend-ml-python/install_simple.sh` | Script d'installation rapide |
| `/backend-ml-python/INSTALLATION_FACILE.md` | Guide ML détaillé |

---

## 🐛 Résolution de Problèmes

### Erreur: face_recognition_models not found

**Solution** :
```bash
pip install git+https://github.com/ageitgey/face_recognition_models
```

### Erreur: cmake not found

**Solution** :
```bash
sudo apt-get install cmake libboost-all-dev build-essential
```

### Port déjà utilisé

**Solution** :
```bash
# Frontend
killall node
npm run dev

# Backend ML
killall uvicorn
python main_simple.py
```

---

## 🎉 C'est Prêt !

Maintenant vous pouvez :

- ✅ Créer un compte de test (bouton automatique)
- ✅ Tester la validation biométrique
- ✅ Créer des agents dans l'admin
- ✅ Les voir dans le formulaire d'inscription
- ✅ Réaffecter des binômes
- ✅ Utiliser Google Maps (avec clé API)

---

**TwoInOne - Installation en 2 minutes ! 🚀**

[Guide Simple](/backend-ml-python/INSTALLATION_FACILE.md) • [Dépannage](/docs/TROUBLESHOOTING.md)
