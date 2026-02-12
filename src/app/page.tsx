'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ChatAssistant from '@/components/ChatAssistant';
import Image from 'next/image';
import { STORE_MODELS, FRAME_COLORS, FABRICS } from '@/lib/catalog-data';

// --- Types ---
interface Cart {
  modelId: string | null;
  modelName?: string;
  colorId: string | null;
  fabricId: string | null;
  width?: number | null;
  projection?: number | null;
  exposure?: string | null;
  withMotor?: boolean;
  priceEco?: number;
  priceStandard?: number;
  pricePremium?: number;
  selectedPrice?: number;
  priceType?: string;
}

/**
 * Génère les modèles mis en avant pour la page d'accueil
 * Basé sur les vraies données du catalogue (STORE_MODELS)
 */
function getFeaturedModels() {
  const featuredList: Array<{
    id: string;
    name: string;
    image: string;
    features: string[];
  }> = [];

  // Sélectionner les 3 premiers modèles "coffre" du catalogue
  const coffreModels = Object.entries(STORE_MODELS)
    .filter(([_, model]) => model.type === 'coffre' && !model.is_promo)
    .slice(0, 3)
    .map(([id, model]) => ({
      id,
      name: model.name,
      image: model.image,
      features: model.features || []
    }));

  return coffreModels.length > 0
    ? coffreModels
    : [
        // Fallback si pas assez de modèles coffre
        ...Object.entries(STORE_MODELS)
          .slice(0, 3)
          .map(([id, model]) => ({
            id,
            name: model.name,
            image: model.image,
            features: model.features || []
          }))
      ];
}

const ServiceCommitment = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 text-blue-600 w-8 h-8">{icon}</div>
    <div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  </div>
);

export default function HomePage() {
  const [modelToConfig, setModelToConfig] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [featuredModels] = useState(() => getFeaturedModels());

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('storal-cart');
      if (savedCart) {
        console.log('📦 Chargement du panier:', savedCart);
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("❌ Erreur chargement panier", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart) {
      localStorage.setItem('storal-cart', JSON.stringify(cart));
      console.log('💾 Panier sauvegardé:', cart);
    }
  }, [cart]);

  const handleConfigureClick = (modelName: string) => {
    setModelToConfig(modelName);
    document.getElementById('configurateur')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectedModelData = cart?.modelId ? Object.values(STORE_MODELS).find(m => m.id === cart.modelId) : null;

  return (
    <>
      <main>
        <section className="text-center pt-12 pb-8 bg-white">
          <div className="max-w-4xl mx-auto px-4"><h1 className="text-4xl md:text-5xl font-bold text-gray-900">Expert en protection solaire</h1><p className="mt-4 text-lg text-gray-600">Configurez votre store banne sur-mesure avec notre assistant intelligent.</p></div>
        </section>

        <section id="configurateur" className="w-full bg-slate-50 border-y border-slate-200 py-12 md:py-16">
          <div className="max-w-[1700px] mx-auto w-[95%] flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-[80%]">
              <div className="h-[750px] bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col">
                <ChatAssistant modelToConfig={modelToConfig} cart={cart} setCart={setCart} />
              </div>
            </div>
            <aside className="w-full lg:w-[20%]">
              <div className="bg-white p-6 rounded-xl border-2 border-gray-300 shadow-lg h-full flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b-2 border-orange-500 pb-3">
                  {cart?.modelId ? '📋 Votre Configuration' : '💡 Nos Engagements'}
                </h2>
                
                {cart?.modelId ? (
                  <div className="space-y-6 flex-1">
                    {/* Modèle */}
                    {selectedModelData && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="text-xs font-semibold text-gray-600 uppercase mb-1">Modèle</h3>
                        <p className="text-xl font-bold text-gray-900">{selectedModelData.name}</p>
                      </div>
                    )}
                    
                    {/* Dimensions */}
                    {cart?.width && cart?.projection && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="text-xs font-semibold text-gray-600 uppercase mb-1">Dimensions</h3>
                        <p className="text-lg font-bold text-gray-900">
                          {(cart.width / 100).toFixed(2)}m × {(cart.projection / 100).toFixed(2)}m
                        </p>
                      </div>
                    )}
                    
                    {/* Coloris Armature */}
                    {cart?.colorId && (
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h3 className="text-xs font-semibold text-gray-600 uppercase mb-1">Coloris Armature</h3>
                        <p className="text-lg font-bold text-gray-900">
                          {FRAME_COLORS.find(c => c.id === cart.colorId)?.name || cart.colorId}
                        </p>
                      </div>
                    )}
                    
                    {/* Toile */}
                    {cart?.fabricId && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h3 className="text-xs font-semibold text-gray-600 uppercase mb-1">Toile Sélectionnée</h3>
                        <p className="text-lg font-bold text-gray-900">
                          {FABRICS.find(f => f.id === cart.fabricId)?.name || cart.fabricId}
                        </p>
                      </div>
                    )}
                    
                    {/* Exposition */}
                    {cart?.exposure && (
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <h3 className="text-xs font-semibold text-gray-600 uppercase mb-1">Exposition</h3>
                        <p className="text-lg font-bold text-gray-900 capitalize">{cart.exposure}</p>
                      </div>
                    )}
                    
                    {/* Motorisation */}
                    {cart?.withMotor !== undefined && (
                      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                        <h3 className="text-xs font-semibold text-gray-600 uppercase mb-1">Motorisation</h3>
                        <p className="text-lg font-bold text-gray-900">
                          {cart.withMotor ? '⚡ Radio Somfy' : '🔧 Manuel'}
                        </p>
                      </div>
                    )}
                    
                    {/* Prix */}
                    {cart?.selectedPrice && (
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="text-xs font-semibold text-gray-600 uppercase mb-1">Prix sélectionné</h3>
                        <p className="text-2xl font-bold text-purple-700">
                          {cart.selectedPrice}€
                        </p>
                        <p className="text-sm text-gray-600 mt-1 capitalize">
                          Formule {cart.priceType || 'standard'}
                        </p>
                      </div>
                    )}
                    
                    {/* Engagements */}
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span className="text-gray-700">Fabrication 24h</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span className="text-gray-700">Livraison sous 7j</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span className="text-gray-700">Pose professionnelle</span>
                      </div>
                    </div>
                    
                    {/* Bouton ORANGE */}
                    <div className="mt-auto pt-6">
                      <Link href="/checkout" className="block w-full text-center py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105">
                        🚀 FINALISER MA COMMANDE
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <ServiceCommitment icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>} title="Fabrication 24h">Votre store fabriqué et expédié en 24 heures.</ServiceCommitment>
                    <ServiceCommitment icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>} title="Livraison sous 7 jours">Recevez votre commande rapidement chez vous.</ServiceCommitment>
                    <ServiceCommitment icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>} title="Service de Pose">Nos experts s'occupent de l'installation.</ServiceCommitment>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>
        
        <section className="pt-4 pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900">Découvrez notre collection de stores bannes</h2>
            <p className="mt-4 text-lg text-gray-600">Des solutions pour chaque besoin, alliant design et performance.</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredModels.map((model) => (
                <div key={model.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                  <div className="relative w-full h-64"><Image src={model.image} alt={`Store banne ${model.name}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /></div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-2xl font-bold">{model.name}</h3>
                    <ul className="mt-4 text-gray-600 space-y-2 text-left flex-1">{model.features.map((feature, i) => (<li key={i} className="flex items-start"><span className="text-blue-600 mr-2">✓</span><span>{feature}</span></li>))}</ul>
                    <button onClick={() => handleConfigureClick(model.name)} className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">Configurer ce modèle</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
