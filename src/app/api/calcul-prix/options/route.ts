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

    // Normaliser la catégorie (minuscules, sans accents)
    const normalizeCategory = (cat: string): string => {
      const mapping: { [key: string]: string } = {
        'Motorisation': 'motorisation',
        'motorisation': 'motorisation',
        'Émetteur': 'emetteur',
        'emetteur': 'emetteur',
        'Toile': 'toile',
        'toile': 'toile',
      };
      return mapping[cat] || cat.toLowerCase();
    };

    const normalizedCategory = normalizeCategory(category);
    console.log('🔍 Options API - Catégorie:', category, 'normalisée:', normalizedCategory, '| Product ID:', productId);

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
      .select('id, option_name, option_type, price_ht')
      .eq('product_id', productId)
      .eq('option_type', normalizedCategory)
      .order('price_ht', { ascending: true });

    console.log('📊 Données reçues de Supabase:', { count: data?.length, error, errorMessage: error?.message });

    if (error) {
      console.error('❌ Erreur lors de la récupération des options:', error);
      return NextResponse.json(
        { error: `Erreur de récupération des options: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ Aucune option trouvée pour la catégorie:', normalizedCategory, 'et product_id:', productId);
      // Retourner un tableau vide plutôt qu'une erreur
      return NextResponse.json({
        options: [],
        debug: { category: normalizedCategory, productId }
      });
    }

    // Mapper les données avec les colonnes réelles
    const optionsAvecPrixVente = (data || []).map(option => ({
      id: option.id,
      name: option.option_name,
      category: option.option_type,
      prixVenteHT: (option.price_ht * 1.5).toFixed(2), // Appliquer un coefficient par défaut
      imageUrl: normalizeImageUrl(null), // pas d'images dans sb_product_options
      // Ne PAS envoyer les données brutes au client
    }));

    console.log('✅ Retour API:', { count: optionsAvecPrixVente.length, options: optionsAvecPrixVente });
    return NextResponse.json({
      options: optionsAvecPrixVente,
    });
  } catch (err) {
    console.error('🔥 Erreur Serveur:', err);
    return NextResponse.json(
      { error: `Erreur interne du serveur: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}
