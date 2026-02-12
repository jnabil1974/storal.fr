const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(process.cwd(), 'public');

const CATALOG_DATA_PATH = path.join(process.cwd(), 'src/lib/catalog-data.ts');

// Liste des images produits définies dans catalog-data.ts
function getProductImages() {
  const catalogData = fs.readFileSync(CATALOG_DATA_PATH, 'utf8');
  const regex = /image: "(?<imagePath>.*?)",/g;
  let match;
  const imagePaths = [];

  while ((match = regex.exec(catalogData)) !== null) {
    imagePaths.push(match.groups.imagePath);
  }

  return imagePaths;
}

const PRODUCT_IMAGES = getProductImages();


console.log('🔍 Vérification des images dans :', PUBLIC_DIR);
let missingCount = 0;

PRODUCT_IMAGES.forEach(img => {
  const fullPath = path.join(PUBLIC_DIR, img);
  
  if (fs.existsSync(fullPath)) {
    console.log(`✅ OK : ${img}`);
  } else {
    console.error(`❌ MANQUANT : ${img}`);
      missingCount++;
  }
});

if (missingCount > 0) {
  console.log(`\n⚠️  ${missingCount} image(s) manquante(s) !`);
  process.exit(1);
} else {
  console.log('\n🎉 Toutes les images produits sont présentes.');
}