import { getSupabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    const body = await request.json();
    const { slug, name, displayName, description, gradientFrom, gradientTo, orderIndex, imageUrl, imageAlt } = body;

    const { data, error } = await supabase
      .from('product_categories')
      .update({
        slug,
        name,
        display_name: displayName,
        description,
        gradient_from: gradientFrom,
        gradient_to: gradientTo,
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
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    const { error } = await supabase
      .from('product_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
