// Test pour vérifier que catalog-data.ts charge correctement les images
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

console.log('🧪 Test des données chargées dans catalog-data.ts\n');

// Essayer de compiler et charger catalog-data.ts
try {
  // Essayer d'exécuter un script Node qui importe catalog-data
  const testScript = `
    import('./src/lib/catalog-data.ts').then(mod => {
      const FABRICS = mod.FABRICS;
      console.log('Total FABRICS:', FABRICS.length);
      console.log('\\nPremières toiles:');
      FABRICS.slice(0, 3).forEach((f, i) => {
        console.log(\`  \${i+1}. \${f.ref} - \${f.name}\`);
        console.log(\`     URL: \${f.image_url}\`);
        if (f.image_url && f.image_url.includes(' ')) {
          console.log('     ⚠️  ATTENTION: URL contient des espaces non-encodés!');
        } else if (f.image_url && f.image_url.includes('%20')) {
          console.log('     ✅ URL correctement encodée');
        }
      });
      
      // Compter les URLs avec problèmes
      const withSpaces = FABRICS.filter(f => f.image_url && f.image_url.includes(' '));
      const withEncoding = FABRICS.filter(f => f.image_url && f.image_url.includes('%20'));
      console.log(\`\\n📊 Statistiques:\`);
      console.log(\`   Total: \${FABRICS.length}\`);
      console.log(\`   Avec images: \${FABRICS.filter(f => f.image_url).length}\`);
      console.log(\`   URLs avec espaces: \${withSpaces.length}\`);
      console.log(\`   URLs avec %20: \${withEncoding.length}\`);
    }).catch(err => {
      console.error('❌ Erreur lors du chargement:', err.message);
    });
  `;
  
  execSync(`node --input-type=module -e "${testScript.replace(/"/g, '\\"')}"`, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
}
