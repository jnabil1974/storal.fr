const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/images/toiles/dickson');

// S'assurer que le dossier existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Mapping manuel basé sur les 4 exemples réussis du scraping initial
// Pattern: orc_{ref}_120_{name_slug}_rvb_96dpi_680x480px_{id}.webp
const KNOWN_IMAGES = [
  { ref: 'u796', slug: 'chine_indigo', id: '24433' },
  { ref: 'd542', slug: 'archipel_saphir', id: '75675' },
  { ref: '7100', slug: 'cypres', id: '54233' },
  { ref: 'u768', slug: 'ebene_pique', id: '22974' },
];

const BASE_URL = 'https://www.dickson-constant.com/media/mf_webp/jpg/media/catalog/product/cache/188c1026d151b0383b18bc116b8a7066/o/r';

// Pour les autres, on va essayer de construire l'URL et tester
const ALL_TOILES = [
  // Série U déjà téléchargées (25 fichiers)
  // On va essayer les autres...
  
  // Série D à tester
  { ref: 'd310', name: 'chicago_green' },
  { ref: 'd330', name: 'color_bloc_noir' },
  { ref: 'd332', name: 'color_bloc_orange' },
  { ref: 'd335', name: 'color_bloc_rouge' },
  { ref: 'd532', name: 'littoral_argent' },
  { ref: 'd533', name: 'fjord_argent' },
  { ref: 'd534', name: 'harmonie_gris' },
  { ref: 'd535', name: 'harmonie_ardoise' },
  { ref: 'd536', name: 'solstice_carbone' },
  { ref: 'd537', name: 'halo_noir' },
  { ref: 'd538', name: 'club_noir' },
  { ref: 'd539', name: 'horizon_vert' },
  { ref: 'd540', name: 'fjord_fougere' },
  { ref: 'd541', name: 'halo_olive' },
  { ref: 'd542', name: 'archipel_saphir' },
  { ref: 'd543', name: 'horizon_indigo' },
  { ref: 'd544', name: 'abysses_marine' },
  { ref: 'd545', name: 'halo_outremer' },
  { ref: 'd546', name: 'harmonie_rouge' },
  { ref: 'd547', name: 'nomade_terracotta' },
  { ref: 'd548', name: 'solstice_rouge' },
  { ref: 'd549', name: 'halo_bordeaux' },
  { ref: 'd550', name: 'littoral_or' },
  { ref: 'd551', name: 'solstice_jaune' },
  { ref: 'd552', name: 'archipel_or' },
  { ref: 'd553', name: 'horizon_ble' },
  { ref: 'd554', name: 'fjord_sable' },
  { ref: 'd555', name: 'harmonie_brun' },
  { ref: 'd556', name: 'solstice_ebene' },
  
  // Série classique
  { ref: '0017', name: 'bleu' },
  { ref: '6318', name: 'ble' },
  { ref: '7100', name: 'cypres' },
  { ref: '7244', name: 'amande' },
  { ref: '7330', name: 'charcoal_tweed' },
  { ref: '7466', name: 'chicago_bleu' },
  { ref: '7467', name: 'chicago_jaune' },
  { ref: '7552', name: 'argent' },
  { ref: '7554', name: 'cassis' },
  { ref: '8200', name: 'chanvre' },
  { ref: '8203', name: 'ardoise' },
  { ref: '8204', name: 'bleuet' },
  { ref: '8206', name: 'bordeaux' },
  { ref: '8207', name: 'chataigne' },
  { ref: '8238', name: 'bleu_nuit' },
  { ref: '8553', name: 'blanc_jaune' },
  { ref: '8776', name: 'cacao' },
  { ref: '8778', name: 'chardon' },
  { ref: '8779', name: 'bruyere' },
  { ref: '8902', name: 'beige' },
  { ref: '8907', name: 'blanc_gris' },
  { ref: '8910', name: 'blanc_bleu' },
  { ref: '8922', name: 'naturel_ardoise' },
];

function tryDownloadWithIds(ref, name) {
  // Essayer plusieurs IDs possibles (range basé sur les exemples)
  const possibleIds = [];
  
  // Générer une plage d'IDs basée sur les patterns observés
  for (let i = 20000; i < 80000; i += 1000) {
    possibleIds.push(i);
  }
  
  return new Promise(async (resolve) => {
    for (const id of possibleIds) {
      const imageUrl = `${BASE_URL}/orc_${ref}_120_${name}_rvb_96dpi_680x480px_${id}.webp`;
      const filename = `${ref}_${name.replace(/_/g, '-')}.webp`;
      const filePath = path.join(OUTPUT_DIR, filename);
      
      // Vérifier si déjà téléchargé
      if (fs.existsSync(filePath)) {
        console.log(`✓ ${filename} existe déjà`);
        resolve(true);
        return;
      }
      
      try {
        const success = await testAndDownload(imageUrl, filePath, filename);
        if (success) {
          console.log(`✓ Téléchargé: ${filename}`);
          resolve(true);
          return;
        }
      } catch (e) {
        // Continuer avec l'ID suivant
      }
      
      await new Promise(r => setTimeout(r, 100)); // Petite pause
    }
    
    console.log(`✗ Aucune image trouvée pour ${ref}`);
    resolve(false);
  });
}

function testAndDownload(url, filePath, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filePath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          // Vérifier la taille du fichier
          const stats = fs.statSync(filePath);
          if (stats.size > 300) {  // Plus de 300 bytes = probablement une vraie image
            resolve(true);
          } else {
            fs.unlinkSync(filePath);
            resolve(false);
          }
        });
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

async function main() {
  console.log('🚀 Téléchargement des images Dickson manquantes...\n');
  
  let success = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const toile of ALL_TOILES) {
    console.log(`📥 Traitement: ${toile.ref.toUpperCase()}...`);
    const result = await tryDownloadWithIds(toile.ref, toile.name);
    
    if (result === true) {
      success++;
    } else if (result === 'skip') {
      skipped++;
    } else {
      failed++;
    }
    
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`\n✅ Terminé: ${success} téléchargés, ${skipped} déjà présents, ${failed} échecs`);
}

main().catch(console.error);
