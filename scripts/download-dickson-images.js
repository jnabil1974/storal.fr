/**
 * Script pour télécharger les images des toiles Dickson Orchestra
 * Usage: node scripts/download-dickson-images.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Liste complète des 90 toiles Orchestra avec leurs slugs URL
const TOILES = [
  // Série U (Unis et Texturés)
  { ref: 'U095', slug: 'basalte-chine' },
  { ref: 'U171', slug: 'carbone' },
  { ref: 'U224', slug: 'brownie' },
  { ref: 'U235', slug: 'chaume-pique' },
  { ref: 'U371', slug: 'chamois-tweed' },
  { ref: 'U387', slug: 'argile' },
  { ref: 'U388', slug: 'azur' },
  { ref: 'U406', slug: 'acier-pique' },
  { ref: 'U411', slug: 'carmin-pique' },
  { ref: 'U768', slug: 'ebene-pique' },
  { ref: 'U767', slug: 'tangerine' },
  { ref: 'U784', slug: 'tempete-tweed' },
  { ref: 'U785', slug: 'cepe-link' },
  { ref: 'U786', slug: 'etain-link' },
  { ref: 'U787', slug: 'jais-link' },
  { ref: 'U788', slug: 'jungle-link' },
  { ref: 'U789', slug: 'pin-link' },
  { ref: 'U791', slug: 'cedre-pique' },
  { ref: 'U792', slug: 'muralis-chine' },
  { ref: 'U793', slug: 'aloe-link' },
  { ref: 'U794', slug: 'celadon-pique' },
  { ref: 'U795', slug: 'celeste-link' },
  { ref: 'U796', slug: 'indigo-chine' },
  { ref: 'U797', slug: 'orage-tweed' },
  { ref: 'U798', slug: 'atoll-pique' },
  { ref: 'U799', slug: 'okoume-link' },
  { ref: 'U800', slug: 'figue-tweed' },
  { ref: 'U801', slug: 'goyave-tweed' },
  { ref: 'U802', slug: 'aurore-link' },
  { ref: 'U803', slug: 'garance-link' },
  { ref: 'U804', slug: 'grenat' },
  { ref: 'U805', slug: 'mate-pique' },
  { ref: 'U806', slug: 'orgeat-link' },
  { ref: 'U807', slug: 'pollen-link' },
  { ref: 'U808', slug: 'magma-link' },
  { ref: 'U809', slug: 'fauve-pique' },
  { ref: 'U810', slug: 'craie-link' },
  { ref: 'U811', slug: 'hetre-link' },
  { ref: 'U812', slug: 'fume-link' },
  { ref: 'U813', slug: 'cuir-link' },

  // Série D (Designs et Jacquard)
  { ref: 'D310', slug: 'chicago-green' },
  { ref: 'D330', slug: 'color-bloc-noir' },
  { ref: 'D332', slug: 'color-bloc-orange' },
  { ref: 'D335', slug: 'color-bloc-rouge' },
  { ref: 'D532', slug: 'littoral-argent' },
  { ref: 'D533', slug: 'fjord-argent' },
  { ref: 'D534', slug: 'harmonie-gris' },
  { ref: 'D535', slug: 'harmonie-ardoise' },
  { ref: 'D536', slug: 'solstice-carbone' },
  { ref: 'D537', slug: 'halo-noir' },
  { ref: 'D538', slug: 'club-noir' },
  { ref: 'D539', slug: 'horizon-vert' },
  { ref: 'D540', slug: 'fjord-fougere' },
  { ref: 'D541', slug: 'halo-olive' },
  { ref: 'D542', slug: 'archipel-saphir' },
  { ref: 'D543', slug: 'horizon-indigo' },
  { ref: 'D544', slug: 'abysses-marine' },
  { ref: 'D545', slug: 'halo-outremer' },
  { ref: 'D546', slug: 'harmonie-rouge' },
  { ref: 'D547', slug: 'nomade-terracotta' },
  { ref: 'D548', slug: 'solstice-rouge' },
  { ref: 'D549', slug: 'halo-bordeaux' },
  { ref: 'D550', slug: 'littoral-or' },
  { ref: 'D551', slug: 'solstice-jaune' },
  { ref: 'D552', slug: 'archipel-or' },
  { ref: 'D553', slug: 'horizon-ble' },
  { ref: 'D554', slug: 'fjord-sable' },
  { ref: 'D555', slug: 'harmonie-brun' },
  { ref: 'D556', slug: 'solstice-ebene' },

  // Série Classiques (0000-8000)
  { ref: '0017', slug: 'bleu' },
  { ref: '6318', slug: 'ble' },
  { ref: '7100', slug: 'cypres' },
  { ref: '7244', slug: 'amande' },
  { ref: '7330', slug: 'charcoal-tweed' },
  { ref: '7466', slug: 'chicago-bleu' },
  { ref: '7467', slug: 'chicago-jaune' },
  { ref: '7552', slug: 'argent' },
  { ref: '7554', slug: 'cassis' },
  { ref: '8200', slug: 'chanvre' },
  { ref: '8203', slug: 'ardoise' },
  { ref: '8204', slug: 'bleuet' },
  { ref: '8206', slug: 'bordeaux' },
  { ref: '8207', slug: 'chataigne' },
  { ref: '8238', slug: 'bleu-nuit' },
  { ref: '8553', slug: 'blanc-jaune' },
  { ref: '8776', slug: 'cacao' },
  { ref: '8778', slug: 'chardon' },
  { ref: '8779', slug: 'bruyere' },
  { ref: '8902', slug: 'beige' },
  { ref: '8907', slug: 'blanc-gris' },
  { ref: '8910', slug: 'blanc-bleu' },
  { ref: '8922', slug: 'naturel-ardoise' },
];

const OUTPUT_DIR = path.join(__dirname, '../public/images/toiles/dickson');

// Créer le dossier de destination s'il n'existe pas
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(OUTPUT_DIR, filename);
    
    // Vérifier si le fichier existe déjà
    if (fs.existsSync(filePath)) {
      console.log(`✓ ${filename} déjà téléchargé`);
      resolve();
      return;
    }

    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Téléchargé: ${filename}`);
          resolve();
        });
      } else {
        fs.unlink(filePath, () => {});
        reject(new Error(`Erreur HTTP ${response.statusCode} pour ${url}`));
      }
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function fetchImageUrlFromPage(ref, slug) {
  // URL de la page produit
  const pageUrl = `https://www.dickson-constant.com/fr/orchestra-${slug}-${ref.toLowerCase()}.html`;
  
  return new Promise((resolve, reject) => {
    https.get(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    }, (res) => {
      // Suivre les redirections
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        console.log(`  ↪ Redirection vers: ${redirectUrl}`);
        reject(new Error(`Redirection détectée - page probablement introuvable`));
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Chercher l'URL de l'image dans le HTML avec plusieurs patterns
        // Pattern 1: URL complète dans data-zoom-image ou similaire
        let match = data.match(/https?:\/\/[^"']+\/orc_[^"']+_120_[^"']+_rvb_96dpi_680x480px[^"']+\.webp/);
        
        // Pattern 2: Chemin relatif
        if (!match) {
          match = data.match(/media\/mf_webp\/jpg\/media\/catalog\/product\/cache\/[^"']+\/o\/r\/orc_[^"']+\.webp/);
          if (match) {
            const imageUrl = `https://www.dickson-constant.com/${match[0]}`;
            resolve(imageUrl);
            return;
          }
        } else {
          resolve(match[0]);
          return;
        }
        
        // Pattern 3: Dans les balises img
        if (!match) {
          match = data.match(/<img[^>]+src="([^"]*orc_[^"]*\.webp[^"]*)"/);
          if (match) {
            const url = match[1].startsWith('http') ? match[1] : `https://www.dickson-constant.com${match[1]}`;
            resolve(url);
            return;
          }
        }
        
        reject(new Error(`Image non trouvée dans le HTML`));
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log(`🚀 Téléchargement de ${TOILES.length} images Dickson Orchestra...\n`);
  
  let success = 0;
  let errors = 0;

  for (const toile of TOILES) {
    try {
      console.log(`📥 Traitement: ${toile.ref} (${toile.slug})...`);
      
      // Récupérer l'URL de l'image depuis la page produit
      const imageUrl = await fetchImageUrlFromPage(toile.ref, toile.slug);
      
      // Télécharger l'image
      const filename = `${toile.ref.toLowerCase()}_${toile.slug}.webp`;
      await downloadImage(imageUrl, filename);
      
      success++;
      
      // Pause de 500ms entre chaque requête pour ne pas surcharger le serveur
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`✗ Erreur pour ${toile.ref}: ${error.message}`);
      errors++;
    }
  }

  console.log(`\n✅ Téléchargement terminé: ${success} succès, ${errors} erreurs`);
  console.log(`📁 Images sauvegardées dans: ${OUTPUT_DIR}`);
}

main().catch(console.error);
