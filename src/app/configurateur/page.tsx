'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStorePrice, STORES_DATA, FRAME_COLORS, FABRICS } from '@/data/storeData';
import { useCart } from '@/contexts/CartContext';
import { ProductType } from '@/types/products';
import Image from 'next/image';

export default function ConfiguratorPage() {
  const router = useRouter();
  const { addItem } = useCart();
  
  // États du configurateur
  const [etape, setEtape] = useState(1);
  const [modelKey, setModelKey] = useState<'kissimy' | 'heliom'>('kissimy');
  const [largeur, setLargeur] = useState(300);
  const [avancee, setAvancee] = useState<'250' | '300'>('250');
  const [frameColorId, setFrameColorId] = useState('9010'); // Blanc par défaut
  const [fabricFilter, setFabricFilter] = useState<'uni' | 'raye' | 'goldies'>('uni');
  const [selectedFabric, setSelectedFabric] = useState<any>(null);
  const [ledCoffre, setLedCoffre] = useState(false);
  const [ledBras, setLedBras] = useState(false);
  const [posePro, setPosePro] = useState(true);
  
  // Calcul du prix en temps réel
  const [prixResult, setPrixResult] = useState<any>(null);

  // Lire les paramètres URL pour le Deep Linking
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const model = searchParams.get('model');
    const width = searchParams.get('width');
    const projection = searchParams.get('projection');
    const color = searchParams.get('color');

    if (model === 'kissimy' || model === 'heliom') {
      setModelKey(model);
    }
    if (width) {
      const widthNum = Number(width);
      if (widthNum >= 300 && widthNum <= 700) {
        setLargeur(widthNum);
      }
    }
    if (projection === '250' || projection === '300') {
      setAvancee(projection);
    }
    if (color) {
      // Vérifier que la couleur existe
      const colorExists = FRAME_COLORS.some(c => c.id === color);
      if (colorExists) {
        setFrameColorId(color);
      }
    }
    
    // Si tout est là, aller directement à l'étape 3 (Configuration)
    if (model && width && projection) {
      setEtape(3);
    }
  }, [searchParams]);

  useEffect(() => {
    const result = getStorePrice(modelKey, largeur, parseInt(avancee), {
      frameColorId,
      ledCoffre,
      ledBras,
      posePro
    });
    setPrixResult(result);
  }, [modelKey, largeur, avancee, frameColorId, ledCoffre, ledBras, posePro]);

  // Séparer les couleurs par catégorie
  const standardColors = FRAME_COLORS.filter(c => c.category === 'standard');
  const matestColors = FRAME_COLORS.filter(c => c.category === 'matest');
  const customColorOption = FRAME_COLORS.find(c => c.category === 'custom');
  
  // Détection du délai de fabrication
  const selectedColor = FRAME_COLORS.find(c => c.id === frameColorId);
  const hasDelayWarning = selectedColor && (selectedColor.category === 'matest' || selectedColor.category === 'custom');

  const modelData = STORES_DATA[modelKey];
  const canHaveLedCoffre = (modelData?.options?.ledsBoxPrice || 0) > 0;

  // Fonction pour ajouter au panier
  const handleAddToCart = async () => {
    if (!selectedFabric) {
      alert('Veuillez sélectionner une toile');
      return;
    }

    if (prixResult?.error) {
      alert('Configuration invalide. Veuillez vérifier les dimensions.');
      return;
    }

    try {
      // Trouver les noms complets
      const selectedColor = FRAME_COLORS.find(c => c.id === frameColorId);
      
      // Préparer la configuration pour le système existant
      const configuration = {
        modelKey,
        modelName: modelData.name,
        largeur,
        avancee: parseInt(avancee),
        fabricRef: selectedFabric.ref,
        fabricName: selectedFabric.name,
        frameColorId,
        frameColorName: selectedColor?.name || 'Blanc',
        ledCoffre,
        ledBras,
        posePro,
        style: modelData.style,
        description: modelData.description,
      };

      // Ajouter au panier avec le système existant
      await addItem({
        productId: `store-${modelKey}`,
        productType: ProductType.STORE_BANNE,
        productName: modelData.name,
        basePrice: prixResult?.sellingPriceHT || 0,
        configuration: configuration as any,
        quantity: 1,
        pricePerUnit: prixResult?.finalPriceTTC || 0,
      });

      // Rediriger vers le panier
      router.push('/cart');
    } catch (error) {
      console.error('Erreur ajout au panier:', error);
      alert('Erreur lors de l\'ajout au panier');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Container principal - Split Screen */}
      <div className="flex flex-col lg:flex-row lg:h-screen">
        
        {/* GAUCHE - APERÇU VISUEL STICKY */}
        <div className="lg:w-1/2 lg:sticky lg:top-0 lg:h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 order-1">
          <div className="relative w-full max-w-2xl aspect-[4/3]">
            {/* Image de fond - Terrasse */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Terrasse.jpg</span>
              </div>
            </div>
            
            {/* Image Store superposée */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-3/4 h-3/4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-xl flex items-center justify-center transition-all duration-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {modelKey === 'kissimy' ? '🌊' : '⬛'}
                  </div>
                  <p className="text-gray-600 font-semibold">
                    {modelData?.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {largeur}cm × {avancee}cm
                  </p>
                </div>
              </div>
            </div>

            {/* Badge infos */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg z-20">
              <div className="text-xs text-gray-500 mb-1">Votre configuration</div>
              <div className="font-bold text-gray-900">{modelData?.name}</div>
              <div className="text-sm text-gray-600 mt-2 space-y-1">
                {ledCoffre && canHaveLedCoffre && <div>✓ LED Coffre</div>}
                {ledBras && <div>✓ LED Bras</div>}
                {posePro && <div>✓ Pose Pro</div>}
              </div>
            </div>
          </div>
        </div>

        {/* DROITE - FORMULAIRE SCROLLABLE */}
        <div className="lg:w-1/2 overflow-y-auto order-2">
          <div className="max-w-2xl mx-auto p-8 lg:p-12">
            
            {/* En-tête */}
            <div className="mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-3">
                Configurateur
              </h1>
              <p className="text-xl text-gray-500">
                Créez votre store banne sur-mesure
              </p>
            </div>

            {/* Barre de progression */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-2">
                <div className={`flex items-center ${etape >= 1 ? 'text-gray-900' : 'text-gray-300'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${etape >= 1 ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:inline">Style</span>
                </div>
                <div className={`flex-1 h-0.5 mx-4 ${etape >= 2 ? 'bg-gray-900' : 'bg-gray-200'}`} />
                <div className={`flex items-center ${etape >= 2 ? 'text-gray-900' : 'text-gray-300'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${etape >= 2 ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:inline">Toile</span>
                </div>
                <div className={`flex-1 h-0.5 mx-4 ${etape >= 3 ? 'bg-gray-900' : 'bg-gray-200'}`} />
                <div className={`flex items-center ${etape >= 3 ? 'text-gray-900' : 'text-gray-300'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${etape >= 3 ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>
                    3
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:inline">Configuration</span>
                </div>
              </div>
            </div>

            {/* ÉTAPE 1 - CHOIX DU STYLE */}
            {etape === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Choisissez votre style
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Carte Kissimy */}
                  <button
                    onClick={() => setModelKey('kissimy')}
                    className={`group relative p-8 rounded-3xl border-2 transition-all ${
                      modelKey === 'kissimy'
                        ? 'border-gray-900 bg-gray-50 shadow-xl scale-105'
                        : 'border-gray-200 hover:border-gray-400 hover:shadow-lg'
                    }`}
                  >
                    <div className="text-6xl mb-4">🌊</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Style Galbé
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {STORES_DATA.kissimy.description}
                    </p>
                    <div className="space-y-2 text-sm text-left">
                      {STORES_DATA.kissimy.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    {modelKey === 'kissimy' && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Carte Heliom */}
                  <button
                    onClick={() => setModelKey('heliom')}
                    className={`group relative p-8 rounded-3xl border-2 transition-all ${
                      modelKey === 'heliom'
                        ? 'border-gray-900 bg-gray-50 shadow-xl scale-105'
                        : 'border-gray-200 hover:border-gray-400 hover:shadow-lg'
                    }`}
                  >
                    <div className="text-6xl mb-4">⬛</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Style Carré
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {STORES_DATA.heliom.description}
                    </p>
                    <div className="space-y-2 text-sm text-left">
                      {STORES_DATA.heliom.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    {modelKey === 'heliom' && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setEtape(2)}
                  className="w-full mt-8 py-4 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-800 transition-all shadow-lg"
                >
                  Continuer
                </button>
              </div>
            )}

            {/* ÉTAPE 2 - CHOIX DE LA TOILE */}
            {etape === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Choisissez votre Toile
                  </h2>
                  <button
                    onClick={() => setEtape(1)}
                    className="text-sm text-gray-500 hover:text-gray-900 transition"
                  >
                    ← Retour
                  </button>
                </div>

                {/* LES ONGLETS (FILTRES) */}
                <div className="flex space-x-2 border-b border-gray-200 pb-1">
                  {(['uni', 'raye', 'goldies'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFabricFilter(cat)}
                      className={`
                        px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                        ${fabricFilter === cat 
                          ? 'bg-white border-x border-t border-gray-200 text-blue-600' 
                          : 'text-gray-500 hover:text-gray-700 bg-gray-50'}
                      `}
                    >
                      {cat === 'uni' && 'Unis'}
                      {cat === 'raye' && 'Rayés'}
                      {cat === 'goldies' && 'Goldies'}
                    </button>
                  ))}
                </div>

                {/* LA GRILLE D'IMAGES */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 h-64 overflow-y-auto p-1 border border-gray-200 rounded-lg bg-gray-50">
                  {FABRICS
                    .filter(f => f.category === fabricFilter)
                    .map((fabric) => (
                    <button
                      key={fabric.id}
                      onClick={() => setSelectedFabric(fabric)}
                      className={`
                        relative group aspect-square rounded-md overflow-hidden border-2 transition-all
                        ${selectedFabric?.id === fabric.id 
                          ? 'border-blue-600 ring-2 ring-blue-100 scale-95' 
                          : 'border-gray-100 hover:border-gray-300'}
                      `}
                    >
                      {/* CONSTRUCTION DYNAMIQUE DU CHEMIN */}
                      <img 
                        src={`/${fabric.folder.replace('public/', '')}/${fabric.ref}.png`} 
                        alt={`${fabric.name} - Ref ${fabric.ref}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />

                      {/* Badge sélectionné */}
                      {selectedFabric?.id === fabric.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-600/20">
                          <div className="bg-white rounded-full p-1 shadow-sm">
                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                      
                      {/* Tooltip au survol */}
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-white text-center truncate">{fabric.ref}</p>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Indication du choix */}
                {selectedFabric && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center">
                    <span className="font-semibold mr-2">Sélection :</span> 
                    {selectedFabric.name} (Réf. {selectedFabric.ref})
                  </div>
                )}

                <button
                  onClick={() => setEtape(3)}
                  disabled={!selectedFabric}
                  className="w-full mt-8 py-4 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-800 transition-all shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continuer
                </button>
              </div>
            )}

            {/* ÉTAPE 3 - DIMENSIONS & OPTIONS */}
            {etape === 3 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Dimensions & Options
                  </h2>
                  <button
                    onClick={() => setEtape(2)}
                    className="text-sm text-gray-500 hover:text-gray-900 transition"
                  >
                    ← Retour
                  </button>
                </div>

                {/* Largeur */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Largeur (cm)
                  </label>
                  <input
                    type="number"
                    value={largeur}
                    onChange={(e) => setLargeur(Number(e.target.value))}
                    min="200"
                    max="600"
                    className="w-full px-6 py-4 text-2xl font-bold border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition"
                  />
                  <p className="text-sm text-gray-500 mt-2">Entre 200 et 600 cm</p>
                </div>

                {/* Avancée */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Avancée
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setAvancee('250')}
                      className={`py-6 px-4 rounded-2xl font-bold text-xl transition-all ${
                        avancee === '250'
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      250 cm
                    </button>
                    <button
                      onClick={() => setAvancee('300')}
                      className={`py-6 px-4 rounded-2xl font-bold text-xl transition-all ${
                        avancee === '300'
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      300 cm
                    </button>
                  </div>
                </div>

                {/* Options LED */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Options d'éclairage
                  </label>

                  {/* LED Coffre - Uniquement si disponible */}
                  {canHaveLedCoffre && (
                    <label className="flex items-center p-4 rounded-2xl border-2 border-gray-200 hover:border-gray-400 transition cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ledCoffre}
                        onChange={(e) => setLedCoffre(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <div className="ml-4 flex-1">
                        <div className="font-semibold text-gray-900">LED Coffre</div>
                        <div className="text-sm text-gray-600">Éclairage intégré au coffre</div>
                      </div>
                      <div className="text-gray-900 font-bold">
                        +{modelData.options.ledsBoxPrice}€
                      </div>
                    </label>
                  )}

                  {/* LED Bras - Toujours disponible */}
                  <label className="flex items-center p-4 rounded-2xl border-2 border-gray-200 hover:border-gray-400 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ledBras}
                      onChange={(e) => setLedBras(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <div className="ml-4 flex-1">
                      <div className="font-semibold text-gray-900">LED Bras</div>
                      <div className="text-sm text-gray-600">Éclairage sur les bras</div>
                    </div>
                    <div className="text-gray-900 font-bold">
                      +{modelData.options.ledsArms}€
                    </div>
                  </label>

                </div>

                {/* SECTION COULEUR D'ARMATURE */}
                <div className="space-y-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Couleur d'armature
                  </label>

                  {/* GROUPE 1 : COULEURS EN STOCK (Rapide) */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-700">En Stock</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Expédition rapide</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {standardColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setFrameColorId(color.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all ${
                            frameColorId === color.id
                              ? 'border-gray-900 shadow-lg'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <div
                            className="w-full h-12 rounded-lg mb-2 border border-gray-200"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="text-xs font-medium text-gray-900 text-center">
                            {color.name.split(' (')[0]}
                          </div>
                          {frameColorId === color.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* GROUPE 2 : NUANCIER MATEST (Gratuit mais délai) */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-700">Nuancier Matest</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Fabrication sur-mesure</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">Offert</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {matestColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setFrameColorId(color.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all ${
                            frameColorId === color.id
                              ? 'border-gray-900 shadow-lg'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <div
                            className="w-full h-12 rounded-lg mb-2 border border-gray-200"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="text-xs font-medium text-gray-900 text-center">
                            {color.name.split(' (')[0]}
                          </div>
                          <div className="text-xs text-gray-500 text-center mt-1">0€</div>
                          {frameColorId === color.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* GROUPE 3 : DEMANDE SPÉCIALE (Payant) */}
                  {customColorOption && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-700">Demande Spéciale</span>
                      </div>
                      <button
                        onClick={() => setFrameColorId(customColorOption.id)}
                        className={`w-full p-6 rounded-xl border-2 transition-all ${
                          frameColorId === customColorOption.id
                            ? 'border-gray-900 bg-gray-50 shadow-lg'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">Autre RAL Hors Nuancier</div>
                            <div className="text-sm text-gray-600 mt-1">Couleur spécifique de votre choix</div>
                          </div>
                          <div className="text-gray-900 font-bold text-xl">+89€</div>
                        </div>
                        {frameColorId === customColorOption.id && (
                          <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    </div>
                  )}

                  {/* AVERTISSEMENT DÉLAI */}
                  {hasDelayWarning && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-semibold text-amber-900 text-sm">Délai de fabrication supplémentaire</div>
                        <div className="text-sm text-amber-700 mt-1">
                          {selectedColor?.category === 'custom' 
                            ? "Cette couleur nécessite une commande spéciale et prolonge le délai de livraison."
                            : "Cette couleur est fabriquée sur-mesure, un délai supplémentaire s'applique par rapport aux couleurs en stock."}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Switch Installation */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    Installation
                  </label>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {posePro ? 'Pose par un Pro' : 'Je pose moi-même'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {posePro ? 'TVA 10%' : 'TVA 20%'}
                      </div>
                    </div>
                    <button
                      onClick={() => setPosePro(!posePro)}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        posePro ? 'bg-gray-900' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          posePro ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PRIX FINAL - Toujours visible en étape 3 */}
            {etape === 3 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Prix total TTC</div>
                    {prixResult?.error ? (
                      <div className="text-2xl font-bold text-gray-900">Sur Devis</div>
                    ) : (
                      <div className="text-5xl font-bold text-gray-900">
                        {prixResult?.finalPriceTTC?.toLocaleString()}€
                      </div>
                    )}
                    {prixResult && !prixResult.error && (
                      <div className="text-sm text-gray-500 mt-2">
                        HT: {prixResult.sellingPriceHT?.toLocaleString()}€
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    disabled={!selectedFabric || prixResult?.error}
                    className="py-4 px-8 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-800 transition-all shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
