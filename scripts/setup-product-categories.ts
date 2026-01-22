import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupCategories() {
  console.log('🚀 Setting up product categories...\n');

  try {
    console.log('1️⃣ Inserting product categories...');
    
    const { error: catError } = await supabase
      .from('product_categories')
      .upsert([
        {
          slug: 'store-banne',
          name: 'store_banne',
          display_name: 'Stores Bannes',
          description: 'Protection solaire élégante pour terrasses et balcons',
          gradient_from: 'orange-100',
          gradient_to: 'yellow-100',
          order_index: 1
        },
        {
          slug: 'store-antichaleur',
          name: 'store_antichaleur',
          display_name: 'Stores Anti-Chaleur',
          description: 'Solutions thermiques pour fenêtres et vérandas',
          gradient_from: 'red-100',
          gradient_to: 'orange-100',
          order_index: 2
        },
        {
          slug: 'porte-blindee',
          name: 'porte_blindee',
          display_name: 'Portes Blindées',
          description: 'Sécurité maximale avec certification A2P',
          gradient_from: 'gray-100',
          gradient_to: 'slate-100',
          order_index: 3
        }
      ], { onConflict: 'slug' });

    if (catError) throw catError;
    console.log('✓ Categories created\n');

    console.log('2️⃣ Fetching categories for subcategories...');
    const { data: categories, error: fetchError } = await supabase
      .from('product_categories')
      .select('id, slug');

    if (fetchError) throw fetchError;

    // Create subcategories
    const subcats = [
      { cat: 'store-banne', slug: 'standard', name: 'Stores Standard', desc: 'Modèles classiques avec motorisation', order: 1 },
      { cat: 'store-banne', slug: 'coffre', name: 'Stores Coffre', desc: 'Coffre intégral pour protection complète', order: 2 },
      { cat: 'porte-blindee', slug: 'a2p', name: 'Certifiées A2P', desc: 'Portes avec certification anti-effraction', order: 1 },
      { cat: 'store-antichaleur', slug: 'premium', name: 'Premium', desc: 'Haute performance thermique', order: 1 }
    ];

    for (const subcat of subcats) {
      const catId = categories?.find(c => c.slug === subcat.cat)?.id;
      if (catId) {
        const { error: subError } = await supabase
          .from('product_subcategories')
          .upsert({
            category_id: catId,
            slug: subcat.slug,
            name: subcat.name,
            description: subcat.desc,
            order_index: subcat.order
          }, { onConflict: 'category_id,slug' });

        if (!subError) console.log(`  ✓ ${subcat.name}`);
      }
    }

    console.log('\n3️⃣ Verifying structure...\n');
    const { data: finalCats } = await supabase
      .from('product_categories')
      .select('id, slug, display_name')
      .order('order_index');

    console.log('Categories:');
    finalCats?.forEach(cat => console.log(`  • ${cat.display_name}`));

    const { data: finalSubs } = await supabase
      .from('product_subcategories')
      .select('name, slug')
      .order('order_index');

    console.log('\nSubcategories:');
    finalSubs?.forEach(sub => console.log(`  • ${sub.name}`));

    console.log('\n✅ Setup completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupCategories();
