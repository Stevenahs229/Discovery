# 🔧 Résolution des Erreurs Courantes - TwoInOne

## ❌ Erreur : "Invalid login credentials"

### Cause
Cette erreur signifie que :
1. **L'utilisateur n'existe pas** dans la base de données
2. **Email ou mot de passe incorrect**
3. **Le compte n'a pas été créé avec succès**

---

### ✅ Solution Rapide (30 secondes)

#### Option 1 : Utiliser le Compte de Test Automatique

1. **Lancer l'application** :
   ```bash
   npm run dev
   ```

2. **Ouvrir** : http://localhost:5173

3. **Sur l'écran d'accueil**, vous verrez maintenant une carte **"Compte de Test Rapide"**

4. **Cliquer** sur "Créer un compte de test"

5. **Copier** les identifiants affichés :
   - Email : `test@twoinone.app`
   - Mot de passe : `Test123456!`

6. **Cliquer** sur "Se connecter"

7. **Coller** les identifiants

8. ✅ **Vous êtes connecté !**

---

#### Option 2 : Créer un Compte Manuellement

1. **Sur l'écran d'accueil**, cliquer sur **"Créer un compte"**

2. **Remplir le formulaire** :
   - Nom : `Test`
   - Prénom : `User`
   - Email : `test@example.com`
   - Téléphone : `0612345678`
   - Binôme : `Binôme Test`
   - Mot de passe : `Test123456!`

3. **Cliquer** sur "Capturer empreinte" (simulation 1.5s)

4. **Soumettre** le formulaire

5. **Retour sur connexion**

6. **Se connecter** avec les identifiants créés

---

### 🔍 Diagnostic

Pour vérifier si un utilisateur existe, ouvrir la console du navigateur (F12) :

```javascript
// Vérifier les logs lors du login
// Vous devriez voir :
// "Login error: AuthApiError: Invalid login credentials"
```

Cela confirme que l'utilisateur n'existe pas ou que les credentials sont incorrects.

---

## ❌ Erreur : "Email already registered"

### Cause
L'email existe déjà dans Supabase.

### ✅ Solution

**Utilisez le login** avec cet email au lieu de créer un nouveau compte.

Si vous avez oublié le mot de passe :
1. Utiliser la fonction "Mot de passe oublié" (à implémenter)
2. OU créer un nouveau compte avec un autre email

---

## ❌ Erreur : Backend inaccessible

### Symptômes
```
Failed to fetch
Network error
```

### ✅ Solutions

#### 1. Vérifier que le serveur est démarré

```bash
# Terminal 1 : Frontend
npm run dev

# Terminal 2 : Backend ML Python (optionnel)
cd backend-ml-python
uvicorn main:app --reload
```

#### 2. Vérifier les URLs

Ouvrir la console (F12) et vérifier :

```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('ML API URL:', import.meta.env.VITE_ML_API_URL);
```

Si `undefined`, vérifier `.env` :

```env
VITE_ML_API_URL=http://localhost:8000
```

Puis **redémarrer l'application**.

---

## ❌ Erreur : Google Maps ne s'affiche pas

### Symptômes
- Carte grise avec message "Clé API non configurée"
- Erreur dans la console : "Google Maps API error"

### ✅ Solutions

#### 1. Vérifier la clé API

```bash
cat .env | grep GOOGLE_MAPS
```

Doit afficher :
```
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
```

#### 2. Format correct

❌ **MAUVAIS** :
```env
GOOGLE_MAPS_API_KEY=AIzaSy...
```

✅ **BON** :
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
```

Le préfixe `VITE_` est **obligatoire** !

#### 3. Redémarrer l'application

```bash
# Arrêter (Ctrl+C)
# Relancer
npm run dev
```

Les variables d'environnement ne sont chargées qu'au démarrage.

---

## ❌ Erreur : Reconnaissance faciale ne fonctionne pas

### Symptômes
- "Backend ML non accessible"
- "Erreur lors de la vérification faciale"
- Caméra ne s'active pas

### ✅ Solutions

#### 1. Vérifier le backend ML

```bash
# Vérifier si le serveur est lancé
curl http://localhost:8000/ml/health
```

Si erreur → Lancer le backend :

```bash
cd backend-ml-python
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### 2. Autoriser la caméra

- **Chrome** : Cliquer sur l'icône 🔒 dans la barre d'adresse
- **Autoriser** l'accès à la caméra
- **Recharger** la page (F5)

#### 3. HTTPS requis (en production)

En local, `http://localhost` fonctionne.

En production, la caméra nécessite **HTTPS obligatoire**.

---

## ❌ Erreur : PWA ne s'installe pas

### Symptômes
- Pas d'icône d'installation
- "Add to home screen" non disponible

### ✅ Solutions

#### 1. Vérifier HTTPS

PWA nécessite HTTPS (sauf localhost).

En production, déployer sur Vercel/Netlify (HTTPS auto).

#### 2. Vérifier manifest.json

```bash
curl http://localhost:5173/manifest.json
```

Doit retourner le JSON du manifest.

#### 3. Vérifier Service Worker

Console (F12) → Application → Service Workers

Doit afficher : `sw.js` activé.

---

## ❌ Erreur : Port 5173 already in use

### ✅ Solution

```bash
# Option 1 : Tuer le processus
killall node

# Option 2 : Utiliser un autre port
npm run dev -- --port 3000
```

---

## ❌ Erreur : npm install échoue

### ✅ Solutions

```bash
# Nettoyer le cache npm
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Si problème persiste, vérifier Node.js version
node --version  # Doit être >= 18

# Mettre à jour Node.js si nécessaire
# https://nodejs.org/
```

---

## ❌ Erreur : Python dependencies installation failed

### ✅ Solutions

#### 1. Installer les dépendances système

**Ubuntu/Debian** :
```bash
sudo apt-get update
sudo apt-get install -y cmake libboost-all-dev build-essential
```

**macOS** :
```bash
brew install cmake boost
```

**Windows** :
- Installer Visual Studio Build Tools
- https://visualstudio.microsoft.com/downloads/

#### 2. Réinstaller

```bash
cd backend-ml-python
pip uninstall -y -r requirements.txt
pip install -r requirements.txt
```

---

## 🔍 Debug Mode

### Activer les logs détaillés

Ouvrir la console navigateur (F12) et exécuter :

```javascript
// Activer les logs Supabase
localStorage.setItem('supabase.debug', 'true');

// Recharger la page
window.location.reload();
```

Vous verrez maintenant tous les logs détaillés.

---

## 📞 Support

Si le problème persiste :

1. **Vérifier la documentation** : `/docs/`
2. **Consulter les logs** : Console navigateur (F12)
3. **Créer une issue** : GitHub
4. **Contact** : support@twoinone.app

---

## ✅ Checklist de Vérification

Avant de demander de l'aide, vérifier :

- [ ] Node.js 18+ installé
- [ ] `npm install` exécuté sans erreur
- [ ] `.env` créé et configuré
- [ ] Application démarrée avec `npm run dev`
- [ ] Compte utilisateur créé (via formulaire ou compte test)
- [ ] Credentials corrects lors du login
- [ ] Console (F12) ouverte pour voir les erreurs
- [ ] Documentation lue (`/docs/`)

---

## 🎯 Raccourcis de Test

### Test Rapide Complet (2 minutes)

```bash
# 1. Démarrer l'app
npm run dev

# 2. Ouvrir http://localhost:5173

# 3. Créer compte de test automatique (bouton sur page d'accueil)

# 4. Se connecter avec les identifiants générés

# 5. Tester validation présence

# 6. ✅ Succès !
```

---

**TwoInOne © 2026** - Guide de Dépannage
