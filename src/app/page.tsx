import Link from 'next/link';
import { getProducts } from '@/lib/database';

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* En-tête */}
      <header className="bg-blue-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Menuiserie sur Mesure</h1>
          <p className="text-blue-100 text-lg">Stores bannes, portes blindées et plus encore</p>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Nos Produits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col overflow-hidden">
                  {/* Image placeholder */}
                  <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <svg
                      className="w-24 h-24 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                    </svg>
                  </div>

                  {/* Contenu */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{product.description}</p>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <span className="text-lg font-bold text-blue-600">À partir de {product.basePrice}€</span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center">&copy; 2026 Menuiserie sur Mesure. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
