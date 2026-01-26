import { getSupabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    const id = params.id;
    const body = await request.json();
    const { slug, name, description, orderIndex, imageUrl, imageAlt } = body;

    const { data, error } = await supabase
      .from('product_subcategories')
      .update({
        slug,
        name,
        description,
        order_index: orderIndex,
        image_url: imageUrl,
        image_alt: imageAlt,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating subcategory:', error);
    return NextResponse.json({ error: 'Failed to update subcategory' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    const id = params.id;

    const { error } = await supabase
      .from('product_subcategories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return NextResponse.json({ error: 'Failed to delete subcategory' }, { status: 500 });
  }
}
