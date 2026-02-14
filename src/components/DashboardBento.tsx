'use client';

import { useShowroom } from '@/contexts/ShowroomContext';
import { STORE_MODELS, FRAME_COLORS, FABRICS, type Fabric, type FrameColor } from '@/lib/catalog-data';
import { useEffect, useState } from 'react';

export default function DashboardBento() {
  const { showroomState } = useShowroom();
  const [highlightedTile, setHighlightedTile] = useState<string | null>(null);

  // Déterminer quelle tuile illuminer selon le contexte
  useEffect(() => {
    if (!showroomState.activeTool) {
      setHighlightedTile(null);
      return;
    }

    const toolName = showroomState.activeTool.toolName;
    
    if (toolName === 'display_triple_offer' || showroomState.ecoCalc || showroomState.standardCalc || showroomState.premiumCalc) {
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

  // Récupérer les données sélectionnées
  const selectedModel = showroomState.selectedModelId 
    ? STORE_MODELS[showroomState.selectedModelId] 
    : null;
  
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

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header Simplifié */}
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#2c3e50] mb-2">Dashboard Projet</h2>
        <p className="text-gray-600 text-sm">Suivi en temps réel de votre configuration</p>
      </div>

      {/* Grille Bento */}
      <div className="grid grid-cols-2 gap-4 auto-rows-min">
        
        {/* TUILE PRIX - Large (2 colonnes) */}
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
          
          {showroomState.ecoCalc || showroomState.standardCalc || showroomState.premiumCalc ? (
            <div className="grid grid-cols-3 gap-3">
              {showroomState.ecoCalc && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold mb-1">Éco</p>
                  <p className="text-2xl font-black text-blue-900">{showroomState.ecoCalc.totalTTC?.toFixed(2) || '—'}€</p>
                  <p className="text-xs text-blue-600 mt-1">TTC</p>
                </div>
              )}
              {showroomState.standardCalc && (
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-3 border border-indigo-200">
                  <p className="text-xs text-indigo-600 font-semibold mb-1">Standard</p>
                  <p className="text-2xl font-black text-indigo-900">{showroomState.standardCalc.totalTTC?.toFixed(2) || '—'}€</p>
                  <p className="text-xs text-indigo-600 mt-1">TTC</p>
                </div>
              )}
              {showroomState.premiumCalc && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
                  <p className="text-xs text-purple-600 font-semibold mb-1">Premium</p>
                  <p className="text-2xl font-black text-purple-900">{showroomState.premiumCalc.totalTTC?.toFixed(2) || '—'}€</p>
                  <p className="text-xs text-purple-600 mt-1">TTC</p>
                </div>
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

        {/* TUILE MODÈLE */}
        <div className={tileClass('modele', 'col-span-1 row-span-2')}>
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
                  <span className="text-lg font-bold text-gray-900">{showroomState.proposedStoreWidth} cm</span>
                </div>
              )}
              {showroomState.proposedStoreHeight && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Hauteur</span>
                  <span className="text-lg font-bold text-gray-900">{showroomState.proposedStoreHeight} cm</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">
              <p className="text-xs">Non défini</p>
            </div>
          )}
        </div>

        {/* TUILE TOILE/COULEUR */}
        <div className={tileClass('toile', 'col-span-1')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm">Finition</h3>
              <p className="text-xs text-gray-500">Toile & Couleur</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {selectedFabric && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-2 border border-orange-200">
                <p className="text-xs text-gray-600 mb-1">Toile</p>
                <p className="font-bold text-gray-900 text-sm">{selectedFabric.name}</p>
              </div>
            )}
            {selectedColor && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Couleur Coffre</p>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-lg border-2 border-white shadow"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <p className="font-bold text-gray-900 text-sm">{selectedColor.name}</p>
                </div>
              </div>
            )}
            {!selectedFabric && !selectedColor && (
              <div className="text-center py-4 text-gray-400">
                <p className="text-xs">Non défini</p>
              </div>
            )}
          </div>
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
                {showroomState.ecoCalc ? 'Devis prêt' : 
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

      </div>

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
  );
}
