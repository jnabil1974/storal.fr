const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkProductFields() {
  console.log('🔍 Vérification des champs du produit KISSIMY...');
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', 'store-banne-kissimy')
    .single();

  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }

  console.log('📊 Champs disponibles:', Object.keys(data));
  console.log('📋 Données complètes:', data);
}

checkProductFields();
