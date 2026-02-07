import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

// GET - Récupérer la liste des stores pour les cases à cocher
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('sb_products')
      .select('id, slug, name')
      .eq('active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    // Transformer en format plus simple pour les cases à cocher
    const products = data.map(p => ({
      slug: p.slug.toUpperCase(),
      label: p.name
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Erreur GET products-list:', error);
    return NextResponse.json({ error: 'Erreur chargement' }, { status: 500 });
  }
}
