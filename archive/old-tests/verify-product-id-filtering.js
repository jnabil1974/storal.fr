const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verifyFiltering() {
  console.log('✅ Vérification du filtrage par product_id\n');
  
  // Vérifier les motorisations pour KISSIMY (product_id=1)
  const { data: motorisations } = await supabase
    .from('product_options')
    .select('id, name, product_id')
    .eq('category', 'Motorisation')
    .eq('product_id', 1);

  console.log(`⚙️ Motorisations pour KISSIMY (product_id=1): ${motorisations?.length || 0}`);
  motorisations?.forEach(m => console.log(`  - ID ${m.id}: ${m.name}`));

  // Vérifier les émetteurs pour KISSIMY (product_id=1)
  const { data: emetteurs } = await supabase
    .from('product_options')
    .select('id, name, product_id')
    .eq('category', 'Émetteur')
    .eq('product_id', 1);

  console.log(`\n📡 Émetteurs pour KISSIMY (product_id=1): ${emetteurs?.length || 0}`);
  emetteurs?.forEach(e => console.log(`  - ID ${e.id}: ${e.name}`));

  // Vérifier les toiles pour KISSIMY (product_id=1)
  const { data: toiles } = await supabase
    .from('product_options')
    .select('id, name, product_id')
    .eq('category', 'Toile')
    .eq('product_id', 1);

  console.log(`\n🎨 Toiles pour KISSIMY (product_id=1): ${toiles?.length || 0}`);
  toiles?.forEach(t => console.log(`  - ID ${t.id}: ${t.name}`));

  // Vérifier s'il y a des options pour d'autres produits
  const { data: otherOptions } = await supabase
    .from('product_options')
    .select('id, product_id, category')
    .neq('product_id', 1)
    .limit(5);

  console.log(`\n🔍 Autres options (product_id ≠ 1): ${otherOptions?.length || 0}`);
  if (otherOptions && otherOptions.length > 0) {
    const productIds = [...new Set(otherOptions.map(o => o.product_id))];
    console.log(`  Product IDs trouvés: ${productIds.join(', ')}`);
  }
}

verifyFiltering().catch(console.error);
