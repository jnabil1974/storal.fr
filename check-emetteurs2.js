const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkEmetteurs() {
  console.log('🔍 Vérification des émetteurs...');
  
  const { data, error } = await supabase
    .from('product_options')
    .select('*')
    .eq('category', 'Émetteur');

  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }

  console.log(`📊 Nombre d'émetteurs trouvés: ${data?.length || 0}`);
  if (data && data.length > 0) {
    data.forEach(item => {
      console.log(`  - ${item.name} (${item.purchase_price_ht}€ × ${item.sales_coefficient})`);
    });
  } else {
    console.log('⚠️ Aucun émetteur trouvé. Vous devez exécuter add-emetteurs.sql');
  }
}

checkEmetteurs();
