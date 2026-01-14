@echo off
echo Correction rapide de l'erreur jsxDEV...
echo.

if exist .vite (
    echo Suppression du cache Vite...
    rmdir /s /q .vite
    echo OK - Cache supprime
)

if exist node_modules\.vite (
    echo Suppression du cache node_modules\.vite...
    rmdir /s /q node_modules\.vite
    echo OK - Cache supprime
)

echo.
echo Correction terminee !
echo.
echo Maintenant lancez:
echo   npm run dev
pause
