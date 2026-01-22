import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addKissimyProduct() {
  console.log('Adding KISSIMY product to Supabase...');

  const now = new Date().toISOString();
  
  const kissimyProduct = {
    name: 'Store Banne Coffre KISSIMY',
    description: 'Store banne coffre intégral KISSIMY avec motorisation incluse et toile acrylique haute résistance',
    type: 'store_banne',
    base_price: 890,
    image: '/images/store-kissimy.jpg',
    category: 'Extérieur',
    specifications: {
      minWidth: 200,
      maxWidth: 700,
      minDepth: 150,
      maxDepth: 400,
      availableFabrics: ['acrylique-premium', 'acrylique-standard'],
      availableFrameColors: ['blanc', 'gris-anthracite', 'noir', 'bronze'],
      motorIncluded: true,
      motorType: 'radio',
      coffreType: 'integral',
    },
    created_at: now,
    updated_at: now,
  };

  // Check if product already exists by name
  const { data: existing } = await supabase
    .from('products')
    .select('id, name')
    .eq('name', 'Store Banne Coffre KISSIMY')
    .maybeSingle();

  if (existing) {
    console.log(`Product KISSIMY already exists with ID ${existing.id}, updating...`);
    const { error } = await supabase
      .from('products')
      .update(kissimyProduct)
      .eq('id', existing.id);

    if (error) {
      console.error('Error updating KISSIMY:', error);
      process.exit(1);
    }
    console.log('✓ KISSIMY product updated successfully');
  } else {
    console.log('Creating new KISSIMY product...');
    const { data, error } = await supabase
      .from('products')
      .insert(kissimyProduct)
      .select();

    if (error) {
      console.error('Error creating KISSIMY:', error);
      process.exit(1);
    }
    console.log('✓ KISSIMY product created successfully with ID:', data?.[0]?.id);
  }

  // Verify
  const { data: products } = await supabase
    .from('products')
    .select('id, name, type')
    .eq('type', 'store_banne');

  console.log('\nAll Store Banne products:');
  console.log(products);
}

addKissimyProduct();
