import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const orchestraMaxFiles = [
  "0001.png",
  "0681 120.png",
  "3914 120.png",
  "6020 120.png",
  "6028 120.png",
  "6088 120.png",
  "6196 120.png",
  "6687 120.png",
  "7133 120.png",
  "7548 120.png",
  "7559 120.png",
  "8203 120.png",
  "8206 120.png",
  "8396 120.png",
  "8779 120.png",
  "Réf. U768 120.png",
  "U104 120.png",
  "U171 120.png",
  "U767 120.png",
  "U786 120.png",
  "U793 120.png",
  "U806 120.png",
  "U808 120.png",
  "U811 120.png"
];

function extractRef(filename: string): string {
  // Enlever .png
  const name = filename.replace('.png', '');
  // Enlever " 120" si présent
  const cleaned = name.replace(/ 120$/, '');
  // Enlever "Réf. " si présent
  return cleaned.replace(/^Réf\.\s+/, '');
}

function detectColorFamily(ref: string): string {
  if (ref.startsWith('U')) return 'Neutre';
  const num = parseInt(ref);
  if (num < 2000) return 'Blanc';
  if (num < 4000) return 'Beige';
  if (num < 6500) return 'Gris';
  if (num < 8000) return 'Bleu';
  return 'Neutre';
}

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔧 Import des toiles Orchestra Max...');

    const toiles = orchestraMaxFiles.map((filename, index) => {
      const ref = extractRef(filename);
      return {
        toile_type_id: 2, // Orchestra Max
        ref: ref,
        name: `Orchestra Max ${ref}`,
        collection: 'Orchestra Max',
        category: 'MAX',
        color_family: detectColorFamily(ref),
        image_url: `/images/toiles/DICKSON/ORCHESTRA MAX/${filename}`,
        is_available: true,
        display_order: 500 + index,
      };
    });

    console.log(`📦 ${toiles.length} toiles à importer`);

    const { data, error } = await supabase
      .from('toile_colors')
      .insert(toiles)
      .select();

    if (error) {
      console.error('❌ Erreur:', error);
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 500 }
      );
    }

    console.log(`✅ ${data.length} toiles importées`);

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

    return NextResponse.json({
      success: true,
      message: `${data.length} toiles Orchestra Max importées`,
      imported: data.length,
      distribution,
    });
  } catch (error: any) {
    console.error('❌ Erreur import:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
