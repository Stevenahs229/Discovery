#!/bin/bash

echo "🧹 Nettoyage complet de TwoInOne..."
echo ""

# Supprimer node_modules
if [ -d "node_modules" ]; then
    echo "Suppression de node_modules..."
    rm -rf node_modules
    echo "✓ node_modules supprimé"
fi

# Supprimer les fichiers de lock
for file in package-lock.json yarn.lock pnpm-lock.yaml; do
    if [ -f "$file" ]; then
        echo "Suppression de $file..."
        rm -f "$file"
        echo "✓ $file supprimé"
    fi
done

# Supprimer le cache Vite
if [ -d ".vite" ]; then
    echo "Suppression du cache Vite..."
    rm -rf .vite
    echo "✓ Cache Vite supprimé"
fi

# Supprimer le cache npm
echo "Nettoyage du cache npm..."
npm cache clean --force 2>/dev/null || true
echo "✓ Cache npm nettoyé"

echo ""
echo "✅ Nettoyage terminé !"
echo ""
echo "Prochaines étapes :"
echo "  npm install --legacy-peer-deps"
echo "  npm run dev"
