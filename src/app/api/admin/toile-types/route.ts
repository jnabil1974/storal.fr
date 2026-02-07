import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

// GET - Récupérer tous les types de toiles
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('toile_types')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur GET toile_types:', error);
    return NextResponse.json({ error: 'Erreur chargement' }, { status: 500 });
  }
}

// POST - Créer un nouveau type de toile
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('toile_types')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Erreur POST toile_types:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur création' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un type de toile
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
      .from('toile_types')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Erreur PUT toile_types:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur modification' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un type de toile
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

    // Vérifier si des couleurs utilisent ce type
    const { count } = await supabase
      .from('toile_colors')
      .select('id', { count: 'exact', head: true })
      .eq('toile_type_id', id);

    if (count && count > 0) {
      return NextResponse.json(
        { error: `Impossible de supprimer: ${count} couleur(s) utilisent ce type` },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('toile_types')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur DELETE toile_types:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur suppression' },
      { status: 500 }
    );
  }
}
