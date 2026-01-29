import { Metadata } from 'next';
import KissimyConfigurator from '@/components/KissimyConfigurator';

export const metadata: Metadata = {
  title: 'Store Banne KISSIMY - Configurateur de Prix | Storal.fr',
  description: 'Configurez votre store banne KISSIMY et obtenez un prix instantané selon vos dimensions.',
};

export default function KissimyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête */}
        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center mb-12">
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Store banne premium
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">
              Store Banne KISSIMY
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Coffre intégral, protection optimale et design élégant. Configurez vos dimensions et options pour obtenir un prix instantané.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded-full bg-white border border-gray-200 text-sm text-gray-700">Garantie jusqu’à 12 ans</span>
              <span className="px-3 py-1 rounded-full bg-white border border-gray-200 text-sm text-gray-700">Classe de vent 2</span>
              <span className="px-3 py-1 rounded-full bg-white border border-gray-200 text-sm text-gray-700">Fabrication française</span>
            </div>
            <div className="mt-8">
              <a
                href="#configurateur"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-700 transition"
              >
                Configurer mon store
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Points clés</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <span className="mt-0.5">✅</span>
                Coffre intégral pour une protection totale de la toile
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5">✅</span>
                Largeur disponible : 1835 à 4830 mm
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5">✅</span>
                Options Somfy IO et télécommandes haut de gamme
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5">✅</span>
                Toile Dickson premium avec choix de couleurs
              </li>
            </ul>
          </div>
        </div>

        {/* Configurateur */}
        <div id="configurateur" className="scroll-mt-24">
          <KissimyConfigurator />
        </div>

        {/* Caractéristiques produit */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Caractéristiques
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg mb-2">🏆 Garantie</h3>
              <p className="text-gray-600">Jusqu'à 12 ans selon composants</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg mb-2">💨 Résistance</h3>
              <p className="text-gray-600">Classe de vent 2 (Beaufort)</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg mb-2">📏 Dimensions</h3>
              <p className="text-gray-600">Largeur : 1835 à 4830 mm</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg mb-2">🇫🇷 Fabrication</h3>
              <p className="text-gray-600">Française - Qualité Premium</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
