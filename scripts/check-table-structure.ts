import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Get one product to see structure
const { data } = await supabase.from('products').select('*').limit(1);
console.log('Current products table structure:');
console.log(JSON.stringify(data, null, 2));

// Get table info via pg_catalog
const { data: columns } = await supabase
  .rpc('exec', { sql: `
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'products'
    ORDER BY ordinal_position;
  `});

console.log('\nColumns:', columns);
