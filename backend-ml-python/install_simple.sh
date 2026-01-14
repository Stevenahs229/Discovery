#!/bin/bash

echo "=========================================="
echo "🚀 Installation Simplifiée Backend ML"
echo "=========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Création environnement virtuel...${NC}"
python3 -m venv venv

echo -e "${YELLOW}2. Activation environnement...${NC}"
source venv/bin/activate

echo -e "${YELLOW}3. Installation dépendances SIMPLIFIÉES...${NC}"
pip install --upgrade pip
pip install -r requirements_simple.txt

echo ""
echo -e "${GREEN}✅ Installation terminée !${NC}"
echo ""
echo "=========================================="
echo "🎯 Pour démarrer le serveur :"
echo "=========================================="
echo ""
echo "  source venv/bin/activate"
echo "  python main_simple.py"
echo ""
echo "  OU"
echo ""
echo "  uvicorn main_simple:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "=========================================="
echo "📝 Mode SIMULATION actif"
echo "   - Pas besoin d'OpenCV ou face_recognition"
echo "   - Reconnaissance faciale simulée"
echo "   - Parfait pour tester l'application"
echo "=========================================="
