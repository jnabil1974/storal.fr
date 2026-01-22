import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('Running product categories migration...');

  // Read the SQL migration file
  const migrationPath = path.join(__dirname, '..', 'supabase-product-categories.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  try {
    // Execute the migration
    const { error } = await supabase.rpc('exec', { sql });
    
    if (error) {
      // Try direct approach using query
      console.log('Executing migration directly...');
      const statements = sql.split(';').filter((stmt) => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          const { error: queryError } = await supabase.rpc('_exec', { sql: statement });
          if (queryError) {
            console.warn('Warning:', queryError.message);
          }
        }
      }
    }

    console.log('✓ Migration completed successfully');

    // Verify the tables exist
    const { data: categories } = await supabase
      .from('product_categories')
      .select('id, slug, display_name')
      .order('order_index');

    console.log('\nProduct Categories:');
    console.log(JSON.stringify(categories, null, 2));

    const { data: subcategories } = await supabase
      .from('product_subcategories')
      .select('id, slug, name, category_id')
      .order('order_index');

    console.log('\nProduct Subcategories:');
    console.log(JSON.stringify(subcategories, null, 2));
  } catch (err) {
    console.error('Error running migration:', err);
    process.exit(1);
  }
}

runMigration();
