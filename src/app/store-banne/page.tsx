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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-blue-100 hover:text-white mb-4 inline-block transition">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-5xl font-bold uppercase tracking-wider mb-4">
            Stores Bannes
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Découvrez notre sélection de stores bannes de qualité. Protection solaire élégante et personnalisable 
            pour vos terrasses et balcons. Configurez vos dimensions, motorisation et toiles.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Grille de produits */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-slate-600 text-lg">Aucun produit disponible pour le moment.</p>
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
                  className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100"
                >
                  {/* Image avec badge */}
                  <div className="relative h-64 bg-slate-100 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
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
                          'bg-slate-600'
                        }`}>
                          {product.type}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-6 flex flex-col h-full">
                    <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition">
                      {product.name}
                    </h2>
                    <p className="text-slate-600 line-clamp-3 mb-4 flex-grow">
                      {product.description}
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition">
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
        <section className="mt-16 bg-white rounded-xl shadow-lg p-8 border border-slate-100">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center">
            <span className="text-4xl mr-3">☀️</span>
            Pourquoi choisir un store banne ?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-slate-600">
            <div className="flex gap-4">
              <span className="text-3xl flex-shrink-0">☀️</span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Protection solaire</h3>
                <p>Réduisez la chaleur et protégez-vous des UV tout en profitant de votre terrasse.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl flex-shrink-0">🎨</span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Personnalisable</h3>
                <p>Choisissez parmi une large gamme de toiles et de dimensions adaptées à vos besoins.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl flex-shrink-0">⚡</span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Motorisation</h3>
                <p>Options motorisées disponibles pour un confort d'utilisation optimal.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl flex-shrink-0">💪</span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Robuste</h3>
                <p>Structures en aluminium de qualité pour une durabilité maximale.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
