const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkToiles() {
  console.log('🔍 Vérification des toiles...');
  
  const { data, error } = await supabase
    .from('product_options')
    .select('*')
    .eq('category', 'Toile');

  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }

  console.log(`📊 Nombre de toiles trouvées: ${data?.length || 0}`);
  if (data && data.length > 0) {
    data.forEach(item => {
      console.log(`  - ${item.name} (${item.purchase_price_ht}€/m² × ${item.sales_coefficient})`);
    });
  } else {
    console.log('⚠️ Aucune toile trouvée. Vérification des autres catégories...');
  }
}

checkToiles();
