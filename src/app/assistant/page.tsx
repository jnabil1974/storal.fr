'use client';

import { useState } from 'react';
import ChatAssistant from '@/components/ChatAssistant';
import VisualShowroom from '@/components/VisualShowroom';
import { ShowroomProvider, useShowroom } from '@/contexts/ShowroomContext';

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
  storeHT?: number;
  ledArmsPrice?: number;
  ledBoxPrice?: number;
  lambrequinPrice?: number;
  poseHT?: number;
  tvaAmount?: number;
}

function AssistantContent() {
  const [cart, setCart] = useState<Cart | null>(null);
  const { showroomState } = useShowroom();

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b1d3a] via-[#10264c] to-[#173165] text-white">
        {/* Header avec système de rassurance */}
        <header className="sticky top-0 z-50 bg-[#0b1d3a]/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            {/* Logo + Titre */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">Expert Storal AI</h1>
                <p className="text-sm text-white/60 font-medium">Votre conseiller intelligent en stores</p>
              </div>
            </div>

            {/* Système de rassurance - 3 points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* 1. Pas d'erreur possible */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-sm mb-1 text-white">Pas d&apos;erreur possible</h3>
                    <p className="text-xs text-white/70 leading-relaxed">Notre IA calcule automatiquement les dimensions exactes et vérifie la faisabilité technique</p>
                  </div>
                </div>
              </div>

              {/* 2. Visio-expertise */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-sm mb-1 text-white">Visio-expertise gratuite</h3>
                    <p className="text-xs text-white/70 leading-relaxed">Un expert Storal peut prendre le relais en visio pour affiner votre projet si besoin</p>
                  </div>
                </div>
              </div>

              {/* 3. Devis instantané */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-sm mb-1 text-white">Devis instantané et précis</h3>
                    <p className="text-xs text-white/70 leading-relaxed">Tarifs transparents calculés en temps réel selon votre configuration exacte</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Interface Application avec Split View */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-6 h-[calc(100vh-220px)] min-h-[600px]">
            
            {/* COLONNE GAUCHE : ChatAssistant (60%) */}
            <div className="w-[60%] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/20 border border-white/20 overflow-hidden text-gray-900">
              <ChatAssistant 
                cart={cart} 
                setCart={setCart}
              />
            </div>

            {/* COLONNE DROITE : VisualShowroom (40%) */}
            <div className="w-[40%] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/20 border border-white/20 overflow-hidden">
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

          </div>
        </main>
      </div>
  );
}

export default function AssistantPage() {
  return (
    <ShowroomProvider>
      <AssistantContent />
    </ShowroomProvider>
  );
}
