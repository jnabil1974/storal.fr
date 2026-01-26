import Link from 'next/link';
import { Metadata } from 'next';
import { getSEOMetadata } from '@/lib/seo';
import { getProductCategories } from '@/lib/categories';
import HeroCarousel from '@/components/HeroCarousel';
import Image from 'next/image';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOMetadata('/');
  return {
    title: seo?.title || 'Storal.fr - Stores et Fermetures sur mesure',
    description: seo?.description || 'Créez vos stores, portes blindées et fermetures sur mesure',
    keywords: seo?.keywords,
    openGraph: {
      title: seo?.og_title || seo?.title,
      description: seo?.og_description || seo?.description,
      url: seo?.canonical_url || 'https://storal.fr/',
      images: seo?.og_image ? [{ url: seo.og_image }] : [],
    },
    robots: seo?.robots || 'index, follow',
    alternates: {
      canonical: seo?.canonical_url || 'https://storal.fr/',
    },
  };
}

export default async function HomePage() {
  // Récupérer les catégories depuis la base de données
  const categories = await getProductCategories();

  // Icônes par défaut pour chaque catégorie
  const categoryIcons: Record<string, React.JSX.Element> = {
    'store-banne': (
      <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
      </svg>
    ),
    'store-antichaleur': (
      <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    'porte-blindee': (
      <svg className="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Contenu principal */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Nos Gammes de Produits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const gradientClass = category.gradientFrom && category.gradientTo
                ? `from-${category.gradientFrom} to-${category.gradientTo}`
                : 'from-gray-100 to-gray-200';
              
              return (
                <Link key={category.id} href={`/products/${category.slug}`}>
                  <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer h-full flex flex-col overflow-hidden group">
                    {/* Header avec image ou icône */}
                    <div className={`w-full h-48 bg-gradient-to-br ${gradientClass} flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden`}>
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt={category.imageAlt || category.displayName}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        categoryIcons[category.slug] || categoryIcons['store-banne']
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.displayName}</h3>
                      <p className="text-gray-600 mb-4 flex-grow">{category.description || 'Découvrez nos produits'}</p>
                      
                      {/* Bouton */}
                      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-4 group-hover:bg-blue-700">
                        Découvrir →
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Section Info */}
        <section className="bg-blue-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pourquoi nous choisir ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">✓ Sur Mesure</h3>
              <p className="text-gray-600">Tous nos produits sont adaptés à vos dimensions exactes</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">✓ Qualité Premium</h3>
              <p className="text-gray-600">Matériaux sélectionnés et fabrication française</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">✓ Configurateur Facile</h3>
              <p className="text-gray-600">Calculez votre prix en quelques clics</p>
            </div>
          </div>
        </section>
      </main>

      {/* Contact Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Une Question ? Contactez-Nous</h2>
          <p className="text-blue-100 mb-6 text-lg">Notre équipe vous répondra dans les plus brefs délais pour répondre à vos questions ou vous aider dans votre projet.</p>
          <Link href="/contact">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              Formulaire de Contact
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
