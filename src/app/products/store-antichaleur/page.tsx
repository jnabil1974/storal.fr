import Link from 'next/link';
import { getProducts } from '@/lib/database';
import { ProductType } from '@/types/products';

export default async function StoreAntichaleurPage() {
  const allProducts = await getProducts();
  const products = allProducts.filter(p => p.type === ProductType.STORE_ANTICHALEUR);

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

        {/* Grille de produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col overflow-hidden">
                {/* Image placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                  <svg className="w-20 h-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>

                {/* Contenu */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <span className="text-lg font-bold text-blue-600">À partir de {product.basePrice}€</span>
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
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
