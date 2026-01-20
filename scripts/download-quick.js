const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/images/toiles/dickson');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// URLs directes des 4 images que nous savons fonctionner
const WORKING_IMAGES = [
  {
    url: 'https://www.dickson-constant.com/media/mf_webp/jpg/media/catalog/product/cache/188c1026d151b0383b18bc116b8a7066/o/r/orc_u796_120_chine_indigo_rvb_96dpi_680x480px_24433.webp',
    filename: 'u796_indigo-chine.webp'
  },
  {
    url: 'https://www.dickson-constant.com/media/mf_webp/jpg/media/catalog/product/cache/188c1026d151b0383b18bc116b8a7066/o/r/orc_d542_120_archipel_saphir_rvb_96dpi_680x480px_75675.webp',
    filename: 'd542_archipel-saphir.webp'
  },
  {
    url: 'https://www.dickson-constant.com/media/mf_webp/jpg/media/catalog/product/cache/188c1026d151b0383b18bc116b8a7066/o/r/orc_7100_120_cypres_rvb_96dpi_680x480px_54233.webp',
    filename: '7100_cypres.webp'
  },
  {
    url: 'https://www.dickson-constant.com/media/mf_webp/jpg/media/catalog/product/cache/188c1026d151b0383b18bc116b8a7066/o/r/orc_u768_120_ebene_pique_rvb_96dpi_680x480px_22974.webp',
    filename: 'u768_ebene-pique.webp'
  }
];

// Liste de TOUTES les toiles (92 fichiers nécessaires)
const ALL_FILES = [
  'u095_basalte-chine.webp', 'u171_carbone.webp', 'u224_brownie.webp', 'u235_chaume-pique.webp',
  'u371_chamois-tweed.webp', 'u387_argile.webp', 'u388_azur.webp', 'u406_acier-pique.webp',
  'u411_carmin-pique.webp', 'u768_ebene-pique.webp', 'u767_tangerine.webp', 'u784_tempete-tweed.webp',
  'u785_cepe-link.webp', 'u786_etain-link.webp', 'u787_jais-link.webp', 'u788_jungle-link.webp',
  'u789_pin-link.webp', 'u791_cedre-pique.webp', 'u792_muralis-chine.webp', 'u793_aloe-link.webp',
  'u794_celadon-pique.webp', 'u795_celeste-link.webp', 'u796_indigo-chine.webp', 'u797_orage-tweed.webp',
  'u798_atoll-pique.webp', 'u799_okoume-link.webp', 'u800_figue-tweed.webp', 'u801_goyave-tweed.webp',
  'u802_aurore-link.webp', 'u803_garance-link.webp', 'u804_grenat.webp', 'u805_mate-pique.webp',
  'u806_orgeat-link.webp', 'u807_pollen-link.webp', 'u808_magma-link.webp', 'u809_fauve-pique.webp',
  'u810_craie-link.webp', 'u811_hetre-link.webp', 'u812_fume-link.webp', 'u813_cuir-link.webp',
  'd310_chicago-green.webp', 'd330_color-bloc-noir.webp', 'd332_color-bloc-orange.webp', 'd335_color-bloc-rouge.webp',
  'd532_littoral-argent.webp', 'd533_fjord-argent.webp', 'd534_harmonie-gris.webp', 'd535_harmonie-ardoise.webp',
  'd536_solstice-carbone.webp', 'd537_halo-noir.webp', 'd538_club-noir.webp', 'd539_horizon-vert.webp',
  'd540_fjord-fougere.webp', 'd541_halo-olive.webp', 'd542_archipel-saphir.webp', 'd543_horizon-indigo.webp',
  'd544_abysses-marine.webp', 'd545_halo-outremer.webp', 'd546_harmonie-rouge.webp', 'd547_nomade-terracotta.webp',
  'd548_solstice-rouge.webp', 'd549_halo-bordeaux.webp', 'd550_littoral-or.webp', 'd551_solstice-jaune.webp',
  'd552_archipel-or.webp', 'd553_horizon-ble.webp', 'd554_fjord-sable.webp', 'd555_harmonie-brun.webp',
  'd556_solstice-ebene.webp', '0017_bleu.webp', '6318_ble.webp', '7100_cypres.webp',
  '7244_amande.webp', '7330_charcoal-tweed.webp', '7466_chicago-bleu.webp', '7467_chicago-jaune.webp',
  '7552_argent.webp', '7554_cassis.webp', '8200_chanvre.webp', '8203_ardoise.webp',
  '8204_bleuet.webp', '8206_bordeaux.webp', '8207_chataigne.webp', '8238_bleu-nuit.webp',
  '8553_blanc-jaune.webp', '8776_cacao.webp', '8778_chardon.webp', '8779_bruyere.webp',
  '8902_beige.webp', '8907_blanc-gris.webp', '8910_blanc-bleu.webp', '8922_naturel-ardoise.webp'
];

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(OUTPUT_DIR, filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ ${filename}`);
          resolve();
        });
      } else {
        fs.unlink(filePath, () => {});
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('🚀 Téléchargement des 4 images de référence...\n');
  
  // Télécharger les 4 vraies images
  for (const img of WORKING_IMAGES) {
    try {
      await downloadImage(img.url, img.filename);
    } catch (err) {
      console.error(`✗ Erreur: ${img.filename}`);
    }
  }
  
  console.log('\n📋 Création des copies pour les toiles manquantes...\n');
  
  // Utiliser u796 comme image par défaut (bleu neutre)
  const defaultImage = path.join(OUTPUT_DIR, 'u796_indigo-chine.webp');
  
  for (const filename of ALL_FILES) {
    const filePath = path.join(OUTPUT_DIR, filename);
    if (!fs.existsSync(filePath)) {
      fs.copyFileSync(defaultImage, filePath);
      console.log(`📄 ${filename}`);
    }
  }
  
  console.log(`\n✅ Terminé ! ${ALL_FILES.length} fichiers créés dans ${OUTPUT_DIR}`);
  console.log('ℹ️  Note: Les images manquantes utilisent temporairement un placeholder (Indigo Chiné U796)');
}

main().catch(console.error);
