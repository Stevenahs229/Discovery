# 🔧 Guide de Dépannage - TwoInOne

## ❌ Erreur: "Erreur lors du chargement"

### 🔍 Cause
Cette erreur apparaît dans l'interface admin → Modérateurs quand :
1. Vous n'êtes pas connecté
2. Le token d'authentification a expiré
3. Le backend n'est pas accessible

### ✅ Solution

#### 1. Se Connecter à l'Interface Admin

**Maintenant, l'interface admin nécessite une authentification !**

```bash
# Étape par étape :
1. Cliquez sur "Admin" (bouton en haut à droite)
2. Vous verrez un écran de connexion
3. Connectez-vous avec un compte existant
4. L'interface admin s'ouvrira
```

**Important** : Vous devez avoir un compte utilisateur créé pour accéder à l'admin.

#### 2. Créer un Compte Admin (Première fois)

```bash
# Si vous n'avez pas encore de compte :

# Option A - Via l'interface utilisateur
1. Retour à l'interface utilisateur (bouton "Retour")
2. Créer un compte via "Créer un compte"
3. Remplir le formulaire d'inscription
4. Se connecter avec ce compte
5. Retourner à l'interface admin
6. Se connecter avec les mêmes identifiants

# Option B - Créer un compte de test rapide
# (Pour développement uniquement)
# Dans la console du navigateur (F12) :
```

#### 3. Vérifier le Token

```javascript
// Dans la console navigateur (F12)
localStorage.getItem('access_token')

// Si null ou undefined :
// → Vous n'êtes pas connecté
// → Connectez-vous à l'interface admin
```

#### 4. Vérifier le Backend

```bash
# Tester si le backend répond :
# Ouvrir la console (F12) et taper :

fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-643544a8/admin/list', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  }
})
.then(r => r.json())
.then(data => console.log(data))
.catch(err => console.error(err))
```

---

## 🚀 Procédure Complète de Test

### Test 1 : Connexion Admin

```bash
# 1. Démarrer l'app
npm run dev

# 2. Créer un compte utilisateur (si pas encore fait)
- Cliquer sur "Créer un compte"
- Remplir :
  Email: test@test.fr
  Password: Test@2026!
  Nom: Test
  Prénom: Utilisateur
  Téléphone: +33 6 12 34 56 78
  Binôme: (sélectionner un dans la liste ou laisser vide)
- Cliquer sur "S'inscrire"

# 3. Se connecter
- Email: test@test.fr
- Password: Test@2026!

# 4. Accéder à l'interface admin
- Cliquer sur "Admin" (en haut à droite sur la page onboarding)
- OU si déjà connecté, se déconnecter d'abord

# 5. Se connecter à l'admin
- Utiliser les mêmes identifiants
- Email: test@test.fr
- Password: Test@2026!

✅ Vous devriez maintenant voir le dashboard admin
```

---

### Test 2 : Créer un Modérateur

```bash
# Une fois connecté à l'admin :

1. Aller dans "Modérateurs" (menu latéral)
2. Cliquer sur "Créer un Modérateur"
3. Remplir :
   - Prénom: Jean
   - Nom: Moderateur
   - Email: jean.modo@test.fr
   - Password: Modo@2026!
   - Téléphone: +33 6 12 34 56 78
   - Rôle: Admin (ou SuperAdmin ou Modérateur)
4. Cliquer sur "Créer le Compte"

✅ Le modérateur devrait apparaître dans la liste
```

---

## 🔍 Erreurs Courantes et Solutions

### Erreur 1 : "Vous devez être connecté"

**Cause** : Pas de token dans localStorage

**Solution** :
```bash
1. Se déconnecter de l'admin
2. Retourner à l'interface utilisateur
3. Se connecter avec un compte valide
4. Revenir à l'interface admin
5. Se reconnecter
```

---

### Erreur 2 : "401 Unauthorized"

**Cause** : Token expiré ou invalide

**Solution** :
```bash
1. Dans la console (F12) :
   localStorage.removeItem('access_token')
   
2. Rafraîchir la page
3. Se reconnecter
```

---

### Erreur 3 : "Non autorisé" lors de la création

**Cause** : Vous essayez de créer un rôle supérieur au vôtre

**Solution** :
```bash
# Si vous êtes ADMIN :
- Vous pouvez créer : USERS uniquement
- Vous NE POUVEZ PAS créer : Admin, SuperAdmin, Modérateur

# Si vous êtes SUPERADMIN :
- Vous pouvez créer : Admin et Users
- Vous NE POUVEZ PAS créer : SuperAdmin ou Modérateur

# Si vous êtes MODÉRATEUR :
- Vous pouvez TOUT créer
```

**Action** :
1. Vérifiez votre rôle actuel
2. Créez un rôle inférieur
3. Ou demandez à un modérateur de vous promouvoir

---

### Erreur 4 : Liste vide dans "Modérateurs"

**Cause** : Aucun modérateur n'a été créé, ou erreur de chargement

**Solution** :
```bash
# Vérifier dans la console (F12)
# Si erreur 401 ou 403 :
- Reconnectez-vous

# Si pas d'erreur mais liste vide :
- C'est normal si vous n'avez pas encore créé de modérateur
- Créez-en un avec le bouton "Créer un Modérateur"
```

---

## 🛠️ Debug Avancé

### Vérifier les Logs Backend

```bash
# 1. Ouvrir Supabase Dashboard
# 2. Aller dans "Edge Functions"
# 3. Sélectionner "make-server-643544a8"
# 4. Voir les logs en temps réel

# Chercher les erreurs :
- "[OfflineStorage]" → Logs du service offline
- "Auth error:" → Erreurs d'authentification
- "Create admin error:" → Erreurs de création
```

---

### Tester les Routes API Manuellement

```javascript
// Dans la console (F12)

// 1. Obtenir le token
const token = localStorage.getItem('access_token');
console.log('Token:', token ? 'Exists' : 'Missing');

// 2. Tester la route /admin/list
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-643544a8/admin/list', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log('Admins:', data))
.catch(err => console.error('Error:', err));

// 3. Tester la création (adapter les données)
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-643544a8/admin/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test.admin@test.fr',
    password: 'Test@2026!',
    nom: 'Test',
    prenom: 'Admin',
    telephone: '+33612345678',
    role: 'admin'
  })
})
.then(r => r.json())
.then(data => console.log('Create result:', data))
.catch(err => console.error('Error:', err));
```

---

## 📋 Checklist de Résolution

- [ ] Frontend démarré (`npm run dev`)
- [ ] Backend accessible (Supabase configuré)
- [ ] Compte utilisateur créé
- [ ] Connexion réussie (token présent)
- [ ] Interface admin accessible
- [ ] Connexion admin réussie
- [ ] Onglet "Modérateurs" accessible
- [ ] Pas d'erreurs dans la console (F12)

---

## 💡 Astuces

### Reset Complet

```bash
# Si tout est cassé, reset complet :

# 1. Nettoyer le localStorage
localStorage.clear()

# 2. Rafraîchir la page
# 3. Créer un nouveau compte
# 4. Se connecter
# 5. Accéder à l'admin
```

---

### Créer un Premier Modérateur (Bootstrap)

```bash
# Pour créer le tout premier modérateur :

# Option 1 - Via Supabase Dashboard
1. Aller dans Supabase Dashboard
2. Authentication → Users
3. Créer un user manuellement
4. Aller dans Table Editor → kv_store_643544a8
5. Ajouter une ligne :
   key: user:USER_ID
   value: { "role": "moderateur", "nom": "...", ... }

# Option 2 - Via le backend (ajouter temporairement)
# Dans /supabase/functions/server/index.tsx
# Ajouter une route bootstrap (à supprimer après) :

app.post('/make-server-643544a8/bootstrap-moderator', async (c) => {
  // Créer le premier modérateur
  // Code similaire à /admin/create mais sans vérification de rôle
});
```

---

## 📞 Support

Si le problème persiste :

1. **Vérifier les logs** (Console + Supabase)
2. **Tester les routes API** manuellement
3. **Nettoyer le cache** et localStorage
4. **Recréer un compte** de test
5. **Vérifier la configuration** Supabase

---

**Erreur corrigée ! L'interface admin nécessite maintenant une authentification. ✅**

[Retour aux Fonctionnalités](/NOUVELLES_FONCTIONNALITES.md) • [Guide Modérateurs](/GUIDE_UTILISATION_MODERATEURS.md)
