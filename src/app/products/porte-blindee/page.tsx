import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { getSubcategoriesByCategorySlug, getProductCategoryBySlug } from '@/lib/categories';
import { getSEOMetadata } from '@/lib/seo';

// Regenerate page every 60 seconds for fresh subcategory images
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOMetadata('products/porte-blindee');
  const category = await getProductCategoryBySlug('porte-blindee');
  return {
    title: seo?.title || `${category?.displayName || 'Portes Blindées'} | Storal.fr`,
    description: seo?.description || category?.description || 'Portes blindées sécurisées, certifiées A2P avec isolation phonique et thermique',
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
  const category = await getProductCategoryBySlug('porte-blindee');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/" className="text-slate-300 hover:text-white mb-4 inline-block transition">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-5xl font-bold uppercase tracking-wider mb-4">
            {category?.displayName || 'Portes Blindées'}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            {category?.description || 'Sécurité maximale pour votre domicile. Certification A2P, isolation phonique et thermique.'}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Grille des sous-catégories */}
        {subcategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subcategories.map((sub) => (
              <Link key={sub.id} href={`/products/porte-blindee/${sub.slug}`}>
                <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden border border-slate-100">
                  <div className="w-full h-56 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden relative">
                    {sub.imageUrl ? (
                      <Image
                        src={sub.imageUrl}
                        alt={sub.imageAlt || sub.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <svg className="w-24 h-24 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="inline-block w-fit bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      Sécurité A2P
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition">
                      {sub.name}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 flex-grow leading-relaxed">
                      {sub.description || 'Découvrez nos portes blindées certifiées avec protection maximale.'}
                    </p>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-auto">
                      Découvrir les modèles →
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-slate-600 text-lg">Aucune sous-catégorie disponible pour le moment.</p>
          </div>
        )}
      </main>
    </div>
  );
}
