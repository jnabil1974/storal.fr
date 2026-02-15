import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createCartItemsTable() {
  console.log('🔨 Création de la table cart_items...\n');

  // Lire le fichier SQL
  const sqlPath = path.join(__dirname, 'create-cart-items-table.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  try {
    // Exécuter le SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.log('❌ Erreur lors de la création:', error.message);
      console.log('\n⚠️  Vous devez exécuter le SQL manuellement dans Supabase:');
      console.log('   1. Allez sur https://supabase.com/dashboard/project/qctnvyxtbvnvllchuibu/sql/new');
      console.log('   2. Copiez le contenu de:', sqlPath);
      console.log('   3. Exécutez le SQL');
      return;
    }

    console.log('✅ Table cart_items créée avec succès!');
    
    // Vérifier la création
    const { data: checkData, error: checkError } = await supabase
      .from('cart_items')
      .select('*', { count: 'exact', head: true });

    if (checkError) {
      console.log('⚠️  Erreur de vérification:', checkError.message);
    } else {
      console.log('✅ Vérification réussie - table accessible');
    }

  } catch (err: any) {
    console.log('❌ Erreur:', err.message);
    console.log('\n📋 Exécutez manuellement le SQL dans Supabase SQL Editor:');
    console.log(sql);
  }
}

createCartItemsTable();
