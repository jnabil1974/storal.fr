import { getSupabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    const body = await request.json();
    const { slug, name, displayName, description, gradientFrom, gradientTo, orderIndex, imageUrl, imageAlt } = body;

    if (!slug || !name || !displayName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('product_categories')
      .insert([{
        slug,
        name,
        display_name: displayName,
        description,
        gradient_from: gradientFrom,
        gradient_to: gradientTo,
        order_index: orderIndex || 0,
        image_url: imageUrl,
        image_alt: imageAlt,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
