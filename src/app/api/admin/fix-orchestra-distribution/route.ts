import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔧 Correction de la répartition Orchestra...');

    // 1. Remettre les toiles Orchestra Décors dans le type 1 (Orchestra standard)
    const { data: decors, error: error1 } = await supabase
      .from('toile_colors')
      .update({ toile_type_id: 1 })
      .like('image_url', '%ORCHESTRA DECORS%')
      .select();

    console.log(`✅ ${decors?.length || 0} toiles Orchestra Décors remises dans type 1`);

    // 2. Garder uniquement Orchestra Max dans le type 2
    // (Les toiles "ORCHESTRA MAX" sont déjà dans le type 2, pas besoin de les bouger)

    // 3. Vérifier la distribution finale
    const { data: types } = await supabase
      .from('toile_types')
      .select('id, name, code, purchase_price_ht, sales_coefficient')
      .order('id');

    const distribution = await Promise.all(
      (types || []).map(async (type) => {
        const { count } = await supabase
          .from('toile_colors')
          .select('*', { count: 'exact', head: true })
          .eq('toile_type_id', type.id);

        // Exemple de toiles dans ce type
        const { data: samples } = await supabase
          .from('toile_colors')
          .select('collection')
          .eq('toile_type_id', type.id)
          .limit(5);

        const collections = [...new Set(samples?.map(s => s.collection) || [])];

        return {
          id: type.id,
          name: type.name,
          code: type.code,
          count: count || 0,
          price_ht: type.purchase_price_ht,
          coefficient: type.sales_coefficient,
          sale_price: (type.purchase_price_ht * type.sales_coefficient).toFixed(2),
          collections: collections
        };
      })
    );

    console.log('📊 Distribution finale:', distribution);

    return NextResponse.json({
      success: true,
      message: 'Répartition corrigée',
      moved: {
        decorsToOrchestra: decors?.length || 0
      },
      distribution
    });
  } catch (error: any) {
    console.error('❌ Erreur correction:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
