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

export default function HomePage() {
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

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      
      {/* COLONNE GAUCHE : L'EXPERTISE (50%) */}
      <div className="w-1/2 h-full border-r border-slate-200 flex flex-col bg-white">
        <div className="p-4 border-b bg-white flex justify-between items-center">
          <Link href="/">
            <Image src="/images/logo-storal.png" alt="Storal" width={120} height={40} className="h-8 w-auto" />
          </Link>
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Expert en ligne</span>
        </div>
        
        {/* Le Chat prend tout l'espace restant */}
        <div className="flex-1 overflow-y-auto">
          <ChatAssistant modelToConfig={modelToConfig} cart={cart} setCart={setCart} />
        </div>
      </div>

      {/* COLONNE DROITE : LE DASHBOARD PROJET (50%) */}
      <div className="w-1/2 h-full flex flex-col p-6 space-y-6 overflow-y-auto">
        
        {/* 1. VISUEL PRODUIT */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 min-h-[300px] flex flex-col items-center justify-center">
          {isConfiguring ? (
            <>
              <h3 className="text-slate-400 uppercase text-xs font-bold tracking-widest mb-4">Aperçu de votre configuration</h3>
              {selectedModelData?.image && (
                <div className="relative w-full max-h-64 h-64">
                  <Image 
                    src={selectedModelData.image} 
                    alt={selectedModelData.name}
                    fill
                    className="object-contain transition-all duration-500"
                  />
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {selectedFabricData && (
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium">
                    Toile : {selectedFabricData.name}
                  </span>
                )}
                {selectedColorData && (
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium">
                    Coffre : {selectedColorData.name}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-serif text-slate-800">Bienvenue chez Storal</h2>
              <p className="text-slate-500 mt-2">Commencez la discussion pour configurer votre store</p>
            </div>
          )}
        </div>

        {/* 2. FICHE TECHNIQUE (Récapitulatif fixe) */}
        {isConfiguring && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-800 text-white px-4 py-2 text-sm font-bold">
              FICHE TECHNIQUE DU PROJET
            </div>
            <div className="grid grid-cols-2 divide-x divide-y divide-slate-100">
              {cart?.width && (
                <div className="p-4">
                  <span className="block text-xs text-slate-400">Largeur</span>
                  <strong className="text-lg">{(cart.width / 100).toFixed(2)} m</strong>
                </div>
              )}
              {cart?.projection && (
                <div className="p-4">
                  <span className="block text-xs text-slate-400">Avancée</span>
                  <strong className="text-lg">{(cart.projection / 100).toFixed(2)} m</strong>
                </div>
              )}
              {selectedModelData && (
                <div className="p-4">
                  <span className="block text-xs text-slate-400">Modèle</span>
                  <strong className="text-sm">{selectedModelData.name}</strong>
                </div>
              )}
              {cart?.exposure && (
                <div className="p-4">
                  <span className="block text-xs text-slate-400">Exposition</span>
                  <strong className="text-sm capitalize">{cart.exposure}</strong>
                </div>
              )}
              {cart?.withMotor !== undefined && (
                <div className="p-4 col-span-2">
                  <span className="block text-xs text-slate-400">Motorisation</span>
                  <strong className="text-sm">{cart.withMotor ? '⚡ Radio Somfy' : '🔧 Manuel'}</strong>
                </div>
              )}
            </div>

            {/* Options incluses (si présentes) */}
            {(cart?.ledArmsPrice || cart?.ledBoxPrice || cart?.lambrequinPrice || cart?.awningPrice || cart?.sousCoffrePrice) && (
              <div className="mt-3 px-4 py-3 bg-blue-50 rounded-lg">
                <span className="block text-xs font-bold text-blue-600 uppercase mb-2">Options incluses</span>
                <div className="space-y-1 text-xs">
                  {cart?.ledArmsPrice && cart.ledArmsPrice > 0 && (
                    <div className="flex justify-between text-slate-700">
                      <span>💡 LED Bras</span>
                      <span className="font-semibold">{cart.ledArmsPrice}€</span>
                    </div>
                  )}
                  {cart?.ledBoxPrice && cart.ledBoxPrice > 0 && (
                    <div className="flex justify-between text-slate-700">
                      <span>💡 LED Coffre</span>
                      <span className="font-semibold">{cart.ledBoxPrice}€</span>
                    </div>
                  )}
                  {cart?.lambrequinPrice && cart.lambrequinPrice > 0 && (
                    <div className="flex justify-between text-slate-700">
                      <span>📏 Lambrequin</span>
                      <span className="font-semibold">{cart.lambrequinPrice}€</span>
                    </div>
                  )}
                  {cart?.awningPrice && cart.awningPrice > 0 && (
                    <div className="flex justify-between text-slate-700">
                      <span>🏠 Auvent</span>
                      <span className="font-semibold">{cart.awningPrice}€</span>
                    </div>
                  )}
                  {cart?.sousCoffrePrice && cart.sousCoffrePrice > 0 && (
                    <div className="flex justify-between text-slate-700">
                      <span>📦 Sous-coffre</span>
                      <span className="font-semibold">{cart.sousCoffrePrice}€</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. LES 3 OFFRES (S'affichent quand les dimensions sont prêtes) */}
        {showPrices && (
          <div className="grid grid-cols-3 gap-3">
            <div 
              onClick={() => selectOffer('eco')}
              className={`bg-white p-3 rounded-xl border-2 transition-colors cursor-pointer ${
                cart?.priceType === 'eco' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-100 hover:border-blue-500'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400">OFFRE ECO</span>
              <div className="text-xl font-bold text-slate-800">{cart.priceEco}€</div>
            </div>
            <div 
              onClick={() => selectOffer('standard')}
              className={`p-3 rounded-xl border-2 relative cursor-pointer ${
                cart?.priceType === 'standard' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-50 border-blue-500 hover:bg-blue-100'
              }`}
            >
              <span className="absolute -top-2 right-2 bg-blue-500 text-white text-[8px] px-1 rounded">TOP VENTE</span>
              <span className={`text-[10px] font-bold ${cart?.priceType === 'standard' ? 'text-white' : 'text-blue-600'}`}>STANDARD</span>
              <div className={`text-xl font-bold ${cart?.priceType === 'standard' ? 'text-white' : 'text-blue-800'}`}>{cart.priceStandard}€</div>
            </div>
            <div 
              onClick={() => selectOffer('premium')}
              className={`bg-white p-3 rounded-xl border-2 transition-colors cursor-pointer ${
                cart?.priceType === 'premium' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-100 hover:border-blue-500'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400">PREMIUM</span>
              <div className="text-xl font-bold text-slate-800">{cart.pricePremium}€</div>
            </div>
          </div>
        )}

        {/* 4. BOUTONS D'ACTION */}
        {showPrices && (
          <div className="space-y-3">
            {/* Message d'instruction si aucune offre sélectionnée */}
            {!cart?.selectedPrice && (
              <div className="text-center py-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">
                  👆 Cliquez sur une offre pour l'ajouter au panier
                </p>
              </div>
            )}

            {/* Bouton Ajouter au panier - apparaît quand une offre est sélectionnée */}
            {cart?.selectedPrice && (
              <>
                <button
                  onClick={() => {
                    // Sauvegarder explicitement dans localStorage
                    localStorage.setItem('storal-cart', JSON.stringify(cart));
                    setAddedToCart(true);
                    console.log('🛒 Article ajouté au panier:', cart);
                    // Afficher le feedback pendant 3 secondes
                    setTimeout(() => setAddedToCart(false), 3000);
                  }}
                  className={`block w-full text-center py-3 text-white text-base font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    addedToCart 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  }`}
                >
                  {addedToCart ? '✅ AJOUTÉ AU PANIER' : '🛒 AJOUTER AU PANIER'}
                </button>

                <Link 
                  href="/order-summary" 
                  className="block w-full text-center py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  🚀 FINALISER MA COMMANDE
                </Link>
              </>
            )}
            
            {/* Engagements */}
            {cart?.selectedPrice && (
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Fabrication 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Livraison sous 7j</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Pose professionnelle</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
