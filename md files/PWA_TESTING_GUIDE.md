# 🧪 Test PWA TwoInOne

## Comment tester la PWA en développement

### 1. Build de production
```bash
npm run build
```

### 2. Prévisualisation locale
```bash
npm run preview
```

### 3. Test sur mobile (même réseau WiFi)

1. Trouvez votre adresse IP locale :
   - **Windows** : `ipconfig` dans CMD
   - **Mac/Linux** : `ifconfig` ou `ip addr` dans Terminal

2. Sur votre smartphone, ouvrez le navigateur et allez à :
   ```
   http://[VOTRE_IP]:4173
   ```
   Exemple : `http://192.168.1.100:4173`

3. Le prompt d'installation devrait apparaître !

---

## ✅ Checklist de vérification PWA

### Manifest
- [ ] Le fichier `/public/manifest.json` existe
- [ ] Les icônes sont présentes dans `/public/`
- [ ] Le manifest est référencé dans `index.html`

### Service Worker
- [ ] Le fichier `/public/sw.js` existe
- [ ] Le SW est enregistré dans `index.html`
- [ ] Dans DevTools > Application > Service Workers, le SW est actif

### Meta Tags
- [ ] `theme-color` est défini
- [ ] `viewport` est configuré
- [ ] Les icônes Apple Touch sont définies

### Test d'installation
- [ ] Sur Android Chrome : Le prompt "Installer" apparaît
- [ ] Sur iOS Safari : "Ajouter à l'écran d'accueil" fonctionne
- [ ] L'app s'ouvre en mode standalone (plein écran)
- [ ] L'icône personnalisée apparaît

### Mode hors ligne
- [ ] Dans DevTools, activez "Offline"
- [ ] L'app continue de fonctionner
- [ ] La bannière "Mode hors ligne" s'affiche

---

## 🔧 Outils de débogage

### Chrome DevTools

1. **F12** ou **Clic droit > Inspecter**
2. Onglet **Application** :
   - **Manifest** : Vérifier les métadonnées
   - **Service Workers** : État du SW
   - **Cache Storage** : Fichiers en cache
   - **Offline** : Tester le mode hors ligne

### Lighthouse Audit

1. Ouvrez DevTools > **Lighthouse**
2. Sélectionnez **Progressive Web App**
3. Cliquez sur **Generate report**
4. Score attendu : **90+** / 100

---

## 📱 Test sur appareil réel

### Android (recommandé)

1. **USB Debugging** :
   - Activez le mode développeur sur Android
   - Connectez via USB
   - Chrome DevTools > **Remote devices**
   - Inspectez l'app sur le téléphone

2. **ngrok** (sans USB) :
   ```bash
   npm install -g ngrok
   npm run preview
   ngrok http 4173
   ```
   Utilisez l'URL ngrok sur votre téléphone

### iOS

1. **Safari Web Inspector** :
   - Sur Mac : Safari > Développement > [Votre iPhone]
   - Inspectez la page web
   
2. **Tunneling** avec ngrok (voir ci-dessus)

---

## 🐛 Problèmes courants

### Le Service Worker ne s'enregistre pas
- Vérifiez que vous êtes en HTTPS ou localhost
- Effacez le cache du navigateur
- Vérifiez les erreurs dans la console

### Le prompt d'installation n'apparaît pas
- Le manifest doit être valide
- Besoin d'un Service Worker fonctionnel
- L'app doit répondre aux critères PWA de Chrome
- Sur iOS, utilisez la méthode manuelle (Partager > Écran d'accueil)

### L'app ne fonctionne pas hors ligne
- Vérifiez que le SW est actif
- Contrôlez la stratégie de cache dans `sw.js`
- Testez avec DevTools > Application > Offline

---

## 📊 Critères PWA validés pour TwoInOne

| Critère | Status | Description |
|---------|--------|-------------|
| HTTPS/Localhost | ✅ | Supabase fournit HTTPS |
| Manifest | ✅ | manifest.json configuré |
| Service Worker | ✅ | sw.js actif |
| Icônes | ✅ | 192x192 et 512x512 |
| Mode standalone | ✅ | display: standalone |
| Theme color | ✅ | #4F46E5 (indigo) |
| Start URL | ✅ | / |
| Responsive | ✅ | Tailwind CSS |

---

## 🚀 Déploiement

Après déploiement sur Supabase/Vercel/Netlify :

1. L'URL sera en HTTPS automatiquement
2. La PWA fonctionnera immédiatement
3. Les utilisateurs pourront l'installer
4. Les mises à jour seront automatiques

**Note** : En production, le Service Worker sera automatiquement servi en HTTPS, ce qui est obligatoire pour les PWA.

---

## 📞 Support

Pour toute question sur la PWA :
- Consultez le guide `/PWA_INSTALLATION_GUIDE.md`
- Vérifiez la console Chrome DevTools
- Testez avec Lighthouse

**Bonne installation ! 🎉**
