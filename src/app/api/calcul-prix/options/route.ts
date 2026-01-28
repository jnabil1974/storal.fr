import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'Motorisation';

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Erreur de connexion à la base de données' },
        { status: 500 }
      );
    }

    // Récupérer les options par catégorie (Motorisation, Automatisme, etc.)
    const { data, error } = await supabase
      .from('product_options')
      .select('id, name, category, purchase_price_ht, sales_coefficient, image_url')
      .eq('category', category)
      .order('purchase_price_ht', { ascending: true });

    if (error) {
      console.warn('❌ Erreur lors de la récupération des options:', error);
      return NextResponse.json(
        { error: 'Erreur de récupération des options' },
        { status: 500 }
      );
    }

    // Calculer les prix de vente côté serveur, ne pas exposer les coefficients
    const optionsAvecPrixVente = (data || []).map(option => ({
      id: option.id,
      name: option.name,
      category: option.category,
      prixVenteHT: (option.purchase_price_ht * option.sales_coefficient).toFixed(2),
      imageUrl: option.image_url,
      // Ne PAS envoyer purchase_price_ht ni sales_coefficient au client
    }));

    return NextResponse.json({
      options: optionsAvecPrixVente,
    });
  } catch (err) {
    console.error('🔥 Erreur Serveur:', err);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
