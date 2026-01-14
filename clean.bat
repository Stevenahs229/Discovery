@echo off
echo Nettoyage complet de TwoInOne...
echo.

if exist node_modules (
    echo Suppression de node_modules...
    rmdir /s /q node_modules
    echo OK - node_modules supprime
)

if exist package-lock.json (
    echo Suppression de package-lock.json...
    del /f /q package-lock.json
    echo OK - package-lock.json supprime
)

if exist yarn.lock (
    echo Suppression de yarn.lock...
    del /f /q yarn.lock
    echo OK - yarn.lock supprime
)

if exist pnpm-lock.yaml (
    echo Suppression de pnpm-lock.yaml...
    del /f /q pnpm-lock.yaml
    echo OK - pnpm-lock.yaml supprime
)

if exist .vite (
    echo Suppression du cache Vite...
    rmdir /s /q .vite
    echo OK - Cache Vite supprime
)

echo Nettoyage du cache npm...
call npm cache clean --force
echo OK - Cache npm nettoye

echo.
echo Nettoyage termine !
echo.
echo Prochaines etapes :
echo   npm install --legacy-peer-deps
echo   npm run dev
pause
