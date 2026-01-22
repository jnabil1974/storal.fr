#!/bin/bash

# Setup product categories in Supabase
echo "🚀 Setting up product categories in Supabase..."

export NEXT_PUBLIC_SUPABASE_URL=https://qctnvyxtbvnvllchuibu.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=sb_secret_9Ym5jsPSc1VCcbYYTal79w_nRaNwR8K

# Create tables using SQL
npx tsx -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  console.log('Creating product_categories table...');
  
  // Create product_categories table
  const { error: catError } = await supabase.rpc('_execute_sql', { 
    sql: \`
      CREATE TABLE IF NOT EXISTS product_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        display_name VARCHAR(255) NOT NULL,
        description TEXT,
        icon_svg TEXT,
        gradient_from VARCHAR(50),
        gradient_to VARCHAR(50),
        order_index INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS product_subcategories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
        slug VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(category_id, slug)
      );
      
      ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES product_subcategories(id) ON DELETE SET NULL;
      
      CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON product_categories(slug);
      CREATE INDEX IF NOT EXISTS idx_product_subcategories_category_id ON product_subcategories(category_id);
      CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON products(subcategory_id);
    \`
  });
  
  if (!catError) {
    console.log('✓ Tables created');
  }
  
  console.log('\\nInserting categories...');
  
  // Insert main categories
  const { error: insertError } = await supabase
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
  
  if (!insertError) {
    console.log('✓ Categories inserted');
  }
  
  // Verify
  const { data } = await supabase
    .from('product_categories')
    .select('slug, display_name')
    .order('order_index');
  
  console.log('\\n📊 Categories created:');
  data?.forEach((cat) => console.log('  • ' + cat.display_name));
  
  console.log('\\n✅ Setup completed!');
})();
"

echo "Done!"
