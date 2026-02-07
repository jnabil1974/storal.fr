import Link from 'next/link';
import Image from 'next/image';
import { getSubcategoriesByCategorySlug, getProductCategoryBySlug } from '@/lib/categories';

// Regenerate page every 60 seconds for fresh subcategory images
export const revalidate = 60;

export default async function StoreAntichaleurPage() {
  const subcategories = await getSubcategoriesByCategorySlug('store-antichaleur');
  const category = await getProductCategoryBySlug('store-antichaleur');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-rose-800 to-red-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/" className="text-rose-100 hover:text-white mb-4 inline-block transition">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-5xl font-bold uppercase tracking-wider mb-4">
            {category?.displayName || 'Stores Anti-Chaleur'}
          </h1>
          <p className="text-xl text-rose-100 max-w-3xl">
            {category?.description || 'Solutions thermiques pour fenêtres et vérandas. Réduction efficace de la température intérieure.'}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Grille des sous-catégories */}
        {subcategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subcategories.map((sub) => (
              <Link key={sub.id} href={`/products/store-antichaleur/${sub.slug}`}>
                <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden border border-slate-100">
                  <div className="w-full h-56 bg-gradient-to-br from-rose-50 to-red-50 flex items-center justify-center overflow-hidden relative">
                    {sub.imageUrl ? (
                      <Image
                        src={sub.imageUrl}
                        alt={sub.imageAlt || sub.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <svg className="w-24 h-24 text-rose-400 group-hover:text-rose-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="inline-block w-fit bg-rose-800 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      Été ☀️
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-rose-800 transition">
                      {sub.name}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 flex-grow leading-relaxed">
                      {sub.description || 'Découvrez nos stores anti-chaleur pour réguler la température.'}
                    </p>
                    <button className="w-full bg-rose-800 text-white py-3 rounded-lg font-semibold hover:bg-rose-900 transition-colors mt-auto">
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
