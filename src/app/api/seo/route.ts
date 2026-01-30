import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    if (slug) {
      // Récupérer une page spécifique
      const { data, error } = await supabase
        .from('seo_pages')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return NextResponse.json(data || {});
    } else {
      // Récupérer toutes les pages
      const { data, error } = await supabase
        .from('seo_pages')
        .select('*')
        .order('slug', { ascending: true });

      if (error) throw error;
      return NextResponse.json(data || []);
    }
  } catch (error: any) {
    console.error('Error fetching SEO metadata:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SEO metadata' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug, title, description, keywords, og_title, og_description, og_image, canonical_url, robots } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Vérifier si la page existe
    const { data: existing } = await supabase
      .from('seo_pages')
      .select('id')
      .eq('slug', slug)
      .single();

    let result;
    if (existing) {
      // Mettre à jour
      const { data, error } = await supabase
        .from('seo_pages')
        .update({
          title: title || null,
          description: description || null,
          keywords: keywords || null,
          og_title: og_title || null,
          og_description: og_description || null,
          og_image: og_image || null,
          canonical_url: canonical_url || null,
          robots: robots || 'index, follow',
        })
        .eq('slug', slug)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Créer une nouvelle page
      const { data, error } = await supabase
        .from('seo_pages')
        .insert({
          slug,
          title: title || null,
          description: description || null,
          keywords: keywords || null,
          og_title: og_title || null,
          og_description: og_description || null,
          og_image: og_image || null,
          canonical_url: canonical_url || null,
          robots: robots || 'index, follow',
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error updating SEO metadata:', error);
    return NextResponse.json(
      { error: 'Failed to update SEO metadata' },
      { status: 500 }
    );
  }
}
