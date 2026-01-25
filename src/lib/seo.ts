import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SEOMetadata {
  slug: string;
  title?: string;
  description?: string;
  keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  robots?: string;
}

/**
 * Récupère les métadonnées SEO pour une page donnée
 */
export async function getSEOMetadata(slug: string): Promise<SEOMetadata | null> {
  try {
    const { data, error } = await supabase
      .from('seo_pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`SEO metadata not found for slug: ${slug}`, error);
      return null;
    }

    return data as SEOMetadata;
  } catch (err) {
    console.error('Error fetching SEO metadata:', err);
    return null;
  }
}

/**
 * Récupère toutes les pages SEO pour l'admin
 */
export async function getAllSEOPages(): Promise<SEOMetadata[]> {
  try {
    const { data, error } = await supabase
      .from('seo_pages')
      .select('*')
      .order('slug', { ascending: true });

    if (error) throw error;
    return (data || []) as SEOMetadata[];
  } catch (err) {
    console.error('Error fetching all SEO pages:', err);
    return [];
  }
}

/**
 * Met à jour les métadonnées SEO pour une page
 */
export async function updateSEOMetadata(slug: string, updates: Partial<SEOMetadata>): Promise<SEOMetadata | null> {
  try {
    const { data, error } = await supabase
      .from('seo_pages')
      .update(updates)
      .eq('slug', slug)
      .select()
      .single();

    if (error) throw error;
    return data as SEOMetadata;
  } catch (err) {
    console.error('Error updating SEO metadata:', err);
    return null;
  }
}
