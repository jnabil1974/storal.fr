'use client';

import { useState } from 'react';
import ChatAssistant from '@/components/ChatAssistant';

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

export default function AssistantPage() {
  const [cart, setCart] = useState<Cart | null>(null);

  return (
    <div className="h-screen w-full bg-white">
      {/* ChatAssistant gère maintenant la layout 50/50 complète */}
      <ChatAssistant cart={cart} setCart={setCart} />
    </div>
  );
}
