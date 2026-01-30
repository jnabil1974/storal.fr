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
      
      // Fournir des options par défaut si aucune donnée
      const defaultOptions = {
        'motorisation': [
          { id: 1, option_name: 'Manuel (chaîne)', option_type: 'motorisation', price_ht: 0 },
          { id: 2, option_name: 'Motorisation standard', option_type: 'motorisation', price_ht: 350 },
          { id: 3, option_name: 'Motorisation + Télécommande', option_type: 'motorisation', price_ht: 500 },
        ],
        'emetteur': [
          { id: 10, option_name: 'Télécommande Situo 1 RTS Pure', option_type: 'emetteur', price_ht: 35 },
          { id: 11, option_name: 'Télécommande Situo 5 RTS Pure', option_type: 'emetteur', price_ht: 55 },
          { id: 12, option_name: 'Télécommande Smoove Origin RTS', option_type: 'emetteur', price_ht: 45 },
        ],
        'toile': [
          { id: 20, option_name: 'Toile Acrylique Standard', option_type: 'toile', price_ht: 12.50 },
          { id: 21, option_name: 'Toile Acrylique Premium', option_type: 'toile', price_ht: 18.50 },
          { id: 22, option_name: 'Toile Microfibre', option_type: 'toile', price_ht: 25.00 },
        ],
      };
      
      const fallbackData = (defaultOptions[normalizedCategory as keyof typeof defaultOptions] || []);
      
      const optionsAvecPrixVente = (fallbackData || []).map(option => ({
        id: option.id,
        name: option.option_name,
        category: option.option_type,
        prixVenteHT: (option.price_ht * 1.5).toFixed(2),
        imageUrl: normalizeImageUrl(null),
      }));

      console.log('✅ Retour API avec options par défaut:', { count: optionsAvecPrixVente.length });
      return NextResponse.json({
        options: optionsAvecPrixVente,
        debug: { 
          message: 'Options par défaut utilisées',
          category: normalizedCategory, 
          productId 
        }
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
