# 🤖 Backend ML Python - TwoInOne

Backend de reconnaissance faciale avec **2 modes** : SIMPLE (rapide) et COMPLET (IA).

---

## ⚡ Installation Express (30 secondes)

```bash
# Rendre exécutable
chmod +x install_simple.sh

# Installer
./install_simple.sh

# Démarrer
source venv/bin/activate
python main_simple.py
```

✅ **C'est tout ! Le serveur est sur http://localhost:8000**

---

## 🎭 2 Modes Disponibles

### Mode SIMPLE (Recommandé pour débuter)

**Fichier** : `main_simple.py`

**Avantages** :
- ✅ Installation en 30 secondes
- ✅ Aucune dépendance lourde
- ✅ Fonctionne sur tous les systèmes
- ✅ Parfait pour tester l'app

**Démarrage** :
```bash
python main_simple.py
```

---

### Mode COMPLET (Vraie IA)

**Fichier** : `main.py`

**Avantages** :
- ✅ Vraie reconnaissance faciale
- ✅ OpenCV + face_recognition
- ✅ Précision élevée

**Démarrage** :
```bash
# Installer dépendances complètes
pip install -r requirements.txt
pip install git+https://github.com/ageitgey/face_recognition_models

# Lancer
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## 📡 API Endpoints

### Health Check

```bash
GET /ml/health
```

**Réponse** :
```json
{
  "status": "healthy",
  "mode": "simulation",  // ou "production"
  "models_loaded": 0
}
```

---

### Enregistrer un Visage

```bash
POST /ml/enroll-face
Headers: user_id, authorization
Body: file (image)
```

---

### Vérifier un Visage

```bash
POST /ml/verify-face
Headers: authorization
Body: file (image)
```

**Réponse** :
```json
{
  "success": true,
  "user_id": "abc123",
  "confidence": 0.92,
  "message": "Identité vérifiée avec 92% de confiance"
}
```

---

## 📚 Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `main_simple.py` | Mode SIMULATION (rapide) |
| `main.py` | Mode COMPLET (vraie IA) |
| `requirements_simple.txt` | Dépendances légères |
| `requirements.txt` | Dépendances complètes |
| `install_simple.sh` | Script d'installation |
| `INSTALLATION_FACILE.md` | Guide détaillé |

---

## 🔄 Passer d'un Mode à l'Autre

### Simple → Complet

```bash
pip install -r requirements.txt
pip install git+https://github.com/ageitgey/face_recognition_models
uvicorn main:app --reload
```

### Complet → Simple

```bash
python main_simple.py
```

---

## 🐛 Dépannage

### face_recognition_models not found

**Solution** :
```bash
pip install git+https://github.com/ageitgey/face_recognition_models
```

### cmake not found

**Solution** :
```bash
sudo apt-get install cmake libboost-all-dev build-essential
```

---

## 📖 Documentation Complète

- [Installation Facile](INSTALLATION_FACILE.md) - Guide pas à pas
- [README Détaillé](README_DETAILLE.md) - Documentation approfondie

---

**TwoInOne ML Backend - Prêt en 30 secondes ! 🚀**
