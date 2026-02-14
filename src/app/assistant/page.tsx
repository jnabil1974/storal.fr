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
      <div 
        className="min-h-screen flex flex-col text-white relative bg-[#f5f7fa]"
        style={{
          backgroundImage: 'url("/images/hero-terrasse.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Gradient Overlay - Style AstroTalky */}
        <div className="absolute inset-0 bg-[#2c3e50]/40 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        
        {/* Main Content - Interface Application avec Split View */}
        <main className="relative z-10 flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
          <div className="flex gap-8 h-[calc(100vh-4rem)]">
            
            {/* COLONNE GAUCHE : ChatAssistant (60%) */}
            <div className="w-[60%] bg-white/95 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-100 overflow-hidden text-[#2f2e41] celestial-glow transition-all">
              <ChatAssistant 
                cart={cart} 
                setCart={setCart}
              />
            </div>

            {/* COLONNE DROITE : Dashboard Bento Dynamique (40%) */}
            <div className="w-[40%] rounded-3xl overflow-hidden">
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
