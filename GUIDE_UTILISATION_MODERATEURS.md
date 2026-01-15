# 🎯 Guide Rapide - Utilisation des Modérateurs

## 🚀 Démarrage Rapide

### 1. Accéder à l'Interface Admin

```bash
# Démarrer l'application
npm run dev

# Ouvrir http://localhost:5173
# Cliquer sur le bouton "Admin" (en haut à droite)
```

---

### 2. Créer Votre Premier Modérateur

**Étape par étape** :

1. **Cliquez sur "Admin"** (bouton avec icône Shield)
2. **Allez dans "Modérateurs"** (menu latéral, icône Shield)
3. **Cliquez sur "Créer un Modérateur"** (bouton bleu)
4. **Remplissez le formulaire** :
   ```
   Prénom:    Jean
   Nom:       Moderateur
   Email:     jean.modo@entreprise.fr
   Password:  Modo@2026!
   Téléphone: +33 6 12 34 56 78
   Rôle:      Modérateur
   ```
5. **Cliquez sur "Créer le Compte"**

✅ **Votre premier modérateur est créé !**

---

## 📊 Comprendre les Rôles

### Hiérarchie (du plus élevé au plus bas)

```
┌────────────────┐
│  MODÉRATEUR    │ ◄── Peut TOUT faire
│  (Niveau 4)    │
└────────────────┘
       │
       ▼
┌────────────────┐
│  SUPER ADMIN   │ ◄── Peut gérer admins et users
│  (Niveau 3)    │
└────────────────┘
       │
       ▼
┌────────────────┐
│  ADMIN         │ ◄── Peut gérer seulement users
│  (Niveau 2)    │
└────────────────┘
       │
       ▼
┌────────────────┐
│  USER          │ ◄── Utilisateur normal
│  (Niveau 1)    │
└────────────────┘
```

### Qui peut gérer qui ?

| Votre Rôle | Peut gérer |
|------------|------------|
| **Modérateur** | Tous (Modérateurs, SuperAdmins, Admins, Users) |
| **SuperAdmin** | Admins et Users seulement |
| **Admin** | Users seulement |
| **User** | Personne |

---

## 🎯 Cas d'Usage

### Scénario 1 : Créer un Admin Simple

**Contexte** : Vous voulez que quelqu'un puisse créer des agents mais pas gérer d'autres admins.

**Solution** :
1. Créer un compte avec rôle "Admin"
2. Il pourra créer/modifier/supprimer des utilisateurs
3. Il ne pourra PAS modifier d'autres admins

---

### Scénario 2 : Créer un Super Admin

**Contexte** : Vous avez un responsable qui doit gérer les admins et les utilisateurs.

**Solution** :
1. Créer un compte avec rôle "SuperAdmin"
2. Il pourra gérer tous les admins
3. Il ne pourra PAS modifier les modérateurs

---

### Scénario 3 : Promouvoir un Utilisateur

**Contexte** : Un utilisateur doit devenir administrateur.

**Solution Recommandée** :
1. **Option A (Lier les comptes)** :
   - Créer un nouveau compte admin
   - Dans "Lier à un utilisateur", sélectionner l'utilisateur existant
   - Cela permet de garder l'historique utilisateur

2. **Option B (Compte séparé)** :
   - Créer un nouveau compte admin avec un email différent
   - L'utilisateur aura 2 comptes (1 user + 1 admin)

---

## 🔄 Modifier un Rôle

### Méthode Rapide

1. Allez dans "Modérateurs"
2. Trouvez le compte dans la liste
3. Cliquez sur le **dropdown "Modifier le rôle"**
4. Sélectionnez le nouveau rôle
5. ✅ C'est fait ! (instantané)

**Exemple** :
```
Admin → SuperAdmin  ✅ (promotion)
SuperAdmin → Admin  ✅ (rétrogradation)
Modérateur → Admin  ❌ (vous devez être modérateur pour faire ça)
```

---

## ⚠️ Erreurs Courantes

### 1. "Vous ne pouvez pas créer un compte avec le rôle moderateur"

**Cause** : Vous êtes admin ou superadmin, pas modérateur.

**Solution** :
- Seul un modérateur peut créer d'autres modérateurs
- Demandez à un modérateur existant
- Ou créez un admin/superadmin à la place

---

### 2. "Vous ne pouvez pas modifier cet utilisateur"

**Cause** : Vous essayez de modifier quelqu'un avec un rôle supérieur ou égal au vôtre.

**Solution** :
- Un admin ne peut pas modifier un superadmin
- Un superadmin ne peut pas modifier un modérateur
- Seul un modérateur peut modifier tous les rôles

---

### 3. "Vous ne pouvez pas vous supprimer vous-même"

**Cause** : Protection pour éviter de se bloquer.

**Solution** :
- Demandez à un autre admin/modérateur de vous supprimer
- Ou créez un nouveau modérateur puis supprimez votre compte

---

## 🛡️ Sécurité - Bonnes Pratiques

### ✅ À FAIRE

1. **Principe du moindre privilège**
   ```
   Besoin de gérer des users ?          → Admin
   Besoin de gérer des admins aussi ?   → SuperAdmin
   Besoin d'un contrôle total ?         → Modérateur
   ```

2. **Un compte par personne**
   - Ne partagez JAMAIS les identifiants
   - Créez un compte pour chaque administrateur

3. **Révision régulière**
   - Vérifiez la liste des modérateurs tous les mois
   - Supprimez les comptes inactifs

4. **Mots de passe forts**
   ```
   ❌ Faible:    admin123
   ❌ Faible:    password
   ✅ Fort:      Modo@2026!SecurePass
   ✅ Fort:      M0d3r@teur#2026$
   ```

### ❌ À NE PAS FAIRE

1. **Ne créez pas trop de modérateurs**
   - 1 à 3 modérateurs suffisent
   - Plus il y en a, plus le risque de sécurité augmente

2. **Ne liez pas systématiquement**
   - Lier un compte admin à un user n'est utile que si nécessaire
   - Sinon, gardez-les séparés

3. **Ne supprimez pas le dernier modérateur**
   - Assurez-vous d'avoir toujours au moins 1 modérateur actif
   - Sinon vous perdrez l'accès admin complet

---

## 🔍 Vérifier les Permissions

### Test Rapide

**En tant qu'Admin** :
```
✅ Créer un user
✅ Modifier un user
✅ Supprimer un user
❌ Créer un admin
❌ Modifier un superadmin
❌ Supprimer un modérateur
```

**En tant que SuperAdmin** :
```
✅ Créer un user
✅ Créer un admin
✅ Modifier un admin
❌ Créer un modérateur
❌ Modifier un modérateur
```

**En tant que Modérateur** :
```
✅ TOUT !
✅ Créer n'importe quel rôle
✅ Modifier n'importe qui
✅ Supprimer n'importe qui (sauf soi-même)
```

---

## 📱 Interface Utilisateur

### Tableau de Bord Modérateurs

```
┌─────────────────────────────────────────┐
│  Gestion des Modérateurs                │
│                                          │
│  [+ Créer un Modérateur]                │
├─────────────────────────────────────────┤
│                                          │
│  📊 Modérateurs:    2                    │
│  📊 Super Admins:   3                    │
│  📊 Admins:         5                    │
│                                          │
├─────────────────────────────────────────┤
│  👤 Jean Moderateur                      │
│     jean.modo@entreprise.fr              │
│     [Modérateur] [Modifier] [Supprimer] │
│                                          │
│  👤 Marie SuperAdmin                     │
│     marie.sa@entreprise.fr               │
│     [SuperAdmin] [Modifier] [Supprimer]  │
│                                          │
└─────────────────────────────────────────┘
```

### Badges de Rôle

- 🔴 **Modérateur** (Badge rouge)
- 🔵 **SuperAdmin** (Badge bleu)
- ⚪ **Admin** (Badge gris)

---

## 🧪 Tester les Fonctionnalités

### Test Complet

1. **Créer un modérateur**
   ```bash
   Email: test.modo@test.fr
   Pass:  Modo@Test123
   Rôle:  Modérateur
   ```

2. **Se connecter avec ce compte**
   - Vérifier l'accès à tous les menus

3. **Créer un admin depuis le compte modérateur**
   ```bash
   Email: test.admin@test.fr
   Pass:  Admin@Test123
   Rôle:  Admin
   ```

4. **Se connecter avec le compte admin**
   - Vérifier qu'on ne peut PAS créer de modérateur

5. **Revenir au compte modérateur**
   - Modifier le rôle de l'admin → SuperAdmin
   - Vérifier dans la liste

6. **Supprimer le compte admin**
   - Confirmer la suppression
   - Vérifier qu'il a disparu de la liste

✅ **Si tout fonctionne, c'est parfait !**

---

## 💡 Conseils Avancés

### Stratégie de Déploiement

**Phase 1 - Setup Initial** :
1. Créer 1 modérateur principal (vous)
2. Créer 1 modérateur de backup (collègue)

**Phase 2 - Délégation** :
1. Créer 2-3 superadmins pour la gestion quotidienne
2. Les superadmins gèrent les admins

**Phase 3 - Opérationnel** :
1. Les admins gèrent les utilisateurs
2. Les modérateurs interviennent rarement
3. Révision mensuelle des permissions

---

### Audit des Permissions

**Checklist mensuelle** :
- [ ] Vérifier la liste des modérateurs (max 3)
- [ ] Vérifier les superadmins actifs
- [ ] Supprimer les comptes inactifs (> 30 jours)
- [ ] Vérifier qu'aucun compte partagé n'existe
- [ ] Forcer le changement de mot de passe si nécessaire

---

## 🆘 Besoin d'Aide ?

### Logs à Vérifier

```bash
# Dans la console navigateur (F12)
# Vérifier les erreurs lors de la création d'un modérateur

# Côté serveur (Supabase)
# Allez dans Logs → Functions
# Cherchez les appels à /admin/create
```

### Problèmes Fréquents

| Problème | Solution |
|----------|----------|
| Bouton "Créer" grisé | Vérifiez que tous les champs sont remplis |
| Erreur 401 | Token expiré, reconnectez-vous |
| Erreur 403 | Permissions insuffisantes |
| Liste vide | Aucun modérateur créé encore |

---

**TwoInOne - Gestion des Modérateurs Simplifiée ! 🚀**

[Fonctionnalités Complètes](/NOUVELLES_FONCTIONNALITES.md) • [Installation](/INSTALLATION_COMPLETE.md)
