#!/usr/bin/env tsx
/**
 * Génération du fichier catalog-data.ts depuis la base SQLite
 * 
 * Ce script lit tous les produits, prix et coefficients depuis SQLite
 * et génère le fichier catalog-data.ts avec les prix calculés.
 * 
 * Usage: npm run pricing:generate
 */

import { PrismaClient } from '../../src/generated/prisma';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const OUTPUT_FILE = path.join(__dirname, '../../src/lib/catalog-data.ts');
const VAT_RATE = 1.10; // TVA 10%

interface GenerationStats {
  productsProcessed: number;
  pricesCalculated: number;
  fileSize: number;
  startTime: number;
  endTime: number;
}

async function main() {
  console.log('🚀 Génération de catalog-data.ts depuis SQLite\n');
  
  const stats: GenerationStats = {
    productsProcessed: 0,
    pricesCalculated: 0,
    fileSize: 0,
    startTime: Date.now(),
    endTime: 0
  };

  try {
    // Récupérer tous les produits actifs avec leurs relations
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        prices: true,
        optionCoefficients: true
      },
      orderBy: { modelId: 'asc' }
    });

    if (products.length === 0) {
      console.error('❌ Aucun produit trouvé dans la base de données');
      console.log('💡 Exécutez d\'abord: npm run pricing:import\n');
      process.exit(1);
    }

    console.log(`📦 ${products.length} produits trouvés\n`);

    // Construire le contenu du fichier TypeScript
    let fileContent = generateFileHeader();
    
    // Import et ré-export des types depuis catalog-types.ts
    fileContent += '// ==========================================\n';
    fileContent += '// IMPORTS TYPES\n';
    fileContent += '// ==========================================\n';
    fileContent += 'import type { StoreModel, StoreModelCompatibility, PriceEntry } from \'./catalog-types\';\n';
    fileContent += 'export type { StoreModel, StoreModelCompatibility, PriceEntry };\n\n';
    
    // Ajouter les imports et exports statiques (depuis backup)
    fileContent += generateStaticExports();
    
    // Générer l'objet STORE_MODELS
    fileContent += '\n// ==========================================\n';
    fileContent += '// STORE MODELS (GÉNÉRÉ DEPUIS BASE DE DONNÉES)\n';
    fileContent += '// ==========================================\n';
    fileContent += 'export const STORE_MODELS: Record<string, Partial<StoreModel> & { id: string; name: string; slug: string; buyPrices: Record<number, PriceEntry[]> }> = {\n';

    for (const product of products) {
      console.log(`\n📝 Traitement: ${product.name} (${product.modelId})`);
      
      // Organiser les prix par projection
      const buyPricesByProjection: Record<number, Array<{ maxW: number; priceHT: number }>> = {};
      
      for (const price of product.prices) {
        if (!buyPricesByProjection[price.projection]) {
          buyPricesByProjection[price.projection] = [];
        }
        buyPricesByProjection[price.projection].push({
          maxW: price.maxWidth,
          priceHT: price.priceHT
        });
      }
      
      // Trier les prix par largeur max dans chaque projection
      for (const projection in buyPricesByProjection) {
        buyPricesByProjection[projection].sort((a, b) => a.maxW - b.maxW);
      }

      // Construire l'objet options coefficients
      const optionsCoefficients: Record<string, number> = {};
      for (const option of product.optionCoefficients) {
        optionsCoefficients[option.optionType] = option.coefficient;
      }

      // Générer le code TypeScript pour ce produit
      fileContent += `  "${product.modelId}": {\n`;
      fileContent += `    id: "${product.modelId}",\n`;
      fileContent += `    name: "${escapeTsString(product.name)}",\n`;
      fileContent += `    slug: "${product.slug}",\n`;
      fileContent += `    salesCoefficient: ${product.salesCoefficient},\n`;
      fileContent += `    buyPrices: ${JSON.stringify(buyPricesByProjection, null, 6).replace(/^/gm, '    ')},\n`;
      fileContent += `    optionsCoefficients: ${JSON.stringify(optionsCoefficients, null, 6).replace(/^/gm, '    ')}\n`;
      fileContent += `  },\n`;

      stats.productsProcessed++;
      stats.pricesCalculated += product.prices.length;
      
      console.log(`  ✅ ${product.prices.length} prix traités`);
    }

    fileContent += '};\n\n';
    
    // Ajouter la fonction de calcul de prix (helper)
    fileContent += generateHelperFunctions();
    
    // Re-exporter toutes les fonctions utilitaires depuis catalog-helpers
    fileContent += '\n// ==========================================\n';
    fileContent += '// RE-EXPORT FONCTIONS UTILITAIRES\n';
    fileContent += '// ==========================================\n';
    fileContent += 'export * from \'./catalog-helpers\';\n';

    // Écrire le fichier
    fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf-8');
    stats.fileSize = fs.statSync(OUTPUT_FILE).size;
    stats.endTime = Date.now();

    // Enregistrer dans l'historique
    await logGeneration(stats);

    // Résumé final
    console.log('\n\n' + '='.repeat(60));
    console.log('✅ GÉNÉRATION TERMINÉE');
    console.log('='.repeat(60));
    console.log(`📦 Produits traités:    ${stats.productsProcessed}`);
    console.log(`💶 Prix calculés:       ${stats.pricesCalculated}`);
    console.log(`📁 Fichier généré:      ${OUTPUT_FILE}`);
    console.log(`📊 Taille fichier:      ${(stats.fileSize / 1024).toFixed(1)} KB`);
    console.log(`⏱️  Temps d'exécution:  ${((stats.endTime - stats.startTime) / 1000).toFixed(2)}s`);
    console.log('\n💡 Prochaines étapes:');
    console.log('   1. git diff src/lib/catalog-data.ts');
    console.log('   2. git add src/lib/catalog-data.ts');
    console.log('   3. git commit -m "fix: update prices from DB"');
    console.log('   4. git push origin main\n');

  } catch (error: any) {
    console.error('\n❌ ERREUR:', error.message);
    console.error(error.stack);
    
    // Enregistrer l'erreur
    await logGeneration({
      productsProcessed: 0,
      pricesCalculated: 0,
      fileSize: 0,
      startTime: Date.now(),
      endTime: Date.now()
    }, 'error', error.message);
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Générer l'en-tête du fichier TypeScript
 */
function generateFileHeader(): string {
  const timestamp = new Date().toISOString();
  return `/**
 * ⚠️  FICHIER GÉNÉRÉ AUTOMATIQUEMENT - NE PAS ÉDITER MANUELLEMENT
 * 
 * Ce fichier est généré par: npm run pricing:generate
 * Source: Base de données SQLite (prisma/dev.db)
 * Date: ${timestamp}
 * 
 * Pour modifier les prix:
 * 1. Utilisez l'interface admin: http://localhost:3000/admin/pricing
 * 2. Ou modifiez directement la base SQLite (Prisma Studio: npx prisma studio)
 * 3. Régénérez ce fichier: npm run pricing:generate
 */

`;
}

/**
 * Générer les définitions de types TypeScript
 */
/**
 * Générer les exports statiques (tous les exports autres que STORE_MODELS)
 * Ces exports sont copiés depuis catalog-data.backup.ts
 */
function generateStaticExports(): string {
  return `
// ==========================================
// IMPORTS CATALOGUES
// ==========================================
import { MATEST_COLORS, STANDARD_COLORS, getColorByRAL } from './catalog-couleurs';
import { TOILE_TYPES, TOILE_IMAGES, getCompatibleToileTypes, getToilesSummaryForChatbot, getToileImageUrl } from './catalog-toiles';

// ==========================================
// COULEURS CADRE
// ==========================================
export const FRAME_COLORS = [
  { id: '9016', name: 'Blanc (RAL 9016)', hex: '#FFFFFF', price: 0, category: 'standard', image_url: '/images/matest/pdf-thumbs/page-1/9016-mat.png' },
  { id: '1015', name: 'Beige (RAL 1015)', hex: '#F3E5AB', price: 0, category: 'standard', image_url: null },
  { id: '7016', name: 'Gris Anthracite (RAL 7016)', hex: '#383E42', price: 0, category: 'standard', image_url: '/images/matest/pdf-thumbs/page-1/7016-mat.png' },
  { id: 'custom', name: 'Autre RAL (Hors Nuancier)', hex: '#cccccc', price: 138, category: 'custom', image_url: null }
];

// ==========================================
// TOILES
// ==========================================
function generateFabricsFromToileTypes() {
  const fabrics: any[] = [];
  
  TOILE_TYPES.forEach(toileType => {
    toileType.examples.forEach((example) => {
      const imageUrl = example.image_url || getToileImageUrl(example.ref);
      
      let typeCode = toileType.code;
      if (toileType.code === 'ORCH') {
        typeCode = example.name.includes('Décor') ? 'ORCH_DECOR' : 'ORCH_UNI';
      }
      
      fabrics.push({
        id: \`\${toileType.code.toLowerCase()}_\${example.ref}\`,
        ref: example.ref,
        name: example.name,
        folder: imageUrl ? imageUrl.substring(0, imageUrl.lastIndexOf('/')) : '',
        category: example.family.toLowerCase().includes('décor') || example.family.toLowerCase().includes('ray') ? 'raye' : 'uni',
        price: 0,
        image_url: imageUrl,
        toile_type_code: typeCode
      });
    });
  });
  
  return fabrics;
}

export const FABRICS = generateFabricsFromToileTypes();

// ==========================================
// PARAMÈTRES COMMERCIAUX
// ==========================================
export const CATALOG_SETTINGS = {
  COEFF_MARGE: 1.8,
  TVA_NORMAL: 1.20,
  TVA_REDUIT: 1.10,
  promoCode: 'BIENVENUE2026',
  promoDiscount: 0.05,
  
  OPTIONS_COEFFICIENTS: {
    LED_ARMS: 1,
    LED_CASSETTE: 1,
    LAMBREQUIN_FIXE: 1,
    LAMBREQUIN_ENROULABLE: 1,
    CEILING_MOUNT: 1,
    AUVENT: 1,
    FABRIC: 1,
    FRAME_COLOR_CUSTOM: 1,
    INSTALLATION: 1,
  },
  
  TRANSPORT: {
    SEUIL_LARGEUR_MM: 3650,
    FRAIS_HT: 139,
  }
};

// ==========================================
// PRIX OPTIONS
// ==========================================
export const OPTIONS_PRICES = {
  LED_ARMS: {
    1500: { 2: 441, 3: 562, 4: 721, 6: 1125 },
    1750: { 2: 462, 3: 592, 4: 764, 6: 1184 },
    2000: { 2: 481, 3: 624, 4: 805, 6: 1248 },
    2500: { 2: 524, 3: 690, 4: 892, 6: 1382 },
    2750: { 2: 553, 3: 736, 4: 950, 6: 1470 },
    3000: { 2: 567, 3: 757, 4: 981, 6: 1514 },
    3250: { 2: 595, 3: 795, 4: 1032, 6: 1590 },
    3500: { 2: 603, 3: 815, 4: 1057, 6: 1629 },
    4000: { 2: 641, 3: 881, 4: 1148, 6: 1762 }
  } as Record<number, Record<number, number>>,
  
  LED_CASSETTE: 1,
  LAMBREQUIN_FIXE: 1,
  
  LAMBREQUIN_ENROULABLE: {
    MANUAL: [{ max: 2400, price: 357 }, { max: 3580, price: 457 }, { max: 4800, price: 531 }, { max: 6000, price: 633 }],
    MOTORIZED: [{ max: 2400, price: 518 }, { max: 3580, price: 641 }, { max: 4800, price: 722 }, { max: 6000, price: 838 }]
  },

  AUVENT_PER_METER: 45,
  FRAME_SPECIFIC_RAL: 138,
};

// ==========================================
// META DESCRIPTIONS SEO
// ==========================================
export const META_DESCRIPTIONS: Record<string, string> = {
  'store-banne-coffre-compact-sur-mesure': "Le STORAL COMPACT : store banne idéal pour petits balcons. Fabrication sur mesure, coffre intégral et prix direct usine. Devis immédiat avec notre IA !",
  'store-banne-coffre-compact-renforce': "Alliez compacité et robustesse avec le COMPACT+. Structure renforcée pour une tenue au vent optimale. Personnalisez votre store en ligne avec l'IA.",
  'store-banne-grande-largeur-armor': "Protégez vos grandes terrasses avec le STORAL ARMOR. Jusqu'à 12m de large. Bras renforcés haute résistance. Configurez votre projet sur mesure dès maintenant.",
  'store-banne-coffre-armor-design': "Le store ARMOR+ : le mariage parfait entre design moderne et grande avancée. Finition premium, coffre galbé et options LED. Qualité française sur mesure.",
  'store-banne-coffre-excellence-led': "Illuminez vos soirées avec le STORAL EXCELLENCE. LED intégrées, design épuré et technologie domotique. Le store banne haut de gamme par excellence.",
  'store-banne-coffre-rectangulaire-kube': "Design minimaliste et cubique pour architectures modernes. Le STORAL KUBE s'intègre parfaitement à votre façade. Qualité premium et design épuré.",
  'store-banne-design-architecte-kube': "Le KUBE+ pousse le design encore plus loin. Finitions invisibles, grande avancée et esthétique cubique. Le choix des architectes pour votre terrasse.",
  'store-banne-renovation-coffre-compact': "Le STORAL K est spécialement conçu pour la rénovation. Installation simplifiée, coffre ultra-compact et protection maximale de la toile.",
  'store-banne-excellence-grandes-dimensions': "L'EXCELLENCE+ pour vos projets XXL. Confort domotique, éclairage LED puissant et structure ultra-robuste. Le luxe et la performance sur mesure.",
  'store-banne-coffre-traditionnel-antibes': "Retrouvez le charme du classique avec le STORAL ANTIBES. Coffre de protection traditionnel, mécanisme éprouvé et large choix de toiles.",
  'store-banne-coffre-robuste-madrid': "Le STORAL MADRID offre une robustesse à toute épreuve pour un usage intensif. Fiabilité mécanique et esthétique intemporelle pour votre maison.",
  'store-banne-loggia-sans-coffre': "Idéal pour les loggias et balcons abrités, le STORAL TRADITION offre une protection solaire efficace et économique sans encombrement inutile.",
  'store-banne-traditionnel-renforce-menton': "Le STORAL TRADITION+ offre une structure renforcée jusqu'à 8m. Installation professionnelle pour terrasses de grandes dimensions. Économique et robuste.",
  'store-banne-traditionnel-grande-portee-18m': "Le store TRADITION 18M pour projets XXL : jusqu'à 18 mètres de large ! Solution professionnelle pour restaurants, CHR et grandes structures. Prix sur devis.",
  'store-banne-balcon-etroit-bras-croises': "La solution pour les terrasses étroites : les bras croisés permettent une avancée supérieure à la largeur du store. Ingénieux et pratique.",
};

// ==========================================
// RE-EXPORTS CATALOGUES
// ==========================================
export { MATEST_COLORS, STANDARD_COLORS, getColorByRAL } from './catalog-couleurs';
export { TOILE_TYPES, TOILE_IMAGES, getCompatibleToileTypes, getToilesSummaryForChatbot, getToileImageUrl } from './catalog-toiles';

`;
}

/**
 * Générer les fonctions helper
 */
function generateHelperFunctions(): string {
  return `/**
 * Créer un slug à partir d'un nom
 */
export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD') // Décompose les caractères accentués
    .replace(/[\\u0300-\\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-') // Remplace les caractères non alphanumériques par des tirets
    .replace(/^-+|-+$/g, ''); // Supprime les tirets en début et fin
}

/**
 * Trouve un modèle par son slug
 */
export function getModelBySlug(slug: string): (typeof STORE_MODELS)[string] | undefined {
  const models = Object.values(STORE_MODELS);
  return models.find(model => {
    // Si le modèle a un slug défini, on l'utilise
    if (model.slug) {
      return model.slug === slug;
    }
    // Sinon, on génère le slug à partir du nom avec le préfixe "store-"
    const generatedSlug = 'store-' + createSlug(model.name);
    return generatedSlug === slug;
  });
}

/**
 * Retourne le slug d'un modèle (utilise le champ slug ou génère depuis le name)
 */
export function getModelSlug(modelIdOrModel: string | (typeof STORE_MODELS)[string]): string {
  const model = typeof modelIdOrModel === 'string' 
    ? STORE_MODELS[modelIdOrModel] 
    : modelIdOrModel;
  
  if (!model) return '';
  // Si le modèle a un slug prédéfini, on l'utilise
  if (model.slug) return model.slug;
  // Sinon, on génère le slug à partir du nom avec le préfixe "store-"
  return 'store-' + createSlug(model.name);
}

/**
 * Vérifie si la largeur nécessite une alerte de livraison en 2 parties
 */
export function checkDeliveryConditions(
  model: (typeof STORE_MODELS)[string],
  largeur: number
): string | null {
  if (!model.deliveryWarningThreshold) {
    return null;
  }
  
  if (largeur > model.deliveryWarningThreshold) {
    return \`⚠️ Attention : En raison d'une largeur supérieure à \${model.deliveryWarningThreshold / 1000}m, la livraison s'effectuera en deux parties via un transporteur spécialisé.\`;
  }
  
  return null;
}

/**
 * Calcule le prix minimum d'un modèle (prix de base TTC avec TVA 10%)
 */
export function getMinimumPrice(model: (typeof STORE_MODELS)[string]): number {
  // Trouver l'avancée minimale disponible
  const projections = Object.keys(model.buyPrices).map(Number).sort((a, b) => a - b);
  if (projections.length === 0) return 0;
  
  const minProjection = projections[0];
  const priceGrid = model.buyPrices[minProjection];
  
  if (!priceGrid || priceGrid.length === 0) return 0;
  
  // Prendre le premier palier (largeur la plus petite)
  const minPriceHT = priceGrid[0].priceHT;
  
  // Appliquer le coefficient du modèle
  const coeff = model.salesCoefficient ?? 1.8;
  const priceVenteHT = minPriceHT * coeff;
  
  // Appliquer TVA réduite 10%
  const priceTTC = priceVenteHT * 1.10;
  
  return Math.round(priceTTC);
}

/**
 * Extrait les dimensions min/max d'un modèle
 */
export function getModelDimensions(model: (typeof STORE_MODELS)[string]): {
  minWidth: number;
  maxWidth: number;
  minProjection: number;
  maxProjection: number;
} {
  // Avancées disponibles
  const projections = Object.keys(model.buyPrices).map(Number).sort((a, b) => a - b);
  const minProjection = projections.length > 0 ? projections[0] : 0;
  const maxProjection = model.compatibility?.max_projection || (projections.length > 0 ? projections[projections.length - 1] : 0);
  
  // Largeur min : prendre la plus petite largeur min parmi toutes les avancées
  const minWidthValues = Object.values(model.minWidths || {});
  const minWidth = minWidthValues.length > 0 ? Math.min(...(minWidthValues as number[])) : 0;
  
  // Largeur max : depuis compatibility
  const maxWidth = model.compatibility?.max_width || 0;
  
  return {
    minWidth,
    maxWidth,
    minProjection,
    maxProjection
  };
}

/**
 * Calculer le prix de vente TTC à partir du prix d'achat HT
 */
export function calculateSalePrice(
  priceHT: number,
  coefficient: number,
  vat: number = ${VAT_RATE}
): number {
  return Math.round(priceHT * coefficient * vat);
}

/**
 * Obtenir le prix d'achat HT pour des dimensions données
 */
export function getBuyPrice(
  modelId: string,
  projection: number,
  width: number
): number | null {
  const model = STORE_MODELS[modelId];
  if (!model || !model.buyPrices[projection]) {
    return null;
  }

  // Trouver le palier de largeur correspondant
  const priceList = model.buyPrices[projection];
  for (const entry of priceList) {
    if (width <= entry.maxW) {
      return entry.priceHT;
    }
  }

  return null;
}

/**
 * Calculer le prix de vente TTC pour un store avec dimensions
 */
export function getStoreSalePrice(
  modelId: string,
  projection: number,
  width: number
): number | null {
  const model = STORE_MODELS[modelId];
  const buyPrice = getBuyPrice(modelId, projection, width);
  
  if (!buyPrice || !model) {
    return null;
  }

  return calculateSalePrice(buyPrice, model.salesCoefficient ?? 1.8);
}
`;
}

/**
 * Échapper les chaînes pour TypeScript
 */
function escapeTsString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

/**
 * Enregistrer la génération dans l'historique
 */
async function logGeneration(
  stats: GenerationStats, 
  status: string = 'success',
  errorLog?: string
): Promise<void> {
  try {
    const version = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('_').slice(0, -5);
    
    await prisma.catalogGeneration.create({
      data: {
        version,
        productsCount: stats.productsProcessed,
        pricesCount: stats.pricesCalculated,
        fileSize: stats.fileSize,
        status,
        errorLog: errorLog || null,
        generatedBy: process.env.USER || 'unknown'
      }
    });
  } catch (error) {
    console.warn('⚠️  Impossible d\'enregistrer dans l\'historique:', error);
  }
}

// Exécuter le script
main().catch(console.error);
