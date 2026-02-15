#!/usr/bin/env tsx
/**
 * Script de diagnostic des tables Supabase
 * Vérifie quelles tables existent et sont accessibles
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables SUPABASE manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CRITICAL_TABLES = [
  'toile_types',      // CRITIQUE pour JOIN
  'toile_colors',     // Dashboard
  'orders',           // Dashboard
];

const OPTIONAL_TABLES = [
  'sb_products',
  'matest_finish_types',
  'matest_colors',
  'newsletter',
  'seo-images'
];

async function checkTable(tableName: string): Promise<boolean> {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error(`❌ Table "${tableName}": ${error.message}`);
      return false;
    }
    
    console.log(`✅ Table "${tableName}": ${count ?? 0} lignes`);
    return true;
  } catch (e: any) {
    console.error(`❌ Table "${tableName}": ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Vérification des tables Supabase...\n');
  
  console.log('📋 TABLES CRITIQUES (admin ne fonctionne pas sans):');
  const criticalResults = await Promise.all(
    CRITICAL_TABLES.map(async (table) => ({
      table,
      exists: await checkTable(table)
    }))
  );
  
  console.log('\n📋 TABLES OPTIONNELLES:');
  const optionalResults = await Promise.all(
    OPTIONAL_TABLES.map(async (table) => ({
      table,
      exists: await checkTable(table)
    }))
  );
  
  const missingCritical = criticalResults.filter(r => !r.exists);
  
  if (missingCritical.length > 0) {
    console.log('\n\n❌ PROBLÈME DÉTECTÉ !');
    console.log('Tables critiques manquantes:');
    missingCritical.forEach(r => console.log(`  - ${r.table}`));
    console.log('\n💡 Solution: Recréer ces tables ou restaurer depuis backup');
  } else {
    console.log('\n\n✅ Toutes les tables critiques sont présentes');
  }
}

main();
