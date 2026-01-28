const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkStructure() {
  console.log('🔍 Vérification de la structure product_options...\n');
  
  // Récupérer les colonnes de la table
  const { data: columns, error: columnsError } = await supabase
    .from('product_options')
    .select('*')
    .limit(1);

  if (columnsError) {
    console.error('❌ Erreur:', columnsError);
    return;
  }

  if (columns && columns.length > 0) {
    console.log('📋 Colonnes disponibles:', Object.keys(columns[0]));
  }

  // Vérifier toutes les options avec product_id
  const { data: allOptions, error: allError } = await supabase
    .from('product_options')
    .select('id, name, category, product_id');

  if (allError) {
    console.error('❌ Erreur:', allError);
    return;
  }

  console.log('\n📊 Toutes les options par product_id:\n');
  const grouped = {};
  allOptions.forEach(opt => {
    if (!grouped[opt.product_id]) grouped[opt.product_id] = [];
    grouped[opt.product_id].push(opt);
  });

  Object.keys(grouped).forEach(productId => {
    console.log(`\n🏢 Product ID = ${productId}:`);
    grouped[productId].forEach(opt => {
      console.log(`  - ID: ${opt.id} | ${opt.name} | Catégorie: ${opt.category}`);
    });
  });

  console.log('\n\n🔎 Options pour KISSIMY (product_id=1) par catégorie:\n');
  const motorisations = allOptions.filter(o => o.product_id === 1 && o.category === 'Motorisation');
  const emetteurs = allOptions.filter(o => o.product_id === 1 && o.category === 'Émetteur');
  const toiles = allOptions.filter(o => o.product_id === 1 && o.category === 'Toile');

  console.log(`⚙️ Motorisations: ${motorisations.length}`);
  motorisations.forEach(m => console.log(`  - ${m.name}`));

  console.log(`\n📡 Émetteurs: ${emetteurs.length}`);
  emetteurs.forEach(e => console.log(`  - ${e.name}`));

  console.log(`\n🎨 Toiles: ${toiles.length}`);
  toiles.forEach(t => console.log(`  - ${t.name}`));
}

checkStructure();
