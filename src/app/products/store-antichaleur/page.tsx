import Link from 'next/link';
import Image from 'next/image';
import { getSubcategoriesByCategorySlug } from '@/lib/categories';

export default async function StoreAntichaleurPage() {
  const subcategories = await getSubcategoriesByCategorySlug('store-antichaleur');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Stores Anti-Chaleur</h1>
          <p className="text-gray-600 text-lg">
            Solutions thermiques pour fenêtres et vérandas. Réduction efficace de la température intérieure.
          </p>
        </div>

        {/* Grille des sous-catégories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subcategories.map((sub) => (
            <Link key={sub.id} href={`/products/store-antichaleur/${sub.slug}`}>
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center overflow-hidden">
                  {sub.imageUrl ? (
                    <Image src={sub.imageUrl} alt={sub.imageAlt || sub.displayName} width={400} height={300} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-20 h-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{sub.displayName}</h3>
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
