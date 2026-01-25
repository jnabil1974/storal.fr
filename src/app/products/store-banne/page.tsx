import Link from 'next/link';
import { Metadata } from 'next';
import { getProducts } from '@/lib/database';
import { ProductType } from '@/types/products';
import { getSEOMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOMetadata('products/store-banne');
  return {
    title: seo?.title || 'Stores Bannes | Storal.fr',
    description: seo?.description || 'Stores bannes élégants pour terrasses et balcons. Personnalisables en dimensions et motorisation.',
    keywords: seo?.keywords,
    openGraph: {
      title: seo?.og_title || seo?.title,
      description: seo?.og_description || seo?.description,
      url: seo?.canonical_url || 'https://storal.fr/products/store-banne',
      images: seo?.og_image ? [{ url: seo.og_image }] : [],
    },
    robots: seo?.robots || 'index, follow',
    alternates: {
      canonical: seo?.canonical_url || 'https://storal.fr/products/store-banne',
    },
  };
}

export default async function StoreBannePage() {
  const allProducts = await getProducts();
  const products = allProducts.filter(p => p.type === ProductType.STORE_BANNE);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Stores Bannes</h1>
          <p className="text-gray-600 text-lg">
            Protection solaire élégante pour terrasses et balcons. Personnalisables en dimensions et coloris.
          </p>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col overflow-hidden">
                {/* Image placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
                  <svg className="w-20 h-20 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
                  </svg>
                </div>

                {/* Contenu */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <span className="text-lg font-bold text-blue-600">À partir de {product.basePrice}€</span>
                    <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Bouton */}
                <div className="px-6 pb-6">
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Configurer
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Message si aucun produit */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Aucun produit disponible dans cette catégorie pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
