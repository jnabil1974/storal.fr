#!/usr/bin/env tsx
/**
 * Import des prix d'achat depuis catalog-data.backup.ts vers SQLite
 * 
 * Usage: npm run pricing:import
 */

import { PrismaClient } from '../../src/generated/prisma';
import { STORE_MODELS } from '../../src/lib/catalog-data.backup';

const prisma = new PrismaClient();

interface ImportStats {
  productsCreated: number;
  pricesCreated: number;
  optionsCreated: number;
  errors: string[];
}

async function main() {
  console.log('🚀 Démarrage import des prix depuis catalog-data.backup.ts\n');
  
  const stats: ImportStats = {
    productsCreated: 0,
    pricesCreated: 0,
    optionsCreated: 0,
    errors: []
  };

  try {
    // Itérer sur tous les modèles de stores
    for (const [modelId, model] of Object.entries(STORE_MODELS)) {
      console.log(`\n📦 Import produit: ${model.name} (${modelId})`);
      
      try {
        // 1. Créer le produit
        const product = await prisma.product.create({
          data: {
            modelId: modelId,
            name: model.name,
            slug: model.slug || modelId.replace(/_/g, '-'),
            productType: 'store',
            salesCoefficient: model.salesCoefficient || 1.8,
            isActive: true,
            isPromo: modelId.includes('promo')
          }
        });
        
        stats.productsCreated++;
        console.log(`  ✅ Produit créé: ${product.name} (coeff: ${product.salesCoefficient})`);

        // 2. Importer les prix d'achat
        let priceCount = 0;
        
        if (model.buyPrices) {
          for (const [projectionStr, priceList] of Object.entries(model.buyPrices)) {
            const projection = parseInt(projectionStr);
            
            for (const priceEntry of priceList) {
              await prisma.productPrice.create({
                data: {
                  productId: product.id,
                  projection: projection,
                  maxWidth: priceEntry.maxW,
                  priceHT: priceEntry.priceHT
                }
              });
              
              priceCount++;
              stats.pricesCreated++;
            }
          }
        }
        
        console.log(`  💶 ${priceCount} prix importés`);

        // 3. Importer les coefficients d'options
        let optionCount = 0;
        
        if (model.optionsCoefficients) {
          for (const [optionType, coefficient] of Object.entries(model.optionsCoefficients)) {
            await prisma.optionCoefficient.create({
              data: {
                productId: product.id,
                optionType: optionType,
                coefficient: coefficient || 1.0,
                description: getOptionDescription(optionType)
              }
            });
            
            optionCount++;
            stats.optionsCreated++;
          }
        }
        
        console.log(`  ⚙️  ${optionCount} coefficients d'options créés`);
        
      } catch (error: any) {
        const errorMsg = `Erreur import ${modelId}: ${error.message}`;
        console.error(`  ❌ ${errorMsg}`);
        stats.errors.push(errorMsg);
      }
    }

    // Résumé final
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DE L\'IMPORT');
    console.log('='.repeat(60));
    console.log(`✅ Produits créés:              ${stats.productsCreated}`);
    console.log(`💶 Prix d'achat importés:       ${stats.pricesCreated}`);
    console.log(`⚙️  Coefficients options créés: ${stats.optionsCreated}`);
    
    if (stats.errors.length > 0) {
      console.log(`\n⚠️  Erreurs rencontrées: ${stats.errors.length}`);
      stats.errors.forEach(err => console.log(`   - ${err}`));
    } else {
      console.log('\n✅ Import terminé sans erreur !');
    }
    
    console.log('\n💡 Prochaine étape: npm run pricing:generate\n');

  } catch (error: any) {
    console.error('\n❌ ERREUR FATALE:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Descriptions des types d'options
 */
function getOptionDescription(optionType: string): string {
  const descriptions: Record<string, string> = {
    'LED_ARMS': 'Éclairage LED dans les bras',
    'LED_CASSETTE': 'Éclairage LED dans le coffre',
    'LAMBREQUIN_FIXE': 'Lambrequin décoratif fixe',
    'LAMBREQUIN_ENROULABLE': 'Lambrequin enroulable',
    'LAMBREQUIN_DEROULANT': 'Lambrequin déroulant',
    'MOTOR_RADIO': 'Moteur radio',
    'SENSOR_SUN': 'Capteur soleil',
    'SENSOR_WIND': 'Capteur vent',
    'FIXATION_PLAFOND': 'Kit fixation plafond'
  };
  
  return descriptions[optionType] || optionType;
}

// Exécuter le script
main().catch(console.error);
