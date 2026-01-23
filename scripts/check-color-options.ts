import { createClient } from '@supabase/supabase-js';

async function run() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: frameGroup } = await supabase
    .from('product_option_groups')
    .select('id, name')
    .eq('slug', 'frame-color')
    .maybeSingle();

  const { data: fabricGroup } = await supabase
    .from('product_option_groups')
    .select('id, name')
    .eq('slug', 'fabric-color')
    .maybeSingle();

  console.log('Groupes de couleurs:');
  console.log(' - Armature:', frameGroup?.name || 'non trouvé');
  console.log(' - Toile:', fabricGroup?.name || 'non trouvé');

  if (frameGroup) {
    const { data: frameColors } = await supabase
      .from('product_options')
      .select('name, slug, price_adjustment')
      .eq('group_id', frameGroup.id)
      .order('display_order');
    console.log('\nCouleurs armature:');
    frameColors?.forEach(c => {
      const price = c.price_adjustment ? ` (+${c.price_adjustment}€)` : ' (inclus)';
      console.log(`  • ${c.name}${price}`);
    });
  }

  if (fabricGroup) {
    const { data: fabricColors } = await supabase
      .from('product_options')
      .select('name, slug, price_adjustment')
      .eq('group_id', fabricGroup.id)
      .order('display_order');
    console.log('\nCouleur de toile:');
    fabricColors?.forEach(c => {
      const price = c.price_adjustment ? ` (+${c.price_adjustment}€)` : '';
      console.log(`  • ${c.name}${price}`);
    });
  }
}

run();