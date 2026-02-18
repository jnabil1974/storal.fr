import { FABRICS } from './src/lib/catalog-data';

console.log('Total fabrics:', FABRICS.length);
console.log('With images:', FABRICS.filter(f => f.image_url).length);
console.log('\n=== First 3 fabrics ===');
FABRICS.slice(0, 3).forEach(f => {
  console.log(`\n${f.ref} - ${f.name}`);
  console.log(`Image URL: ${f.image_url}`);
});
