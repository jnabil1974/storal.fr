import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const optionId = searchParams.get('optionId') ? parseInt(searchParams.get('optionId')!) : null;

    if (!optionId) {
      return NextResponse.json(
        { error: 'optionId est requis' },
        { status: 400 }
      );
    }

    console.log('🎨 Toile Colors API - Option ID:', optionId);

    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('❌ Supabase client non disponible');
      return NextResponse.json(
        { error: 'Erreur de connexion à la base de données' },
        { status: 500 }
      );
    }

    // Récupérer les couleurs de la toile sélectionnée
    const { data, error } = await supabase
      .from('product_toile_colors')
      .select('id, color_name, color_hex, price_adjustment')
      .eq('option_id', optionId)
      .order('color_name', { ascending: true });

    console.log('📊 Données reçues de Supabase:', { count: data?.length, error });

    if (error) {
      console.error('❌ Erreur lors de la récupération des couleurs:', error);
      return NextResponse.json(
        { error: 'Erreur de récupération des couleurs' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ Aucune couleur trouvée pour l\'option:', optionId);
    }

    return NextResponse.json({
      colors: data || [],
    });
  } catch (err) {
    console.error('🔥 Erreur Serveur :', err);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
