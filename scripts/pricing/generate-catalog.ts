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
    
    // Générer les types TypeScript
    fileContent += generateTypeDefinitions();
    
    // Générer l'objet STORE_MODELS
    fileContent += 'export const STORE_MODELS: Record<string, StoreModel> = {\n';

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
function generateTypeDefinitions(): string {
  return `export interface PriceEntry {
  maxW: number;  // Largeur maximum en mm
  priceHT: number; // Prix d'achat HT fournisseur en €
}

export interface StoreModel {
  id: string;
  name: string;
  slug: string;
  salesCoefficient: number; // Coefficient de marge (ex: 1.8 = +80%)
  buyPrices: Record<number, PriceEntry[]>; // Organisé par projection (avancée)
  optionsCoefficients: Record<string, number>; // Coefficients par type d'option
}

`;
}

/**
 * Générer les fonctions helper
 */
function generateHelperFunctions(): string {
  return `/**
 * Calculer le prix de vente TTC à partir du prix d'achat HT
 * 
 * @param priceHT Prix d'achat HT fournisseur
 * @param coefficient Coefficient de marge du produit
 * @param vat Taux de TVA (défaut: 1.10 pour 10%)
 * @returns Prix de vente TTC arrondi
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
 * 
 * @param modelId ID du modèle de store
 * @param projection Avancée en mm
 * @param width Largeur en mm
 * @returns Prix d'achat HT ou null si non trouvé
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
 * 
 * @param modelId ID du modèle
 * @param projection Avancée en mm
 * @param width Largeur en mm
 * @returns Prix de vente TTC ou null
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

  return calculateSalePrice(buyPrice, model.salesCoefficient);
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
