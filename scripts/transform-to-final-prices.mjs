#!/usr/bin/env node
/**
 * Script de transformation des prix d'achat en prix de vente finaux
 * Applique un coefficient de 1.8 sur tous les prix
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COEFF = 1.8;
const catalogPath = join(__dirname, '../src/lib/catalog-data.ts');

console.log('🔄 Transformation des prix d\'achat en prix de vente finaux...');
console.log(`   Coefficient appliqué: ${COEFF}\n`);

let content = readFileSync(catalogPath, 'utf-8');
let modificationsCount = 0;

// 1. Transformer les grilles de prix (buyPrices)
console.log('📊 Transformation des grilles de prix (buyPrices)...');

// Pattern pour capturer les prix dans les grilles: { maxW: 3000, priceHT: 1200 }
const pricePattern = /\{\s*maxW:\s*(\d+),\s*priceHT:\s*(\d+)\s*\}/g;

content = content.replace(pricePattern, (match, maxW, priceHT) => {
  const originalPrice = parseInt(priceHT);
  const newPrice = Math.round(originalPrice * COEFF);
  modificationsCount++;
  
  if (modificationsCount <= 5) {
    console.log(`   ${originalPrice}€ → ${newPrice}€`);
  } else if (modificationsCount === 6) {
    console.log('   ...');
  }
  
  return `{ maxW: ${maxW}, priceHT: ${newPrice} }`;
});

console.log(`   ✅ ${modificationsCount} prix de grilles transformés\n`);

// 2. Transformer OPTIONS_PRICES
console.log('🔧 Transformation des prix d\'options (OPTIONS_PRICES)...');

// LED_ARMS grilles
const ledArmsPattern = /(LED_ARMS:\s*\{\s*)([\s\S]*?)(\s*\})/;
const ledArmsMatch = content.match(ledArmsPattern);
if (ledArmsMatch) {
  let ledArmsContent = ledArmsMatch[2];
  const ledPattern = /(\d+):\s*\[\s*([\d,\s]+)\s*\]/g;
  
  ledArmsContent = ledArmsContent.replace(ledPattern, (match, projection, values) => {
    const prices = values.split(',').map(v => v.trim());
    const newPrices = prices.map(p => Math.round(parseInt(p) * COEFF));
    console.log(`   LED_ARMS[${projection}]: [${prices.join(', ')}] → [${newPrices.join(', ')}]`);
    return `${projection}: [${newPrices.join(', ')}]`;
  });
  
  content = content.replace(ledArmsMatch[0], ledArmsMatch[1] + ledArmsContent + ledArmsMatch[3]);
}

// Prix simples des options
const simpleOptionPrices = [
  'LED_CASSETTE',
  'FRAME_SPECIFIC_RAL',
  'LAMBREQUIN_FIXE'
];

simpleOptionPrices.forEach(option => {
  const regex = new RegExp(`(${option}:\\s*)(\\d+)`);
  const match = content.match(regex);
  if (match) {
    const oldPrice = parseInt(match[2]);
    const newPrice = Math.round(oldPrice * COEFF);
    console.log(`   ${option}: ${oldPrice}€ → ${newPrice}€`);
    content = content.replace(regex, `$1${newPrice}`);
  }
});

console.log('   ✅ Prix d\'options transformés\n');

// 3. Supprimer CATALOG_SETTINGS (coefficients plus nécessaires)
console.log('🗑️  Suppression de CATALOG_SETTINGS (coefficients)...');

const catalogSettingsPattern = /export const CATALOG_SETTINGS = \{[\s\S]*?\n\};\n/;
const settingsMatch = content.match(catalogSettingsPattern);

if (settingsMatch) {
  // Garder seulement TVA et TRANSPORT, supprimer COEFF_MARGE et OPTIONS_COEFFICIENTS
  const newSettings = `export const CATALOG_SETTINGS = {
  TVA_NORMAL: 1.20,
  TVA_REDUIT: 1.10,
  promoCode: 'BIENVENUE2026',
  promoDiscount: 0.05,
  
  // Frais de transport pour stores de grande dimension
  TRANSPORT: {
    SEUIL_LARGEUR_MM: 3650,  // Seuil de déclenchement en millimètres de largeur
    FRAIS_HT: 139,           // Frais de transport en € HT (appliqués si largeur > seuil)
  }
};
`;
  content = content.replace(catalogSettingsPattern, newSettings);
  console.log('   ✅ COEFF_MARGE et OPTIONS_COEFFICIENTS supprimés\n');
}

// 4. Mettre à jour les commentaires pour indiquer prix finaux
content = content.replace(
  /buyPrices: Record<number, \{ maxW: number, priceHT: number \}\[\]\>;/,
  'buyPrices: Record<number, { maxW: number, priceHT: number }[]>; // Prix de vente HT finaux (coefficient déjà appliqué)'
);

content = content.replace(
  /\/\/ ==========================================\n\/\/ 3\. OPTIONS & PRIX \(BASE MATEST 2026\)\n\/\/ ==========================================/,
  `// ==========================================
// 3. OPTIONS & PRIX (PRIX FINAUX DE VENTE HT)
// ==========================================
// ⚠️ IMPORTANT: Tous les prix sont des prix de VENTE HT finaux
// Le coefficient de marge a déjà été appliqué (×1.8)`
);

// 5. Ajouter un commentaire au début
const headerComment = `// /src/lib/catalog-data.ts
// ⚠️ PRIX FINAUX: Tous les prix dans ce fichier sont des prix de VENTE HT
// Les coefficients de marge ont été pré-appliqués lors de la génération
// Backup original disponible dans: catalog-data.backup.ts

`;

content = content.replace(/^\/\/ \/src\/lib\/catalog-data\.ts\n/, headerComment);

// Écrire le fichier modifié
writeFileSync(catalogPath, content, 'utf-8');

console.log('✨ Transformation terminée!');
console.log(`📁 Fichier mis à jour: ${catalogPath}`);
console.log(`📦 Backup disponible: ${catalogPath.replace('.ts', '.backup.ts')}\n`);

console.log('⚠️  PROCHAINES ÉTAPES:');
console.log('   1. Modifier calculateFinalPrice() pour ne plus multiplier par coefficients');
console.log('   2. Supprimer les références à model.salesCoefficient');
console.log('   3. Supprimer les références à model.optionsCoefficients');
console.log('   4. Tester que les prix affichés sont identiques');
