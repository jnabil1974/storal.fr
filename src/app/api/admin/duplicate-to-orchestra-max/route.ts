import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔧 Duplication des toiles Orchestra vers Orchestra Max...');

    // 1. Récupérer toutes les toiles Orchestra (type 1)
    const { data: orchestraToiles, error: fetchError } = await supabase
      .from('toile_colors')
      .select('*')
      .eq('toile_type_id', 1);

    if (fetchError) {
      console.error('❌ Erreur récupération:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    console.log(`📦 ${orchestraToiles?.length || 0} toiles Orchestra à dupliquer`);

    // 2. Créer les copies pour Orchestra Max (type 2)
    const orchestraMaxToiles = orchestraToiles?.map((toile: any) => ({
      toile_type_id: 2, // Orchestra Max
      ref: toile.ref,
      name: toile.name.replace('Orchestra', 'Orchestra Max'),
      collection: toile.collection === 'Orchestra Uni' ? 'Orchestra Max Uni' : 
                  toile.collection === 'Orchestra Décors' ? 'Orchestra Max Décors' : 
                  'Orchestra Max',
      category: toile.category,
      color_family: toile.color_family,
      image_url: toile.image_url, // Même image
      thumbnail_url: toile.thumbnail_url,
      color_hex: toile.color_hex,
      color_r: toile.color_r,
      color_g: toile.color_g,
      color_b: toile.color_b,
      is_available: toile.is_available,
      display_order: toile.display_order,
    })) || [];

    console.log(`📋 ${orchestraMaxToiles.length} toiles à importer`);

    let imported = 0;
    let errors: any[] = [];

    // Importer par batch de 20
    for (let i = 0; i < orchestraMaxToiles.length; i += 20) {
      const batch = orchestraMaxToiles.slice(i, i + 20);
      
      try {
        const { data, error } = await supabase
          .from('toile_colors')
          .insert(batch)
          .select();

        if (error) {
          console.error(`❌ Erreur batch ${i / 20 + 1}:`, error);
          errors.push({
            batch: i / 20 + 1,
            error: error.message,
            code: error.code
          });
          
          // Si c'est une erreur de contrainte, on arrête
          if (error.code === '23505') {
            return NextResponse.json({
              success: false,
              error: 'Contrainte unique non modifiée',
              message: 'Vous devez d\'abord exécuter ce SQL dans Supabase:',
              sql: `
ALTER TABLE toile_colors DROP CONSTRAINT IF EXISTS toile_colors_ref_key;
ALTER TABLE toile_colors ADD CONSTRAINT toile_colors_type_ref_unique UNIQUE (toile_type_id, ref);
              `,
              imported,
              total: orchestraMaxToiles.length
            }, { status: 400 });
          }
        } else {
          imported += batch.length;
          console.log(`✅ Batch ${i / 20 + 1}: ${batch.length} toiles importées`);
        }
      } catch (error: any) {
        console.error(`❌ Exception batch ${i / 20 + 1}:`, error);
        errors.push({ batch: i / 20 + 1, error: error.message });
      }
    }

    // Vérifier la distribution finale
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

        return {
          id: type.id,
          name: type.name,
          code: type.code,
          count: count || 0,
          prix_vente: (type.purchase_price_ht * type.sales_coefficient).toFixed(2) + '€/m²'
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: `Duplication terminée: ${imported}/${orchestraMaxToiles.length} toiles`,
      imported,
      total: orchestraMaxToiles.length,
      errors: errors.length > 0 ? errors : undefined,
      distribution,
    });
  } catch (error: any) {
    console.error('❌ Erreur duplication:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
