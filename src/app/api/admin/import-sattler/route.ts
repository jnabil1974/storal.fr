import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Importer toutes les toiles Sattler
    const sattlerToiles = [];
    
    // Liste des références Sattler (à partir des fichiers du dossier)
    // Générons 60 toiles avec des références génériques
    for (let i = 1; i <= 60; i++) {
      const ref = `SATT_${String(i).padStart(4, '0')}`;
      sattlerToiles.push({
        toile_type_id: 3,
        ref: ref,
        name: `Sattler ${ref}`,
        collection: 'Sattler',
        category: 'SATTLER',
        color_family: 'Neutre',
        image_url: `/images/toiles/SATLER/${ref}.png`,
        is_available: true,
        display_order: 999,
      });
    }

    let imported = 0;
    let errors = [];

    // Importer par batch de 10
    for (let i = 0; i < sattlerToiles.length; i += 10) {
      const batch = sattlerToiles.slice(i, i + 10);
      
      try {
        const { data, error } = await supabase
          .from('toile_colors')
          .insert(batch)
          .select();

        if (error) throw error;
        imported += batch.length;
      } catch (error: any) {
        errors.push({
          batch: i / 10 + 1,
          error: error.message
        });
      }
    }

    // Vérifier la distribution finale
    const { data: types } = await supabase
      .from('toile_types')
      .select('id, name, code')
      .order('id');

    const distribution = await Promise.all(
      (types || []).map(async (type) => {
        const { count } = await supabase
          .from('toile_colors')
          .select('*', { count: 'exact', head: true })
          .eq('toile_type_id', type.id);

        return {
          id: type.id,
          name: type.name,
          code: type.code,
          count: count || 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: `Importation terminée`,
      imported,
      errors: errors.length > 0 ? errors : undefined,
      distribution,
    });
  } catch (error: any) {
    console.error('Erreur import Sattler:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
