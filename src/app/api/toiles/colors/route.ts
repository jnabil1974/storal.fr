import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * GET /api/toiles/colors
 * Récupère les couleurs de toile disponibles pour un type de toile
 * Query params:
 * - toileTypeId: ID du type de toile
 * - colorFamily: (optionnel) Filtrer par famille de couleur
 * - search: (optionnel) Recherche par ref ou nom
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const toileTypeId = searchParams.get('toileTypeId');
    const colorFamily = searchParams.get('colorFamily');
    const search = searchParams.get('search');
    const pattern = searchParams.get('pattern'); // 'uni' ou 'decor'

    if (!toileTypeId) {
      return NextResponse.json(
        { error: 'Le paramètre toileTypeId est requis' },
        { status: 400 }
      );
    }

    // Construire la requête
    let query = supabase
      .from('toile_colors')
      .select(`
        *,
        toile_types!inner(
          id,
          name,
          manufacturer,
          code
        )
      `)
      .eq('toile_type_id', parseInt(toileTypeId))
      .eq('is_available', true)
      .order('display_order', { ascending: true });

    // Filtrer par famille de couleur si spécifié
    if (colorFamily && colorFamily !== 'all') {
      query = query.eq('color_family', colorFamily);
    }

    // Filtrer par pattern (uni/décor) si spécifié
    if (pattern === 'uni') {
      query = query.or('category.ilike.%uni%,tags.cs.{"uni"}');
    } else if (pattern === 'decor') {
      query = query.or('category.ilike.%decor%,category.ilike.%rayure%,category.ilike.%motif%,tags.cs.{"decor"}');
    }

    // Recherche par ref ou nom
    if (search) {
      query = query.or(`ref.ilike.%${search}%,name.ilike.%${search}%`);
    }

    const { data: colors, error } = await query;

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des couleurs', details: error.message },
        { status: 500 }
      );
    }

    // Transformer les données pour le format attendu
    const formattedColors = colors.map((color) => ({
      id: color.id,
      ref: color.ref,
      name: color.name,
      collection: color.collection,
      category: color.category,
      colorFamily: color.color_family,
      imageUrl: color.image_url,
      thumbnailUrl: color.thumbnail_url || color.image_url,
      colorHex: color.color_hex,
      colorRgb: color.color_r !== null && color.color_g !== null && color.color_b !== null
        ? { r: color.color_r, g: color.color_g, b: color.color_b }
        : null,
      stockStatus: color.stock_status,
      tags: color.tags,
      description: color.description,
      toileType: {
        id: color.toile_types.id,
        name: color.toile_types.name,
        manufacturer: color.toile_types.manufacturer,
        code: color.toile_types.code,
      },
    }));

    return NextResponse.json({
      success: true,
      colors: formattedColors,
      count: formattedColors.length,
    });
  } catch (err) {
    console.error('Erreur serveur:', err);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
