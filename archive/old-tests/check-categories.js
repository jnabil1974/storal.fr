const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkCategories() {
  console.log('🔍 Vérification des catégories...');
  
  const { data, error } = await supabase
    .from('product_options')
    .select('category')
    .order('category');

  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }

  const categories = [...new Set(data.map(d => d.category))];
  console.log(`📊 Catégories trouvées: ${categories.join(', ')}`);
}

checkCategories();
