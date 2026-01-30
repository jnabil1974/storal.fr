import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📝 Création produit store banne:', body);

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase admin indisponible' }, { status: 500 });
    }

    // Insérer le nouveau produit
    const { data, error } = await supabase
      .from('sb_products')
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description,
        sales_coefficient: body.sales_coefficient,
        img_store: body.img_store,
        img_larg_ht: body.img_larg_ht,
        img_tol_dim: body.img_tol_dim,
        img_dim_coffre: body.img_dim_coffre,
        bras: body.bras,
        img_bras_led: body.img_bras_led,
        image_store_small: body.image_store_small,
        image_hero: body.image_hero,
        hero_title: body.hero_title,
        hero_subtitle: body.hero_subtitle,
        hero_tagline: body.hero_tagline,
        hero_text: body.hero_text,
        hero_points: body.hero_points,
        tags: body.tags,
        guarantees: body.guarantees,
        options_cards: body.options_cards,
        certifications: body.certifications,
        product_type: body.product_type,
        category: body.category,
        min_width: body.min_width,
        max_width: body.max_width,
        min_projection: body.min_projection,
        max_projection: body.max_projection,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Produit créé:', data.id);
    return NextResponse.json({ success: true, product: data });
  } catch (error: any) {
    console.error('❌ Erreur création produit:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
