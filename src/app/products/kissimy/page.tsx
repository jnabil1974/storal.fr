import Link from 'next/link';
import { StoreBanneKissimyConfigurator } from '@/components/StoreBanneKissimyConfigurator';
import { createClient } from '@supabase/supabase-js';

async function getKissimyProduct() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('name', 'Store Banne Coffre KISSIMY')
      .single();

    if (error) {
      return { product: null, error: error.message };
    }

    return { product: data, error: null };
  } catch (err) {
    return { product: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export default async function KissimyProductPage() {
  const { product, error } = await getKissimyProduct();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
            ← Retour
          </Link>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-red-900 mb-2">Erreur</h2>
            <p className="text-red-800">{error}</p>
            {error.includes('non trouvé') && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  Le produit KISSIMY doit être créé dans Supabase. Exécutez:
                </p>
                <code className="block mt-2 text-xs bg-gray-900 text-green-400 p-2 rounded overflow-auto">
                  node scripts/seed-kissimyProduct.mjs
                </code>
              </div>
            )}
          </div>
        ) : null}

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Colonne gauche: Description */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product?.name || 'Store Banne Coffre KISSIMY'}
              </h1>
              <p className="text-gray-600 text-lg">
                {product?.description || 'Configurez votre store banne coffre KISSIMY'}
              </p>
            </div>

            {/* Badge produit */}
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Store Banne Coffre
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Motorisation Incluse
              </span>
              <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Configuration Flexible
              </span>
            </div>

            {/* Infos: Garantie, Délai, etc. */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="text-xs text-blue-600 font-semibold uppercase">Garantie</p>
                <p className="text-lg font-bold text-blue-900">5 ans</p>
              </div>
              <div>
                <p className="text-xs text-blue-600 font-semibold uppercase">Délai Fabrication</p>
                <p className="text-lg font-bold text-blue-900">4-6 semaines</p>
              </div>
              <div>
                <p className="text-xs text-blue-600 font-semibold uppercase">Livraison</p>
                <p className="text-lg font-bold text-blue-900">Gratuite</p>
              </div>
              <div>
                <p className="text-xs text-blue-600 font-semibold uppercase">Montage</p>
                <p className="text-lg font-bold text-blue-900">Sur RDV</p>
              </div>
            </div>

            {/* Caractéristiques principales */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Caractéristiques</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-3 text-green-600 font-bold">✓</span>
                  <span>
                    <strong>Motorisation:</strong> SUNEA IO + Situo IO 1 incluses
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-green-600 font-bold">✓</span>
                  <span>
                    <strong>Dimensions:</strong> Avancée 1500-3000mm, Largeur 1800-4830mm
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-green-600 font-bold">✓</span>
                  <span>
                    <strong>Couleur Cadre:</strong> 3 RAL inclus + couleur personnalisée disponible
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-green-600 font-bold">✓</span>
                  <span>
                    <strong>Accessoires:</strong> 4 options montage et contrôle
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-green-600 font-bold">✓</span>
                  <span>
                    <strong>Toiles:</strong> Orchestra Dickson 290g + 90+ variantes à la commande
                  </span>
                </li>
              </ul>
            </div>

            {/* Description détaillée */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 uppercase">À propos du KISSIMY</h3>
              <p className="text-sm text-gray-700">
                Le Store Banne Coffre KISSIMY est la solution premium pour ombrage et protection solaire. 
                Conçu pour la durabilité et la flexibilité, il s'adapte à tous les besoins résidentiels et commerciaux.
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Coffre aluminium pour protection complète du mécanisme</li>
                <li>• Motorisation silencieuse et réactive SUNEA IO</li>
                <li>• Toile haute performance Orchestra Dickson 290g</li>
                <li>• Sécurité vent intégrée optionnelle</li>
              </ul>
            </div>
          </div>

          {/* Colonne droite: Configurateur */}
          {product && (
            <div>
              <StoreBanneKissimyConfigurator
                productId={product.id}
                productName={product.name}
                coefficient={2.0}
              />
            </div>
          )}
        </div>

        {/* Section Galerie Images */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Photos du Produit</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <p className="text-gray-500 font-medium">Image principale</p>
                <p className="text-sm text-gray-400">Store Banne Coffre KISSIMY</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <p className="text-gray-500 font-medium">Vue détail motorisation</p>
                <p className="text-sm text-gray-400">SUNEA IO + Situo IO 1</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <p className="text-gray-500 font-medium">Installation exemple</p>
                <p className="text-sm text-gray-400">Pose sous plafond/mur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Options détaillées */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Options Disponibles</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Motorisation */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                Motorisation (incluse)
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>SUNEA IO</strong> motorisation intelligente
                </li>
                <li>
                  <strong>Situo IO 1</strong> télécommande intégrée
                </li>
              </ul>
            </div>

            {/* Couleur cadre */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                Couleur du cadre
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>RAL 9010 (Blanc)</strong> — inclus
                </li>
                <li>
                  <strong>RAL 1015 (Beige)</strong> — inclus
                </li>
                <li>
                  <strong>RAL 7016 (Gris Anthracite)</strong> — inclus
                </li>
                <li>
                  <strong>Autre couleur RAL</strong> — +86€
                </li>
              </ul>
            </div>

            {/* Accessoires */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                Accessoires (optionnels)
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Pose sous plafond</strong> +39€
                </li>
                <li>
                  <strong>Capteur vent</strong> +90€
                </li>
                <li>
                  <strong>TAHOMA</strong> +117€
                </li>
                <li>
                  <strong>Câblage 10m</strong> +48€
                </li>
              </ul>
            </div>

            {/* Toile */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="inline-block w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
                Toile (incluse)
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Orchestra Dickson 290g</strong>
                </li>
                <li className="text-xs text-gray-600">
                  Plus de 90 toiles disponibles à la commande
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
