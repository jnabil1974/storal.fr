import { Metadata } from 'next';
import KissimyConfigurator from '@/components/KissimyConfigurator';

export const metadata: Metadata = {
  title: 'Store Banne KISSIMY - Configurateur de Prix | Storal.fr',
  description: 'Configurez votre store banne KISSIMY et obtenez un prix instantané selon vos dimensions.',
};

export default function KissimyPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Store Banne KISSIMY
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Store banne à coffre intégral, protection optimale et design élégant.
            Configurez vos dimensions pour obtenir votre prix instantanément.
          </p>
        </div>

        {/* Configurateur */}
        <KissimyConfigurator />

        {/* Caractéristiques produit */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Caractéristiques
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">🏆 Garantie</h3>
              <p className="text-gray-600">Jusqu'à 12 ans selon composants</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">💨 Résistance</h3>
              <p className="text-gray-600">Classe de vent 2 (Beaufort)</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">📏 Dimensions</h3>
              <p className="text-gray-600">Largeur : 1835 à 4830 mm</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">🇫🇷 Fabrication</h3>
              <p className="text-gray-600">Française - Qualité Premium</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
