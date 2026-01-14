#!/bin/bash

# 🚀 Script de Build et Test PWA TwoInOne

echo "🎯 TwoInOne - Build PWA"
echo "======================="
echo ""

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer Node.js."
    exit 1
fi

echo "📦 Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo ""
echo "🔨 Build de l'application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo ""
echo "✅ Build terminé avec succès !"
echo ""
echo "🌐 Démarrage du serveur de prévisualisation..."
echo ""
echo "📱 Pour tester sur mobile (même réseau WiFi) :"
echo "   1. Trouvez votre IP locale avec 'ifconfig' ou 'ipconfig'"
echo "   2. Sur votre smartphone, ouvrez : http://[VOTRE_IP]:4173"
echo ""
echo "🔧 Panel de debug : Appuyez sur Ctrl+Shift+P"
echo "📖 Documentation : Voir PWA_README.md"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

npm run preview
