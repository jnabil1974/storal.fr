import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

// GET - Récupérer les couleurs de toiles avec filtres
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const toileTypeId = searchParams.get('toile_type_id');
    const colorFamily = searchParams.get('color_family');
    const available = searchParams.get('available');
    const search = searchParams.get('search');

    let query = supabase
      .from('toile_colors')
      .select(`
        *,
        toile_type:toile_types(*)
      `)
      .order('display_order', { ascending: true });

    // Appliquer les filtres
    if (toileTypeId) {
      query = query.eq('toile_type_id', toileTypeId);
    }

    if (colorFamily) {
      query = query.eq('color_family', colorFamily);
    }

    if (available === 'true') {
      query = query.eq('is_available', true);
    }

    if (search) {
      query = query.or(`ref.ilike.%${search}%,name.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur GET toile_colors:', error);
    return NextResponse.json({ error: 'Erreur chargement' }, { status: 500 });
  }
}

// POST - Créer une nouvelle couleur de toile
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 });
    }

    const body = await request.json();

    // Vérifier que la référence n'existe pas déjà
    const { data: existing } = await supabase
      .from('toile_colors')
      .select('ref')
      .eq('ref', body.ref)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: `La référence ${body.ref} existe déjà` },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('toile_colors')
      .insert([body])
      .select(`
        *,
        toile_type:toile_types(*)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Erreur POST toile_colors:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur création' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une couleur de toile
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('toile_colors')
      .update(body)
      .eq('id', id)
      .select(`
        *,
        toile_type:toile_types(*)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Erreur PUT toile_colors:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur modification' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une couleur de toile
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    const { error } = await supabase
      .from('toile_colors')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur DELETE toile_colors:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur suppression' },
      { status: 500 }
    );
  }
}
