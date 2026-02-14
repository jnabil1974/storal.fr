'use client';

import { useState } from 'react';
import ChatAssistant from '@/components/ChatAssistant';
import DashboardBento from '@/components/DashboardBento';
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

  return (
      <div className="h-screen flex flex-col text-white">
        {/* Header Mode App - Simplifié */}
        <header className="sticky top-0 z-50 bg-[#0b1d3a]/90 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Logo + Titre Compact */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-black tracking-tight">Expert Storal AI</h1>
                  <p className="text-xs text-white/60">Assistant personnalisé</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-3">
                <div className="text-xs text-white/60 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                  ✅ Devis instantané
                </div>
                <div className="text-xs text-white/60 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                  🎥 Visio gratuite
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Interface Application avec Split View */}
        <main className="flex-1 max-w-7xl mx-auto px-6 py-6 overflow-hidden">
          <div className="flex gap-6 h-full">
            
            {/* COLONNE GAUCHE : ChatAssistant (60%) */}
            <div className="w-[60%] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/20 border border-white/20 overflow-hidden text-gray-900">
              <ChatAssistant 
                cart={cart} 
                setCart={setCart}
              />
            </div>

            {/* COLONNE DROITE : Dashboard Bento Dynamique (40%) */}
            <div className="w-[40%] bg-transparent rounded-3xl overflow-hidden">
              <DashboardBento />
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
