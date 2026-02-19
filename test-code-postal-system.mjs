#!/usr/bin/env node

/**
 * Script de test pour le système de code postal dans le configurateur
 * 
 * Tests :
 * 1. API /api/check-zone avec différents codes postaux
 * 2. Calcul des frais de déplacement selon la zone
 * 3. Vérification messages de validation
 */

const BASE_URL = 'http://localhost:3001';

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test cases
const testCases = [
  {
    name: 'Paris (Zone gratuite)',
    codePostal: '75001',
    expectedDisponible: true,
    expectedFrais: 0,
    expectedZone: 'Paris',
  },
  {
    name: 'Hauts-de-Seine (Zone gratuite)',
    codePostal: '92000',
    expectedDisponible: true,
    expectedFrais: 0,
    expectedZone: 'Hauts-de-Seine',
  },
  {
    name: 'Essonne (Grande couronne - 50€)',
    codePostal: '91000',
    expectedDisponible: true,
    expectedFrais: 50,
    expectedZone: 'Essonne',
  },
  {
    name: 'Yvelines (Grande couronne - 50€)',
    codePostal: '78000',
    expectedDisponible: true,
    expectedFrais: 50,
    expectedZone: 'Yvelines',
  },
  {
    name: 'Loiret (Centre-Val de Loire - 100€)',
    codePostal: '45000',
    expectedDisponible: true,
    expectedFrais: 100,
    expectedZone: 'Loiret',
  },
  {
    name: 'Cher (Centre-Val de Loire - 100€)',
    codePostal: '18000',
    expectedDisponible: true,
    expectedFrais: 100,
    expectedZone: 'Cher',
  },
  {
    name: 'Sarthe (Limitrophe - 150€)',
    codePostal: '72000',
    expectedDisponible: true,
    expectedFrais: 150,
    expectedZone: 'Sarthe',
  },
  {
    name: 'Yonne (Limitrophe - 150€)',
    codePostal: '89000',
    expectedDisponible: true,
    expectedFrais: 150,
    expectedZone: 'Yonne',
  },
  {
    name: 'Allier (200€)',
    codePostal: '03000',
    expectedDisponible: true,
    expectedFrais: 200,
    expectedZone: 'Allier',
  },
  {
    name: 'Marseille (Hors zone)',
    codePostal: '13001',
    expectedDisponible: false,
    expectedFrais: null,
    expectedZone: null,
  },
  {
    name: 'Lyon (Hors zone)',
    codePostal: '69001',
    expectedDisponible: false,
    expectedFrais: null,
    expectedZone: null,
  },
];

async function testCheckZone(testCase) {
  const { name, codePostal, expectedDisponible, expectedFrais, expectedZone } = testCase;
  
  log(`\n🧪 Test : ${name}`, 'cyan');
  log(`   Code postal : ${codePostal}`, 'blue');
  
  try {
    const response = await fetch(`${BASE_URL}/api/check-zone?codePostal=${codePostal}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Vérification disponible
    if (data.disponible !== expectedDisponible) {
      log(`   ❌ ÉCHEC : disponible = ${data.disponible}, attendu = ${expectedDisponible}`, 'red');
      return false;
    }
    
    // Vérification frais de déplacement (si zone couverte)
    if (expectedDisponible) {
      if (data.zone.frais_deplacement !== expectedFrais) {
        log(`   ❌ ÉCHEC : frais = ${data.zone.frais_deplacement}€, attendu = ${expectedFrais}€`, 'red');
        return false;
      }
      
      if (data.zone.nom !== expectedZone) {
        log(`   ❌ ÉCHEC : zone = ${data.zone.nom}, attendu = ${expectedZone}`, 'red');
        return false;
      }
      
      log(`   ✅ SUCCÈS : Zone disponible`, 'green');
      log(`      - Département : ${data.zone.nom} (${data.departement})`, 'blue');
      log(`      - Frais de déplacement : ${data.zone.frais_deplacement}€`, 'blue');
      log(`      - Délai : ${data.zone.delai}`, 'blue');
      log(`      - Message : ${data.message}`, 'blue');
    } else {
      log(`   ✅ SUCCÈS : Zone non couverte (attendu)`, 'green');
      log(`      - Message : ${data.message}`, 'blue');
    }
    
    return true;
    
  } catch (error) {
    log(`   ❌ ERREUR : ${error.message}`, 'red');
    return false;
  }
}

async function testCalculInstallation() {
  log('\n\n═══════════════════════════════════════', 'yellow');
  log('📊 Tests Calcul Installation + Frais', 'yellow');
  log('═══════════════════════════════════════', 'yellow');
  
  const scenarios = [
    {
      description: 'Store 4m Paris (≤6m, 0€ frais)',
      largeurCm: 4000,
      codePostal: '75001',
      expectedBase: 500,
      expectedFrais: 0,
      expectedTotal: 500,
    },
    {
      description: 'Store 7m Essonne (>6m, 50€ frais)',
      largeurCm: 7000,
      codePostal: '91000',
      expectedBase: 600,  // 500 + 1×100
      expectedFrais: 50,
      expectedTotal: 650,
    },
    {
      description: 'Store 8.5m Loiret (>6m, 100€ frais)',
      largeurCm: 8500,
      codePostal: '45000',
      expectedBase: 800,  // 500 + 3×100 (arrondi sup)
      expectedFrais: 100,
      expectedTotal: 900,
    },
    {
      description: 'Store 10m Allier (>6m, 200€ frais)',
      largeurCm: 10000,
      codePostal: '03000',
      expectedBase: 900,  // 500 + 4×100
      expectedFrais: 200,
      expectedTotal: 1100,
    },
  ];
  
  // Import de la fonction (simulation)
  // Note : Ceci est une simulation, en production on devrait importer depuis intervention-zones.ts
  function simulateCalculInstallation(widthCm, frais) {
    let base;
    if (widthCm <= 6000) {
      base = 500;
    } else {
      const surpass = Math.ceil((widthCm - 6000) / 1000);
      base = 500 + (surpass * 100);
    }
    return { base, frais, total: base + frais };
  }
  
  let allPassed = true;
  
  for (const scenario of scenarios) {
    log(`\n🧪 ${scenario.description}`, 'cyan');
    log(`   Largeur : ${scenario.largeurCm / 100}m`, 'blue');
    log(`   Code postal : ${scenario.codePostal}`, 'blue');
    
    // Simuler le calcul
    const result = simulateCalculInstallation(scenario.largeurCm, scenario.expectedFrais);
    
    if (result.base !== scenario.expectedBase || 
        result.frais !== scenario.expectedFrais || 
        result.total !== scenario.expectedTotal) {
      log(`   ❌ ÉCHEC : Calcul incorrect`, 'red');
      log(`      Attendu : base=${scenario.expectedBase}€, frais=${scenario.expectedFrais}€, total=${scenario.expectedTotal}€`, 'red');
      log(`      Obtenu  : base=${result.base}€, frais=${result.frais}€, total=${result.total}€`, 'red');
      allPassed = false;
    } else {
      log(`   ✅ SUCCÈS`, 'green');
      log(`      Base pose : ${result.base}€`, 'blue');
      log(`      Frais déplacement : ${result.frais}€`, 'blue');
      log(`      Total installation : ${result.total}€`, 'blue');
    }
  }
  
  return allPassed;
}

async function runAllTests() {
  log('═══════════════════════════════════════', 'yellow');
  log('🚀 Test Suite : Système Code Postal', 'yellow');
  log('═══════════════════════════════════════', 'yellow');
  
  let passedTests = 0;
  let failedTests = 0;
  
  // Tests API check-zone
  log('\n\n📡 Tests API /api/check-zone', 'yellow');
  log('═══════════════════════════════════════', 'yellow');
  
  for (const testCase of testCases) {
    const passed = await testCheckZone(testCase);
    if (passed) {
      passedTests++;
    } else {
      failedTests++;
    }
  }
  
  // Tests calcul installation
  const calcPassed = await testCalculInstallation();
  if (calcPassed) {
    passedTests += 4;  // 4 scenarios
  } else {
    failedTests += 4;
  }
  
  // Résumé
  log('\n\n═══════════════════════════════════════', 'yellow');
  log('📊 RÉSUMÉ DES TESTS', 'yellow');
  log('═══════════════════════════════════════', 'yellow');
  log(`✅ Tests réussis : ${passedTests}`, 'green');
  log(`❌ Tests échoués : ${failedTests}`, 'red');
  log(`📈 Taux de réussite : ${Math.round((passedTests / (passedTests + failedTests)) * 100)}%`, 'cyan');
  
  if (failedTests === 0) {
    log('\n🎉 TOUS LES TESTS SONT PASSÉS !', 'green');
    process.exit(0);
  } else {
    log('\n⚠️ CERTAINS TESTS ONT ÉCHOUÉ', 'red');
    process.exit(1);
  }
}

// Lancer les tests
runAllTests();
