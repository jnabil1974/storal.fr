import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSubcategories() {
  console.log('🔄 Updating product subcategories...\n');

  try {
    // Get categories
    const { data: categories } = await supabase
      .from('product_categories')
      .select('id, slug, display_name')
      .order('order_index');

    if (!categories || categories.length === 0) {
      console.error('❌ No categories found');
      process.exit(1);
    }

    const categoriesMap = new Map(categories.map(c => [c.slug, c.id]));

    // Delete existing subcategories
    console.log('1️⃣ Deleting old subcategories...');
    const { error: deleteError } = await supabase
      .from('product_subcategories')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) throw deleteError;
    console.log('✓ Old subcategories deleted\n');

    // Define new subcategories structure
    const subcategories = [
      // Stores Bannes
      { category_slug: 'store-banne', slug: 'coffre', name: 'Coffre', order: 1 },
      { category_slug: 'store-banne', slug: 'semi-coffre', name: 'Semi-coffre', order: 2 },
      { category_slug: 'store-banne', slug: 'monoblocs', name: 'Monoblocs', order: 3 },
      { category_slug: 'store-banne', slug: 'traditionnel', name: 'Traditionnel', order: 4 },
      
      // Stores Anti-Chaleur
      { category_slug: 'store-antichaleur', slug: 'horizontaux', name: 'Stores horizontaux', order: 1 },
      { category_slug: 'store-antichaleur', slug: 'verticaux', name: 'Stores verticaux', order: 2 },
      
      // Portes Blindées
      { category_slug: 'porte-blindee', slug: 'serrures-applique', name: 'Portes blindées avec serrures en applique', order: 1 },
      { category_slug: 'porte-blindee', slug: 'serrures-encastrees', name: 'Portes blindées avec serrures encastrées', order: 2 },
      { category_slug: 'porte-blindee', slug: 'cave-collective', name: 'Porte de cave et porte collective', order: 3 },
      { category_slug: 'porte-blindee', slug: 'accessoires', name: 'Accessoires serrures etc...', order: 4 },
    ];

    // Insert new subcategories
    console.log('2️⃣ Creating new subcategories...');
    
    const subcategoriesToInsert = subcategories.map(sub => ({
      category_id: categoriesMap.get(sub.category_slug),
      slug: sub.slug,
      name: sub.name,
      order_index: sub.order
    }));

    const { error: insertError } = await supabase
      .from('product_subcategories')
      .insert(subcategoriesToInsert);

    if (insertError) throw insertError;
    console.log('✓ New subcategories created\n');

    // Display structure
    console.log('3️⃣ Verifying structure...\n');
    
    for (const category of categories) {
      const { data: subs } = await supabase
        .from('product_subcategories')
        .select('slug, name')
        .eq('category_id', category.id)
        .order('order_index');

      console.log(`📁 ${category.display_name}:`);
      subs?.forEach(sub => console.log(`   • ${sub.name}`));
      console.log('');
    }

    console.log('✅ Subcategories updated successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateSubcategories();
