#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Vérification de l\'installation TwoInOne\n');

const checks = {
  '✓': '\x1b[32m✓\x1b[0m',
  '✗': '\x1b[31m✗\x1b[0m',
  '⚠': '\x1b[33m⚠\x1b[0m',
};

let hasErrors = false;

// Fichiers requis
const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'tsconfig.node.json',
  'index.html',
  'src/main.tsx',
  'src/app/App.tsx',
  'src/app/AdminApp.tsx',
  'src/styles/index.css',
  'src/styles/theme.css',
  '.npmrc',
];

console.log('📄 Vérification des fichiers essentiels:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? checks['✓'] : checks['✗']} ${file}`);
  if (!exists) hasErrors = true;
});

console.log('\n📦 Vérification des dépendances:');

// Vérifier node_modules
const nodeModulesExists = fs.existsSync(path.join(__dirname, 'node_modules'));
console.log(`  ${nodeModulesExists ? checks['✓'] : checks['✗']} node_modules/`);
if (!nodeModulesExists) {
  console.log(`    ${checks['⚠']} Exécutez: npm install --legacy-peer-deps`);
  hasErrors = true;
}

// Vérifier react et react-dom
const reactPath = path.join(__dirname, 'node_modules', 'react');
const reactDomPath = path.join(__dirname, 'node_modules', 'react-dom');

const reactExists = fs.existsSync(reactPath);
const reactDomExists = fs.existsSync(reactDomPath);

console.log(`  ${reactExists ? checks['✓'] : checks['✗']} react`);
console.log(`  ${reactDomExists ? checks['✓'] : checks['✗']} react-dom`);

if (!reactExists || !reactDomExists) {
  hasErrors = true;
}

// Vérifier les JSX runtime
if (reactExists) {
  const jsxDevRuntime = fs.existsSync(path.join(reactPath, 'jsx-dev-runtime.js'));
  const jsxRuntime = fs.existsSync(path.join(reactPath, 'jsx-runtime.js'));
  
  console.log(`  ${jsxDevRuntime ? checks['✓'] : checks['✗']} react/jsx-dev-runtime.js`);
  console.log(`  ${jsxRuntime ? checks['✓'] : checks['✗']} react/jsx-runtime.js`);
  
  if (!jsxDevRuntime || !jsxRuntime) {
    hasErrors = true;
  }
}

// Vérifier @vitejs/plugin-react
const viteReactPlugin = fs.existsSync(path.join(__dirname, 'node_modules', '@vitejs', 'plugin-react'));
console.log(`  ${viteReactPlugin ? checks['✓'] : checks['✗']} @vitejs/plugin-react`);
if (!viteReactPlugin) hasErrors = true;

console.log('\n⚙️  Vérification de la configuration:');

// Vérifier vite.config.ts
try {
  const viteConfig = fs.readFileSync(path.join(__dirname, 'vite.config.ts'), 'utf8');
  const hasReactPlugin = viteConfig.includes('react()');
  const hasJsxAlias = viteConfig.includes('jsx-runtime');
  
  console.log(`  ${hasReactPlugin ? checks['✓'] : checks['✗']} Plugin React configuré`);
  console.log(`  ${hasJsxAlias ? checks['✓'] : checks['✗']} Alias JSX runtime configuré`);
  
  if (!hasReactPlugin || !hasJsxAlias) {
    hasErrors = true;
  }
} catch (error) {
  console.log(`  ${checks['✗']} Erreur lecture vite.config.ts`);
  hasErrors = true;
}

// Vérifier package.json scripts
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const hasDevScript = pkg.scripts && pkg.scripts.dev;
  const hasBuildScript = pkg.scripts && pkg.scripts.build;
  
  console.log(`  ${hasDevScript ? checks['✓'] : checks['✗']} Script "dev" configuré`);
  console.log(`  ${hasBuildScript ? checks['✓'] : checks['✗']} Script "build" configuré`);
  
  if (!hasDevScript || !hasBuildScript) {
    hasErrors = true;
  }
} catch (error) {
  console.log(`  ${checks['✗']} Erreur lecture package.json`);
  hasErrors = true;
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log(`\n${checks['✗']} Des problèmes ont été détectés !`);
  console.log('\n📝 Solutions suggérées:');
  console.log('  1. Nettoyer et réinstaller:');
  console.log('     rm -rf node_modules package-lock.json');
  console.log('     npm install --legacy-peer-deps');
  console.log('\n  2. Ou utiliser le script d\'installation:');
  console.log('     bash install.sh  (Linux/Mac)');
  console.log('     install.bat      (Windows)');
  process.exit(1);
} else {
  console.log(`\n${checks['✓']} Tout est bon ! Vous pouvez lancer:`);
  console.log('     npm run dev');
  process.exit(0);
}
