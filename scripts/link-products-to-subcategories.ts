import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function linkProductsToSubcategories() {
  console.log('🔗 Linking products to subcategories...\n');

  try {
    // Get subcategories
    const { data: subcategories } = await supabase
      .from('product_subcategories')
      .select('id, category_id, slug')
      .order('slug');

    const subcategoriesMap = new Map(
      subcategories?.map(s => [s.slug, s.id]) || []
    );

    console.log('Subcategories map:', Array.from(subcategoriesMap.entries()));

    // Get all products
    const { data: products } = await supabase
      .from('products')
      .select('id, name, type');

    console.log('\nProducts to update:');
    products?.forEach(p => console.log(`  • ${p.name} (type: ${p.type})`));

    // Link products based on their type and specific attributes
    const updates: Array<{ id: string; subcategory_id: string }> = [];

    products?.forEach(product => {
      let subcategorySlug: string | null = null;

      if (product.type === 'store_banne') {
        // KISSIMY special case - uses 'coffre' subcategory
        if (product.name.includes('KISSIMY')) {
          subcategorySlug = 'coffre';
        } else {
          subcategorySlug = 'standard';
        }
      } else if (product.type === 'porte_blindee') {
        subcategorySlug = 'a2p';
      } else if (product.type === 'store_antichaleur') {
        subcategorySlug = 'premium';
      }

      if (subcategorySlug && subcategoriesMap.has(subcategorySlug)) {
        updates.push({
          id: product.id,
          subcategory_id: subcategoriesMap.get(subcategorySlug)!
        });
        console.log(`  ✓ ${product.name} → ${subcategorySlug}`);
      }
    });

    if (updates.length === 0) {
      console.log('\n❌ No products to update');
      return;
    }

    // Update products with subcategory_id using individual updates
    for (const update of updates) {
      const { error } = await supabase
        .from('products')
        .update({ subcategory_id: update.subcategory_id })
        .eq('id', update.id);

      if (error) {
        console.error(`Error updating product ${update.id}:`, error);
        throw error;
      }
    }

    console.log(`\n✅ Linked ${updates.length} products to subcategories`);

    // Verify
    console.log('\nVerifying links:');
    const { data: verified } = await supabase
      .from('products')
      .select(`
        id,
        name,
        type,
        subcategory_id,
        product_subcategories(slug, category_id, product_categories(display_name))
      `)
      .not('subcategory_id', 'is', null);

    verified?.forEach(p => {
      const sub = p.product_subcategories as any;
      const cat = sub?.product_categories as any;
      console.log(`  • ${p.name} → ${sub?.slug} (${cat?.display_name})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

linkProductsToSubcategories();
