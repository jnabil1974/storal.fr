/**
 * Service de récupération des données du configurateur
 * Gère la connexion avec Supabase et le formatage des données
 */

import { getSupabaseClient } from '@/lib/supabase';
import type {
  ToileColor,
  ToileType,
  MatestColor,
  MatestFinishType,
  ConfiguratorData,
  FabricFilters,
  ColorFilters
} from '@/types/configurator';

// ============================================
// RÉCUPÉRATION DES TOILES
// ============================================

/**
 * Récupère toutes les toiles actives avec leurs types
 */
export async function fetchActiveFabrics(filters?: FabricFilters): Promise<ToileColor[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error('Supabase client non disponible');
    return [];
  }

  try {
    let query = supabase
      .from('toile_colors')
      .select(`
        *,
        toile_type:toile_types(*)
      `)
      .order('display_order', { ascending: true })
      .order('popularity_score', { ascending: false });

    // Appliquer les filtres
    if (filters?.availableOnly !== false) {
      query = query.eq('is_available', true);
    }

    if (filters?.manufacturer && filters.manufacturer !== 'all') {
      // Filtrer via la relation toile_type
      query = query.eq('toile_type.manufacturer', filters.manufacturer);
    }

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters?.colorFamily && filters.colorFamily !== 'all') {
      query = query.eq('color_family', filters.colorFamily);
    }

    if (filters?.collection && filters.collection !== 'all') {
      query = query.eq('collection', filters.collection);
    }

    if (filters?.search) {
      query = query.or(`ref.ilike.%${filters.search}%,name.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur fetchActiveFabrics:', error);
      return [];
    }

    return data as ToileColor[];
  } catch (error) {
    console.error('Exception fetchActiveFabrics:', error);
    return [];
  }
}

/**
 * Récupère les types de toiles actifs
 */
export async function fetchToileTypes(): Promise<ToileType[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('toile_types')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Erreur fetchToileTypes:', error);
      return [];
    }

    return data as ToileType[];
  } catch (error) {
    console.error('Exception fetchToileTypes:', error);
    return [];
  }
}

// ============================================
// RÉCUPÉRATION DES COULEURS DE STRUCTURE
// ============================================

/**
 * Récupère les couleurs de structure (RAL) avec filtres
 */
export async function fetchFrameColors(filters?: ColorFilters): Promise<MatestColor[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from('matest_colors')
      .select('*')
      .order('finish', { ascending: true })
      .order('ral_code', { ascending: true });

    // Si un productSlug est fourni, filtrer par types de finition compatibles
    if (filters?.productSlug) {
      // 1. Récupérer les types de finition compatibles
      const { data: finishTypes } = await supabase
        .from('matest_finish_types')
        .select('name')
        .contains('product_slugs', [filters.productSlug]);

      if (finishTypes && finishTypes.length > 0) {
        const compatibleFinishes = finishTypes.map(t => t.name);
        query = query.in('finish', compatibleFinishes);
      } else {
        // Aucun type compatible trouvé, retourner tableau vide
        return [];
      }
    }

    if (filters?.finish && filters.finish !== 'all') {
      query = query.eq('finish', filters.finish);
    }

    if (filters?.search) {
      query = query.or(`ral_code.ilike.%${filters.search}%,name.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur fetchFrameColors:', error);
      return [];
    }

    return data as MatestColor[];
  } catch (error) {
    console.error('Exception fetchFrameColors:', error);
    return [];
  }
}

/**
 * Récupère les types de finition disponibles
 */
export async function fetchFinishTypes(): Promise<MatestFinishType[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('matest_finish_types')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Erreur fetchFinishTypes:', error);
      return [];
    }

    return data as MatestFinishType[];
  } catch (error) {
    console.error('Exception fetchFinishTypes:', error);
    return [];
  }
}

// ============================================
// RÉCUPÉRATION CONSOLIDÉE
// ============================================

/**
 * Récupère toutes les données nécessaires au configurateur en une seule fois
 * Utilisé pour la mise en cache côté serveur
 */
export async function fetchConfiguratorData(): Promise<ConfiguratorData> {
  const [fabrics, frameColors, finishTypes] = await Promise.all([
    fetchActiveFabrics({ availableOnly: true }),
    fetchFrameColors(),
    fetchFinishTypes()
  ]);

  // Organiser les données par catégories
  const fabricsByManufacturer: Record<string, ToileColor[]> = {};
  const fabricsByCategory: Record<string, ToileColor[]> = {};

  fabrics.forEach(fabric => {
    const manufacturer = fabric.toile_type?.manufacturer || 'other';
    if (!fabricsByManufacturer[manufacturer]) {
      fabricsByManufacturer[manufacturer] = [];
    }
    fabricsByManufacturer[manufacturer].push(fabric);

    if (fabric.category) {
      if (!fabricsByCategory[fabric.category]) {
        fabricsByCategory[fabric.category] = [];
      }
      fabricsByCategory[fabric.category].push(fabric);
    }
  });

  const colorsByFinish: Record<string, MatestColor[]> = {};
  frameColors.forEach(color => {
    if (!colorsByFinish[color.finish]) {
      colorsByFinish[color.finish] = [];
    }
    colorsByFinish[color.finish].push(color);
  });

  // Couleurs standards (RAL 9016, 1015, 7016)
  const standardRalCodes = ['9016', '1015', '7016'];
  const standardColors = frameColors.filter(color =>
    standardRalCodes.includes(color.ral_code)
  );

  return {
    fabrics: {
      all: fabrics,
      byManufacturer: fabricsByManufacturer,
      byCategory: fabricsByCategory
    },
    frameColors: {
      all: frameColors,
      byFinish: colorsByFinish,
      standardColors
    },
    finishTypes
  };
}

// ============================================
// UTILITAIRES
// ============================================

/**
 * Génère l'URL de l'image pour une toile
 * @param ref Référence de la toile (ex: "6088", "8910")
 * @param manufacturer Fabricant (ex: "Dickson", "Sattler")
 * @returns URL complète de l'image
 */
export function getFabricImageUrl(ref: string, manufacturer: string): string {
  // Pattern standard: /images/toiles/DICKSON/dickson_6088.jpg
  const fabricantUpper = manufacturer.toUpperCase();
  const fabricantLower = manufacturer.toLowerCase();
  return `/images/toiles/${fabricantUpper}/${fabricantLower}_${ref}.jpg`;
}

/**
 * Génère l'URL de l'image pour une couleur RAL
 * @param ralCode Code RAL (ex: "7016", "9016")
 * @returns URL complète de l'image
 */
export function getRalImageUrl(ralCode: string): string {
  return `/images/matest/RAL_${ralCode}.png`;
}

/**
 * Vérifie si une couleur est une couleur standard (PROMO)
 * @param ralCode Code RAL
 * @returns true si c'est une couleur standard
 */
export function isStandardColor(ralCode: string): boolean {
  return ['9016', '1015', '7016'].includes(ralCode);
}
