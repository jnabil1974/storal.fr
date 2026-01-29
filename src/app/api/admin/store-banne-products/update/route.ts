import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body || {};

    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase admin indisponible' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('sb_products')
      .update(updates)
      .eq('id', id)
      .select('id');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Aucune ligne mise à jour' }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: data[0].id });
  } catch (error) {
    console.error('Erreur update store banne:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
