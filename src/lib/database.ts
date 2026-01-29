import { getSupabaseClient } from '@/lib/supabase';
import { Product, ProductType, StoreBanneProduct, PorteBlindeeProduct } from '@/types/products';

type DbProductRow = {
  id: string;
  name: string;
  description: string;
  type: ProductType;
  base_price: number;
  image: string | null;
  category: string | null;
  specifications: Record<string, any> | null;
  created_at: string;
  updated_at: string;
};

// Données de secours locales si Supabase n'est pas configuré
const mockProducts: Product[] = [
  {
    id: 'store-1',
    name: 'Store Banne Standard',
    description: 'Store banne classique avec motorisation électrique',
    type: ProductType.STORE_BANNE,
    basePrice: 350,
    image: '/images/store-banne-1.jpg',
    category: 'Extérieur',
    createdAt: new Date(),
    updatedAt: new Date(),
    specifications: {
      minWidth: 100,
      maxWidth: 600,
      minDepth: 50,
      maxDepth: 250,
      availableFabrics: ['acrylique', 'polyester', 'micro-perforé'],
      availableFrameColors: ['blanc', 'gris', 'noir', 'bronze'],
      motorOptions: ['manuel', 'electrique', 'smarty'],
    },
  } as StoreBanneProduct,
  {
    id: 'store-anti-1',
    name: 'Store Antichaleur Premium',
    description: 'Protection solaire haute performance avec contrôle thermique',
    type: ProductType.STORE_ANTICHALEUR,
    basePrice: 150,
    image: '/images/store-antichaleur-1.jpg',
    category: 'Occultation',
    createdAt: new Date(),
    updatedAt: new Date(),
    specifications: {
      minWidth: 60,
      maxWidth: 300,
      minHeight: 80,
      maxHeight: 300,
      availableFabricTypes: ['screen', 'semi-occultant', 'occultant'],
      availableColors: ['blanc', 'beige', 'gris', 'anthracite', 'noir'],
      motorOptions: ['manuel', 'electrique', 'solaire'],
    },
  } as Product,
  {
    id: 'porte-1',
    name: 'Porte Blindée Standard A2P',
    description: 'Porte blindée entrée avec certificationA2P 2 étoiles',
    type: ProductType.PORTE_BLINDEE,
    basePrice: 890,
    image: '/images/porte-blindee-1.jpg',
    category: 'Entrée',
    createdAt: new Date(),
    updatedAt: new Date(),
    specifications: {
      minWidth: 70,
      maxWidth: 100,
      minHeight: 200,
      maxHeight: 240,
      availableMaterials: ['acier', 'aluminium', 'composite'],
      availableTypes: ['battante', 'coulissante'],
      securityLevels: ['A2P_1', 'A2P_2', 'A2P_3'],
      availableColors: ['blanc', 'gris', 'noir', 'bois'],
    },
  } as PorteBlindeeProduct,
];

function mapRowToProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    type: row.type,
    basePrice: row.base_price,
    image: row.image || '',
    category: row.category || '',
    specifications: row.specifications || {},
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  } as Product;
}

function withMockFallback<T>(fn: () => Promise<T>, fallback: () => T | Promise<T>): Promise<T> {
  return fn().catch((err) => {
    console.warn('⚠️ Database query failed, returning empty result:', err?.message || err);
    return fallback();
  });
}

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.log('[getProducts] No supabase, returning empty array');
    return [];
  }

  return withMockFallback(async () => {
    // Get all products
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) throw error;
    
    console.log(`[getProducts] Got ${data.length} products from Supabase`);
    
    return data.map(mapRowToProduct);
  }, () => []);
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return mockProducts.find(p => p.id === id) || null;

  return withMockFallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapRowToProduct(data) : null;
  }, () => mockProducts.find(p => p.id === id) || null);
}

export async function getProductsByType(type: ProductType): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return mockProducts.filter(p => p.type === type);

  return withMockFallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: true });

    if (error || !data) throw error;
    return data.map(mapRowToProduct);
  }, () => mockProducts.filter(p => p.type === type));
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    const newProduct: Product = {
      ...(product as any),
      id: `prod-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockProducts.push(newProduct);
    return newProduct;
  }

  return withMockFallback(async () => {
    const now = new Date().toISOString();
    const payload = {
      name: product.name,
      description: product.description,
      type: product.type,
      base_price: product.basePrice,
      image: product.image || null,
      category: product.category || null,
      specifications: (product as any).specifications || null,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select('*')
      .maybeSingle();

    if (error || !data) throw error;
    return mapRowToProduct(data);
  }, async () => {
    const newProduct: Product = {
      ...(product as any),
      id: `prod-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockProducts.push(newProduct);
    return newProduct;
  });
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return null;
    mockProducts[index] = {
      ...mockProducts[index],
      ...(updates as any),
      updatedAt: new Date(),
    } as Product;
    return mockProducts[index];
  }

  return withMockFallback(async () => {
    const payload: Partial<DbProductRow> = {
      name: updates.name,
      description: updates.description,
      type: updates.type,
      base_price: updates.basePrice as number | undefined,
      image: (updates as any).image ?? undefined,
      category: updates.category ?? undefined,
      specifications: (updates as any).specifications ?? undefined,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data ? mapRowToProduct(data) : null;
  }, () => {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return null;
    mockProducts[index] = {
      ...mockProducts[index],
      ...(updates as any),
      updatedAt: new Date(),
    } as Product;
    return mockProducts[index];
  });
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return false;
    mockProducts.splice(index, 1);
    return true;
  }

  return withMockFallback(async () => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }, () => {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return false;
    mockProducts.splice(index, 1);
    return true;
  });
}
