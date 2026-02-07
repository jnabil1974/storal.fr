import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { getSupabaseAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

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
  min_width?: number;
  max_width?: number;
  min_projection?: number;
  max_projection?: number;
}

async function getStoreBanneProducts() {
  noStore();
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    console.error('❌ Supabase admin client missing (SUPABASE_SERVICE_ROLE_KEY)');
    return [];
  }

  try {
    console.log('🔍 Tentative de requête sb_products (service role)...');

    const { data, error } = await supabase
      .from('sb_products')
      .select('id, name, slug, description, image_store_small, img_store, type, active, min_width, max_width, min_projection, max_projection, display_order')
      .eq('active', true)
      .order('display_order', { ascending: true });

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
      <header className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold uppercase tracking-widest mb-4">
            Notre Gamme Stores Bannes
          </h1>
          <p className="text-xl text-slate-200">
            100% sur-mesure | Fabrication Française | Garantie 12 ans sur l'armature
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
                <div
                  key={product.id}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
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
                          product.type === 'Store Coffre' ? 'bg-rose-800' :
                          product.type === 'Semi-coffre' ? 'bg-rose-800' :
                          product.type === 'Monobloc' ? 'bg-yellow-600' :
                          product.type === 'Traditionnel' ? 'bg-amber-700' :
                          'bg-slate-600'
                        }`}>
                          {product.type}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-rose-800 transition">
                      {product.name}
                    </h3>
                    <p className="text-slate-600 line-clamp-2 mb-4">
                      {product.description}
                    </p>
                    
                    {/* Specs */}
                    <div className="text-sm border-t border-slate-200 pt-4 mb-4 flex-grow space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Type:</span>
                        <span className="font-bold text-slate-900">{product.type || 'Standard'}</span>
                      </div>
                      {(product.min_width !== undefined && product.max_width !== undefined) && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Largeur:</span>
                          <span className="font-bold text-slate-900">{product.min_width} - {product.max_width} mm</span>
                        </div>
                      )}
                      {(product.min_projection !== undefined && product.max_projection !== undefined) && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Avancée:</span>
                          <span className="font-bold text-slate-900">{product.min_projection} - {product.max_projection} mm</span>
                        </div>
                      )}
                    </div>

                    {/* Bouton */}
                    <Link
                      href={`/products/store-banne/${product.slug}`}
                      className="block w-full bg-rose-800 hover:bg-rose-900 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
                    >
                      Voir le modèle →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Section Comment choisir */}
        <section className="mt-20 bg-white rounded-xl shadow-lg p-12 border border-slate-100">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 flex items-center border-l-6 border-rose-800 pl-6">
            Comment choisir votre store idéal ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 hover:border-rose-800 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 bg-rose-800 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">1</div>
              <h3 className="text-rose-800 font-bold text-lg mb-3">L'emplacement</h3>
              <p className="text-slate-600 text-sm mb-3">
                Où sera fixé le store ? <strong>Face au mur</strong> ou <strong>sous un plafond</strong> (balcon) ? Cela détermine le type de supports nécessaires.
              </p>
              <p className="text-rose-800 text-xs italic">💡 Conseil : Vérifiez la solidité de votre mur.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 hover:border-rose-800 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 bg-rose-800 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">2</div>
              <h3 className="text-rose-800 font-bold text-lg mb-3">Le niveau de protection</h3>
              <p className="text-slate-600 text-sm">
                Souhaitez-vous un <strong>Coffre Intégral</strong> (protection totale de la toile et des bras) ou un <strong>Monobloc</strong> (plus flexible, idéal sous un débord de toit) ?
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 hover:border-rose-800 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 bg-rose-800 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">3</div>
              <h3 className="text-rose-800 font-bold text-lg mb-3">Les dimensions</h3>
              <p className="text-slate-600 text-sm">
                Mesurez votre terrasse. L'avancée (projection) doit être environ <strong>50 cm supérieure</strong> à la surface que vous souhaitez réellement ombrager pour compenser le mouvement du soleil.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 hover:border-rose-800 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 bg-rose-800 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">4</div>
              <h3 className="text-rose-800 font-bold text-lg mb-3">La toile et le design</h3>
              <p className="text-slate-600 text-sm">
                Choisissez parmi nos 256 coloris. Une toile foncée protège mieux de la chaleur qu'une toile claire, qui elle, laisse passer plus de lumière.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 hover:border-rose-800 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 bg-rose-800 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">5</div>
              <h3 className="text-rose-800 font-bold text-lg mb-3">Le confort (Options)</h3>
              <p className="text-slate-600 text-sm">
                Motorisation Somfy® pour un pilotage smartphone, rampes LED pour vos soirées, ou capteur de vent pour une sécurité automatique.
              </p>
            </div>
          </div>
        </section>

        {/* Section informative */}
        <section className="mt-20 bg-white rounded-xl shadow-lg p-12 border border-slate-100">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 flex items-center border-l-6 border-rose-800 pl-6">
            Pourquoi choisir un store banne ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <span className="text-5xl block mb-4">☀️</span>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Protection solaire</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Réduisez la chaleur et protégez-vous des UV tout en profitant de votre terrasse.
              </p>
            </div>
            <div className="text-center">
              <span className="text-5xl block mb-4">🎨</span>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Personnalisable</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Choisissez parmi une large gamme de toiles et de dimensions adaptées à vos besoins.
              </p>
            </div>
            <div className="text-center">
              <span className="text-5xl block mb-4">⚡</span>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Motorisation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Options motorisées Somfy® disponibles pour un confort d'utilisation optimal.
              </p>
            </div>
            <div className="text-center">
              <span className="text-5xl block mb-4">💪</span>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Robuste</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Structures en aluminium de qualité première fusion pour une durabilité maximale.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
