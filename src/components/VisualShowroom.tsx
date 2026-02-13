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
}

const TerraceVisualizer: React.FC<{ 
  onDimensionsChange?: (dims: TerraceState) => void 
}> = ({ onDimensionsChange }) => {
  const [terrace, setTerrace] = useState<TerraceState>({
    m1: 4,
    m2: 3,
    m3: 4,
    m4: 3,
  });

  const handleDimensionChange = (side: keyof TerraceState, value: string) => {
    const num = parseFloat(value) || 0;
    const newState = { ...terrace, [side]: num };
    setTerrace(newState);
  };

  const handleValidate = () => {
    onDimensionsChange?.(terrace);
  };

  // Calcul dynamique pour trapèze adaptive
  const maxDim = Math.max(terrace.m1, terrace.m2, terrace.m3, terrace.m4, 1);
  const scale = 60 / maxDim; // 60 pixels par mètre
  
  const widthTop = terrace.m1 * scale;
  const widthBottom = terrace.m3 * scale;
  const height = terrace.m2 * scale;
  
  const padding = 40;
  const maxWidth = Math.max(widthTop, widthBottom);
  const svgWidth = maxWidth + padding * 2;
  const svgHeight = height + padding * 2;

  // Centre horizontale pour le trapèze
  const centerX = padding + maxWidth / 2;
  
  // Points du trapèze
  const trapezoid = {
    topLeft: [centerX - widthTop / 2, padding],
    topRight: [centerX + widthTop / 2, padding],
    bottomLeft: [centerX - widthBottom / 2, padding + height],
    bottomRight: [centerX + widthBottom / 2, padding + height],
  };
  
  const polygonPoints = `${trapezoid.topLeft[0]},${trapezoid.topLeft[1]} ${trapezoid.topRight[0]},${trapezoid.topRight[1]} ${trapezoid.bottomRight[0]},${trapezoid.bottomRight[1]} ${trapezoid.bottomLeft[0]},${trapezoid.bottomLeft[1]}`;

  // Positions pour les labels
  const y1 = padding;
  const y2 = padding + height;
  const x1_label = centerX - widthTop / 2;
  const x2_label = centerX + widthTop / 2;
  const x3_label = centerX - widthBottom / 2;
  const x4_label = centerX + widthBottom / 2;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Titre - Même style que le header du chat */}
      <header className="bg-gray-900 text-white p-4 flex-shrink-0">
        <h3 className="text-xl font-bold">Vue de Votre Terrasse</h3>
        <p className="text-sm text-gray-300">Entrez les dimensions de vos murs (en mètres)</p>
      </header>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

      {/* Inputs pour les dimensions */}
      <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
        {/* M1 - Haut */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-700 mb-1">M1 (haut)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={terrace.m1}
            onChange={(e) => handleDimensionChange('m1', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="M1"
          />
        </div>

        {/* M2 - Gauche */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-700 mb-1">M2 (gauche)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={terrace.m2}
            onChange={(e) => handleDimensionChange('m2', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="M2"
          />
        </div>

        {/* M3 - Bas */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-700 mb-1">M3 (bas)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={terrace.m3}
            onChange={(e) => handleDimensionChange('m3', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="M3"
          />
        </div>

        {/* M4 - Droite */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-700 mb-1">M4 (droite)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={terrace.m4}
            onChange={(e) => handleDimensionChange('m4', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="M4"
          />
        </div>
      </div>

      {/* Bouton Valider */}
      <button
        onClick={handleValidate}
        className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg text-base"
      >
        ✅ Valider les dimensions
      </button>

      {/* Visualization SVG */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 overflow-auto">
        <svg
          width={Math.min(svgWidth * 2.5, 700)}
          height={Math.min(svgHeight * 2.5, 700)}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="border-2 border-gray-300 bg-white rounded shadow-lg"
        >
          {/* Trapèze central (terrasse) */}
          <polygon
            points={polygonPoints}
            fill="#a3d977"
            stroke="#558b2f"
            strokeWidth="1.5"
          />

          {/* Hachures légères */}
          <defs>
            <pattern
              id="hatch"
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
            >
              <path
                d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4"
                stroke="#558b2f"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <polygon
            points={polygonPoints}
            fill="url(#hatch)"
          />

          {/* M1 - Haut */}
          <text
            x={centerX}
            y={y1 - 12}
            textAnchor="middle"
            className="font-bold fill-blue-600"
            fontSize="11"
            fontWeight="bold"
          >
            M1: {terrace.m1.toFixed(2)}m
          </text>
          <line x1={x1_label} y1={y1 - 5} x2={x2_label} y2={y1 - 5} stroke="#3b82f6" strokeWidth="1" />
          <line x1={x1_label} y1={y1 - 8} x2={x1_label} y2={y1 - 2} stroke="#3b82f6" strokeWidth="1" />
          <line x1={x2_label} y1={y1 - 8} x2={x2_label} y2={y1 - 2} stroke="#3b82f6" strokeWidth="1" />

          {/* M2 - Gauche */}
          <text
            x={centerX - Math.max(widthTop, widthBottom) / 2 - 30}
            y={(y1 + y2) / 2}
            textAnchor="middle"
            className="font-bold fill-purple-600"
            fontSize="11"
            fontWeight="bold"
            dy="0.3em"
          >
            M2: {terrace.m2.toFixed(2)}m
          </text>
          <line x1={centerX - Math.max(widthTop, widthBottom) / 2 - 5} y1={y1} y2={y2} x2={centerX - Math.max(widthTop, widthBottom) / 2 - 5} stroke="#a855f7" strokeWidth="1" />
          <line x1={centerX - Math.max(widthTop, widthBottom) / 2 - 8} y1={y1} x2={centerX - Math.max(widthTop, widthBottom) / 2 - 2} y2={y1} stroke="#a855f7" strokeWidth="1" />
          <line x1={centerX - Math.max(widthTop, widthBottom) / 2 - 8} y1={y2} x2={centerX - Math.max(widthTop, widthBottom) / 2 - 2} y2={y2} stroke="#a855f7" strokeWidth="1" />

          {/* M3 - Bas */}
          <text
            x={centerX}
            y={y2 + 20}
            textAnchor="middle"
            className="font-bold fill-orange-600"
            fontSize="11"
            fontWeight="bold"
          >
            M3: {terrace.m3.toFixed(2)}m
          </text>
          <line x1={x3_label} y1={y2 + 5} x2={x4_label} y2={y2 + 5} stroke="#ea580c" strokeWidth="1" />
          <line x1={x3_label} y1={y2 + 2} x2={x3_label} y2={y2 + 8} stroke="#ea580c" strokeWidth="1" />
          <line x1={x4_label} y1={y2 + 2} x2={x4_label} y2={y2 + 8} stroke="#ea580c" strokeWidth="1" />

          {/* M4 - Droite */}
          <text
            x={centerX + Math.max(widthTop, widthBottom) / 2 + 30}
            y={(y1 + y2) / 2}
            textAnchor="middle"
            className="font-bold fill-red-600"
            fontSize="11"
            fontWeight="bold"
            dy="0.3em"
          >
            M4: {terrace.m4.toFixed(2)}m
          </text>
          <line x1={centerX + Math.max(widthTop, widthBottom) / 2 + 5} y1={y1} y2={y2} x2={centerX + Math.max(widthTop, widthBottom) / 2 + 5} stroke="#dc2626" strokeWidth="1" />
          <line x1={centerX + Math.max(widthTop, widthBottom) / 2 + 2} y1={y1} x2={centerX + Math.max(widthTop, widthBottom) / 2 + 8} y2={y1} stroke="#dc2626" strokeWidth="1" />
          <line x1={centerX + Math.max(widthTop, widthBottom) / 2 + 2} y1={y2} x2={centerX + Math.max(widthTop, widthBottom) / 2 + 8} y2={y2} stroke="#dc2626" strokeWidth="1" />

          {/* Texte central */}
          <text
            x={centerX}
            y={(y1 + y2) / 2}
            textAnchor="middle"
            className="font-bold fill-gray-700"
            fontSize="10"
            fontWeight="bold"
            dy="0.3em"
          >
            Votre terrasse
          </text>
        </svg>
      </div>

      {/* Légende */}
      <div className="text-xs text-gray-600 text-center">
        <p className="font-semibold text-gray-700 mb-1">Légende des murs:</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-600 rounded"></span> M1 (haut)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 bg-purple-600 rounded"></span> M2 (gauche)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 bg-orange-600 rounded"></span> M3 (bas)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 bg-red-600 rounded"></span> M4 (droite)
          </span>
        </div>
      </div>
      </div>
    </div>
  );
};

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
}: VisualShowroomProps) {
  const [selectedModelForModal, setSelectedModelForModal] = useState<any>(null);

  // Si pas d'outil actif
  if (!activeTool) {
    // Si la conversation a commencé, afficher le TerraceVisualizer pour entrer les dimensions
    if (hasStartedConversation) {
      return (
        <div className="w-full h-full flex flex-col overflow-y-auto">
          <TerraceVisualizer onDimensionsChange={onTerraceChange} />
        </div>
      );
    }
    
    // Sinon, afficher l'image du store banne
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
