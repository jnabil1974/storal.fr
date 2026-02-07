import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * GET /api/toiles
 * Récupère les types de toiles compatibles avec un produit
 * Query params:
 * - productSlug: slug du produit (ex: "belharra", "kalyo")
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productSlug = searchParams.get('productSlug');

    if (!productSlug) {
      return NextResponse.json(
        { error: 'Le paramètre productSlug est requis' },
        { status: 400 }
      );
    }

    // Normaliser le slug en majuscules pour la comparaison
    const normalizedSlug = productSlug.toUpperCase();

    // Récupérer les types de toiles compatibles avec ce produit
    const { data: toileTypes, error } = await supabase
      .from('toile_types')
      .select('*')
      .contains('compatible_categories', [normalizedSlug])
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des toiles', details: error.message },
        { status: 500 }
      );
    }

    // Transformer les données pour le format attendu par le configurateur
    const formattedTypes = toileTypes.map((type) => ({
      id: type.id,
      name: type.name,
      manufacturer: type.manufacturer,
      code: type.code,
      purchasePriceHT: type.purchase_price_ht,
      salesCoefficient: type.sales_coefficient,
      // Calculer le prix de vente HT
      salePriceHT: (type.purchase_price_ht * type.sales_coefficient).toFixed(2),
      composition: type.composition,
      description: type.description,
      defaultWidth: type.default_width,
    }));

    return NextResponse.json({
      success: true,
      types: formattedTypes,
      count: formattedTypes.length,
    });
  } catch (err) {
    console.error('Erreur serveur:', err);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
