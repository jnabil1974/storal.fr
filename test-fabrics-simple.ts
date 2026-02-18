// Test simple des données FABRICS
import { FABRICS } from './src/lib/catalog-data';

console.log('🧪 Test des FABRICS chargés\n');
console.log('Total FABRICS:', FABRICS.length);

console.log('\nPremières 5 toiles:');
FABRICS.slice(0, 5).forEach((f, i) => {
  console.log(`  ${i+1}. ${f.ref} - ${f.name}`);
  console.log(`     URL: ${f.image_url || 'null'}`);
  if (f.image_url && f.image_url.includes(' ')) {
    console.log('     ⚠️  ATTENTION: URL contient des espaces non-encodés!');
  } else if (f.image_url && f.image_url.includes('%20')) {
    console.log('     ✅ URL correctement encodée avec %20');
  }
  console.log('');
});

// Statistiques
const withImages = FABRICS.filter(f => f.image_url);
const withSpaces = FABRICS.filter(f => f.image_url && f.image_url.includes(' '));
const withEncoding = FABRICS.filter(f => f.image_url && f.image_url.includes('%20'));

console.log('📊 Statistiques:');
console.log(`   Total FABRICS: ${FABRICS.length}`);
console.log(`   Avec images: ${withImages.length}`);
console.log(`   URLs avec espaces: ${withSpaces.length}`);
console.log(`   URLs avec %20: ${withEncoding.length}`);

if (withSpaces.length > 0) {
  console.log('\n❌ PROBLÈME: Il y a des URLs avec espaces non-encodés!');
  console.log('   Exemples:');
  withSpaces.slice(0, 3).forEach(f => {
    console.log(`   - ${f.ref}: ${f.image_url}`);
  });
} else {
  console.log('\n✅ Toutes les URLs sont correctement encodées!');
}
