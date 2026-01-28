import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

// Couleurs par défaut en cas d'indisponibilité de la table
const DEFAULT_COLORS = [
  { id: 1, color_name: 'Blanc', color_hex: '#FFFFFF', price_adjustment: 0 },
  { id: 2, color_name: 'Gris clair', color_hex: '#D3D3D3', price_adjustment: 0 },
  { id: 3, color_name: 'Gris foncé', color_hex: '#808080', price_adjustment: 5 },
  { id: 4, color_name: 'Marron', color_hex: '#8B4513', price_adjustment: 15 },
  { id: 5, color_name: 'Noir', color_hex: '#000000', price_adjustment: 20 },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const optionId = searchParams.get('optionId') ? parseInt(searchParams.get('optionId')!) : null;

    if (!optionId) {
      // Retourner les couleurs par défaut si optionId est manquant
      return NextResponse.json({ colors: DEFAULT_COLORS });
    }

    console.log('🎨 Toile Colors API - Option ID:', optionId);

    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('❌ Supabase client non disponible');
      // Retourner les couleurs par défaut en cas d'erreur
      return NextResponse.json({ colors: DEFAULT_COLORS });
    }

    // Essayer de récupérer les couleurs depuis la table product_toile_colors
    const { data, error } = await supabase
      .from('product_toile_colors')
      .select('id, color_name, color_hex, price_adjustment')
      .eq('option_id', optionId)
      .order('color_name', { ascending: true });

    console.log('📊 Données reçues de Supabase:', { count: data?.length, error });

    if (error) {
      console.warn('⚠️ Erreur Supabase, utilisant les couleurs par défaut:', error.message);
      // Retourner les couleurs par défaut si la table n'existe pas
      return NextResponse.json({ colors: DEFAULT_COLORS });
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ Aucune couleur trouvée pour l\'option:', optionId, '- Utilisant les couleurs par défaut');
      // Retourner les couleurs par défaut si aucune couleur n'est trouvée
      return NextResponse.json({ colors: DEFAULT_COLORS });
    }

    return NextResponse.json({ colors: data });
  } catch (err) {
    console.error('🔥 Erreur Serveur:', err);
    // Retourner les couleurs par défaut en cas d'erreur
    return NextResponse.json({ colors: DEFAULT_COLORS });
  }
}

