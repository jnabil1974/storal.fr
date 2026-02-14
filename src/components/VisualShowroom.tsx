'use client';

import { STORE_MODELS, FRAME_COLORS, FABRICS } from '@/lib/catalog-data';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface CustomToolCall {
  toolCallId: string;
  toolName: string;
  input: any;
}

interface TerraceState {
  m1: number; // haut
  m2: number; // gauche
  m3: number; // bas
  m4: number; // droite
}

interface VisualShowroomProps {
  activeTool: CustomToolCall | null;
  onSelectColor: (colorId: string, colorName: string) => void;
  onSelectFabric: (fabricId: string, fabricName: string) => void;
  onSelectModel: (modelId: string, modelName: string) => void;
  onTerraceChange?: (dims: TerraceState) => void;
  selectedColorId: string | null;
  selectedFabricId: string | null;
  selectedModelId: string | null;
  hasStartedConversation?: boolean;
  // Offres
  onSelectEco?: (priceHT: number) => void;
  onSelectStandard?: (priceHT: number) => void;
  onSelectPremium?: (priceHT: number) => void;
  ecoCalc?: any;
  standardCalc?: any;
  premiumCalc?: any;
  avec_pose?: boolean;
  // Proposition du store
  proposedStoreWidth?: number;
  proposedStoreHeight?: number;
  // Hint vidéo
  showVideoHint?: boolean;
}

export default function VisualShowroom({
  activeTool,
  onSelectColor,
  onSelectFabric,
  onSelectModel,
  onTerraceChange,
  selectedColorId,
  selectedFabricId,
  selectedModelId,
  onSelectEco,
  onSelectStandard,
  onSelectPremium,
  ecoCalc,
  standardCalc,
  premiumCalc,
  avec_pose = false,
  hasStartedConversation = false,
  proposedStoreWidth,
  proposedStoreHeight,
}: VisualShowroomProps) {
  const [selectedModelForModal, setSelectedModelForModal] = useState<any>(null);

  // Si pas d'outil actif
  if (!activeTool) {
    // Afficher l'image du store banne
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <Image
          src="/images/store-banne/store-banne.jpg"
          alt="Store banne Storal"
          width={800}
          height={600}
          className="w-full h-full object-cover"
          priority
        />
      </div>
    );
  }

  // ✅ AFFICHAGE SÉLECTEUR DE MODÈLES
  if (activeTool.toolName === 'open_model_selector') {
    const { models_to_display, width, depth, frame_color, fabric_color, exposure, with_motor } = activeTool.input;
    const filteredModels = (models_to_display || [])
      .map((id: string) => Object.values(STORE_MODELS).find((m: any) => m.id === id))
      .filter(Boolean);

    return (
      <div className="animate-fade-in h-full overflow-y-auto">
        <div className="p-6 space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Choisissez votre store</h3>
          
          {/* Affichage en grille de modèles */}
          <div className="space-y-3">
            {(filteredModels as any[]).map((model) => {
              const isSelected = selectedModelId === model.id;
              return (
                <div
                  key={model.id}
                  className={`border-2 rounded-xl overflow-hidden p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-4 border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-blue-500 hover:shadow-lg'
                  }`}
                  onClick={() => onSelectModel(model.id, model.name)}
                >
                  <div className="relative w-full h-32 bg-gray-100 rounded mb-3">
                    <Image src={model.image} alt={model.name} fill className="object-cover rounded" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{model.name}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{model.description}</p>
                  {isSelected && <div className="mt-2 text-green-600 font-bold text-sm">✅ Sélectionné</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ✅ AFFICHAGE SÉLECTEUR DE COULEURS
  if (activeTool.toolName === 'open_color_selector') {
    return (
      <div className="animate-fade-in h-full overflow-y-auto">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Couleur de l'Armature</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {FRAME_COLORS.map((color) => {
              const isSelected = selectedColorId === color.id;
              return (
                <button
                  key={color.id}
                  onClick={() => onSelectColor(color.id, color.name)}
                  className={`p-4 rounded-lg border-2 transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'border-4 border-green-500 ring-2 ring-green-300 shadow-lg'
                      : 'border-gray-300 hover:border-gray-500 hover:shadow-md'
                  }`}
                >
                  <div
                    className="w-full h-20 rounded-lg mb-2 border-2 border-gray-400"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-xs font-semibold text-gray-900">{color.name}</p>
                  {color.price > 0 && <p className="text-xs text-orange-600">+{color.price}€</p>}
                  {isSelected && <p className="text-xs text-green-600 font-bold mt-1">✅</p>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ✅ AFFICHAGE SÉLECTEUR DE TOILES
  if (activeTool.toolName === 'open_fabric_selector') {
    return (
      <div className="animate-fade-in h-full overflow-y-auto">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Choisissez votre Toile</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {FABRICS.map((fabric) => {
              const isSelected = selectedFabricId === fabric.id;
              return (
                <button
                  key={fabric.id}
                  onClick={() => onSelectFabric(fabric.id, fabric.name)}
                  className={`p-3 rounded-lg border-2 transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'border-4 border-green-500 ring-2 ring-green-300 shadow-lg'
                      : 'border-gray-300 hover:border-gray-500 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{fabric.ref}</p>
                      <p className="text-sm text-gray-600">{fabric.name}</p>
                    </div>
                    <div className="text-right">
                      {fabric.price > 0 && <p className="text-xs text-blue-600 font-bold">+{fabric.price}€</p>}
                      {isSelected && <p className="text-xs text-green-600 font-bold">✅</p>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ✅ AFFICHAGE TRIPLE OFFRE
  if (activeTool.toolName === 'display_triple_offer') {
    const { width, depth, selected_model } = activeTool.input;

    return (
      <div className="animate-fade-in h-full overflow-y-auto">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Votre Triple Offre</h3>
          <p className="text-xs text-gray-600 mb-6">
            Configuration : {width}cm × {depth}cm {selected_model ? `| ${selected_model}` : ''}
          </p>

          <div className="space-y-3">
            {/* ECO */}
            {ecoCalc && (
              <button
                onClick={() => onSelectEco?.(ecoCalc.totalTTC)}
                className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left cursor-pointer bg-white"
              >
                <h4 className="font-bold text-lg mb-1">💚 Eco</h4>
                <p className="text-3xl font-bold text-gray-900 mb-2">{ecoCalc.totalTTC}€ TTC</p>
                <p className="text-xs text-gray-500">Store: {ecoCalc.storeHT}€ HT</p>
                {avec_pose && <p className="text-xs text-gray-500">Pose: {ecoCalc.poseHT}€ HT</p>}
                <p className="text-xs text-gray-500">TVA {ecoCalc.tauxTVA}%: +{ecoCalc.tvaMontant}€</p>
              </button>
            )}

            {/* STANDARD */}
            {standardCalc && (
              <button
                onClick={() => onSelectStandard?.(standardCalc.totalTTC)}
                className="w-full p-4 rounded-lg border-4 border-blue-600 shadow-xl hover:shadow-2xl transition-all text-left cursor-pointer bg-white relative"
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  RECOMMANDÉ
                </div>
                <h4 className="font-bold text-lg text-blue-600 mb-1">⭐ Standard</h4>
                <p className="text-4xl font-bold text-blue-600 mb-2">{standardCalc.totalTTC}€ TTC</p>
                <p className="text-xs text-gray-500">Store: {standardCalc.storeHT}€ HT</p>
                {avec_pose && <p className="text-xs text-gray-500">Pose: {standardCalc.poseHT}€ HT</p>}
                <p className="text-xs text-gray-500">TVA {standardCalc.tauxTVA}%: +{standardCalc.tvaMontant}€</p>
              </button>
            )}

            {/* PREMIUM */}
            {premiumCalc && (
              <button
                onClick={() => onSelectPremium?.(premiumCalc.totalTTC)}
                className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all text-left cursor-pointer bg-white"
              >
                <h4 className="font-bold text-lg mb-1">👑 Premium</h4>
                <p className="text-3xl font-bold text-gray-900 mb-2">{premiumCalc.totalTTC}€ TTC</p>
                <p className="text-xs text-gray-500">Store: {premiumCalc.storeHT}€ HT</p>
                {avec_pose && <p className="text-xs text-gray-500">Pose: {premiumCalc.poseHT}€ HT</p>}
                <p className="text-xs text-gray-500">TVA {premiumCalc.tauxTVA}%: +{premiumCalc.tvaMontant}€</p>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
