'use client';

import { useState, useEffect, useCallback } from 'react';
import ChatAssistant from './ChatAssistant';
import VisualShowroom from './VisualShowroom';
import MarketingShowcase from './MarketingShowcase';

interface CustomToolCall {
  toolCallId: string;
  toolName: string;
  input: any;
}

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
}

interface TerraceState {
  m1: number;
  m2: number;
  m3: number;
  m4: number;
}

interface ProjectConfiguratorProps {
  modelToConfig?: string | null;
}

export default function ProjectConfigurator({ modelToConfig = null }: ProjectConfiguratorProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false); // TRUE quand dimensions détectées
  const [terrace, setTerrace] = useState<TerraceState | null>(null);
  const [activeTool, setActiveTool] = useState<CustomToolCall | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'project'>('chat'); // Mobile tabs
  const [isMobile, setIsMobile] = useState(false);
  const [sendTerraceMessageFn, setSendTerraceMessageFn] = useState<((dims: TerraceState) => void) | undefined>();

  // Detect mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('storal-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      }
    } catch (error) {
      console.error("❌ Erreur chargement panier", error);
    }
  }, []);

  // Auto-enable configuration mode when user interacts with chat
  // This will trigger the VisualShowroom to appear
  const enableConfigurationMode = () => {
    if (!isConfiguring) {
      setIsConfiguring(true);
    }
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart) {
      localStorage.setItem('storal-cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Transition to configuration mode when terrace dimensions are detected
  const handleTerraceDetected = (dims: TerraceState) => {
    setTerrace(dims);
    setIsConfiguring(true);
  };

  // Handle terrace message callback from ChatAssistant
  const handleAddTerraceMessage = useCallback((callback: (dims: TerraceState) => void) => {
    console.log('📝 ProjectConfigurator: Received terrace callback from ChatAssistant');
    setSendTerraceMessageFn(callback);
  }, []);

  // Debug: Log when sendTerraceMessageFn is set
  useEffect(() => {
    console.log('🔄 ProjectConfigurator: sendTerraceMessageFn updated:', typeof sendTerraceMessageFn);
  }, [sendTerraceMessageFn]);

  // Create a stable wrapper function that always works, even if callback not yet registered
  const stableSendTerraceMessage = useCallback((dims: TerraceState) => {
    console.log('🔗 stableSendTerraceMessage called with:', dims);
    if (sendTerraceMessageFn) {
      console.log('✅ Calling sendTerraceMessageFn');
      sendTerraceMessageFn(dims);
    } else {
      console.warn('⚠️ sendTerraceMessageFn is still undefined! Callback not yet registered from ChatAssistant');
    }
  }, [sendTerraceMessageFn]);

  // Desktop Layout (40/60 Split Screen)
  if (!isMobile) {
    return (
      <div className="flex h-screen bg-white">
        {/* LEFT COLUMN (40%) - CHAT ONLY */}
        <div className="w-[40%] bg-white border-r border-gray-200 flex flex-col">
          <ChatAssistant 
            modelToConfig={modelToConfig} 
            cart={cart} 
            setCart={setCart} 
            onTerraceDetected={handleTerraceDetected}
            onTerraceMessage={handleAddTerraceMessage}
            onUserInteraction={enableConfigurationMode}
            onToolChange={setActiveTool}
          />
        </div>

        {/* RIGHT COLUMN (60%) - CONDITIONAL CONTENT */}
        <div className="w-[60%] bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col overflow-hidden">
          {!isConfiguring ? (
            // MARKETING MODE
            <MarketingShowcase />
          ) : (
            // CONFIGURATION MODE - Full VisualShowroom
            <VisualShowroom
              activeTool={activeTool}
              onSelectColor={(colorId, colorName) => {
                setCart(c => c ? { ...c, colorId } : null);
              }}
              onSelectFabric={(fabricId, fabricName) => {
                setCart(c => c ? { ...c, fabricId } : null);
              }}
              onSelectModel={(modelId, modelName) => {
                setCart(c => c ? { ...c, modelId, modelName } : null);
              }}
              onTerraceChange={handleTerraceDetected}
              onSendTerraceMessage={stableSendTerraceMessage}
              selectedColorId={cart?.colorId || null}
              selectedFabricId={cart?.fabricId || null}
              selectedModelId={cart?.modelId || null}
              hasStartedConversation={isConfiguring}
              proposedStoreWidth={cart?.width ? cart.width / 100 : undefined}
              proposedStoreHeight={cart?.projection ? cart.projection / 100 : undefined}
              ecoCalc={cart?.priceEco ? { total_ht: cart.priceEco } : undefined}
              standardCalc={cart?.priceStandard ? { total_ht: cart.priceStandard } : undefined}
              premiumCalc={cart?.pricePremium ? { total_ht: cart.pricePremium } : undefined}
            />
          )}
        </div>
      </div>
    );
  }

  // Mobile Layout (Tabs)
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile Tab Navigation */}
      <div className="flex gap-0 border-b border-gray-200 bg-white sticky top-0 z-40">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-4 font-semibold transition-colors border-b-2 ${
            activeTab === 'chat'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          💬 Chat
        </button>
        <button
          onClick={() => setActiveTab('project')}
          className={`flex-1 py-4 font-semibold transition-colors border-b-2 relative ${
            activeTab === 'project'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          🏠 Mon Projet
          {/* Red notification dot when project is updated */}
          {isConfiguring && (
            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'chat' ? (
          <div className="h-full">
            <ChatAssistant 
              modelToConfig={modelToConfig} 
              cart={cart} 
              setCart={setCart} 
              onTerraceDetected={handleTerraceDetected}
              onTerraceMessage={handleAddTerraceMessage}
              onUserInteraction={enableConfigurationMode}
              onToolChange={setActiveTool}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {!isConfiguring ? (
              <MarketingShowcase />
            ) : (
              <VisualShowroom
                activeTool={activeTool}
                onSelectColor={(colorId, colorName) => {
                  setCart(c => c ? { ...c, colorId } : null);
                }}
                onSelectFabric={(fabricId, fabricName) => {
                  setCart(c => c ? { ...c, fabricId } : null);
                }}
                onSelectModel={(modelId, modelName) => {
                  setCart(c => c ? { ...c, modelId, modelName } : null);
                }}
                onTerraceChange={handleTerraceDetected}
                onSendTerraceMessage={stableSendTerraceMessage}
                selectedColorId={cart?.colorId || null}
                selectedFabricId={cart?.fabricId || null}
                selectedModelId={cart?.modelId || null}
                hasStartedConversation={isConfiguring}
                proposedStoreWidth={cart?.width ? cart.width / 100 : undefined}
                proposedStoreHeight={cart?.projection ? cart.projection / 100 : undefined}
                ecoCalc={cart?.priceEco ? { total_ht: cart.priceEco } : undefined}
                standardCalc={cart?.priceStandard ? { total_ht: cart.priceStandard } : undefined}
                premiumCalc={cart?.pricePremium ? { total_ht: cart.pricePremium } : undefined}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
