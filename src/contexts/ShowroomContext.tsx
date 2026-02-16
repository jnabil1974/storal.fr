// Context pour partager l'état du Showroom entre ChatAssistant et la page principale
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react';

interface TerraceState {
  m1: number;
  m2: number;
  m3: number;
  m4: number;
}

interface CustomToolCall {
  toolCallId: string;
  toolName: string;
  input: any;
}

export interface ShowroomState {
  // Tool actif
  activeTool: CustomToolCall | null;
  
  // Sélections actuelles
  selectedColorId: string | null;
  selectedFabricId: string | null;
  selectedModelId: string | null;
  
  // Dimensions proposées
  proposedStoreWidth?: number;
  proposedStoreHeight?: number;
  
  // Offres calculées
  ecoCalc?: any;
  standardCalc?: any;
  premiumCalc?: any;
  singleOfferCalc?: any; // Nouvelle offre unique personnalisée
  avec_pose?: boolean;
  
  // Statut conversation
  hasStartedConversation: boolean;
  showVideoHint?: boolean;
  
  // Callbacks pour les actions du showroom
  onSelectColor?: (colorId: string, colorName: string) => void;
  onSelectFabric?: (fabricId: string, fabricName: string) => void;
  onSelectModel?: (modelId: string, modelName: string) => void;
  onSelectEco?: (priceHT: number) => void;
  onSelectStandard?: (priceHT: number) => void;
  onSelectPremium?: (priceHT: number) => void;
  onSelectOffer?: (priceTTC: number) => void; // Pour l'offre unique
  onTerraceChange?: (dims: TerraceState) => void;
}

interface ShowroomContextType {
  showroomState: ShowroomState;
  setShowroomState: Dispatch<SetStateAction<ShowroomState>>;
}

const ShowroomContext = createContext<ShowroomContextType | null>(null);

export function ShowroomProvider({ children }: { children: ReactNode }) {
  const [showroomState, setShowroomState] = useState<ShowroomState>({
    activeTool: null,
    selectedColorId: null,
    selectedFabricId: null,
    selectedModelId: null,
    hasStartedConversation: false,
  });

  // 🔍 Log pour déboguer les changements du ShowroomContext
  useEffect(() => {
    console.log('🏠 ShowroomContext STATE CHANGED:', JSON.stringify({
      selectedModelId: showroomState.selectedModelId,
      selectedColorId: showroomState.selectedColorId,
      selectedFabricId: showroomState.selectedFabricId,
      activeTool: showroomState.activeTool?.toolName
    }, null, 2));
  }, [showroomState]);

  return (
    <ShowroomContext.Provider value={{ showroomState, setShowroomState }}>
      {children}
    </ShowroomContext.Provider>
  );
}

export function useShowroom() {
  const context = useContext(ShowroomContext);
  if (!context) {
    throw new Error('useShowroom must be used within ShowroomProvider');
  }
  return context;
}
