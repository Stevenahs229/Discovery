#!/bin/bash

echo "🔧 Correction rapide de l'erreur jsxDEV..."
echo ""

# Supprimer le cache Vite
if [ -d ".vite" ]; then
    echo "Suppression du cache Vite..."
    rm -rf .vite
    echo "✓ Cache supprimé"
fi

# Supprimer node_modules/.vite si existe
if [ -d "node_modules/.vite" ]; then
    echo "Suppression du cache node_modules/.vite..."
    rm -rf node_modules/.vite
    echo "✓ Cache supprimé"
fi

echo ""
echo "✅ Correction terminée !"
echo ""
echo "Maintenant lancez:"
echo "  npm run dev"
