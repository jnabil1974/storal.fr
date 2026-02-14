'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ChatAssistant from '@/components/ChatAssistant';
import VisualShowroom from '@/components/VisualShowroom';
import Image from 'next/image';
import { STORE_MODELS, FRAME_COLORS, FABRICS } from '@/lib/catalog-data';
import { ShowroomProvider, useShowroom } from '@/contexts/ShowroomContext';

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

function HomePageContent() {
  const [modelToConfig, setModelToConfig] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { showroomState } = useShowroom();

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
  
  // Masquer les promos dès que la conversation démarre OU qu'un modèle est sélectionné
  const isConfiguring = !!cart?.modelId || !!showroomState?.hasStartedConversation;
  const showPrices = !!(cart?.priceEco && cart?.priceStandard && cart?.pricePremium);

  // Calcul du détail de prix
  const totalOptionsHT = (cart?.ledArmsPrice || 0) + (cart?.ledBoxPrice || 0) + 
                         (cart?.lambrequinPrice || 0) + (cart?.awningPrice || 0) + 
                         (cart?.sousCoffrePrice || 0);
  const subtotalHT = (cart?.storeHT || 0) + totalOptionsHT + (cart?.poseHT || 0);
  const tva = cart?.tvaAmount || (subtotalHT * 0.20);
  const totalTTC = subtotalHT + tva;

  return (
    <div className="flex h-screen w-full bg-slate-100 text-slate-900 overflow-hidden">
      
      {/* COLONNE GAUCHE : CHAT ASSISTANT (35%) */}
      <div className="w-[35%] h-full border-r border-slate-200 flex flex-col bg-white">
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

      {/* COLONNE CENTRALE : SHOWROOM INTERACTIF + DÉTAILS (40%) */}
      <div className="w-[40%] h-full flex flex-col p-4 space-y-4 overflow-y-auto bg-white border-r border-slate-200">
        
        {/* SHOWROOM INTERACTIF - Connecté au chat via Context */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[300px] overflow-hidden">
          {showroomState && (
            <VisualShowroom
              activeTool={showroomState.activeTool}
              onSelectColor={showroomState.onSelectColor || (() => {})}
              onSelectFabric={showroomState.onSelectFabric || (() => {})}
              onSelectModel={showroomState.onSelectModel || (() => {})}
              onTerraceChange={showroomState.onTerraceChange}
              selectedColorId={showroomState.selectedColorId}
              selectedFabricId={showroomState.selectedFabricId}
              selectedModelId={showroomState.selectedModelId}
              hasStartedConversation={showroomState.hasStartedConversation}
              onSelectEco={showroomState.onSelectEco}
              onSelectStandard={showroomState.onSelectStandard}
              onSelectPremium={showroomState.onSelectPremium}
              ecoCalc={showroomState.ecoCalc}
              standardCalc={showroomState.standardCalc}
              premiumCalc={showroomState.premiumCalc}
              avec_pose={showroomState.avec_pose}
              proposedStoreWidth={showroomState.proposedStoreWidth}
              proposedStoreHeight={showroomState.proposedStoreHeight}
              showVideoHint={showroomState.showVideoHint}
            />
          )}
        </div>

        {/* Tags de sélection actuelle */}
        {isConfiguring && (
          <div className="flex flex-wrap gap-2 px-2">
            {selectedFabricData && (
              <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-700">
                Toile : {selectedFabricData.name}
              </span>
            )}
            {selectedColorData && (
              <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-700">
                Coffre : {selectedColorData.name}
              </span>
            )}
          </div>
        )}

        {/* FICHE TECHNIQUE */}
        {isConfiguring ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-3 py-2 text-xs font-bold flex items-center gap-2">
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
        ) : (
          /* PROMOTIONS - Affichées avant la configuration */
          <div className="space-y-3">
            {/* Titre général des promos */}
            <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">🔥</span>
                <span className="text-xs font-bold uppercase tracking-wide">Promotions Exceptionnelles</span>
                <span className="text-lg">🔥</span>
              </div>
            </div>

            {/* PROMO KISSYMY */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-3 space-y-3">
                {/* Nom du produit */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-800">KISSYMY</h3>
                  <p className="text-xs text-slate-600">Store coffre intégral design</p>
                </div>

                {/* Image du produit */}
                <div className="bg-white rounded-lg p-2">
                  <div className="relative h-24 bg-slate-50 rounded flex items-center justify-center">
                    <span className="text-4xl">🏠</span>
                  </div>
                </div>

                {/* Prix */}
                <div className="bg-white rounded-lg p-2 border border-slate-200 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-sm text-slate-400 line-through">1 990€</span>
                    <span className="text-2xl font-bold text-slate-900">1 490€</span>
                  </div>
                  <p className="text-[10px] text-slate-600">TTC - Pose incluse</p>
                  <div className="mt-1 inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    -25% 🎉
                  </div>
                </div>

                {/* Caractéristiques */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-700">✓</span>
                    <span className="text-slate-700">Coffre intégral design</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-700">✓</span>
                    <span className="text-slate-700">Motorisation Somfy</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-700">✓</span>
                    <span className="text-slate-700">Garantie 12 ans</span>
                  </div>
                </div>

                {/* CTA */}
                <button 
                  onClick={() => {
                    const chatInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                    if (chatInput) {
                      chatInput.focus();
                      chatInput.value = "Je veux configurer le KISSYMY en promo";
                    }
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg transition-all shadow-sm hover:shadow-md text-sm"
                >
                  🎯 Commander
                </button>
              </div>
            </div>

            {/* PROMO INASTA */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-3 space-y-3">
                {/* Nom du produit */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-800">INASTA</h3>
                  <p className="text-xs text-slate-600">Store banne traditionnel robuste</p>
                </div>

                {/* Image du produit */}
                <div className="bg-white rounded-lg p-2">
                  <div className="relative h-24 bg-slate-50 rounded flex items-center justify-center">
                    <span className="text-4xl">⛱️</span>
                  </div>
                </div>

                {/* Prix */}
                <div className="bg-white rounded-lg p-2 border border-slate-200 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-sm text-slate-400 line-through">1 690€</span>
                    <span className="text-2xl font-bold text-slate-900">1 290€</span>
                  </div>
                  <p className="text-[10px] text-slate-600">TTC - Pose incluse</p>
                  <div className="mt-1 inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    -24% 🎉
                  </div>
                </div>

                {/* Caractéristiques */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-700">✓</span>
                    <span className="text-slate-700">Structure traditionnelle</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-700">✓</span>
                    <span className="text-slate-700">Toile acrylique premium</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-700">✓</span>
                    <span className="text-slate-700">Garantie 10 ans</span>
                  </div>
                </div>

                {/* CTA */}
                <button 
                  onClick={() => {
                    const chatInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                    if (chatInput) {
                      chatInput.focus();
                      chatInput.value = "Je veux configurer l'INASTA en promo";
                    }
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg transition-all shadow-sm hover:shadow-md text-sm"
                >
                  🎯 Commander
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OPTIONS INCLUSES */}
        {isConfiguring && (cart?.ledArmsPrice || cart?.ledBoxPrice || cart?.lambrequinPrice || cart?.awningPrice || cart?.sousCoffrePrice) && (
          <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-3 py-2 text-xs font-bold flex items-center gap-2">
              <span>⚙️</span>
              <span>OPTIONS SÉLECTIONNÉES</span>
            </div>
            <div className="p-3 space-y-2 text-sm">
              {cart?.ledArmsPrice && cart.ledArmsPrice > 0 && (
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="text-slate-700">💡</span>
                    <span>LED Bras</span>
                  </span>
                  <span className="font-semibold text-slate-900">+{cart.ledArmsPrice}€</span>
                </div>
              )}
              {cart?.ledBoxPrice && cart.ledBoxPrice > 0 && (
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="text-slate-700">💡</span>
                    <span>LED Coffre</span>
                  </span>
                  <span className="font-semibold text-slate-900">+{cart.ledBoxPrice}€</span>
                </div>
              )}
              {cart?.lambrequinPrice && cart.lambrequinPrice > 0 && (
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="text-slate-700">📏</span>
                    <span>Lambrequin</span>
                  </span>
                  <span className="font-semibold text-slate-900">+{cart.lambrequinPrice}€</span>
                </div>
              )}
              {cart?.awningPrice && cart.awningPrice > 0 && (
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="text-slate-700">🏠</span>
                    <span>Auvent</span>
                  </span>
                  <span className="font-semibold text-slate-900">+{cart.awningPrice}€</span>
                </div>
              )}
              {cart?.sousCoffrePrice && cart.sousCoffrePrice > 0 && (
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="text-slate-700">📦</span>
                    <span>Sous-coffre</span>
                  </span>
                  <span className="font-semibold text-slate-900">+{cart.sousCoffrePrice}€</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DÉTAIL DU PRIX */}
        {showPrices && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-3 py-2 text-xs font-bold flex items-center gap-2">
              <span>📊</span>
              <span>DÉTAIL DU PRIX</span>
            </div>
            <div className="p-3 space-y-2 text-sm">
              <div className="flex justify-between text-slate-700">
                <span>Store HT</span>
                <span className="font-semibold">{cart.storeHT?.toFixed(2) || '0.00'}€</span>
              </div>
              
              {totalOptionsHT > 0 && (
                <div className="flex justify-between text-slate-600 text-xs pl-4">
                  <span>Options</span>
                  <span className="font-semibold">{totalOptionsHT.toFixed(2)}€</span>
                </div>
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
              
              <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-slate-900">
                <span className="font-bold text-base">TOTAL TTC</span>
                <span className="font-bold text-lg">{totalTTC.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* COLONNE DROITE : PRIX & ACTIONS (25%) */}
      <div className="w-1/4 h-full flex flex-col p-4 space-y-4 overflow-y-auto">
        
        {!showPrices ? (
          <div className="flex-1 flex flex-col">
            {/* TITRE */}
            <div className="bg-slate-900 text-white px-4 py-3 rounded-xl text-center mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wide">🌟 Nos Garanties</h3>
            </div>

            {/* LISTE DES AVANTAGES */}
            <div className="space-y-3 flex-1">
              {/* Garantie 12 ans */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🛡️</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Garantie 12 ans</h4>
                    <p className="text-xs text-slate-600">Protection totale sur tous nos produits</p>
                  </div>
                </div>
              </div>

              {/* Fabrication 24 heures */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">⚡</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Fabrication 24h</h4>
                    <p className="text-xs text-slate-600">Production rapide en atelier</p>
                  </div>
                </div>
              </div>

              {/* Livraison sous 7 jours */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🚚</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Livraison sous 7 jours</h4>
                    <p className="text-xs text-slate-600">Partout en France</p>
                  </div>
                </div>
              </div>

              {/* Service de pose */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🔧</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Service de pose</h4>
                    <p className="text-xs text-slate-600">Installation par nos experts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* MESSAGE D'ENCOURAGEMENT */}
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs text-center text-slate-600">
                💬 <strong>Discutez avec notre assistant</strong> pour obtenir votre devis personnalisé
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* TITRE SECTION */}
            <div className="bg-slate-900 text-white px-4 py-3 rounded-xl text-center">
              <h3 className="text-sm font-bold uppercase tracking-wide">💰 Choisissez votre offre</h3>
            </div>

            {/* LES 3 OFFRES - Format carte enrichie */}
            <div className="space-y-3 flex-1">
              {/* OFFRE ECO */}
              <div 
                onClick={() => selectOffer('eco')}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  cart?.priceType === 'eco' 
                    ? 'border-slate-900 bg-white shadow-md ring-1 ring-slate-900/10' 
                    : 'border-slate-200 bg-white hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase">💚 Offre Eco</span>
                  {cart?.priceType === 'eco' && (
                    <span className="text-slate-900">✓</span>
                  )}
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-3">{cart.priceEco}€ TTC</div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-700 mt-0.5">✓</span>
                    <span>Toile standard</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-700 mt-0.5">✓</span>
                    <span>Pose incluse</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-700 mt-0.5">✓</span>
                    <span>Garantie 2 ans</span>
                  </div>
                </div>
              </div>

              {/* OFFRE STANDARD */}
              <div 
                onClick={() => selectOffer('standard')}
                className={`rounded-xl border p-4 cursor-pointer relative transition-all ${
                  cart?.priceType === 'standard' 
                    ? 'border-slate-900 bg-white shadow-md ring-1 ring-slate-900/10' 
                    : 'border-slate-200 bg-white hover:shadow-sm'
                }`}
              >
                <span className="absolute -top-2 right-2 bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                  ⭐ TOP VENTE
                </span>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-slate-700">
                    💙 Standard
                  </span>
                  {cart?.priceType === 'standard' && (
                    <span className="text-slate-900">✓</span>
                  )}
                </div>
                <div className="text-2xl font-bold mb-3 text-slate-900">
                  {cart.priceStandard}€ TTC
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-700">✓</span>
                    <span>Toile Dickson Premium</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-700">✓</span>
                    <span>LED bras inclus</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-700">✓</span>
                    <span>Garantie 5 ans</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-700">✓</span>
                    <span>Pose pro sous 7j</span>
                  </div>
                </div>
              </div>

              {/* OFFRE PREMIUM */}
              <div 
                onClick={() => selectOffer('premium')}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  cart?.priceType === 'premium' 
                    ? 'border-slate-900 bg-white shadow-md ring-1 ring-slate-900/10' 
                    : 'border-slate-200 bg-white hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase">⭐ Premium</span>
                  {cart?.priceType === 'premium' && (
                    <span className="text-slate-900">✓</span>
                  )}
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-3">{cart.pricePremium}€ TTC</div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-700 mt-0.5">✓</span>
                    <span>Toile haut de gamme</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-700 mt-0.5">✓</span>
                    <span>Toutes options incluses</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-700 mt-0.5">✓</span>
                    <span>Garantie 10 ans</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-700 mt-0.5">✓</span>
                    <span>Service prioritaire</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MESSAGE D'INSTRUCTION SI AUCUNE OFFRE */}
            {!cart?.selectedPrice && (
              <div className="text-center py-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-700 font-medium">
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
                  className={`block w-full text-center py-3 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg ${
                    addedToCart 
                      ? 'bg-slate-900 hover:bg-slate-800' 
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {addedToCart ? '✅ AJOUTÉ' : '🛒 AJOUTER AU PANIER'}
                </button>

                <Link 
                  href="/order-summary" 
                  className="block w-full text-center py-4 bg-slate-900 text-white text-base font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
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

// Wrapper avec ShowroomProvider
export default function HomePageWithShowroomFusion() {
  return (
    <ShowroomProvider>
      <HomePageContent />
    </ShowroomProvider>
  );
}
