import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const sattlerRefs = [
  "30A734", "314001", "314007", "314010", "314020", "314022", "314028", "314030",
  "314070", "314081", "314083", "314085", "314154", "314182", "314325", "314362",
  "314364", "314398", "314402", "314414", "314546", "314550", "314638", "314660",
  "314718", "314763", "314780", "314818", "314819", "314828", "314838", "314840",
  "314851", "314858", "314880", "314888", "314941", "314E67", "320180", "320190",
  "320212", "320235", "320253", "320309", "320408", "320434", "320452", "320679",
  "320692", "320833", "320923", "320925", "320928", "320937", "320954", "320956",
  "320992", "320994", "364053", "364598"
];

function detectColorFamily(ref: string): string {
  // Logique simplifiée basée sur le code
  if (ref.startsWith('30')) return 'Neutre';
  if (ref.startsWith('314')) return 'Beige';
  if (ref.startsWith('320')) return 'Gris';
  if (ref.startsWith('364')) return 'Bleu';
  return 'Neutre';
}

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔧 Démarrage de l\'importation Sattler...');

    // Préparer les données Sattler
    const sattlerToiles = sattlerRefs.map((ref, index) => ({
      toile_type_id: 3, // Sattler
      ref: ref,
      name: `Sattler ${ref}`,
      collection: 'Sattler',
      category: 'SATTLER',
      color_family: detectColorFamily(ref),
      image_url: `/images/toiles/SATLER/${ref}.png`,
      is_available: true,
      display_order: 1000 + index,
    }));

    console.log(`📦 ${sattlerToiles.length} toiles à importer`);

    let imported = 0;
    let errors: any[] = [];

    // Importer par batch de 10 pour éviter les timeouts
    for (let i = 0; i < sattlerToiles.length; i += 10) {
      const batch = sattlerToiles.slice(i, i + 10);
      
      try {
        const { data, error } = await supabase
          .from('toile_colors')
          .insert(batch)
          .select();

        if (error) {
          console.error(`❌ Erreur batch ${i / 10 + 1}:`, error);
          errors.push({
            batch: i / 10 + 1,
            error: error.message,
            code: error.code
          });
        } else {
          imported += batch.length;
          console.log(`✅ Batch ${i / 10 + 1}: ${batch.length} toiles importées`);
        }
      } catch (error: any) {
        console.error(`❌ Exception batch ${i / 10 + 1}:`, error);
        errors.push({
          batch: i / 10 + 1,
          error: error.message
        });
      }
    }

    // Vérifier la distribution finale
    const { data: types } = await supabase
      .from('toile_types')
      .select('id, name, code')
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
        };
      })
    );

    console.log('📊 Distribution finale:', distribution);

    return NextResponse.json({
      success: imported > 0,
      message: `Importation terminée: ${imported}/${sattlerToiles.length} toiles Sattler`,
      imported,
      total: sattlerToiles.length,
      errors: errors.length > 0 ? errors : undefined,
      distribution,
      note: errors.length > 0 && errors[0].code === '23505' 
        ? 'Erreur de contrainte unique. Exécutez d\'abord le SQL pour modifier la contrainte.'
        : undefined
    });
  } catch (error: any) {
    console.error('❌ Erreur import Sattler:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
