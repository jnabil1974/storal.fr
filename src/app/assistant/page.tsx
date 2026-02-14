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
        {/* Main Content - Interface Application avec Split View */}
        <main className="flex-1 max-w-7xl mx-auto px-6 py-6 overflow-hidden w-full">
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
