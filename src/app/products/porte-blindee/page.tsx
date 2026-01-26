import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { getSubcategoriesByCategorySlug } from '@/lib/categories';
import { getSEOMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOMetadata('products/porte-blindee');
  return {
    title: seo?.title || 'Portes Blindées | Storal.fr',
    description: seo?.description || 'Portes blindées sécurisées, certifiées A2P avec isolation phonique et thermique',
    keywords: seo?.keywords,
    openGraph: {
      title: seo?.og_title || seo?.title,
      description: seo?.og_description || seo?.description,
      url: seo?.canonical_url || 'https://storal.fr/products/porte-blindee',
      images: seo?.og_image ? [{ url: seo.og_image }] : [],
    },
    robots: seo?.robots || 'index, follow',
    alternates: {
      canonical: seo?.canonical_url || 'https://storal.fr/products/porte-blindee',
    },
  };
}

export default async function PorteBlindeePage() {
  const subcategories = await getSubcategoriesByCategorySlug('porte-blindee');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Portes Blindées</h1>
          <p className="text-gray-600 text-lg">
            Sécurité maximale pour votre domicile. Certification A2P, isolation phonique et thermique.
          </p>
        </div>

        {/* Grille des sous-catégories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subcategories.map((sub) => (
            <Link key={sub.id} href={`/products/porte-blindee/${sub.slug}`}>
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-slate-100 flex items-center justify-center overflow-hidden">
                  {sub.imageUrl ? (
                    <Image src={sub.imageUrl} alt={sub.imageAlt || sub.name} width={400} height={300} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-20 h-20 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
