import { createClient } from '@supabase/supabase-js';

async function run() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: group } = await supabase
    .from('product_option_groups')
    .select('id')
    .eq('slug', 'lighting')
    .maybeSingle();

  if (!group) {
    console.log('Lighting group not found');
    return;
  }

  const { data: options } = await supabase
    .from('product_options')
    .select('id, name, slug, price_adjustment')
    .eq('group_id', group.id)
    .order('display_order');

  console.log('Éclairage LED options:');
  for (const opt of options || []) {
    console.log(` - ${opt.name} (${opt.slug}) ${opt.price_adjustment ? "+"+opt.price_adjustment+"€" : ""}`);
    if (opt.slug === 'led-arms-dimmer-situo5-var') {
      const { data: tiers } = await supabase
        .from('option_advance_pricing')
        .select('advance_mm, price')
        .eq('option_id', opt.id)
        .order('advance_mm');
      console.log('   Avancées → Prix:');
      tiers?.forEach(t => console.log(`    • ${t.advance_mm}mm → ${t.price}€`));
    }
  }
}

run();