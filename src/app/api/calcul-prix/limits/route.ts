import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projection = searchParams.get('projection');

    if (!projection) {
      return NextResponse.json(
        { error: 'Projection manquante' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Erreur de connexion à la base de données' },
        { status: 500 }
      );
    }

    // Récupérer les largeurs min et max pour KISSIMY et cette projection
    const { data, error } = await supabase
      .from('product_purchase_prices')
      .select(`
        width_min,
        width_max,
        products!inner (
          id,
          slug,
          inclinaison_min,
          inclinaison_max,
          inclinaison_unite
        )
      `)
      .eq('products.slug', 'store-banne-kissimy')  // Filtrer par produit KISSIMY
      .eq('projection', parseInt(projection))
      .order('width_max', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('❌ Pas de limites trouvées pour cette projection:', error);
      return NextResponse.json(
        { error: 'Projection non disponible' },
        { status: 404 }
      );
    }

    // Trouver le min et le max pour ce produit et cette projection
    const minWidth = Math.min(...data.map(d => d.width_min || 0).filter(w => w > 0));
    const maxWidth = Math.max(...data.map(d => d.width_max));
    
    // Récupérer les infos d'inclinaison (identiques pour toutes les lignes)
    const product = data[0]?.products;

    return NextResponse.json({
      minWidth,
      maxWidth,
      projection: parseInt(projection),
      inclinaisonMin: product?.inclinaison_min || 0,
      inclinaisonMax: product?.inclinaison_max || 60,
      inclinaisonUnite: product?.inclinaison_unite || '°',
    });
  } catch (err) {
    console.error('🔥 Erreur Serveur:', err);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
