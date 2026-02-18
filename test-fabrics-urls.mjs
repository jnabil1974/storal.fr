// Test simple pour vérifier les URLs des FABRICS
import { readFileSync } from 'fs';

console.log('🔍 Vérification des URLs dans catalog-toiles.ts\n');

const catalogToiles = readFileSync('src/lib/catalog-toiles.ts', 'utf-8');

// Extraire quelques URLs
const urlMatches = catalogToiles.match(/"image_url":\s*"([^"]+)"/g);

if (urlMatches) {
  console.log(`✅ Trouvé ${urlMatches.length} URLs d'images\n`);
  console.log('📋 Exemples des 5 premières URLs:');
  urlMatches.slice(0, 5).forEach((match, i) => {
    const url = match.match(/"([^"]+)"$/)[1];
    console.log(`  ${i + 1}. ${url}`);
    
    // Vérifier si URL contient des espaces (problème)
    if (url.includes(' ')) {
      console.log('     ⚠️  ATTENTION: URL contient des espaces!');
    } else if (url.includes('_')) {
      console.log('     ✅ OK: Utilise des underscores');
    }
  });
  
  // Vérifier s'il reste des URLs avec espaces
  const urlsWithSpaces = urlMatches.filter(match => {
    const url = match.match(/"([^"]+)"$/)[1];
    return url.includes(' ');
  });
  
  console.log(`\n📊 Résumé:`);
  console.log(`   Total URLs: ${urlMatches.length}`);
  console.log(`   URLs avec espaces: ${urlsWithSpaces.length}`);
  console.log(`   URLs propres: ${urlMatches.length - urlsWithSpaces.length}`);
  
  if (urlsWithSpaces.length > 0) {
    console.log('\n❌ PROBLÈME: Il reste des URLs avec des espaces!');
    console.log('   Exemples:');
    urlsWithSpaces.slice(0, 3).forEach(match => {
      const url = match.match(/"([^"]+)"$/)[1];
      console.log(`   - ${url}`);
    });
  } else {
    console.log('\n✅ PARFAIT: Aucune URL avec espaces!');
  }
} else {
  console.log('❌ Aucune URL trouvée dans le catalogue');
}
