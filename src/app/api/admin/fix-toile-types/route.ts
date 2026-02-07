import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function POST() {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 });
    }

    // 1. Orchestra Max (type 2) - dossier "ORCHESTRA MAX"
    const { data: orchestraMax, error: error1 } = await supabase
      .from('toile_colors')
      .update({ toile_type_id: 2 })
      .or('image_url.like.%ORCHESTRA MAX%,image_url.like.%ORCHESTRA DECORS%')
      .select();

    // 2. Sattler (type 3) - dossier "SATLER"
    const { data: sattler, error: error2 } = await supabase
      .from('toile_colors')
      .update({ toile_type_id: 3 })
      .like('image_url', '%SATLER%')
      .select();

    // 3. Vérifier la répartition
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
      message: 'Toiles redistribuées avec succès',
      updated: {
        orchestraMax: orchestraMax?.length || 0,
        sattler: sattler?.length || 0,
      },
      distribution,
    });
  } catch (error: any) {
    console.error('Erreur redistribution:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la redistribution' },
      { status: 500 }
    );
  }
}
