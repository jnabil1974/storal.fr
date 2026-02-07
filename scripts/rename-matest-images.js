const fs = require('fs');
const path = require('path');

// Charger les données
const data = JSON.parse(fs.readFileSync('./data/matest-colors-from-pdf.json', 'utf8'));

// Séparer par finition
const brillantColors = data.items.filter(item => item.finish === 'brillant' && item.ral_code);
const sableColors = data.items.filter(item => item.finish === 'sablé' && item.ral_code);

console.log(`🎨 Renommage de ${brillantColors.length} images brillantes et ${sableColors.length} images sablé\n`);

const renamedFiles = [];

// Renommer les images brillantes (pages 1 et 2)
brillantColors.forEach((color, index) => {
  const pageNum = index < 26 ? 1 : 2;
  const colorNum = index < 26 ? index + 1 : index - 25;
  
  const oldPath = `./public/images/matest/pdf-thumbs/page-${pageNum}/color_${String(colorNum).padStart(2, '0')}.png`;
  const newName = `ral-${color.ral_code}-brillant.png`;
  const newPath = `./public/images/matest/pdf-thumbs/page-${pageNum}/${newName}`;
  
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`✓ ${path.basename(oldPath)} → ${newName}`);
    renamedFiles.push({
      ral_code: color.ral_code,
      finish: 'brillant',
      old_path: `/images/matest/pdf-thumbs/page-${pageNum}/color_${String(colorNum).padStart(2, '0')}.png`,
      new_path: `/images/matest/pdf-thumbs/page-${pageNum}/${newName}`
    });
  } else {
    console.log(`⚠ Fichier non trouvé: ${oldPath}`);
  }
});

// Renommer les images sablé (page 3)
sableColors.forEach((color, index) => {
  const colorNum = index + 1;
  
  const oldPath = `./public/images/matest/pdf-thumbs/page-3/color_${String(colorNum).padStart(2, '0')}.png`;
  const newName = `ral-${color.ral_code}-sable.png`;
  const newPath = `./public/images/matest/pdf-thumbs/page-3/${newName}`;
  
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`✓ ${path.basename(oldPath)} → ${newName}`);
    renamedFiles.push({
      ral_code: color.ral_code,
      finish: 'sablé',
      old_path: `/images/matest/pdf-thumbs/page-3/color_${String(colorNum).padStart(2, '0')}.png`,
      new_path: `/images/matest/pdf-thumbs/page-3/${newName}`
    });
  } else {
    console.log(`⚠ Fichier non trouvé: ${oldPath}`);
  }
});

// Sauvegarder le mapping pour mise à jour de la BDD
fs.writeFileSync('./data/matest-renamed-mapping.json', JSON.stringify(renamedFiles, null, 2));

console.log(`\n✅ ${renamedFiles.length} fichiers renommés avec succès!`);
console.log(`📄 Mapping sauvegardé dans data/matest-renamed-mapping.json`);
