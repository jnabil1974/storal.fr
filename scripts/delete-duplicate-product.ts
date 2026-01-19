import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'OK' : 'MISSING');
  console.error('Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'OK' : 'MISSING');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // Get all store_antichaleur products
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, created_at')
    .eq('type', 'store_antichaleur')
    .order('created_at', { ascending: false });

  if (fetchError) {
    console.error('Error fetching products:', fetchError);
    process.exit(1);
  }

  console.log(`Found ${products?.length} store_antichaleur products`);
  
  if (!products || products.length <= 1) {
    console.log('No duplicates to delete');
    process.exit(0);
  }

  // Delete all but the first (latest)
  const toDelete = products.slice(1);
  console.log(`Deleting ${toDelete.length} older duplicates...`);

  for (const product of toDelete) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id);

    if (error) {
      console.error(`Error deleting ${product.id}:`, error);
    } else {
      console.log(`✓ Deleted ${product.id}`);
    }
  }

  console.log('Done!');
}

main().catch(console.error);
