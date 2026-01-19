import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  {
    name: 'Store Banne Standard',
    description: 'Store banne classique avec motorisation électrique',
    type: 'store_banne',
    base_price: 350.00,
    image: '/images/store-banne-1.jpg',
    category: 'Extérieur',
    specifications: {
      minWidth: 100,
      maxWidth: 600,
      minDepth: 50,
      maxDepth: 250,
      availableFabrics: ['acrylique', 'polyester', 'micro-perforé'],
      availableFrameColors: ['blanc', 'gris', 'noir', 'bronze'],
      motorOptions: ['manuel', 'electrique', 'smarty'],
    },
  },
  {
    name: 'Store Antichaleur Premium',
    description: 'Protection solaire haute performance avec contrôle thermique',
    type: 'store_antichaleur',
    base_price: 150.0,
    image: '/images/store-antichaleur-1.jpg',
    category: 'Occultation',
    specifications: {
      minWidth: 60,
      maxWidth: 300,
      minHeight: 80,
      maxHeight: 300,
      availableFabricTypes: ['screen', 'semi-occultant', 'occultant'],
      availableColors: ['blanc', 'beige', 'gris', 'anthracite', 'noir'],
      motorOptions: ['manuel', 'electrique', 'solaire'],
    },
  },
  {
    name: 'Porte Blindée Standard A2P',
    description: 'Porte blindée entrée avec certification A2P 2 étoiles',
    type: 'porte_blindee',
    base_price: 890.00,
    image: '/images/porte-blindee-1.jpg',
    category: 'Entrée',
    specifications: {
      minWidth: 70,
      maxWidth: 100,
      minHeight: 200,
      maxHeight: 240,
      availableMaterials: ['acier', 'aluminium', 'composite'],
      availableTypes: ['battante', 'coulissante'],
      securityLevels: ['A2P_1', 'A2P_2', 'A2P_3'],
      availableColors: ['blanc', 'gris', 'noir', 'bois'],
    },
  },
];

async function seed() {
  console.log('🌱 Seeding Supabase...');

  // Vérifier si la table existe
  const { data: existingProducts, error: checkError } = await supabase
    .from('products')
    .select('id')
    .limit(1);

  if (checkError) {
    console.error('❌ Error checking products table:', checkError.message);
    console.log('\n⚠️  Please run the SQL schema first in Supabase SQL Editor:');
    console.log('   See: supabase-schema.sql\n');
    process.exit(1);
  }

  // Insérer les produits
  for (const product of products) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select();

    if (error) {
      console.error(`❌ Error inserting ${product.name}:`, error.message);
    } else {
      console.log(`✅ Inserted: ${product.name} (ID: ${data[0].id})`);
    }
  }

  console.log('✨ Seeding complete!');
}

seed();
