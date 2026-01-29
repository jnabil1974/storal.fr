import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

// Fonction pour nettoyer les objets en supprimant les null
function cleanObject(obj: any) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as any);
}
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

    // D'abord, essayer de récupérer avec SELECT * pour voir la structure réelle
    const { data: sampleData, error: sampleError } = await supabase
      .from('sb_product_toile_colors')
      .select('*')
      .limit(1);

    let columnNames: string[] = [];
    if (sampleData && sampleData.length > 0) {
      columnNames = Object.keys(sampleData[0]);
      console.log('📊 Colonnes détectées dans sb_product_toile_colors:', columnNames);
    } else {
      console.log('📊 Aucune donnée ou erreur lors de la vérification de structure:', sampleError?.message);
    }

    // Essayer de récupérer les couleurs depuis la table product_toile_colors
    // En utilisant SELECT * pour éviter les erreurs de colonnes manquantes
    const { data, error } = await supabase
      .from('sb_product_toile_colors')
      .select('*')
      .eq('option_id', optionId)
      .order('id', { ascending: true });

    console.log('📊 Données brutes reçues de Supabase:', { count: data?.length, firstRecord: data?.[0], error });

    if (error) {
      console.warn('⚠️ Erreur Supabase, utilisant les couleurs par défaut:', error.message);
      // Retourner les couleurs par défaut si la table n'existe pas
      return NextResponse.json({ colors: DEFAULT_COLORS, debug: { error: error.message, columns: columnNames } });
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ Aucune couleur trouvée pour l\'option:', optionId, '- Utilisant les couleurs par défaut');
      // Retourner les couleurs par défaut si aucune couleur n'est trouvée
      return NextResponse.json({ colors: DEFAULT_COLORS, debug: { noData: true, columns: columnNames } });
    }

    // Mapper les données réelles aux champs attendus
    // Les vraies colonnes sont: id, option_id, nom_couleur, code_reference, image_swatch, price_category
    const mappedColors: any[] = [];
    
    data.forEach((color: any) => {
      const mapped: any = {
        id: color.id,
        color_name: color.nom_couleur || 'Couleur',
        color_hex: color.code_reference || '#000000',
      };
      
      // Ajouter le prix d'ajustement seulement s'il est défini et non zéro
      const priceValue = color.price_category ? parseFloat(color.price_category) : null;
      if (priceValue !== null && priceValue !== 0) {
        mapped.price_adjustment = priceValue;
      }
      
      // Ajouter image_swatch s'il existe
      if (color.image_swatch) {
        mapped.image_swatch = color.image_swatch;
      }
      
      mappedColors.push(mapped);
    });

    console.log('✅ Couleurs mappées:', mappedColors);
    return NextResponse.json({ colors: mappedColors });
  } catch (err) {
    console.error('🔥 Erreur Serveur:', err);
    // Retourner les couleurs par défaut en cas d'erreur
    return NextResponse.json({ colors: DEFAULT_COLORS });
  }
}

