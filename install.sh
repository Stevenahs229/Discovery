#!/bin/bash

echo "🚀 Installation de TwoInOne - Application de Présence Sécurisée"
echo "=============================================================="
echo ""
echo "⚠️  IMPORTANT: Cette installation corrige l'erreur jsxDEV"
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Étape 1 : Nettoyage
echo "📦 Étape 1/5 : Nettoyage des anciennes installations..."
if [ -d "node_modules" ]; then
    rm -rf node_modules
    print_success "node_modules supprimé"
fi

if [ -f "package-lock.json" ]; then
    rm -f package-lock.json
    print_success "package-lock.json supprimé"
fi

if [ -f "yarn.lock" ]; then
    rm -f yarn.lock
    print_success "yarn.lock supprimé"
fi

if [ -f "pnpm-lock.yaml" ]; then
    rm -f pnpm-lock.yaml
    print_success "pnpm-lock.yaml supprimé"
fi

if [ -d ".vite" ]; then
    rm -rf .vite
    print_success "Cache Vite supprimé"
fi

echo ""

# Étape 2 : Vérification de Node.js
echo "🔍 Étape 2/5 : Vérification de l'environnement..."
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v)
print_success "Node.js $NODE_VERSION détecté"

if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé. Veuillez l'installer"
    exit 1
fi

NPM_VERSION=$(npm -v)
print_success "npm $NPM_VERSION détecté"

echo ""

# Étape 3 : Installation des dépendances
echo "📥 Étape 3/5 : Installation des dépendances..."
echo "Cela peut prendre quelques minutes..."
echo ""

npm install --legacy-peer-deps

if [ $? -eq 0 ]; then
    print_success "Toutes les dépendances ont été installées avec succès !"
else
    print_error "Erreur lors de l'installation des dépendances"
    echo ""
    print_warning "Essayez de lancer manuellement :"
    echo "  npm install --legacy-peer-deps"
    exit 1
fi

echo ""

# Étape 4 : Vérification finale
echo "✅ Étape 4/5 : Vérification de l'installation..."

# Vérifier que les fichiers essentiels existent
if [ ! -f "vite.config.ts" ]; then
    print_error "vite.config.ts manquant"
    exit 1
fi
print_success "vite.config.ts ✓"

if [ ! -f "tsconfig.json" ]; then
    print_error "tsconfig.json manquant"
    exit 1
fi
print_success "tsconfig.json ✓"

if [ ! -f "index.html" ]; then
    print_error "index.html manquant"
    exit 1
fi
print_success "index.html ✓"

if [ ! -f "src/main.tsx" ]; then
    print_error "src/main.tsx manquant"
    exit 1
fi
print_success "src/main.tsx ✓"

if [ ! -d "node_modules" ]; then
    print_error "node_modules n'existe pas"
    exit 1
fi
print_success "node_modules ✓"

echo ""
echo "=============================================================="
print_success "🎉 Installation terminée avec succès !"
echo "=============================================================="
echo ""
echo "📝 Prochaines étapes :"
echo ""
echo "  1. Lancer le serveur de développement :"
echo "     ${GREEN}npm run dev${NC}"
echo ""
echo "  2. Ouvrir votre navigateur sur :"
echo "     ${GREEN}http://localhost:5173${NC}"
echo ""
echo "  3. Pour builder en production :"
echo "     ${GREEN}npm run build${NC}"
echo ""
echo "💡 Conseils :"
echo "  - Code OTP de test : ${YELLOW}999999${NC}"
echo "  - Basculer en mode admin via le bouton en haut à droite"
echo ""
echo "📖 Consultez le README.md pour plus d'informations"
echo ""