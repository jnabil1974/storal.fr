import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Stores Bannes | Storal.fr',
  description: 'Découvrez notre gamme complète de stores bannes personnalisables pour terrasses et balcons.',
};

interface StoreBanneProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_store_small: string | null;
  img_store: string[] | null;
  type?: string;
  active?: boolean;
}

async function getStoreBanneProducts() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase env vars missing:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
    return [];
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔍 Tentative de requête sb_products...');
    
    const { data, error } = await supabase
      .from('sb_products')
      .select('id, name, slug, description, image_store_small, img_store, type, active')
      .eq('active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ Erreur Supabase complète:', error);
      console.error('❌ Erreur stringifiée:', JSON.stringify(error, null, 2));
      return [];
    }

    console.log('✅ Produits chargés:', data?.length || 0);
    console.log('✅ Premier produit:', data?.[0]);
    return data || [];
  } catch (err) {
    console.error('❌ Exception:', err);
    console.error('❌ Exception type:', typeof err);
    console.error('❌ Exception stringifiée:', JSON.stringify(err, null, 2));
    return [];
  }
}

export default async function StoreBanneCatalogPage() {
  const products = await getStoreBanneProducts();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-12">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Stores Bannes</h1>
          <p className="text-gray-600 text-lg max-w-3xl">
            Découvrez notre sélection de stores bannes de qualité. Protection solaire élégante et personnalisable 
            pour vos terrasses et balcons. Configurez vos dimensions, motorisation et toiles.
          </p>
        </div>

        {/* Grille de produits */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun produit disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              // Utiliser image_store_small, ou la première image de img_store, ou une image par défaut
              const imageUrl = product.image_store_small || 
                             (product.img_store && product.img_store[0]) || 
                             '/images/placeholder-store.jpg';

              return (
                <Link
                  key={product.id}
                  href={`/products/store-banne/${product.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Image avec badge */}
                  <div className="relative h-64 bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Badge Type */}
                    {product.type && (
                      <div className="absolute top-3 right-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
                          product.type === 'Store Coffre' ? 'bg-blue-600' :
                          product.type === 'Semi-coffre' ? 'bg-purple-600' :
                          product.type === 'Monobloc' ? 'bg-green-600' :
                          product.type === 'Traditionnel' ? 'bg-amber-600' :
                          'bg-gray-600'
                        }`}>
                          {product.type}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 line-clamp-3">
                      {product.description}
                    </p>
                    <div className="mt-4 flex items-center text-blue-600 font-medium">
                      Configurer
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Section informative */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pourquoi choisir un store banne ?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">☀️ Protection solaire</h3>
              <p>Réduisez la chaleur et protégez-vous des UV tout en profitant de votre terrasse.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🎨 Personnalisable</h3>
              <p>Choisissez parmi une large gamme de toiles et de dimensions adaptées à vos besoins.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">⚡ Motorisation</h3>
              <p>Options motorisées disponibles pour un confort d'utilisation optimal.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">💪 Robuste</h3>
              <p>Structures en aluminium de qualité pour une durabilité maximale.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
