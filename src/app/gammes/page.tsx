import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { STORE_MODELS, getMinimumPrice, getModelDimensions, getModelSlug } from '@/lib/catalog-data';
import { CheckCircle2, Zap, Shield, Sparkles, Wrench, Home, Palette } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nos Gammes de Stores Bannes | Toutes les Collections Storal',
  description: 'Découvrez toutes nos gammes de stores bannes : Compact, Armor, Excellence, Kube, Classique. Comparatif complet des dimensions, options LED et prix.',
  keywords: ['gammes stores bannes', 'collections stores', 'comparatif stores', 'stores compacts', 'stores coffre intégral', 'stores monobloc'],
  openGraph: {
    title: 'Nos Gammes de Stores Bannes | Storal',
    description: 'Découvrez toutes nos gammes : Compact, Armor, Excellence, Kube, Classique. Comparatif complet.',
    type: 'website',
  },
};

// Définition des gammes avec leurs caractéristiques
const GAMMES = {
  GAMME_COMPACT: {
    name: 'Gamme COMPACT',
    subtitle: 'Solution économique avec coffre de protection',
    description: 'Stores avec coffre semi-intégral offrant une excellente protection de la toile à prix abordable.',
    icon: Home,
    color: 'from-blue-500 to-blue-600',
    features: [
      'Coffre semi-intégral pour protection de la toile',
      'Excellent rapport qualité-prix',
      'Installation facile',
      'Mécanisme fiable éprouvé',
      'Garantie constructeur 5 ans',
    ],
    models: ['kissimy_promo', 'kitanguy'],
  },
  GAMME_ARMOR: {
    name: 'Gamme ARMOR',
    subtitle: 'Résistance renforcée pour grandes dimensions',
    description: 'Conception robuste avec bras renforcés, idéale pour les larges terrasses et zones ventées.',
    icon: Shield,
    color: 'from-slate-600 to-slate-700',
    features: [
      'Bras renforcés ultra-résistants',
      'Spécialement conçu pour grandes largeurs (jusqu\'à 7m)',
      'Toile anti-graffiti en option',
      'Résistance au vent optimale (classe 3)',
      'LED intégrable dans coffre et bras',
    ],
    models: ['dynasta', 'belharra'],
  },
  GAMME_EXCELLENCE: {
    name: 'Gamme EXCELLENCE',
    subtitle: 'Coffre intégral haut de gamme',
    description: 'Le summum de l\'élégance avec coffre intégral pour une protection maximale et un design épuré.',
    icon: Sparkles,
    color: 'from-purple-500 to-purple-700',
    features: [
      'Coffre intégral pour protection totale',
      'Design épuré et moderne',
      'Finitions premium',
      'LED intégrable dans bras et coffre',
      'Garantie étendue 7 ans',
      'Motorisation Somfy IO premium incluse',
    ],
    models: ['kitanguy_2', 'belharra_2'],
  },
  GAMME_KUBE: {
    name: 'Gamme KUBE',
    subtitle: 'Design contemporain ultra-compact',
    description: 'Coffre intégral compact au design moderne, parfait pour les façades contemporaines.',
    icon: Palette,
    color: 'from-amber-500 to-orange-600',
    features: [
      'Coffre intégral ultra-compact',
      'Design contemporain minimaliste',
      'Idéal façades modernes',
      'LED intégrable',
      'Finitions RAL personnalisables',
    ],
    models: ['heliom', 'heliom_plus'],
  },
  GAMME_CLASSIQUE: {
    name: 'Gamme CLASSIQUE',
    subtitle: 'Stores monobloc traditionnels',
    description: 'Stores bannes sans coffre, solution économique pour installations abritées.',
    icon: Home,
    color: 'from-green-600 to-green-700',
    features: [
      'Store monobloc sans coffre',
      'Prix ultra-compétitif',
      'Idéal pour installations sous avancée de toit',
      'Mécanisme simplifié et fiable',
      'Large choix de toiles',
    ],
    models: ['antibes', 'madrid'],
  },
  GAMME_KARE_COMPACT: {
    name: 'Gamme KARÉ COMPACT',
    subtitle: 'Design polyvalent et compact',
    description: 'Le coffre carré compact, solution polyvalente avec options lambrequin enroulable.',
    icon: Wrench,
    color: 'from-teal-500 to-teal-600',
    features: [
      'Coffre carré design',
      'Lambrequin enroulable optionnel',
      'Éclairage LED bras',
      'Jusqu\'à 6m de large',
      'Installation polyvalente',
    ],
    models: ['kalyo'],
  },
  GAMME_SPECIAL: {
    name: 'Stores Spéciaux',
    subtitle: 'Solutions techniques spécifiques',
    description: 'Stores avec bras croisés pour configurations particulières.',
    icon: Zap,
    color: 'from-red-500 to-red-600',
    features: [
      'Bras croisés pour espaces réduits',
      'Configuration verticale possible',
      'Idéal balcons et petites terrasses',
      'Encombrement minimal',
      'Sur-mesure uniquement',
    ],
    models: ['bras_croises'],
  },
  GAMME_TRADITION: {
    name: 'Gamme TRADITION',
    subtitle: 'Store banne à l\'italienne',
    description: 'Store traditionnel avec lambrequin droit, charme authentique.',
    icon: Home,
    color: 'from-indigo-500 to-indigo-600',
    features: [
      'Design traditionnel à l\'italienne',
      'Lambrequin droit intégré',
      'Charme authentique',
      'Idéal façades classiques',
      'Mécanisme robuste',
    ],
    models: ['genes'],
  },
};

export default function GammesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold mb-6">
              Nos Gammes de Stores Bannes Sur-Mesure
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              8 gammes complètes pour répondre à tous vos besoins : du store économique 
              au coffre intégral haut de gamme, en passant par les solutions techniques spéciales.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/assistant"
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                Configurer mon store
              </Link>
              <Link
                href="/contact"
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-600 transition-all border-2 border-white"
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation rapide entre gammes */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3">
            <span className="text-sm font-bold text-gray-500 whitespace-nowrap mr-2">Accès rapide :</span>
            {Object.entries(GAMMES).map(([key, gamme]) => (
              <a
                key={key}
                href={`#${key}`}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg transition-colors whitespace-nowrap text-sm font-semibold"
              >
                {gamme.name.replace('Gamme ', '')}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Gammes Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {Object.entries(GAMMES).map(([key, gamme]) => {
          const Icon = gamme.icon;
          const models = gamme.models.map(id => ({
            id,
            model: STORE_MODELS[id as keyof typeof STORE_MODELS],
          }));

          return (
            <section key={key} id={key} className="scroll-mt-20">
              {/* Bannière Gamme */}
              <div className={`bg-gradient-to-r ${gamme.color} text-white rounded-2xl p-8 mb-8 shadow-2xl`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Icon className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold">{gamme.name}</h2>
                    <p className="text-xl text-white/90 mt-1">{gamme.subtitle}</p>
                  </div>
                </div>
                <p className="text-lg text-white/95 leading-relaxed">{gamme.description}</p>
              </div>

              {/* Points Forts */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  Points Forts de la Gamme
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {gamme.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tableau Comparatif des Modèles */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800">
                    Comparatif des Modèles {gamme.name}
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Modèle</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Largeur Max</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Avancée Max</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">LED Coffre</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">LED Bras</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Prix à partir</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {models.map(({ id, model }) => {
                        const dimensions = getModelDimensions(model);
                        const minPrice = getMinimumPrice(model);
                        const hasLedBox = model.compatibility?.led_box || false;
                        const hasLedArms = model.compatibility?.led_arms || false;

                        return (
                          <tr key={id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {model.image && (
                                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                      src={model.image}
                                      alt={model.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-gray-900">{model.name}</div>
                                  <div className="text-sm text-gray-500">{model.marketingRange || 'Store banne'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              <span className="font-semibold">{dimensions.maxWidth / 1000}m</span>
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              <span className="font-semibold">{dimensions.maxProjection / 1000}m</span>
                            </td>
                            <td className="px-6 py-4">
                              {hasLedBox ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {hasLedArms ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-blue-600 text-lg">
                                {minPrice}€ <span className="text-sm text-gray-500">TTC</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link
                                href={`/produits/${getModelSlug(model)}`}
                                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                Voir le produit
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Besoin d'aide pour choisir ?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Notre assistant intelligent vous guide vers le store parfait pour votre projet en 2 minutes.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/assistant"
              className="bg-white text-blue-700 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all transform hover:scale-105"
            >
              Lancer l'assistant
            </Link>
            <Link
              href="/contact"
              className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-400 transition-all border-2 border-white"
            >
              Parler à un conseiller
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
