/**
 * Script de test pour calculer les coûts de pose selon la zone
 * Usage: node test-installation-cost.mjs
 */

import { ZONES_INTERVENTION, calculateInstallationCostWithZone } from './src/lib/intervention-zones.ts';

console.log('🧪 Test des tarifs de pose par département\n');
console.log('=' .repeat(80));

// Tests pour différentes largeurs et zones
const testCases = [
  { width: 4000, codePostal: '75001', description: 'Store 4m à Paris' },
  { width: 6000, codePostal: '92100', description: 'Store 6m à Hauts-de-Seine' },
  { width: 7000, codePostal: '91000', description: 'Store 7m à Essonne' },
  { width: 8500, codePostal: '45000', description: 'Store 8.5m à Loiret' },
  { width: 10000, codePostal: '03000', description: 'Store 10m à Allier' },
  { width: 5000, codePostal: '13001', description: 'Store 5m à Marseille (hors zone)' },
];

testCases.forEach(({ width, codePostal, description }) => {
  const result = calculateInstallationCostWithZone(width, codePostal);
  const widthM = (width / 1000).toFixed(1);
  
  console.log(`\n📏 ${description} (${widthM}m)`);
  console.log(`   Code postal: ${codePostal}`);
  
  if (result.zone) {
    console.log(`   Département: ${result.departement} - ${result.zone.nom}`);
    console.log(`   Délai: ${result.zone.delai}`);
    console.log(`   Pose de base: ${result.poseBase}€ HT`);
    console.log(`   Frais déplacement: ${result.fraisDeplacement}€ HT`);
    console.log(`   ✅ TOTAL POSE: ${result.total}€ HT`);
  } else {
    console.log(`   ⚠️  Zone non couverte - Tarifs par défaut appliqués`);
    console.log(`   Pose de base: ${result.poseBase}€ HT`);
    console.log(`   Frais déplacement: ${result.fraisDeplacement}€ HT`);
    console.log(`   TOTAL POSE: ${result.total}€ HT`);
  }
});

console.log('\n' + '=' .repeat(80));
console.log('📊 Récapitulatif des frais de déplacement par zone:\n');

const zonesByFrais = {};
Object.entries(ZONES_INTERVENTION).forEach(([dept, zone]) => {
  const frais = zone.frais_deplacement;
  if (!zonesByFrais[frais]) {
    zonesByFrais[frais] = [];
  }
  zonesByFrais[frais].push(`${dept} (${zone.nom})`);
});

Object.entries(zonesByFrais)
  .sort((a, b) => Number(a[0]) - Number(b[0]))
  .forEach(([frais, depts]) => {
    console.log(`💰 ${frais}€: ${depts.join(', ')}`);
  });

console.log('\n' + '=' .repeat(80));
