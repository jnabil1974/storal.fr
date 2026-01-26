import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { getSubcategoriesByCategorySlug } from '@/lib/categories';
import { getSEOMetadata } from '@/lib/seo';

// Regenerate page every 60 seconds for fresh subcategory images
export const revalidate = 60;

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
  const subcategories = await getSubcategoriesByCategorySlug('store-banne');

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

        {/* Grille des sous-catégories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subcategories.map((sub) => (
            <Link key={sub.id} href={`/products/store-banne/${sub.slug}`}>
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center overflow-hidden">
                  {sub.imageUrl ? (
                    <Image src={sub.imageUrl} alt={sub.imageAlt || sub.name} width={400} height={300} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-20 h-20 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
                    </svg>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{sub.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">{sub.description || 'Découvrez nos produits de cette sous-catégorie.'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Message si aucun produit */}
        {subcategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Aucune sous-catégorie disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
