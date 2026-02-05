import { createClient } from '@supabase/supabase-js';
import StoreBanneConfigurator from '@/components/StoreBanneConfigurator';
import ProductPresentation from '@/components/ProductPresentation';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProductBySlug(slug: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) return null;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from('sb_products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

function replaceValuesWithColumnNames(obj: any, prefix = ''): any {
  if (obj === null || obj === undefined) {
    return `[${prefix || 'null'}]`;
  }
  
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replaceValuesWithColumnNames(value, key);
    }
    return result;
  }
  
  if (Array.isArray(obj)) {
    return obj.map((item, index) => 
      replaceValuesWithColumnNames(item, `${prefix}[${index}]`)
    );
  }
  
  // For numbers, keep them as is for dimensions and coefficients
  if (typeof obj === 'number' && prefix && (
    prefix.includes('width') || 
    prefix.includes('height') || 
    prefix.includes('projection') || 
    prefix.includes('coefficient') ||
    prefix.includes('min_') ||
    prefix.includes('max_')
  )) {
    return obj;
  }
  
  // Return the column name instead of the actual value
  return `[${prefix}]`;
}

export default async function DebugStoreBanneProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Produit non trouvé: {slug}
        </div>
      </div>
    );
  }

  // Replace all values with column names (except dimensions)
  const debugProduct = replaceValuesWithColumnNames(product);

  return (
    <div>
      {/* Bandeau de debug en haut */}
      <div className="bg-yellow-100 border-b-4 border-yellow-500 py-3 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-yellow-900 font-bold text-lg">🔍 MODE DEBUG</span>
            <span className="ml-4 text-yellow-800 text-sm">Les valeurs sont remplacées par les noms des colonnes</span>
          </div>
          <a href={`/products/store-banne/${slug}`} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Voir la page normale
          </a>
        </div>
      </div>

      {/* Section de présentation avec carousel en haut à droite */}
      <ProductPresentation product={debugProduct} showCarousel={true} />

      {/* Section du configurateur de prix */}
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div id="configurateur" className="scroll-mt-24">
            <StoreBanneConfigurator product={debugProduct} productSlug={debugProduct.slug} hideCarousel={true} />
          </div>
        </div>
      </div>

      {/* JSON Debug en bas de page */}
      <div className="bg-gray-900 text-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">📋 Données avec Noms de Colonnes (JSON)</h2>
          <pre className="bg-gray-800 p-4 rounded overflow-x-auto text-xs">
            {JSON.stringify(debugProduct, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
