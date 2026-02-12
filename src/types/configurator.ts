/**
 * Types pour les données du configurateur de stores
 * Ces types correspondent aux tables Supabase
 */

// ============================================
// TOILES
// ============================================

export interface ToileType {
  id: number;
  name: string;
  code: string;
  manufacturer: string;
  purchase_price_ht: number;
  sales_coefficient: number;
  compatible_categories: string[];
  is_active: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ToileColor {
  id: number;
  toile_type_id: number;
  ref: string;
  name: string;
  collection: string;
  category: string;
  sub_category?: string;
  color_family: string;
  color_hex?: string;
  color_r?: number;
  color_g?: number;
  color_b?: number;
  image_url: string;
  thumbnail_url?: string;
  is_available: boolean;
  stock_status?: 'in_stock' | 'out_of_stock' | 'discontinued';
  tags?: string[];
  description?: string;
  search_keywords?: string;
  display_order?: number;
  popularity_score?: number;
  created_at?: string;
  updated_at?: string;
  
  // Relation jointe
  toile_type?: ToileType;
}

// ============================================
// COULEURS DE STRUCTURE (MATEST)
// ============================================

export interface MatestColor {
  id: number;
  ral_code: string;
  name: string;
  finish: string; // 'brillant', 'sable', 'structure'
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MatestFinishType {
  id: number;
  name: string;
  icon?: string;
  color?: string;
  order_index: number;
  product_slugs?: string[] | null;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// RÉPONSES API POUR LE CONFIGURATEUR
// ============================================

export interface ConfiguratorFabricsResponse {
  fabrics: ToileColor[];
  types: ToileType[];
  totalCount: number;
  lastUpdate: string;
}

export interface ConfiguratorColorsResponse {
  colors: MatestColor[];
  finishTypes: MatestFinishType[];
  totalCount: number;
  lastUpdate: string;
}

// ============================================
// FILTRES POUR LES REQUÊTES
// ============================================

export interface FabricFilters {
  manufacturer?: string;
  category?: string;
  colorFamily?: string;
  collection?: string;
  availableOnly?: boolean;
  search?: string;
}

export interface ColorFilters {
  finish?: string;
  productSlug?: string; // Filtrer par compatibilité produit
  search?: string;
}

// ============================================
// DONNÉES CONSOLIDÉES POUR LE CONFIGURATEUR
// ============================================

export interface ConfiguratorData {
  fabrics: {
    all: ToileColor[];
    byManufacturer: Record<string, ToileColor[]>;
    byCategory: Record<string, ToileColor[]>;
  };
  frameColors: {
    all: MatestColor[];
    byFinish: Record<string, MatestColor[]>;
    standardColors: MatestColor[]; // RAL 9016, 1015, 7016
  };
  finishTypes: MatestFinishType[];
}
