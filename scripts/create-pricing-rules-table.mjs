#!/usr/bin/env node

/**
 * Script pour appliquer la migration pricing_rules.sql à Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger les variables d'env
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

async function createPricingRulesTable() {
  try {
    console.log('🔄 Création de la table pricing_rules...\n');

    // Vérifier si la table existe déjà
    const { data: existing, error: checkError } = await supabase
      .from('pricing_rules')
      .select('id')
      .limit(1);

    if (!checkError) {
      console.log('✅ La table pricing_rules existe déjà');
      return;
    }

    // Créer la table avec l'admin client
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.pricing_rules (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
          coefficient DECIMAL(5, 2) NOT NULL,
          reason TEXT,
          valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          valid_until TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          created_by TEXT,
          
          CONSTRAINT coefficient_positive CHECK (coefficient > 0),
          CONSTRAINT valid_date_range CHECK (valid_until IS NULL OR valid_until > valid_from)
        );

        CREATE INDEX IF NOT EXISTS idx_pricing_rules_product_id ON public.pricing_rules(product_id);
        CREATE INDEX IF NOT EXISTS idx_pricing_rules_active ON public.pricing_rules(is_active, valid_from, valid_until);

        ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;

        CREATE POLICY IF NOT EXISTS "Allow read pricing rules" ON public.pricing_rules
          FOR SELECT
          USING (is_active = true AND valid_from <= NOW() AND (valid_until IS NULL OR valid_until > NOW()));
      `,
    });

    if (createError && !createError.message.includes('does not exist')) {
      throw new Error(`Erreur lors de la création: ${createError.message}`);
    }

    console.log('⚠️  Note: RPC pour créer les tables n\'est pas disponible');
    console.log('💡 Veuillez créer manuellement la table pricing_rules via SQL Editor Supabase:\n');
    console.log('--- Copier/Coller dans Supabase SQL Editor ---\n');

    const sql = `
-- Créer la table pricing_rules
CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  coefficient DECIMAL(5, 2) NOT NULL,
  reason TEXT,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by TEXT,
  
  CONSTRAINT coefficient_positive CHECK (coefficient > 0),
  CONSTRAINT valid_date_range CHECK (valid_until IS NULL OR valid_until > valid_from)
);

-- Index
CREATE INDEX idx_pricing_rules_product_id ON public.pricing_rules(product_id);
CREATE INDEX idx_pricing_rules_active ON public.pricing_rules(is_active, valid_from, valid_until);

-- RLS
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read pricing rules" ON public.pricing_rules
  FOR SELECT
  USING (is_active = true AND valid_from <= NOW() AND (valid_until IS NULL OR valid_until > NOW()));

CREATE POLICY "Allow admin write pricing rules" ON public.pricing_rules
  FOR ALL
  USING (auth.uid() = created_by);
`;

    console.log(sql);
    console.log('\n--- Fin du SQL ---\n');

  } catch (error) {
    console.error('❌ Erreur:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

createPricingRulesTable();
