# ⚠️ ERREURS RÉSOLUES - Lisez ceci en premier !

## 🔴 Erreur : "Invalid login credentials"

### ✅ Solution Rapide (30 secondes)

Cette erreur signifie qu'**aucun compte n'a été créé**. Voici comment créer un compte de test instantanément :

1. **Lancer l'application** :
   ```bash
   npm run dev
   ```

2. **Ouvrir** : http://localhost:5173

3. **Sur l'écran d'accueil**, vous verrez une carte **"Compte de Test Rapide"**

4. **Cliquer** sur **"Créer un compte de test"**

5. **Copier les identifiants** affichés :
   - Email : `test@twoinone.app`
   - Mot de passe : `Test123456!`

6. **Cliquer** sur **"Se connecter"**

7. **Coller** les identifiants

8. ✅ **Connexion réussie !**

---

## 🟠 Autres Erreurs Courantes

### Google Maps ne s'affiche pas

Vérifiez que la clé API est dans `.env` avec le **préfixe VITE_** :

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
```

Puis redémarrez l'application.

### Backend ML Python inaccessible

Lancez le backend dans un deuxième terminal :

```bash
cd backend-ml-python
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn
uvicorn main:app --reload
```

### Port 5173 déjà utilisé

```bash
killall node
npm run dev
```

---

## 📚 Documentation Complète

- **[Guide de Dépannage Complet](/docs/TROUBLESHOOTING.md)** - Toutes les erreurs et solutions
- **[Démarrage Rapide](/docs/QUICK_START.md)** - Guide en 5 minutes
- **[Configuration](/docs/CONFIGURATION_COMPLETE.md)** - Setup de A à Z

---

## ✅ Fonctionnalités Corrigées

| Problème | Solution | Statut |
|----------|----------|--------|
| Dockerfile incorrect | Recréé correctement | ✅ CORRIGÉ |
| .env.example manquant | Créé avec toutes les variables | ✅ CORRIGÉ |
| Login échoue | Composant QuickTestAccount ajouté | ✅ CORRIGÉ |
| Messages d'erreur peu clairs | Messages améliorés | ✅ CORRIGÉ |

---

## 🎯 Test Rapide (1 minute)

```bash
# 1. Installer et démarrer
npm install
npm run dev

# 2. Ouvrir http://localhost:5173

# 3. Créer compte de test (bouton automatique)

# 4. Se connecter avec les identifiants générés

# 5. ✅ Succès !
```

---

**Dernière mise à jour** : Janvier 2026
