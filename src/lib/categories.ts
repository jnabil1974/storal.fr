import { getSupabaseClient } from '@/lib/supabase';
import { ProductCategory, ProductSubcategory, ProductCategoryMap } from '@/types/categories';

export async function getProductCategories(): Promise<ProductCategory[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    displayName: row.display_name,
    description: row.description,
    iconSvg: row.icon_svg,
    gradientFrom: row.gradient_from,
    gradientTo: row.gradient_to,
    orderIndex: row.order_index,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }));
}

export async function getProductCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    displayName: data.display_name,
    description: data.description,
    iconSvg: data.icon_svg,
    gradientFrom: data.gradient_from,
    gradientTo: data.gradient_to,
    orderIndex: data.order_index,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

export async function getSubcategoriesByCategory(categoryId: string): Promise<ProductSubcategory[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('product_subcategories')
    .select('*')
    .eq('category_id', categoryId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    categoryId: row.category_id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    orderIndex: row.order_index,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }));
}

export async function getProductCategoryHierarchy(): Promise<ProductCategoryMap> {
  const categories = await getProductCategories();
  const hierarchy: ProductCategoryMap = {};

  for (const category of categories) {
    const subcategories = await getSubcategoriesByCategory(category.id);
    hierarchy[category.slug] = { category, subcategories };
  }

  return hierarchy;
}

export async function createProductCategory(
  slug: string,
  name: string,
  displayName: string,
  description?: string,
  gradientFrom?: string,
  gradientTo?: string
): Promise<ProductCategory | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('product_categories')
    .insert({
      slug,
      name,
      display_name: displayName,
      description,
      gradient_from: gradientFrom,
      gradient_to: gradientTo,
    })
    .select()
    .maybeSingle();

  if (error || !data) {
    console.error('Error creating category:', error);
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    displayName: data.display_name,
    description: data.description,
    iconSvg: data.icon_svg,
    gradientFrom: data.gradient_from,
    gradientTo: data.gradient_to,
    orderIndex: data.order_index,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

export async function createProductSubcategory(
  categoryId: string,
  slug: string,
  name: string,
  description?: string
): Promise<ProductSubcategory | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('product_subcategories')
    .insert({
      category_id: categoryId,
      slug,
      name,
      description,
    })
    .select()
    .maybeSingle();

  if (error || !data) {
    console.error('Error creating subcategory:', error);
    return null;
  }

  return {
    id: data.id,
    categoryId: data.category_id,
    slug: data.slug,
    name: data.name,
    description: data.description,
    orderIndex: data.order_index,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}
