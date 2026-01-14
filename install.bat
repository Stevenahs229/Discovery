@echo off
setlocal enabledelayedexpansion

echo ========================================
echo TwoInOne - Installation
echo ========================================
echo.

:: Etape 1 : Nettoyage
echo [Etape 1/4] Nettoyage...
if exist node_modules (
    echo Suppression de node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Suppression de package-lock.json...
    del /f /q package-lock.json
)
if exist yarn.lock (
    echo Suppression de yarn.lock...
    del /f /q yarn.lock
)
if exist pnpm-lock.yaml (
    echo Suppression de pnpm-lock.yaml...
    del /f /q pnpm-lock.yaml
)
if exist .vite (
    echo Suppression du cache Vite...
    rmdir /s /q .vite
)
echo OK - Nettoyage termine
echo.

:: Etape 2 : Verification
echo [Etape 2/4] Verification de Node.js et npm...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installe
    echo Telechargez-le depuis https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo Node.js %NODE_VERSION% detecte
echo OK
echo.

:: Etape 3 : Installation
echo [Etape 3/4] Installation des dependances...
echo Cela peut prendre quelques minutes...
echo.
call npm install --legacy-peer-deps

if %errorlevel% neq 0 (
    echo.
    echo ERREUR: Echec de l'installation
    echo Essayez manuellement: npm install --legacy-peer-deps
    pause
    exit /b 1
)

echo.
echo OK - Dependances installees
echo.

:: Etape 4 : Verification
echo [Etape 4/4] Verification finale...

if not exist "vite.config.ts" (
    echo ERREUR: vite.config.ts manquant
    pause
    exit /b 1
)
echo vite.config.ts OK

if not exist "tsconfig.json" (
    echo ERREUR: tsconfig.json manquant
    pause
    exit /b 1
)
echo tsconfig.json OK

if not exist "index.html" (
    echo ERREUR: index.html manquant
    pause
    exit /b 1
)
echo index.html OK

if not exist "src\main.tsx" (
    echo ERREUR: src\main.tsx manquant
    pause
    exit /b 1
)
echo src\main.tsx OK

if not exist "node_modules" (
    echo ERREUR: node_modules manquant
    pause
    exit /b 1
)
echo node_modules OK

echo.
echo ========================================
echo Installation terminee avec succes !
echo ========================================
echo.
echo Prochaines etapes :
echo.
echo 1. Lancer le serveur :
echo    npm run dev
echo.
echo 2. Ouvrir le navigateur sur :
echo    http://localhost:5173
echo.
echo 3. Code OTP de test : 999999
echo.
echo Consultez README.md pour plus d'infos
echo.
pause
