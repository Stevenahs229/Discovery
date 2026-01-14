@echo off
REM 🚀 Script de Build et Test PWA TwoInOne (Windows)

echo 🎯 TwoInOne - Build PWA
echo =======================
echo.

REM Vérifier que npm est installé
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm n'est pas installé. Veuillez installer Node.js.
    pause
    exit /b 1
)

echo 📦 Installation des dépendances...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)

echo.
echo 🔨 Build de l'application...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors du build
    pause
    exit /b 1
)

echo.
echo ✅ Build terminé avec succès !
echo.
echo 🌐 Démarrage du serveur de prévisualisation...
echo.
echo 📱 Pour tester sur mobile (même réseau WiFi) :
echo    1. Trouvez votre IP locale avec 'ipconfig' dans CMD
echo    2. Sur votre smartphone, ouvrez : http://[VOTRE_IP]:4173
echo.
echo 🔧 Panel de debug : Appuyez sur Ctrl+Shift+P
echo 📖 Documentation : Voir PWA_README.md
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

call npm run preview
