#!/usr/bin/env node

/**
 * Script pour appliquer la table newsletter et corriger la RLS dans Supabase
 * Usage: node scripts/setup-newsletter.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupNewsletter() {
  try {
    console.log('🔄 Setting up newsletter table and RLS...\n');

    // Read SQL file
    const sqlPath = path.resolve(__dirname, 'create-newsletter-table.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

    // Split by semicolons and execute each statement
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 60)}...`);
      
      const { error } = await supabase.rpc('exec_sql', {
        query: statement
      }).then(
        () => ({ error: null }),
        (error) => ({ error })
      );

      if (error && error.code !== 'PGRST204') {
        console.warn(`⚠️  ${error.message || error}`);
      } else {
        console.log('✅ OK\n');
      }
    }

    // Verify table exists
    console.log('\n📋 Verifying newsletter table...');
    const { data: tables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'newsletter');

    if (checkError || !tables || tables.length === 0) {
      console.log('❌ Table newsletter not found');
      process.exit(1);
    }

    console.log('✅ Newsletter table exists');

    // Try inserting a test email
    console.log('\n🧪 Testing insert with RLS...');
    const { data, error: insertError } = await supabase
      .from('newsletter')
      .insert([{ email: 'test@example.com', status: 'active' }])
      .select();

    if (insertError) {
      console.error('❌ Insert failed:', insertError.message);
      console.log('\n⚠️  RLS Policy may still be incorrect. Try this in Supabase SQL Editor:');
      console.log(`
-- Disable RLS temporarily for INSERT to work
ALTER TABLE newsletter DISABLE ROW LEVEL SECURITY;

-- Or update the policy to allow public inserts
DROP POLICY IF EXISTS "Public can insert newsletter" ON newsletter;
CREATE POLICY "Public can insert newsletter" ON newsletter
  FOR INSERT WITH CHECK (true);

-- Re-enable RLS
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
      `);
      process.exit(1);
    }

    console.log('✅ Insert successful! Email:', data[0].email);
    
    // Clean up test
    await supabase.from('newsletter').delete().eq('email', 'test@example.com');
    console.log('🧹 Cleaned up test data\n');

    console.log('✨ Newsletter setup complete!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupNewsletter();
