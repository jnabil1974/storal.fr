import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Message d'information
    return NextResponse.json({
      success: true,
      message: 'Exécutez manuellement ce SQL dans Supabase SQL Editor',
      sql: `
-- Supprimer l'ancienne contrainte
ALTER TABLE toile_colors DROP CONSTRAINT IF EXISTS toile_colors_ref_key;

-- Créer la nouvelle contrainte composite
ALTER TABLE toile_colors ADD CONSTRAINT toile_colors_type_ref_unique 
UNIQUE (toile_type_id, ref);
      `
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
