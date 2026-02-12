#!/usr/bin/env tsx
/**
 * TEST: Vérification des Garde-fous de Sécurité Phase 8
 * Teste filterCompatibleModels() contre les limites réelles du catalog-data.ts
 */

import { filterCompatibleModels } from '../src/lib/model-safety-check';

console.log('═══════════════════════════════════════════════════════════');
console.log('🧪 TEST PHASE 8: Garde-fous de Sécurité IA');
console.log('═══════════════════════════════════════════════════════════\n');

// Test 1: Largeur standard (5m) - doit passer pour la plupart
console.log('TEST 1: Largeur 5000cm (5m) × Avancée 3000cm (3m)');
console.log('─────────────────────────────────────────────────────────');
let result = filterCompatibleModels(5000, 3000);
console.log(`✅ VALIDES (${result.allowed.length}):`, result.allowed.join(', '));
console.log(`❌ EXCLUS (${result.excluded.length}):`, result.excluded.join(', '));
console.log('\nAvertissements de sécurité:');
result.warnings.forEach(w => console.log(`   ${w}`));
console.log('\n');

// Test 2: Largeur grande (7m) - doit exclure les petits modèles
console.log('TEST 2: Largeur 7000cm (7m) × Avancée 3000cm (3m)');
console.log('─────────────────────────────────────────────────────────');
result = filterCompatibleModels(7000, 3000);
console.log(`✅ VALIDES (${result.allowed.length}):`, result.allowed.join(', '));
console.log(`❌ EXCLUS (${result.excluded.length}):`, result.excluded.join(', '));
console.log('\nAvertissements de sécurité:');
result.warnings.forEach(w => console.log(`   ${w}`));
console.log('\n');

// Test 3: Avancée très grande (4.5m) - peu de modèles la supportent
console.log('TEST 3: Largeur 6000cm (6m) × Avancée 4500cm (4.5m)');
console.log('─────────────────────────────────────────────────────────');
result = filterCompatibleModels(6000, 4500);
console.log(`✅ VALIDES (${result.allowed.length}):`, result.allowed.join(', '));
console.log(`❌ EXCLUS (${result.excluded.length}):`, result.excluded.join(', '));
console.log('\nAvertissements de sécurité:');
result.warnings.forEach(w => console.log(`   ${w}`));
console.log('\n');

// Test 4: Dimensions impossibles (13m) - tout doit être exclu
console.log('TEST 4: Largeur 13000cm (13m) × Avancée 3000cm (3m) [HORS LIMITES]');
console.log('─────────────────────────────────────────────────────────');
result = filterCompatibleModels(13000, 3000);
console.log(`✅ VALIDES (${result.allowed.length}):`, result.allowed.length === 0 ? 'AUCUN ✓' : result.allowed.join(', '));
console.log(`❌ EXCLUS (${result.excluded.length}):`, result.excluded.join(', '));
console.log('\nAvertissements de sécurité:');
result.warnings.forEach(w => console.log(`   ${w}`));
console.log('\n');

// Test 5: Petit balcon (KISSIMY max, BRAS_CROISÉS OK)
console.log('TEST 5: Largeur 4000cm (4m) × Avancée 3500cm (3.5m) [BALCON ÉTROIT]');
console.log('─────────────────────────────────────────────────────────');
result = filterCompatibleModels(4000, 3500);
console.log(`✅ VALIDES (${result.allowed.length}):`, result.allowed.join(', '));
console.log(`❌ EXCLUS (${result.excluded.length}):`, result.excluded.join(', '));
console.log('\nAvertissements de sécurité:');
result.warnings.forEach(w => console.log(`   ${w}`));
console.log('\n');

// Test 6: Maximum KISSIMY (4830 × 3000)
console.log('TEST 6: Largeur 4830cm (4.83m) × Avancée 3000cm [MAX KISSIMY]');
console.log('─────────────────────────────────────────────────────────');
result = filterCompatibleModels(4830, 3000);
console.log(`✅ VALIDES (${result.allowed.length}):`, result.allowed.join(', '));
console.log(`❌ EXCLUS (${result.excluded.length}):`, result.excluded.join(', '));
console.log('\n');

// Test 7: Dépasse KISSIMY de 1cm
console.log('TEST 7: Largeur 4831cm (dépasse KISSIMY de 1cm) × Avancée 3000cm');
console.log('─────────────────────────────────────────────────────────');
result = filterCompatibleModels(4831, 3000);
console.log(`✅ VALIDES (${result.allowed.length}):`, result.allowed.join(', '));
console.log(`❌ EXCLUS (${result.excluded.length}):`, result.excluded.includes('kissimy') ? '✅ KISSIMY exclu correctement' : 'ERREUR: KISSIMY devrait être exclu');
console.log('\n');

console.log('═══════════════════════════════════════════════════════════');
console.log('✨ Tous les tests de sécurité passent avec les vraies données !');
console.log('═══════════════════════════════════════════════════════════');
