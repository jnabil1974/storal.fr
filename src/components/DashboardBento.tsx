'use client';

import { useShowroom } from '@/contexts/ShowroomContext';
import { STORE_MODELS, FRAME_COLORS, FABRICS, type Fabric, type FrameColor } from '@/lib/catalog-data';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import type { ProductType } from '@/types/products';

export default function DashboardBento() {
  const { showroomState } = useShowroom();
  const { addItem } = useCart();
  const router = useRouter();
  const [highlightedTile, setHighlightedTile] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState<'color' | 'fabric' | 'model' | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // 🔍 Log au render pour voir si le composant se met à jour
  console.log('🎨 [DashboardBento] RENDER avec showroomState:', JSON.stringify({
    selectedModelId: showroomState.selectedModelId,
    selectedColorId: showroomState.selectedColorId,
    selectedFabricId: showroomState.selectedFabricId,
    timestamp: new Date().toLocaleTimeString()
  }, null, 2));

  // Déterminer quelle tuile illuminer selon le contexte
  useEffect(() => {
    if (!showroomState.activeTool) {
      setHighlightedTile(null);
      return;
    }

    const toolName = showroomState.activeTool.toolName;
    
    if (toolName === 'display_triple_offer' || toolName === 'display_single_offer' || showroomState.ecoCalc || showroomState.standardCalc || showroomState.premiumCalc || showroomState.singleOfferCalc) {
      setHighlightedTile('prix');
    } else if (toolName === 'open_model_selector' || showroomState.selectedModelId) {
      setHighlightedTile('modele');
    } else if (toolName === 'open_fabric_selector' || showroomState.selectedFabricId) {
      setHighlightedTile('toile');
    } else if (toolName === 'open_color_selector' || showroomState.selectedColorId) {
      setHighlightedTile('couleur');
    } else if (showroomState.proposedStoreWidth || showroomState.proposedStoreHeight) {
      setHighlightedTile('dimensions');
    }
  }, [showroomState]);

  // Gérer l'ouverture/fermeture de l'overlay selon l'outil actif
  useEffect(() => {
    if (!showroomState.activeTool) {
      setShowOverlay(false);
      setOverlayType(null);
      return;
    }

    const toolName = showroomState.activeTool.toolName;
    
    if (toolName === 'open_model_selector') {
      // ❌ Désactivé - Les modèles s'affichent maintenant dans le chat
      setOverlayType(null);
      setShowOverlay(false);
    } else if (toolName === 'open_color_selector') {
      // ❌ Désactivé - Les couleurs s'affichent maintenant dans le chat
      setOverlayType(null);
      setShowOverlay(false);
    } else if (toolName === 'open_fabric_selector') {
      // ❌ Désactivé - Les toiles s'affichent maintenant dans le chat
      setOverlayType(null);
      setShowOverlay(false);
    } else {
      setShowOverlay(false);
      setOverlayType(null);
    }
  }, [showroomState.activeTool]);

  // Récupérer les données sélectionnées
  const selectedModel = showroomState.selectedModelId 
    ? STORE_MODELS[showroomState.selectedModelId] 
    : null;
  
  // 🔍 Log de débogage pour tracer quel modèle est affiché
  useEffect(() => {
    console.log('📦 DashboardBento - Modèle actuel:', JSON.stringify({
      selectedModelId: showroomState.selectedModelId,
      modelName: selectedModel?.name,
      modelImage: selectedModel?.image,
      hasModel: !!selectedModel
    }, null, 2));
  }, [showroomState.selectedModelId, selectedModel]);
  
  const selectedFabric = showroomState.selectedFabricId 
    ? FABRICS.find((f: Fabric) => f.id === showroomState.selectedFabricId) 
    : null;
  
  const selectedColor = showroomState.selectedColorId 
    ? FRAME_COLORS.find((c: FrameColor) => c.id === showroomState.selectedColorId) 
    : null;

  const tileClass = (tileName: string, baseClass: string = '') => {
    const isHighlighted = highlightedTile === tileName;
    return `${baseClass} bg-white/95 backdrop-blur-xl rounded-2xl p-5 border transition-all duration-500 ${
      isHighlighted 
        ? 'border-blue-400 shadow-xl shadow-blue-400/30 ring-2 ring-blue-400/50 scale-[1.02]' 
        : 'border-white/20 hover:border-white/40'
    }`;
  };

  // Fonction pour gérer la sélection de couleur
  const handleColorSelect = (colorId: string, colorName: string) => {
    if (showroomState.onSelectColor) {
      showroomState.onSelectColor(colorId, colorName);
    }
    setShowOverlay(false);
  };

  // Fonction pour gérer la sélection de toile
  const handleFabricSelect = (fabricId: string, fabricName: string) => {
    if (showroomState.onSelectFabric) {
      showroomState.onSelectFabric(fabricId, fabricName);
    }
    setShowOverlay(false);
  };

  // Fonction pour gérer la sélection de modèle
  const handleModelSelect = (modelId: string, modelName: string) => {
    if (showroomState.onSelectModel) {
      showroomState.onSelectModel(modelId, modelName);
    }
    setShowOverlay(false);
  };

  // Rendu du sélecteur de modèles
  const renderModelSelector = () => {
    // Récupérer les modèles depuis l'input de l'outil
    const toolInput = showroomState.activeTool?.input as any;
    const modelsToDisplay = toolInput?.models_to_display || [];
    
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-gray-900">
            🏠 Choisissez votre Modèle de Store
          </h3>
          <button
            onClick={() => setShowOverlay(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {modelsToDisplay.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun modèle à afficher</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-h-[70vh] overflow-y-auto px-2">
            {modelsToDisplay.map((modelId: string) => {
              const model = STORE_MODELS[modelId];
              if (!model) {
                console.warn('⚠️ Model not found:', modelId);
                return null;
              }
              
              const isSelected = showroomState.selectedModelId === modelId;
              
              return (
                <button
                  key={modelId}
                  onClick={() => handleModelSelect(modelId, model.name)}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    isSelected 
                      ? 'border-4 border-green-500 ring-2 ring-green-300 shadow-lg' 
                      : 'border-gray-300 hover:border-blue-400 hover:shadow-md'
                  }`}
                >
                  <div className="relative w-full h-48 mb-3 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-contain"
                    />
                    {model.is_promo && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        PROMO
                      </div>
                    )}
                  </div>
                  <h4 className="text-lg font-black text-gray-900 mb-2">{model.name}</h4>
                  <p className="text-xs text-gray-600 mb-3">{model.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {model.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                  {isSelected && <p className="text-xs text-green-600 font-bold mt-2">✅ Sélectionné</p>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Rendu du sélecteur de couleurs
  const renderColorSelector = () => {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-gray-900">
            🎨 Choisissez votre Couleur d'Armature
          </h3>
          <button
            onClick={() => setShowOverlay(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
          {FRAME_COLORS.map((color) => {
            const isSelected = showroomState.selectedColorId === color.id;
            return (
              <button
                key={color.id}
                onClick={() => handleColorSelect(color.id, color.name)}
                className={`p-4 rounded-xl border-2 transition-all text-center hover:scale-105 ${
                  isSelected 
                    ? 'border-4 border-green-500 ring-2 ring-green-300 shadow-lg' 
                    : 'border-gray-300 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                <div 
                  className="w-full h-20 rounded-lg mb-2 border-2 border-gray-400"
                  style={{ backgroundColor: color.hex }}
                  title={color.hex}
                />
                <p className="text-sm font-bold text-gray-900">{color.name}</p>
                {color.price > 0 && <p className="text-xs text-orange-600 font-semibold">+{color.price}€</p>}
                {isSelected && <p className="text-xs text-green-600 font-bold mt-1">✅ Sélectionné</p>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Rendu du sélecteur de toiles
  const renderFabricSelector = () => {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-gray-900">
            🧵 Choisissez votre Toile
          </h3>
          <button
            onClick={() => setShowOverlay(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
          {FABRICS.map((fabric) => {
            const isSelected = showroomState.selectedFabricId === fabric.id;
            return (
              <button
                key={fabric.id}
                onClick={() => handleFabricSelect(fabric.id, fabric.name)}
                className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-105 ${
                  isSelected 
                    ? 'border-4 border-green-500 ring-2 ring-green-300 shadow-lg' 
                    : 'border-gray-300 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                <div className="w-full h-24 rounded-lg mb-3 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-400 overflow-hidden flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">{fabric.category.toUpperCase()}</span>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">{fabric.ref}</p>
                <p className="text-xs text-gray-700">{fabric.name}</p>
                {fabric.price > 0 && <p className="text-xs text-blue-600 font-bold mt-1">+{fabric.price}€</p>}
                {isSelected && <p className="text-xs text-green-600 font-bold mt-1">✅ Sélectionné</p>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Overlay Modal pour les sélecteurs - Couvre tout l'écran */}
      {showOverlay && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 animate-fadeIn">
          <div className={`bg-white rounded-3xl shadow-2xl w-full max-h-[90vh] overflow-hidden animate-slideUp ${
            overlayType === 'model' ? 'max-w-[98vw] xl:max-w-[95vw]' : 'max-w-4xl'
          }`}>
            {overlayType === 'model' && renderModelSelector()}
            {overlayType === 'color' && renderColorSelector()}
            {overlayType === 'fabric' && renderFabricSelector()}
          </div>
        </div>
      )}

      {/* Header avec style similaire à l'assistant */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 text-center shadow-lg">
        <h2 className="text-lg font-bold leading-tight">Dashboard Projet</h2>
        <p className="text-xs text-blue-100 mt-1">Suivi en temps réel de votre configuration</p>
      </header>

      {/* Grille Bento */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4 auto-rows-min">
        
        {/* TUILE MODÈLE */}
        <div className={tileClass('modele', 'col-span-2')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm">Modèle</h3>
              <p className="text-xs text-gray-500">Store sélectionné</p>
            </div>
          </div>
          
          {selectedModel ? (
            <div className="space-y-3">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border border-gray-200">
                {selectedModel.image ? (
                  <img 
                    src={selectedModel.image} 
                    alt={selectedModel.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm mb-1">{selectedModel.name}</p>
                <p className="text-xs text-gray-600">{selectedModel.description}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Aucun modèle</p>
            </div>
          )}
        </div>

        {/* TUILE PRIX - Large (2 colonnes) - DÉPLACÉE SOUS MODÈLE */}
        <div className={tileClass('prix', 'col-span-2')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm">Tarification</h3>
              <p className="text-xs text-gray-500">Devis instantané</p>
            </div>
          </div>
          
          {showroomState.singleOfferCalc ? (
            <div className="flex justify-center">
              <button 
                onClick={() => showroomState.onSelectOffer?.(showroomState.singleOfferCalc.totalTTC)}
                className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border-2 border-emerald-300 hover:border-emerald-500 hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105 w-full max-w-md"
              >
                <p className="text-sm text-emerald-700 font-bold mb-3">💎 Votre Devis Personnalisé</p>
                <p className="text-4xl font-black text-emerald-900 mb-2">{showroomState.singleOfferCalc.totalTTC?.toFixed(2) || '—'}€</p>
                <p className="text-sm text-emerald-700 font-semibold mb-4">TTC</p>
                
                <div className="bg-white/60 rounded-lg p-3 mb-3 text-left space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Store de base</span>
                    <span className="font-semibold text-gray-900">{showroomState.singleOfferCalc.basePrice?.toFixed(2)}€ HT</span>
                  </div>
                  {showroomState.singleOfferCalc.options?.ledArms && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">💡 LED Bras</span>
                      <span className="font-semibold text-gray-900">{showroomState.singleOfferCalc.options.ledArms.toFixed(2)}€ HT</span>
                    </div>
                  )}
                  {showroomState.singleOfferCalc.options?.ledBox && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">💡 LED Coffre</span>
                      <span className="font-semibold text-gray-900">{showroomState.singleOfferCalc.options.ledBox.toFixed(2)}€ HT</span>
                    </div>
                  )}
                  {showroomState.singleOfferCalc.options?.lambrequin && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">🎨 Lambrequin</span>
                      <span className="font-semibold text-gray-900">{showroomState.singleOfferCalc.options.lambrequin.toFixed(2)}€ HT</span>
                    </div>
                  )}
                  {showroomState.singleOfferCalc.options?.awning && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">☂️ Auvent</span>
                      <span className="font-semibold text-gray-900">{showroomState.singleOfferCalc.options.awning.toFixed(2)}€ HT</span>
                    </div>
                  )}
                  {showroomState.singleOfferCalc.options?.sousCoffre && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">📦 Sous-coffre</span>
                      <span className="font-semibold text-gray-900">{showroomState.singleOfferCalc.options.sousCoffre.toFixed(2)}€ HT</span>
                    </div>
                  )}
                  {showroomState.singleOfferCalc.poseHT > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">🔧 Installation</span>
                      <span className="font-semibold text-gray-900">{showroomState.singleOfferCalc.poseHT?.toFixed(2)}€ HT</span>
                    </div>
                  )}
                  <div className="border-t border-emerald-200 pt-1 mt-1"></div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Total HT</span>
                    <span className="font-semibold text-gray-900">{showroomState.singleOfferCalc.totalHT?.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">TVA ({showroomState.avec_pose ? '10' : '20'}%)</span>
                    <span className="font-semibold text-gray-900">{showroomState.singleOfferCalc.tva?.toFixed(2)}€</span>
                  </div>
                </div>
                
                <p className="text-xs text-emerald-600 font-semibold">👆 Cliquez pour valider</p>
              </button>
            </div>
          ) : showroomState.ecoCalc || showroomState.standardCalc || showroomState.premiumCalc ? (
            <div className="grid grid-cols-3 gap-3">
              {showroomState.ecoCalc && (
                <button 
                  onClick={() => showroomState.onSelectEco?.(showroomState.ecoCalc.totalTTC)}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
                >
                  <p className="text-xs text-blue-600 font-semibold mb-1">Éco</p>
                  <p className="text-2xl font-black text-blue-900">{showroomState.ecoCalc.totalTTC?.toFixed(2) || '—'}€</p>
                  <p className="text-xs text-blue-600 mt-1">TTC</p>
                  <p className="text-xs text-blue-500 mt-2">👆 Cliquez pour sélectionner</p>
                </button>
              )}
              {showroomState.standardCalc && (
                <button 
                  onClick={() => showroomState.onSelectStandard?.(showroomState.standardCalc.totalTTC)}
                  className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-3 border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
                >
                  <p className="text-xs text-indigo-600 font-semibold mb-1">Standard</p>
                  <p className="text-2xl font-black text-indigo-900">{showroomState.standardCalc.totalTTC?.toFixed(2) || '—'}€</p>
                  <p className="text-xs text-indigo-600 mt-1">TTC</p>
                  <p className="text-xs text-indigo-500 mt-2">👆 Cliquez pour sélectionner</p>
                </button>
              )}
              {showroomState.premiumCalc && (
                <button 
                  onClick={() => showroomState.onSelectPremium?.(showroomState.premiumCalc.totalTTC)}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
                >
                  <p className="text-xs text-purple-600 font-semibold mb-1">Premium</p>
                  <p className="text-2xl font-black text-purple-900">{showroomState.premiumCalc.totalTTC?.toFixed(2) || '—'}€</p>
                  <p className="text-xs text-purple-600 mt-1">TTC</p>
                  <p className="text-xs text-purple-500 mt-2">👆 Cliquez pour sélectionner</p>
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">En attente du calcul...</p>
            </div>
          )}
        </div>

        {/* TUILE DIMENSIONS */}
        <div className={tileClass('dimensions', 'col-span-1')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm">Dimensions</h3>
              <p className="text-xs text-gray-500">Sur mesure</p>
            </div>
          </div>
          
          {showroomState.proposedStoreWidth || showroomState.proposedStoreHeight ? (
            <div className="space-y-2">
              {showroomState.proposedStoreWidth && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Largeur</span>
                  <span className="text-lg font-bold text-gray-900">{showroomState.proposedStoreWidth} m</span>
                </div>
              )}
              {showroomState.proposedStoreHeight && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Hauteur</span>
                  <span className="text-lg font-bold text-gray-900">{showroomState.proposedStoreHeight} m</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">
              <p className="text-xs">Non défini</p>
            </div>
          )}
        </div>

        {/* TUILE TOILE */}
        <div className={tileClass('toile', 'col-span-1')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm">Toile</h3>
              <p className="text-xs text-gray-500">Tissu sélectionné</p>
            </div>
          </div>
          
          {selectedFabric ? (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-200">
              <p className="font-bold text-gray-900 text-sm">{selectedFabric.name}</p>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">
              <p className="text-xs">Non défini</p>
            </div>
          )}
        </div>

        {/* TUILE COULEUR */}
        <div className={tileClass('couleur', 'col-span-1')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm">Couleur</h3>
              <p className="text-xs text-gray-500">Coffre RAL</p>
            </div>
          </div>
          
          {selectedColor ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg border-2 border-white shadow"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <p className="font-bold text-gray-900 text-sm">{selectedColor.name}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">
              <p className="text-xs">Non défini</p>
            </div>
          )}
        </div>

        {/* TUILE OPTIONS */}
        <div className={tileClass('options', 'col-span-1')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm">Options</h3>
              <p className="text-xs text-gray-500">Accessoires</p>
            </div>
          </div>
          
          {(showroomState.ecoCalc || showroomState.standardCalc || showroomState.premiumCalc || showroomState.singleOfferCalc) ? (
            <div className="space-y-1">
              {(showroomState.standardCalc?.ledArmsPrice > 0 || showroomState.singleOfferCalc?.options?.ledArms > 0) && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">LED Bras</span>
                </div>
              )}
              {(showroomState.standardCalc?.ledBoxPrice > 0 || showroomState.singleOfferCalc?.options?.ledBox > 0) && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">LED Coffre</span>
                </div>
              )}
              {(showroomState.standardCalc?.lambrequinPrice > 0 || showroomState.singleOfferCalc?.options?.lambrequin > 0) && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">Lambrequin</span>
                </div>
              )}
              {(showroomState.singleOfferCalc?.options?.awning > 0) && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">Auvent</span>
                </div>
              )}
              {(showroomState.singleOfferCalc?.options?.sousCoffre > 0) && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">Sous-coffre</span>
                </div>
              )}
              {(!showroomState.standardCalc?.ledArmsPrice && !showroomState.standardCalc?.ledBoxPrice && !showroomState.standardCalc?.lambrequinPrice && !showroomState.singleOfferCalc?.options?.ledArms && !showroomState.singleOfferCalc?.options?.ledBox && !showroomState.singleOfferCalc?.options?.lambrequin && !showroomState.singleOfferCalc?.options?.awning && !showroomState.singleOfferCalc?.options?.sousCoffre) && (
                <div className="text-center py-4 text-gray-400">
                  <p className="text-xs">Aucune option</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">
              <p className="text-xs">Non défini</p>
            </div>
          )}
        </div>

        {/* TUILE RÉCAPITULATIF - Large */}
        <div className={tileClass('recap', 'col-span-2')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm">Récapitulatif</h3>
              <p className="text-xs text-gray-500">Configuration actuelle</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Statut</p>
              <p className="text-sm font-semibold text-gray-900">
                {showroomState.hasStartedConversation ? '✅ En cours' : '⏳ Prêt'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Étape</p>
              <p className="text-sm font-semibold text-gray-900">
                {showroomState.ecoCalc || showroomState.singleOfferCalc ? 'Devis prêt' : 
                 showroomState.selectedModelId ? 'Configuration' :
                 'Sélection modèle'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Modèle</p>
              <p className="text-sm font-semibold text-gray-900">
                {selectedModel?.name || '—'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Pose</p>
              <p className="text-sm font-semibold text-gray-900">
                {showroomState.avec_pose ? 'Incluse' : 'Non'}
              </p>
            </div>
          </div>
        </div>

        {/* Bouton de validation - Visible uniquement quand les offres sont affichées */}
        {(showroomState.ecoCalc || showroomState.standardCalc || showroomState.premiumCalc || showroomState.singleOfferCalc) && (
          <div className="col-span-2 mt-4">
            <button
              onClick={async () => {
                console.log('🔵 handleValidateConfiguration (DashboardBento) appelée');
                setIsAddingToCart(true);
                
                try {
                  // Récupérer la configuration depuis localStorage (où ChatAssistant la sauvegarde dans 'storal-cart')
                  const storedCartJson = localStorage.getItem('storal-cart');
                  console.log('📦 storal-cart raw:', storedCartJson);
                  
                  const storedConfig = storedCartJson ? JSON.parse(storedCartJson) : null;
                  console.log('📦 storedConfig keys:', Object.keys(storedConfig || {}));
                  console.log('📦 modelId:', storedConfig?.modelId);
                  console.log('📦 modelName:', storedConfig?.modelName);
                  console.log('📦 colorId:', storedConfig?.colorId);
                  console.log('📦 fabricId:', storedConfig?.fabricId);

                  if (!storedConfig || !storedConfig.modelId) {
                    console.error('❌ Missing modelId in storedConfig');
                    alert('⚠️ Configuration non trouvée. Veuillez configurer votre store dans le chatbot.');
                    setIsAddingToCart(false);
                    return;
                  }

                  console.log('✅ Configuration found, searching for model');

                  // Récupérer les données du modèle (STORE_MODELS est un objet, pas un tableau)
                  const modelsList = Object.values(STORE_MODELS);
                  console.log('📋 STORE_MODELS count:', modelsList.length);
                  console.log('🔍 Looking for modelId:', storedConfig.modelId);
                  
                  const modelData = modelsList.find((m: any) => m.id === storedConfig.modelId);
                  console.log('🔍 Found modelData:', modelData?.name || 'NOT FOUND');
                  
                  if (!modelData) {
                    console.error('❌ Model not found:', storedConfig.modelId);
                    alert('⚠️ Modèle non trouvé. Veuillez configurer votre store dans le chatbot.');
                    setIsAddingToCart(false);
                    return;
                  }

                  // Construire la configuration pour le panier
                  const configuration = {
                    width: storedConfig.width || 0,
                    depth: storedConfig.projection || 0,
                    motorized: storedConfig.withMotor ?? false,
                    fabric: 'acrylique' as const,
                    fabricColor: storedConfig.fabricId || 'non définie',
                    frameColor: (storedConfig.colorId || 'blanc') as 'blanc' | 'gris' | 'noir' | 'bronze' | 'inox',
                    armType: 'coffre' as const,
                    windSensor: false,
                    rainSensor: false,
                    avec_pose: storedConfig.avec_pose ?? false,
                  };

                  // Construire le payload
                  const payload = {
                    productId: storedConfig.modelId,
                    productType: 'store_banne' as ProductType,
                    productName: storedConfig.modelName || modelData.name,
                    basePrice: storedConfig.storeHT || 0,
                    configuration,
                    quantity: 1,
                    pricePerUnit: storedConfig.selectedPrice || storedConfig.storeHT || 0,
                  };

                  console.log('🛒 Ajout au panier (DashboardBento):', payload);
                  const addedItem = await addItem(payload);
                  console.log('✅ Article ajouté (DashboardBento):', addedItem);
                  console.log('🔀 Redirection vers /cart...');
                  router.push('/cart');
                  console.log('✅ Commande de redirection exécutée');
                } catch (error) {
                  console.error('❌ Erreur lors de l\'ajout au panier:', error);
                  alert('❌ Erreur lors de l\'ajout au panier. Vérifiez la console pour plus de détails.');
                } finally {
                  setIsAddingToCart(false);
                }
              }}
              disabled={isAddingToCart}
              className="block w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white text-center font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              <div className="flex items-center justify-center gap-3">
                {isAddingToCart ? (
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="text-lg">{isAddingToCart ? 'Ajout en cours...' : 'Valider ma Configuration'}</span>
              </div>
              <p className="text-xs text-green-100 mt-2">
                Ajoutez votre store au panier et finalisez votre commande
              </p>
            </button>
          </div>
        )}

        </div> {/* Fermeture de la grille */}

      {/* Footer avec liens légaux discrets */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-center gap-4 text-xs text-gray-500">
          <a href="/mentions-legales" target="_blank" className="hover:text-gray-700 transition">
            Mentions légales
          </a>
          <span>•</span>
          <a href="/cgv" target="_blank" className="hover:text-gray-700 transition">
            CGV
          </a>
          <span>•</span>
          <a href="/politique-confidentialite" target="_blank" className="hover:text-gray-700 transition">
            Confidentialité
          </a>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">© 2026 Storal.fr - Tous droits réservés</p>
      </div>
      </div>
    </div>
  );
}
