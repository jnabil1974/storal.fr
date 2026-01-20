/**
 * Script pour insérer le produit Store Banne Coffre KISSIMY dans Supabase
 * 
 * Usage: npx ts-node scripts/seed-kissimyProduct.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Grille de tarification KISSIMY
const KISSIMY_PRICING_GRID = [
  { avancee: 1500, largeurMin: 1800, largeurMax: 2470, priceHT: 1010 },
  { avancee: 1500, largeurMin: 2470, largeurMax: 3650, priceHT: 1039 },
  { avancee: 1500, largeurMin: 3650, largeurMax: 4830, priceHT: 1068 },
  { avancee: 2000, largeurMin: 1800, largeurMax: 2470, priceHT: 1095 },
  { avancee: 2000, largeurMin: 2470, largeurMax: 3650, priceHT: 1125 },
  { avancee: 2000, largeurMin: 3650, largeurMax: 4830, priceHT: 1154 },
  { avancee: 2500, largeurMin: 1800, largeurMax: 2470, priceHT: 1181 },
  { avancee: 2500, largeurMin: 2470, largeurMax: 3650, priceHT: 1210 },
  { avancee: 2500, largeurMin: 3650, largeurMax: 4830, priceHT: 1239 },
  { avancee: 3000, largeurMin: 1800, largeurMax: 2470, priceHT: 1268 },
  { avancee: 3000, largeurMin: 2470, largeurMax: 3650, priceHT: 1296 },
  { avancee: 3000, largeurMin: 3650, largeurMax: 4830, priceHT: 1295 },
];

const KISSIMYOPTIONS = {
  manivelleDeSecours: {
    somfy_iohomme_rts: 108,
    somfy_iohomme_io: 132,
  },
  telecommande: {
    remote_5_canaux: 14,
    remote_7_canaux: 25,
  },
  accessoires: {
    poseSousPlafond: 39,
    tubeAluminium: { '28mm': 26, '40mm': 39, '50mm': 52 },
    auvent: 125,
    capteurVent: 90,
    tahoma: 117,
    cablage10m: 48,
  },
  couleur: {
    specialeCouleur: 92,
    biColor: 46,
  },
};

async function seedKissimyProduct() {
  try {
    console.log('🔄 Insertion du produit KISSIMY...');

    // Créer le produit
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([
        {
          name: 'Store Banne Coffre KISSIMY',
          type: 'store_banne',
          model: 'kissimy',
          description:
            'Store banne coffre KISSIMY - Motorisation SUNEA IO incluse. Configurable selon vos besoins: dimensions, options, accessoires.',
          basePrice: 1010, // Prix minimum HT
          category: 'stores',
          image: '/images/store-banne-kissimy.jpg',
          active: true,
          specifications: {
            avanceeOptions: [1500, 2000, 2500, 3000],
            largeurMin: 1800,
            largeurMax: 4830,
            pricingGrid: KISSIMY_PRICING_GRID,
            framColors: ['blanc', 'gris', 'noir', 'bronze', 'inox'],
          },
          pricingConfig: {
            coefficient: 2.0, // 100% margin + TVA
            optionsEnabled: true,
            dynamicRulesEnabled: true,
          },
        },
      ])
      .select()
      .single();

    if (productError) {
      throw new Error(`Failed to insert product: ${productError.message}`);
    }

    console.log('✅ Produit KISSIMY créé:', product?.id);

    // Créer la règle de prix par défaut
    const { data: pricingRule, error: ruleError } = await supabase
      .from('pricing_rules')
      .insert([
        {
          product_id: product!.id,
          coefficient: 2.0,
          reason: 'DEFAULT_COEFFICIENT',
          valid_from: new Date().toISOString(),
          valid_until: null,
          is_active: true,
          created_by: 'system',
        },
      ])
      .select()
      .single();

    if (ruleError) {
      throw new Error(`Failed to insert pricing rule: ${ruleError.message}`);
    }

    console.log('✅ Règle de prix créée:', pricingRule?.id);

    console.log('\n📊 Récapitulatif KISSIMY:');
    console.log('  • Produit ID:', product?.id);
    console.log('  • Nom:', product?.name);
    console.log('  • Options de largeur: 1800-4830mm');
    console.log('  • Options d\'avancée: 1500, 2000, 2500, 3000mm');
    console.log('  • Nombre de variantes: 12 (grille)');
    console.log('  • Prix min (HT):', 1010, '€');
    console.log('  • Prix max (HT):', 1296, '€');
    console.log('  • Coefficient:', 2.0);
    console.log('  • TVA:', 20, '%');

    console.log('\n✨ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedKissimyProduct();
