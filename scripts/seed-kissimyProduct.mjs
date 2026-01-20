#!/usr/bin/env node

/**
 * Script pour insérer le produit Store Banne Coffre KISSIMY dans Supabase
 * Version JavaScript simple
 * 
 * Usage: node scripts/seed-kissimyProduct.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger les variables d'env depuis .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'OK' : 'MISSING');
  console.error('  SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'OK' : 'MISSING');
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

async function seedKissimyProduct() {
  try {
    console.log('🔄 Insertion du produit Store Banne Coffre KISSIMY...\n');

    // D'abord, vérifier la structure de la table
    console.log('📋 Vérification de la structure de la table products...');
    const { data: sampleRow, error: sampleError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (!sampleError && sampleRow) {
      console.log('Colonnes détectées:', Object.keys(sampleRow).join(', '));
    }

    // Vérifier si le produit existe déjà
    console.log('\n📋 Vérification de l\'existence du produit...');
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('name', 'Store Banne Coffre KISSIMY')
      .single();

    if (existing) {
      console.log('⚠️  Le produit KISSIMY existe déjà (ID:', existing.id + ')');
      console.log('Suppression de l\'ancien produit...');
      await supabase.from('products').delete().eq('id', existing.id);
      console.log('✅ Ancien produit supprimé\n');
    }

    // Créer le produit - en utilisant seulement les colonnes supportées
    console.log('🆕 Création du produit KISSIMY...');
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([
        {
          name: 'Store Banne Coffre KISSIMY',
          type: 'store_banne',
          description:
            'Store banne coffre KISSIMY - Motorisation SUNEA IO incluse. Configurable selon vos besoins: dimensions, options, accessoires.',
          base_price: 1010, // Prix minimum HT
          category: 'stores',
          image: '/images/products/store-banne-kissimy.jpg',
          specifications: {
            model: 'kissimy',
            avanceeOptions: [1500, 2000, 2500, 3000],
            largeurMin: 1800,
            largeurMax: 4830,
            pricingGrid: KISSIMY_PRICING_GRID,
            framColors: ['blanc', 'gris', 'noir', 'bronze', 'inox'],
            availableOptions: [
              { id: 'manivelle_rts', category: 'motorisation', priceHT: 108 },
              { id: 'manivelle_io', category: 'motorisation', priceHT: 132 },
              { id: 'telecommande_5', category: 'telecommande', priceHT: 14 },
              { id: 'telecommande_7', category: 'telecommande', priceHT: 25 },
              { id: 'pose_plafond', category: 'accessoires', priceHT: 39 },
              { id: 'tube_28mm', category: 'accessoires', priceHT: 26 },
              { id: 'tube_40mm', category: 'accessoires', priceHT: 39 },
              { id: 'tube_50mm', category: 'accessoires', priceHT: 52 },
              { id: 'auvent', category: 'accessoires', priceHT: 125 },
              { id: 'capteur_vent', category: 'accessoires', priceHT: 90 },
              { id: 'tahoma', category: 'accessoires', priceHT: 117 },
              { id: 'cablage_10m', category: 'accessoires', priceHT: 48 },
              { id: 'couleur_special', category: 'couleur', priceHT: 92 },
              { id: 'bicolor', category: 'couleur', priceHT: 46 },
            ],
            coefficient: 2.0,
            optionsEnabled: true,
            dynamicRulesEnabled: true,
          },
        },
      ])
      .select()
      .single();

    if (productError) {
      throw new Error(`Erreur lors de l'insertion du produit: ${productError.message}`);
    }

    console.log('✅ Produit KISSIMY créé (ID:', product.id + ')\n');

    // Créer la règle de prix par défaut (optionnel - table peut ne pas exister)
    console.log('📊 Création de la règle de prix...');
    try {
      const { data: pricingRule, error: ruleError } = await supabase
        .from('pricing_rules')
        .insert([
          {
            product_id: product.id,
            coefficient: 2.0,
            reason: 'DEFAULT_COEFFICIENT_KISSIMY',
            valid_from: new Date().toISOString(),
            valid_until: null,
            is_active: true,
            created_by: 'system',
          },
        ])
        .select()
        .single();

      if (ruleError) {
        if (ruleError.message.includes('pricing_rules')) {
          console.log('⚠️  Table pricing_rules non trouvée (ignorée pour l\'instant)\n');
        } else {
          throw new Error(`Erreur lors de l'insertion de la règle: ${ruleError.message}`);
        }
      } else {
        console.log('✅ Règle de prix créée (ID:', pricingRule.id + ')\n');
      }
    } catch (error) {
      console.log('⚠️  Impossible de créer la règle de prix (table non existante)');
      console.log('   Vous pourrez créer la table pricing_rules manuellement dans Supabase\n');
    }

    // Récapitulatif
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Récapitulatif du produit KISSIMY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Produit ID:', product.id);
    console.log('  Nom:', product.name);
    console.log('  Type:', product.type);
    console.log('  Catégorie:', product.category);
    console.log('');
    console.log('📐 Dimensions:');
    console.log('  • Avancée: 1500, 2000, 2500, 3000 mm');
    console.log('  • Largeur: 1800 - 4830 mm');
    console.log('  • Variantes de grille: 12');
    console.log('');
    console.log('💰 Tarification:');
    console.log('  • Prix min (HT): 1010€');
    console.log('  • Prix max (HT): 1296€');
    console.log('  • Coefficient appliqué: 2.0 (100% marge)');
    console.log('  • TVA: 20%');
    console.log('');
    console.log('🎨 Options disponibles: 14');
    console.log('  - Motorisation: 2 options');
    console.log('  - Télécommande: 2 options');
    console.log('  - Accessoires: 8 options');
    console.log('  - Couleur/Toile: 2 options');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Seeding terminé avec succès!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('\n❌ Erreur:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.message.includes('relation')) {
      console.error('\n💡 Conseil: Assurez-vous que les tables "products" et "pricing_rules" existent dans Supabase');
    }
    process.exit(1);
  }
}

seedKissimyProduct();
