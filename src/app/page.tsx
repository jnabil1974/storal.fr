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
  console.log('📂 HomePage: fetched categories count =', categories.length);
  if (categories.length === 0) console.warn('⚠️  Categories are empty!');

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Section Avantages - 4 Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 border border-gray-100 rounded-xl hover:shadow-lg transition">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Sur-Mesure</h3>
              <p className="text-gray-600 text-sm">Adaptés à vos dimensions exactes avec une précision millimétrique</p>
            </div>
            <div className="text-center p-6 border border-gray-100 rounded-xl hover:shadow-lg transition">
              <div className="text-5xl mb-4">🇫🇷</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Qualité Premium</h3>
              <p className="text-gray-600 text-sm">Matériaux sélectionnés et fabrication française certifiée</p>
            </div>
            <div className="text-center p-6 border border-gray-100 rounded-xl hover:shadow-lg transition">
              <div className="text-5xl mb-4">⏱️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Livraison Rapide</h3>
              <p className="text-gray-600 text-sm">Fabrication express et livraison dans les meilleurs délais</p>
            </div>
            <div className="text-center p-6 border border-gray-100 rounded-xl hover:shadow-lg transition">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Prix Transparent</h3>
              <p className="text-gray-600 text-sm">Calculez votre devis en ligne en quelques clics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* SECTION PRODUITS TEMPORAIREMENT DÉSACTIVÉE - En attente de la nouvelle base de données */}
        {/* <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Gammes de Produits</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Découvrez nos solutions sur-mesure pour transformer votre habitat</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const gradientClass = category.gradientFrom && category.gradientTo
                ? `from-${category.gradientFrom} to-${category.gradientTo}`
                : 'from-gray-100 to-gray-200';
              
              return (
                <Link key={category.id} href={`/products/${category.slug}`}>
                  <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer h-full flex flex-col overflow-hidden group">
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

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.displayName}</h3>
                      <p className="text-gray-600 mb-4 flex-grow">{category.description || 'Découvrez nos produits'}</p>
                      
                      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-4 group-hover:bg-blue-700">
                        Découvrir →
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section> */}

        {/* Section Confiance / Testimonial */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-12 mb-16 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">L'Excellence du Sur-Mesure, La Sérénité en Plus</h2>
            <p className="text-xl text-gray-300 mb-8">
              Transformez votre extérieur et sécurisez votre intérieur avec des équipements certifiés et garantis. Fabrication française, service client dédié.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <span className="px-6 py-3 bg-white/10 rounded-lg backdrop-blur-sm font-semibold">✓ Certification CE</span>
              <span className="px-6 py-3 bg-white/10 rounded-lg backdrop-blur-sm font-semibold">✓ Garantie Étendue</span>
              <span className="px-6 py-3 bg-white/10 rounded-lg backdrop-blur-sm font-semibold">✓ SAV Réactif</span>
            </div>
          </div>
        </section>
      </main>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white text-center shadow-xl">
          <h2 className="text-4xl font-bold mb-4">Une Question ? Besoin d'un Conseil ?</h2>
          <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">Notre équipe d'experts vous accompagne dans votre projet. Devis gratuit et sans engagement.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg">
                Demander un Devis
              </button>
            </Link>
            <a href="tel:+33185093446" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition">
              Appeler le 01 85 09 34 46
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
