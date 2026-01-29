import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

const normalizeImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  if (imageUrl.startsWith('/assets/')) return imageUrl;
  const normalized = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
  if (normalized.startsWith('assets/')) return `/${normalized}`;
  return `/assets/img/options/${normalized}`;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'Motorisation';
    const productId = searchParams.get('productId') ? parseInt(searchParams.get('productId')!) : 1;

    console.log('🔍 Options API - Catégorie:', category, '| Product ID:', productId);

    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('❌ Supabase client non disponible');
      return NextResponse.json(
        { error: 'Erreur de connexion à la base de données' },
        { status: 500 }
      );
    }

    // Récupérer les options par catégorie ET product_id
    const { data, error } = await supabase
      .from('sb_product_options')
      .select('id, name, category, purchase_price_ht, sales_coefficient, image_url')
      .eq('category', category)
      .eq('product_id', productId)
      .order('purchase_price_ht', { ascending: true });

    console.log('📊 Données reçues de Supabase:', { count: data?.length, error });

    if (error) {
      console.error('❌ Erreur lors de la récupération des options:', error);
      return NextResponse.json(
        { error: 'Erreur de récupération des options' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ Aucune option trouvée pour la catégorie:', category);
    }

    // Calculer les prix de vente côté serveur, ne pas exposer les coefficients
    const optionsAvecPrixVente = (data || []).map(option => ({
      id: option.id,
      name: option.name,
      category: option.category,
      prixVenteHT: (option.purchase_price_ht * option.sales_coefficient).toFixed(2),
      imageUrl: normalizeImageUrl(option.image_url),
      // Ne PAS envoyer purchase_price_ht ni sales_coefficient au client
    }));

    console.log('✅ Retour API:', { count: optionsAvecPrixVente.length });
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
