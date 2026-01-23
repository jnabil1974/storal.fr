import { createClient } from '@supabase/supabase-js';

async function checkOptions() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: groups } = await supabase
    .from('product_option_groups')
    .select('id, name, slug, is_required')
    .order('display_order');

  console.log('📊 Option Groups:');
  for (const group of groups || []) {
    const { data: opts } = await supabase
      .from('product_options')
      .select('name, price_adjustment')
      .eq('group_id', group.id)
      .order('display_order');

    const required = group.is_required ? ' (obligatoire)' : ' (optionnel)';
    console.log(`\n${group.name}${required}:`);
    opts?.forEach(o => {
      const price = o.price_adjustment > 0 ? ` (+${o.price_adjustment}€)` : ' (inclus)';
      console.log(`  ✓ ${o.name}${price}`);
    });
  }
}

checkOptions();
