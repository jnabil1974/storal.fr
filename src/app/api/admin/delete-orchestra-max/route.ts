import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🗑️ Suppression des toiles Orchestra Max...');

    // Supprimer toutes les toiles du type 2 (Orchestra Max)
    const { data, error } = await supabase
      .from('toile_colors')
      .delete()
      .eq('toile_type_id', 2)
      .select();

    if (error) {
      console.error('❌ Erreur:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ ${data?.length || 0} toiles Orchestra Max supprimées`);

    // Vérifier la distribution
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
      message: `${data?.length || 0} toiles Orchestra Max supprimées`,
      deleted: data?.length || 0,
      distribution,
    });
  } catch (error: any) {
    console.error('❌ Erreur:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
