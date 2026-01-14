# ✅ PWA Installation Checklist

## Avant de commencer

- [ ] Node.js est installé (v16+)
- [ ] npm fonctionne correctement
- [ ] Le projet TwoInOne est récupéré

---

## 🔧 Étape 1 : Vérifier les fichiers PWA

### Configuration
- [ ] `/public/manifest.json` existe
- [ ] `/public/sw.js` existe
- [ ] `/index.html` contient les meta tags PWA
- [ ] `<link rel="manifest">` est présent

### Icônes
- [ ] `/public/icon.svg` existe
- [ ] `/public/icon-192.png` existe
- [ ] `/public/icon-512.png` existe

### Composants React
- [ ] `/src/app/components/PWAInstallPrompt.tsx` existe
- [ ] `/src/app/components/PWAHelpers.tsx` existe
- [ ] `/src/app/components/PWADebugPanel.tsx` existe
- [ ] Ces composants sont importés dans `/src/app/App.tsx`

---

## 🚀 Étape 2 : Build et Test

### Build de production
```bash
npm run build
```

- [ ] Build réussi sans erreurs
- [ ] Dossier `/dist` créé

### Prévisualisation
```bash
npm run preview
```

- [ ] Serveur démarre sur http://localhost:4173
- [ ] Page s'affiche correctement
- [ ] Pas d'erreurs dans la console

---

## 🔍 Étape 3 : Vérification Chrome DevTools

### Ouvrir DevTools
1. **F12** ou **Clic droit > Inspecter**
2. Onglet **Application**

### Manifest
- [ ] Section "Manifest" affiche les données
- [ ] Nom : "TwoInOne - Gestion de Présence Sécurisée"
- [ ] Icônes : 192x192 et 512x512 visibles
- [ ] Theme color : #4F46E5

### Service Worker
- [ ] Section "Service Workers" affiche "sw.js"
- [ ] Status : "activated and is running"
- [ ] Bouton "Update" présent

### Cache Storage
- [ ] Section "Cache Storage" affiche "twoinone-v1"
- [ ] Fichiers HTML, CSS, JS visibles dans le cache

### Console
- [ ] Message : "✅ Service Worker enregistré avec succès"
- [ ] Pas d'erreurs rouges

---

## 📱 Étape 4 : Test sur Mobile

### Android (Chrome)

#### Via WiFi (même réseau)
1. Trouver IP locale : `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
2. Sur smartphone : ouvrir `http://[IP]:4173`
3. [ ] Page s'affiche correctement
4. [ ] Prompt "Installer TwoInOne" apparaît en bas
5. [ ] Cliquer sur "Installer"
6. [ ] Icône TwoInOne sur l'écran d'accueil
7. [ ] Ouvrir l'app : Mode plein écran (pas de barre navigateur)

#### Vérification post-installation
- [ ] App démarre rapidement
- [ ] Splash screen s'affiche
- [ ] Barre d'état en indigo
- [ ] Toutes les fonctionnalités marchent

### iOS (Safari)

1. Ouvrir l'URL dans **Safari** (pas Chrome)
2. [ ] Page s'affiche correctement
3. [ ] Icône Partager (⬆️) en bas
4. [ ] "Sur l'écran d'accueil"
5. [ ] Nommer "TwoInOne"
6. [ ] "Ajouter"
7. [ ] Icône sur l'écran d'accueil
8. [ ] Ouvrir : Mode app native

---

## 🧪 Étape 5 : Tests Fonctionnels

### Mode Hors Ligne
1. [ ] Ouvrir l'app installée
2. [ ] Activer mode avion / couper WiFi
3. [ ] Bannière orange "Mode hors ligne" apparaît
4. [ ] App continue de se charger (pages visitées)
5. [ ] Réactiver connexion
6. [ ] Bannière verte "Connexion rétablie" apparaît

### Panel de Debug
- [ ] Appuyer sur **Ctrl+Shift+P** (ou cliquer icône 🔧)
- [ ] Panel s'affiche en bas à gauche
- [ ] Score : 5/5 (100%)
- [ ] Mode Installé : ✅ Oui
- [ ] Support SW : ✅ Oui
- [ ] SW Actif : ✅ Actif
- [ ] Manifest : ✅ Valide
- [ ] Connexion : ✅ En ligne

### Prompt d'Installation
- [ ] Sur navigateur (non installé) : Prompt apparaît
- [ ] Design cohérent avec l'app
- [ ] Boutons "Installer" et "Plus tard" fonctionnent
- [ ] Bouton ✕ ferme le prompt
- [ ] Après installation : Prompt disparaît

---

## 📊 Étape 6 : Audit Lighthouse

### Lancer l'audit
1. Chrome DevTools > **Lighthouse**
2. Cocher **Progressive Web App**
3. **Generate report**

### Scores attendus
- [ ] PWA : **90+** / 100
- [ ] Performance : 80+ / 100
- [ ] Accessibility : 90+ / 100
- [ ] Best Practices : 90+ / 100

### Critères PWA vérifiés
- [ ] ✅ Installe une Web App
- [ ] ✅ Fournit un manifest valide
- [ ] ✅ Utilise un Service Worker
- [ ] ✅ Répond avec 200 quand hors ligne
- [ ] ✅ Configure un viewport
- [ ] ✅ Contenu dimensionné correctement
- [ ] ✅ Thème couleur défini

---

## 🔄 Étape 7 : Mises à Jour

### Tester la mise à jour
1. Modifier un fichier (ex: changer texte dans App.tsx)
2. [ ] `npm run build`
3. [ ] `npm run preview`
4. [ ] Rafraîchir l'app installée
5. [ ] Nouveau contenu visible (peut nécessiter 2 refresh)

### Vérifier cache
- [ ] DevTools > Application > Cache Storage
- [ ] Nouveau cache "twoinone-v2" créé
- [ ] Ancien cache supprimé après activation

---

## 🎯 Étape 8 : Vérification Finale

### Fonctionnalités Core
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Déclaration de présence fonctionne
- [ ] Interface admin accessible
- [ ] Logout fonctionne
- [ ] Navigation fluide

### PWA Features
- [ ] Installation possible
- [ ] Mode standalone fonctionne
- [ ] Icônes correctes
- [ ] Mode hors ligne géré
- [ ] Bannières hors ligne/en ligne
- [ ] Prompt d'installation intelligent
- [ ] Panel de debug fonctionnel

### Performance
- [ ] Chargement rapide (<3s)
- [ ] Transitions fluides
- [ ] Pas de freeze/lag
- [ ] Responsive sur tous écrans

### Cross-Browser
- [ ] ✅ Chrome/Edge Android
- [ ] ✅ Safari iOS
- [ ] ✅ Desktop Chrome
- [ ] ⚠️ Firefox (fonctionnel mais limité)

---

## 🎊 Résultat Final

Si tous les points sont cochés : **🎉 Félicitations ! Votre PWA TwoInOne est parfaitement fonctionnelle !**

Si certains points échouent :
1. Consultez `/PWA_TESTING_GUIDE.md`
2. Vérifiez la console pour les erreurs
3. Utilisez le Panel de Debug (Ctrl+Shift+P)
4. Testez avec Lighthouse

---

## 📞 Support

En cas de problème persistant :
- [ ] Vérifier `/PWA_README.md`
- [ ] Consulter `/PWA_INSTALLATION_GUIDE.md`
- [ ] Analyser Chrome DevTools > Console
- [ ] Tester sur un autre navigateur
- [ ] Effacer cache et réessayer

---

**Score Idéal** : ✅ 50/50 points

**Votre Score** : _____ / 50

**Prêt pour la production** : ☐ Oui  ☐ Non  ☐ Presque

---

*Checklist TwoInOne PWA v1.0 - 2026-01-14*
