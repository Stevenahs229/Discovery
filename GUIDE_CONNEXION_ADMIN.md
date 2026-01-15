# Guide de Connexion Admin - Résolution de l'erreur "Invalid JWT"

## 🔴 Problème

Vous voyez les erreurs suivantes :
```
Error fetching current user profile: 401 {"code":401,"message":"Invalid JWT"}
Error fetching moderateurs: 401 Erreur lors du chargement
```

## 🎯 Cause

Ces erreurs signifient que le **token d'authentification est invalide**. Cela se produit généralement dans les cas suivants :

1. **Vous vous êtes connecté avec un compte utilisateur normal** (pas admin) et essayez d'accéder à l'interface admin
2. **Le token a expiré** après un certain temps
3. **Vous n'avez jamais créé de compte admin** et essayez de vous connecter avec les identifiants utilisateur

## ✅ Solution : Créer un compte admin

### Étape 1 : Déconnectez-vous complètement

1. Cliquez sur le bouton **"Déconnexion"** dans l'interface admin (si visible)
2. Ou ouvrez la console développeur (F12) et tapez :
   ```javascript
   localStorage.removeItem('access_token');
   localStorage.removeItem('admin_email');
   location.reload();
   ```

### Étape 2 : Créez un nouveau compte admin

1. **Allez sur la page d'accueil admin** (cliquez sur "Admin" depuis l'accueil)
2. **Cliquez sur "Créer un compte admin"**
3. **Remplissez le formulaire avec EXACTEMENT ces informations** :

   ```
   Prénom : Joachim
   Nom : Goehakue
   Email : joachimgoehakue05@gmail.com
   Téléphone : +33 6 XX XX XX XX (votre numéro)
   Mot de passe : jo@chim31
   Confirmer le mot de passe : jo@chim31
   ```

4. **Cliquez sur "Créer le Compte"**

### Étape 3 : Connectez-vous avec le nouveau compte admin

1. Après la création, vous serez redirigé vers la page de connexion
2. Connectez-vous avec :
   ```
   Email : joachimgoehakue05@gmail.com
   Mot de passe : jo@chim31
   ```

3. Vous serez automatiquement **Modérateur** (le rôle le plus élevé)

### Étape 4 : Vérification

Une fois connecté, vous devriez pouvoir :
- ✅ Accéder au Dashboard Admin
- ✅ Voir la section "Gestion des Modérateurs"
- ✅ Créer d'autres comptes admin/modérateurs
- ✅ Gérer tous les utilisateurs

## 🔐 Pourquoi cela fonctionne ?

L'email `joachimgoehakue05@gmail.com` est configuré comme **email spécial** dans le backend. Lorsque vous créez un compte avec cet email :

1. Le système vous attribue automatiquement le rôle **Modérateur** (niveau 4 - le plus élevé)
2. Vous avez accès à TOUTES les fonctionnalités admin
3. Vous pouvez créer d'autres modérateurs, super admins et admins

## 🆚 Différence entre compte utilisateur et compte admin

### Compte Utilisateur (interface normale)
- Créé via la page d'inscription utilisateur
- Peut déclarer sa présence
- Peut gérer son binôme
- **NE PEUT PAS** accéder à l'interface admin

### Compte Admin (interface admin)
- Créé via `/admin/signup`
- Peut gérer tous les utilisateurs
- Peut voir le dashboard admin
- **Possède un rôle** : Modérateur, Super Admin ou Admin

## ⚠️ Important

**Vous devez créer un compte SÉPARÉ pour l'interface admin.** Les comptes utilisateur normaux ne peuvent pas accéder à l'interface admin, même s'ils utilisent le même email.

## 🛠️ Commandes de débogage

Si vous avez des doutes, ouvrez la console (F12) et tapez :

### Vérifier le token actuel
```javascript
console.log('Token:', localStorage.getItem('access_token'));
console.log('Admin email:', localStorage.getItem('admin_email'));
```

### Nettoyer complètement la session
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Vérifier le profil utilisateur
```javascript
fetch('https://rxxvpifqgqkipnluqgpx.supabase.co/functions/v1/make-server-643544a8/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
})
.then(res => res.json())
.then(data => console.log('User profile:', data))
.catch(err => console.error('Error:', err));
```

## 📞 Support

Si le problème persiste après avoir suivi ces étapes :

1. Vérifiez que vous utilisez bien l'email **joachimgoehakue05@gmail.com**
2. Vérifiez que vous avez créé le compte via **/admin/signup** et non la page d'inscription normale
3. Essayez de nettoyer complètement votre session (voir commandes ci-dessus)
4. Vérifiez les logs dans la console développeur (F12)

## 🎉 Une fois connecté

Vous aurez accès à :
- **Dashboard** : Vue d'ensemble des agents et statistiques
- **Agents** : Gestion de tous les utilisateurs
- **Sites** : Gestion des sites géographiques
- **Anomalies IA** : Détection d'anomalies de présence
- **Modérateurs** : Gestion des rôles administrateurs ⭐

Dans la section Modérateurs, vous pourrez :
- Créer de nouveaux admins/modérateurs
- Modifier les rôles
- Supprimer des comptes admin
- Voir la hiérarchie des permissions
