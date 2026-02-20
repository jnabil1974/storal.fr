#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const catalogPath = join(__dirname, '../src/lib/catalog-data.ts');

console.log('🔄 Suppression des propriétés salesCoefficient et optionsCoefficients des modèles...\n');

let content = readFileSync(catalogPath, 'utf-8');

// Pattern pour trouver et supprimer salesCoefficient + optionsCoefficients
const coeffPattern = /\s+salesCoefficient: \d+,\s*\/\/[^\n]*\n\s+optionsCoefficients: \{[\s\S]*?\},\n/g;

let count = 0;
content = content.replace(coeffPattern, (match) => {
  count++;
  console.log(`✅ Bloc ${count} supprimé`);
  return '';
});

console.log(`\n📊 Total: ${count} blocs supprimés`);

writeFileSync(catalogPath, content, 'utf-8');

console.log('✨ Nettoyage terminé!\n');
console.log('📁 Fichier mis à jour:', catalogPath);
