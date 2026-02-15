import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCartItems() {
  console.log('🔍 Vérification de la table cart_items...\n');

  try {
    // Essayer de récupérer la structure de la table
    const { data, error, count } = await supabase
      .from('cart_items')
      .select('*', { count: 'exact', head: false })
      .limit(5);

    if (error) {
      console.log('❌ Table "cart_items" : ERREUR');
      console.log('   Erreur:', error.message);
      console.log('   Code:', error.code);
      
      if (error.code === '42P01') {
        console.log('\n⚠️  La table "cart_items" N\'EXISTE PAS dans Supabase');
      } else if (error.code === 'PGRST116') {
        console.log('\n⚠️  Problème de permissions RLS sur la table "cart_items"');
      }
    } else {
      console.log('✅ Table "cart_items" : EXISTE');
      console.log('   Nombre total de lignes:', count ?? 0);
      
      if (data && data.length > 0) {
        console.log('   Colonnes:', Object.keys(data[0]).join(', '));
        console.log('\n📦 Exemple de données (max 5):');
        data.forEach((item, i) => {
          console.log(`   ${i + 1}.`, JSON.stringify(item, null, 2).substring(0, 150));
        });
      }
    }
  } catch (err: any) {
    console.log('❌ Erreur lors de la vérification:', err.message);
  }
}

checkCartItems();
