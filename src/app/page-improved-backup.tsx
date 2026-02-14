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
  // Détails des options et prix
  storeHT?: number;
  ledArmsPrice?: number;
  ledBoxPrice?: number;
  lambrequinPrice?: number;
  awningPrice?: number;
  sousCoffrePrice?: number;
  poseHT?: number;
  tvaAmount?: number;
}

export default function HomePageImproved() {
  const [modelToConfig, setModelToConfig] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

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

  // Fonction pour sélectionner une offre
  const selectOffer = (priceType: 'eco' | 'standard' | 'premium') => {
    const prices = {
      eco: cart?.priceEco,
      standard: cart?.priceStandard,
      premium: cart?.pricePremium
    };
    
    const newCart = {
      ...cart,
      selectedPrice: prices[priceType],
      priceType
    } as Cart;
    
    setCart(newCart);
    console.log(`✅ Offre ${priceType.toUpperCase()} sélectionnée:`, prices[priceType]);
  };

  const selectedModelData = cart?.modelId ? Object.values(STORE_MODELS).find(m => m.id === cart.modelId) : null;
  const selectedFabricData = cart?.fabricId ? FABRICS.find(f => f.id === cart.fabricId) : null;
  const selectedColorData = cart?.colorId ? FRAME_COLORS.find(c => c.id === cart.colorId) : null;
  const isConfiguring = !!cart?.modelId;
  const showPrices = !!(cart?.priceEco && cart?.priceStandard && cart?.pricePremium);

  // Calcul du détail de prix
  const totalOptionsHT = (cart?.ledArmsPrice || 0) + (cart?.ledBoxPrice || 0) + 
                         (cart?.lambrequinPrice || 0) + (cart?.awningPrice || 0) + 
                         (cart?.sousCoffrePrice || 0);
  const subtotalHT = (cart?.storeHT || 0) + totalOptionsHT + (cart?.poseHT || 0);
  const tva = cart?.tvaAmount || (subtotalHT * 0.20);
  const totalTTC = subtotalHT + tva;

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      
      {/* COLONNE GAUCHE : CHAT ASSISTANT (25%) */}
      <div className="w-1/4 h-full border-r border-slate-200 flex flex-col bg-white">
        <div className="p-3 border-b bg-white flex justify-between items-center">
          <Link href="/">
            <Image src="/images/logo-storal.png" alt="Storal" width={100} height={35} className="h-7 w-auto" />
          </Link>
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">En ligne</span>
        </div>
        
        {/* Le Chat prend tout l'espace restant */}
        <div className="flex-1 overflow-y-auto">
          <ChatAssistant modelToConfig={modelToConfig} cart={cart} setCart={setCart} />
        </div>
      </div>

      {/* COLONNE CENTRALE : VISUEL + DÉTAILS (45%) */}
      <div className="w-[45%] h-full flex flex-col p-4 space-y-4 overflow-y-auto bg-white border-r border-slate-200">
        
        {/* VISUEL PRODUIT */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 min-h-[200px] flex flex-col items-center justify-center">
          {isConfiguring ? (
            <>
              <h3 className="text-slate-400 uppercase text-[10px] font-bold tracking-widest mb-3">Aperçu de votre configuration</h3>
              {selectedModelData?.image && (
                <div className="relative w-full max-h-48 h-48">
                  <Image 
                    src={selectedModelData.image} 
                    alt={selectedModelData.name}
                    fill
                    className="object-contain transition-all duration-500"
                  />
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {selectedFabricData && (
                  <span className="px-2 py-1 bg-white rounded-full text-[10px] font-medium border border-slate-200">
                    Toile : {selectedFabricData.name}
                  </span>
                )}
                {selectedColorData && (
                  <span className="px-2 py-1 bg-white rounded-full text-[10px] font-medium border border-slate-200">
                    Coffre : {selectedColorData.name}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <h2 className="text-xl font-serif text-slate-800">Bienvenue chez Storal</h2>
              <p className="text-slate-500 text-sm mt-2">Commencez la discussion pour configurer votre store</p>
            </div>
          )}
        </div>

        {/* FICHE TECHNIQUE */}
        {isConfiguring && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-800 text-white px-3 py-2 text-xs font-bold flex items-center gap-2">
              <span>📋</span>
              <span>FICHE TECHNIQUE</span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-y divide-slate-100">
              {cart?.width && (
                <div className="p-3">
                  <span className="block text-[10px] text-slate-400 uppercase mb-1">Largeur</span>
                  <strong className="text-lg text-slate-800">{(cart.width / 100).toFixed(2)} m</strong>
                </div>
              )}
              {cart?.projection && (
                <div className="p-3">
                  <span className="block text-[10px] text-slate-400 uppercase mb-1">Avancée</span>
                  <strong className="text-lg text-slate-800">{(cart.projection / 100).toFixed(2)} m</strong>
                </div>
              )}
              {selectedModelData && (
                <div className="p-3">
                  <span className="block text-[10px] text-slate-400 uppercase mb-1">Modèle</span>
                  <strong className="text-sm text-slate-800">{selectedModelData.name}</strong>
                </div>
              )}
              {cart?.exposure && (
                <div className="p-3">
                  <span className="block text-[10px] text-slate-400 uppercase mb-1">Exposition</span>
                  <strong className="text-sm text-slate-800 capitalize">{cart.exposure}</strong>
                </div>
              )}
              {cart?.withMotor !== undefined && (
                <div className="p-3 col-span-2">
                  <span className="block text-[10px] text-slate-400 uppercase mb-1">Motorisation</span>
                  <strong className="text-sm text-slate-800">{cart.withMotor ? '⚡ Radio Somfy' : '🔧 Manuel'}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* OPTIONS INCLUSES */}
        {isConfiguring && (cart?.ledArmsPrice || cart?.ledBoxPrice || cart?.lambrequinPrice || cart?.awningPrice || cart?.sousCoffrePrice) && (
          <div className="bg-blue-50 rounded-xl border border-blue-200 overflow-hidden">
            <div className="bg-blue-600 text-white px-3 py-2 text-xs font-bold flex items-center gap-2">
              <span>⚙️</span>
              <span>OPTIONS SÉLECTIONNÉES</span>
            </div>
            <div className="p-3 space-y-2 text-sm">
              {cart?.ledArmsPrice && cart.ledArmsPrice > 0 && (
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="text-blue-600">💡</span>
                    <span>LED Bras</span>
                  </span>
                  <span className="font-semibold text-blue-700">+{cart.ledArmsPrice}€</span>
                </div>
              )}
              {cart?.ledBoxPrice && cart.ledBoxPrice > 0 && (
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="text-blue-600">💡</span>
                    <span>LED Coffre</span>
                  </span>
                  <span className="font-semibold text-blue-700">+{cart.ledBoxPrice}€</span>
                </div>
              )}
              {cart?.lambrequinPrice && cart.lambrequinPrice > 0 && (
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="text-blue-600">📏</span>
                    <span>Lambrequin</span>
                  </span>
                  <span className="font-semibold text-blue-700">+{cart.lambrequinPrice}€</span>
                </div>
              )}
              {cart?.awningPrice && cart.awningPrice > 0 && (
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="text-blue-600">🏠</span>
                    <span>Auvent</span>
                  </span>
                  <span className="font-semibold text-blue-700">+{cart.awningPrice}€</span>
                </div>
              )}
              {cart?.sousCoffrePrice && cart.sousCoffrePrice > 0 && (
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="text-blue-600">📦</span>
                    <span>Sous-coffre</span>
                  </span>
                  <span className="font-semibold text-blue-700">+{cart.sousCoffrePrice}€</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DÉTAIL DU PRIX */}
        {showPrices && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-emerald-600 text-white px-3 py-2 text-xs font-bold flex items-center gap-2">
              <span>📊</span>
              <span>DÉTAIL DU PRIX</span>
            </div>
            <div className="p-3 space-y-2 text-sm">
              <div className="flex justify-between text-slate-700">
                <span>Store HT</span>
                <span className="font-semibold">{cart.storeHT?.toFixed(2) || '0.00'}€</span>
              </div>
              
              {totalOptionsHT > 0 && (
                <>
                  <div className="flex justify-between text-slate-600 text-xs pl-4">
                    <span>Options</span>
                    <span className="font-semibold">{totalOptionsHT.toFixed(2)}€</span>
                  </div>
                </>
              )}
              
              {cart?.poseHT && cart.poseHT > 0 && (
                <div className="flex justify-between text-slate-700">
                  <span>Pose professionnelle</span>
                  <span className="font-semibold">{cart.poseHT.toFixed(2)}€</span>
                </div>
              )}
              
              <div className="border-t border-slate-200 pt-2 flex justify-between text-slate-700">
                <span>Sous-total HT</span>
                <span className="font-semibold">{subtotalHT.toFixed(2)}€</span>
              </div>
              
              <div className="flex justify-between text-slate-600">
                <span>TVA (20%)</span>
                <span className="font-semibold">{tva.toFixed(2)}€</span>
              </div>
              
              <div className="border-t-2 border-emerald-600 pt-2 flex justify-between text-emerald-700">
                <span className="font-bold text-base">TOTAL TTC</span>
                <span className="font-bold text-lg">{totalTTC.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* COLONNE DROITE : PRIX & ACTIONS (30%) */}
      <div className="w-[30%] h-full flex flex-col p-4 space-y-4 overflow-y-auto">
        
        {!showPrices ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Configurez votre store</h3>
              <p className="text-sm text-slate-500">
                Discutez avec notre assistant pour obtenir votre devis personnalisé
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* TITRE SECTION */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl text-center">
              <h3 className="text-sm font-bold uppercase tracking-wide">💰 Choisissez votre offre</h3>
            </div>

            {/* LES 3 OFFRES - Format carte enrichie */}
            <div className="space-y-3 flex-1">
              {/* OFFRE ECO */}
              <div 
                onClick={() => selectOffer('eco')}
                className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  cart?.priceType === 'eco' 
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg' 
                    : 'border-slate-200 bg-white hover:border-emerald-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-600 uppercase">💚 Offre Eco</span>
                  {cart?.priceType === 'eco' && (
                    <span className="text-emerald-600">✓</span>
                  )}
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-3">{cart.priceEco}€ TTC</div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span>Toile standard</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span>Pose incluse</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span>Garantie 2 ans</span>
                  </div>
                </div>
              </div>

              {/* OFFRE STANDARD */}
              <div 
                onClick={() => selectOffer('standard')}
                className={`rounded-xl border-2 p-4 cursor-pointer relative transition-all ${
                  cart?.priceType === 'standard' 
                    ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-105' 
                    : 'border-blue-400 bg-blue-50 hover:shadow-md hover:scale-102'
                }`}
              >
                <span className="absolute -top-2 right-2 bg-orange-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                  ⭐ TOP VENTE
                </span>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase ${cart?.priceType === 'standard' ? 'text-white' : 'text-blue-700'}`}>
                    💙 Standard
                  </span>
                  {cart?.priceType === 'standard' && (
                    <span className="text-white">✓</span>
                  )}
                </div>
                <div className={`text-2xl font-bold mb-3 ${cart?.priceType === 'standard' ? 'text-white' : 'text-slate-800'}`}>
                  {cart.priceStandard}€ TTC
                </div>
                <div className={`space-y-1 text-xs ${cart?.priceType === 'standard' ? 'text-blue-50' : 'text-slate-600'}`}>
                  <div className="flex items-start gap-2">
                    <span className={cart?.priceType === 'standard' ? 'text-white' : 'text-blue-600'}>✓</span>
                    <span>Toile Dickson Premium</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className={cart?.priceType === 'standard' ? 'text-white' : 'text-blue-600'}>✓</span>
                    <span>LED bras inclus</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className={cart?.priceType === 'standard' ? 'text-white' : 'text-blue-600'}>✓</span>
                    <span>Garantie 5 ans</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className={cart?.priceType === 'standard' ? 'text-white' : 'text-blue-600'}>✓</span>
                    <span>Pose pro sous 7j</span>
                  </div>
                </div>
              </div>

              {/* OFFRE PREMIUM */}
              <div 
                onClick={() => selectOffer('premium')}
                className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  cart?.priceType === 'premium' 
                    ? 'border-amber-500 bg-amber-50 shadow-lg' 
                    : 'border-slate-200 bg-white hover:border-amber-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-600 uppercase">⭐ Premium</span>
                  {cart?.priceType === 'premium' && (
                    <span className="text-amber-600">✓</span>
                  )}
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-3">{cart.pricePremium}€ TTC</div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">✓</span>
                    <span>Toile haut de gamme</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">✓</span>
                    <span>Toutes options incluses</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">✓</span>
                    <span>Garantie 10 ans</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">✓</span>
                    <span>Service prioritaire</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MESSAGE D'INSTRUCTION SI AUCUNE OFFRE */}
            {!cart?.selectedPrice && (
              <div className="text-center py-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 font-medium">
                  👆 Cliquez sur une offre pour continuer
                </p>
              </div>
            )}

            {/* BOUTONS D'ACTION */}
            {cart?.selectedPrice && (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    localStorage.setItem('storal-cart', JSON.stringify(cart));
                    setAddedToCart(true);
                    console.log('🛒 Article ajouté au panier:', cart);
                    setTimeout(() => setAddedToCart(false), 3000);
                  }}
                  className={`block w-full text-center py-3 text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    addedToCart 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  }`}
                >
                  {addedToCart ? '✅ AJOUTÉ' : '🛒 AJOUTER AU PANIER'}
                </button>

                <Link 
                  href="/order-summary" 
                  className="block w-full text-center py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-base font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  🚀 FINALISER MA COMMANDE
                </Link>

                {/* Engagements */}
                <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-sm">✓</span>
                    <span>Fabrication 24h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-sm">✓</span>
                    <span>Livraison sous 7j</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-sm">✓</span>
                    <span>Pose professionnelle</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
