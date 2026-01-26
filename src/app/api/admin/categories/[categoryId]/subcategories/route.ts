import { getSupabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    const { data, error } = await supabase
      .from('product_subcategories')
      .select('*')
      .eq('category_id', categoryId)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json({ error: 'Failed to fetch subcategories' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    const body = await request.json();
    const { slug, name, description, orderIndex, imageUrl, imageAlt } = body;

    if (!slug || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('product_subcategories')
      .insert([{
        category_id: categoryId,
        slug,
        name,
        description,
        order_index: orderIndex || 0,
        image_url: imageUrl,
        image_alt: imageAlt,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return NextResponse.json({ error: 'Failed to create subcategory' }, { status: 500 });
  }
}
