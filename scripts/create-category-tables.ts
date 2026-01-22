import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('🚀 Creating product categories tables...\n');

  try {
    // Create the tables using raw SQL
    const { data: result, error: sqlError } = await supabase.rpc('exec', {
      sql: `
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
      `
    });

    if (sqlError && sqlError.message.includes('PGRST')) {
      // If RPC exec doesn't work, try creating tables one by one
      console.log('Creating tables individually...\n');

      // We'll use a different approach - create via Supabase client
      // First, let's try a simple test query to see if tables exist
      try {
        await supabase.from('product_categories').select('count(*)').limit(1);
        console.log('✓ Tables already exist');
      } catch {
        console.log('⚠️ Tables not found. You need to create them manually via Supabase dashboard:');
        console.log('\n📋 Run this SQL in Supabase Query Editor:\n');
        
        const sql = `
-- Create product_categories table
CREATE TABLE product_categories (
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

-- Create product_subcategories table
CREATE TABLE product_subcategories (
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

-- Add column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES product_subcategories(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX idx_product_categories_slug ON product_categories(slug);
CREATE INDEX idx_product_subcategories_category_id ON product_subcategories(category_id);
CREATE INDEX idx_products_subcategory_id ON products(subcategory_id);
        `;
        
        console.log(sql);
        process.exit(1);
      }
    }

    console.log('✓ Tables created\n');

    // Now insert categories
    console.log('2️⃣ Inserting product categories...');
    
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

    console.log('3️⃣ Fetching categories...');
    const { data: categories } = await supabase
      .from('product_categories')
      .select('id, slug, display_name')
      .order('order_index');

    console.log('\nCategories:');
    categories?.forEach(cat => console.log(`  • ${cat.display_name}`));

    console.log('\n✅ Setup completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTables();
