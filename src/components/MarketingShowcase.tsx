'use client';

import { STORE_MODELS } from '@/lib/catalog-data';
import Image from 'next/image';

export default function MarketingShowcase() {
  const featuredModels = Object.entries(STORE_MODELS)
    .filter(([_, model]) => model.type === 'coffre' && !model.is_promo)
    .slice(0, 3)
    .map(([id, model]) => ({
      id,
      name: model.name,
      image: model.image,
      features: model.features || []
    }));

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 text-center flex-shrink-0">
        <h2 className="text-3xl font-bold mb-2">Bienvenue chez Storal</h2>
        <p className="text-lg opacity-90">
          L'expertise en stores bannes sur mesure
        </p>
      </div>

      {/* Featured Products */}
      <div className="px-6 py-8 flex-shrink-0">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Nos Modèles Phares</h3>
        <div className="grid grid-cols-1 gap-4">
          {featuredModels.map((model) => (
            <div
              key={model.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={model.image}
                    alt={model.name}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>
                <div className="py-2 pr-4 flex-1">
                  <h4 className="font-bold text-gray-900">{model.name}</h4>
                  <ul className="text-xs text-gray-600 space-y-1 mt-1">
                    {model.features.slice(0, 2).map((f, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-blue-600 mr-1">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="px-6 py-6 border-t border-gray-200 flex-shrink-0">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Nos Avantages</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="text-2xl flex-shrink-0">⚡</div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Toiles Premium</h4>
              <p className="text-xs text-gray-600">Qualité Sattler et Serge Ferrari</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-2xl flex-shrink-0">🤖</div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Motorisation Somfy</h4>
              <p className="text-xs text-gray-600">Commande radio ou domotique</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-2xl flex-shrink-0">⏱️</div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Fabrication 24h</h4>
              <p className="text-xs text-gray-600">Livraison express en 7 jours</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-2xl flex-shrink-0">🔧</div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Pose Professionnelle</h4>
              <p className="text-xs text-gray-600">Installation garantie par experts</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-6 border-t border-gray-200 bg-blue-50 flex-1 flex items-end">
        <div className="w-full text-center">
          <p className="text-sm text-gray-700 mb-3 font-semibold">💬 Commencez votre configuration à gauche</p>
          <p className="text-xs text-gray-600">
            Parlez de vos dimensions, de votre exposition et de vos préférences.
          </p>
        </div>
      </div>
    </div>
  );
}
