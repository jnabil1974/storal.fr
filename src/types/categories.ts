// Types for product categories
export interface ProductCategory {
  id: string;
  slug: string;
  name: string; // Internal name (store_banne, porte_blindee, etc.)
  displayName: string; // Display name (Stores Bannes, Portes Blindées)
  description?: string;
  iconSvg?: string;
  gradientFrom?: string;
  gradientTo?: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSubcategory {
  id: string;
  categoryId: string;
  slug: string;
  name: string;
  description?: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithCategory {
  id: string;
  name: string;
  description: string;
  type: string;
  basePrice: number;
  image: string;
  category: string;
  subcategoryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper types
export type ProductCategoryMap = {
  [categorySlug: string]: {
    category: ProductCategory;
    subcategories: ProductSubcategory[];
  };
};
