'use client';

import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { STORE_MODELS, type StoreModel, FRAME_COLORS, FABRICS } from '@/lib/catalog-data';

// --- Types ---
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

interface ChatAssistantProps {
  modelToConfig?: string | null;
  cart: Cart | null;
  setCart: Dispatch<SetStateAction<Cart | null>>;
}

const ProductModal = ({ model, onClose }: { model: StoreModel | null; onClose: () => void }) => {
  if (!model) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <header className="p-4 border-b flex justify-between items-center"><h2 className="text-2xl font-bold">{model.name}</h2><button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-3xl">&times;</button></header>
        <div className="overflow-y-auto p-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="relative w-full h-80 rounded-lg overflow-hidden"><Image src={`/images/models/${model.id.toUpperCase()}.png`} alt={model.name} fill className="object-cover" /></div><div><h3 className="text-xl font-semibold mb-3">Détails Techniques</h3><ul className="space-y-2 text-gray-700">{model.features.map((feature, idx) => (<li key={idx} className="flex items-start"><span className="text-blue-600 mr-2 font-bold">✓</span>{feature}</li>))}<li><span className="text-blue-600 mr-2 font-bold">✓</span>Armature en aluminium extrudé</li><li><span className="text-blue-600 mr-2 font-bold">✓</span>Visserie d'assemblage en inox</li><li><span className="text-blue-600 mr-2 font-bold">✓</span>Garantie structure : 5 ans</li></ul></div></div></div>
        <footer className="p-4 bg-gray-50 border-t rounded-b-2xl text-right"><button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Fermer</button></footer>
      </div>
    </div>
  );
};

export default function ChatAssistant({ modelToConfig, cart, setCart }: ChatAssistantProps) {
  const [input, setInput] = useState('');
  
  // ChatID persistant pour conserver l'historique
  const [chatId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('storal-chat-id');
      if (!id) {
        id = `chat-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        localStorage.setItem('storal-chat-id', id);
      }
      console.log('🆔 Chat ID utilisé:', id);
      return id;
    }
    return `chat-${Date.now()}`;
  });
  
  const [activeTool, setActiveTool] = useState<CustomToolCall | null>(null);
  const [toolHistory, setToolHistory] = useState<CustomToolCall[]>([]);  // 🔥 Historique des outils
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);  // 🔥 Modèle sélectionné
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);  // 🔥 Couleur sélectionnée
  const [selectedFabricId, setSelectedFabricId] = useState<string | null>(null);  // 🔥 Toile sélectionnée
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModelForModal, setSelectedModelForModal] = useState<StoreModel | null>(null);
  const [initialMessageSent, setInitialMessageSent] = useState(false);

  // Fonction pour sauvegarder dans localStorage
  const saveToCart = (updates: Partial<Cart>) => {
    const newCart = { ...cart, ...updates } as Cart;
    setCart(newCart);
    localStorage.setItem('storal-cart', JSON.stringify(newCart));
    console.log('💾 Configuration sauvegardée:', newCart);
  };

  // 🔥 Sauvegarder automatiquement la configuration quand l'outil change
  useEffect(() => {
    if (activeTool?.toolName === 'open_model_selector') {
      const input = (activeTool.input as Record<string, unknown>) || {};
      const width = input.width as number || null;
      const depth = input.depth as number || null;
      const frameColor = input.frame_color as string || null;
      const fabricColor = input.fabric_color as string || null;
      const exposure = input.exposure as string || null;
      const withMotor = input.with_motor !== undefined ? input.with_motor as boolean : true;
      
      if (width || depth || frameColor || fabricColor || exposure) {
        saveToCart({ 
          width, 
          projection: depth,
          colorId: frameColor,
          fabricId: fabricColor,
          exposure,
          withMotor
        });
      }
    }
    
    if (activeTool?.toolName === 'display_triple_offer') {
      const input = activeTool.input as any;
      const { standard, confort, premium, selected_model, width, depth, frame_color, fabric_color, exposure, with_motor } = input;
      
      saveToCart({ 
        priceEco: standard, 
        priceStandard: confort, 
        pricePremium: premium,
        modelId: selected_model || cart?.modelId,
        width: width || cart?.width,
        projection: depth || cart?.projection,
        colorId: frame_color || cart?.colorId,
        fabricId: fabric_color || cart?.fabricId,
        exposure: exposure || cart?.exposure,
        withMotor: with_motor !== undefined ? with_motor : cart?.withMotor
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTool]);

  // UTILISATION NATIVE DU SDK - Méthode la plus stable avec sendMessage
  const { messages, sendMessage, status, addToolResult } = useChat({
    id: chatId,
    onToolCall: ({ toolCall }: any) => {
      console.log('🔧 Tool appelé:', toolCall);
      setActiveTool(toolCall);
      // 🔥 Ajouter à l'historique des outils (ne pas nettoyer l'ancien)
      setToolHistory(prev => [...prev, toolCall]);
    },
    onFinish: (data: any) => {
      console.log('✅ Réponse terminée, messages:', data.messages?.length || 0);
    },
    onError: (err) => console.error('❌ Erreur:', err),
  });
  
  const isLoading = status !== 'ready';
  
  // Debug
  useEffect(() => {
    console.log('💬 Messages client:', messages.length);
    if (messages.length > 0) {
      console.log('📤 Tous les messages:', messages);
    }
  }, [messages]);
  
  useEffect(() => {
    if (modelToConfig && !initialMessageSent) {
      sendMessage({ text: `Je souhaite configurer le modèle ${modelToConfig}` });
      setInitialMessageSent(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelToConfig]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const getMessageText = (msg: UIMessage): string => msg.parts.filter((part) => part.type === 'text').map((part) => part.text).join('');

  // HandleSubmit simple et robuste
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    
    console.log('🚀 Envoi:', trimmed);
    setActiveTool(null);
    sendMessage({ text: trimmed });
    setInput('');
  };

  const handleQuickClick = (text: string) => {
    if (isLoading) return;
    console.log('⚡ Quick:', text);
    setActiveTool(null);
    sendMessage({ text });
  };
  
  const renderActiveTool = () => {
    // 🔥 Afficher tous les outils de l'historique (tools passés)
    const allToolsToRender = [...toolHistory];
    if (activeTool && !toolHistory.includes(activeTool)) {
      allToolsToRender.push(activeTool);
    }
    
    if (allToolsToRender.length === 0) return null;
    
    return (
      <div className="space-y-6">
        {allToolsToRender.map((tool, idx) => {
          const isCurrent = tool === activeTool;
          return (
            <div key={`${tool.toolCallId}-${idx}`} className={`transition-all ${!isCurrent ? 'opacity-70 scale-95 mb-4' : ''}`}>
              {tool.toolName === 'display_triple_offer' && renderTripleOfferTool(tool, isCurrent)}
              {tool.toolName === 'open_model_selector' && renderModelSelectorTool(tool, isCurrent)}
              {tool.toolName === 'open_color_selector' && renderColorSelectorTool(tool, isCurrent)}
              {tool.toolName === 'open_fabric_selector' && renderFabricSelectorTool(tool, isCurrent)}
            </div>
          );
        })}
      </div>
    );
  };
  
  // 🔥 Extraire display_triple_offer en fonction séparée
  const renderTripleOfferTool = (tool: CustomToolCall, isCurrent: boolean) => {
    const input = tool.input as any;
    const { standard, confort, premium, selected_model, width, depth, frame_color, fabric_color } = input;
    
    console.log('💰 Prix reçus de l\'IA:', { standard, confort, premium, selected_model, width, depth });
    
    return (
        <div className={`p-6 rounded-xl border-2 ${isCurrent ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-center mb-6 ${isCurrent ? 'text-2xl font-bold text-gray-900' : 'text-lg font-semibold text-gray-700'}`}>
              {isCurrent ? '🎯 Votre Triple Offre Personnalisée' : '📋 Offre antérieure'}
            </h3>
            {width && depth && (
              <p className={`text-center mb-4 ${isCurrent ? 'text-sm text-gray-700' : 'text-xs text-gray-600'}`}>
                Configuration : {width}cm × {depth}cm {selected_model ? `| Modèle: ${selected_model}` : ''}
              </p>
            )}
            <div className={`grid gap-4 ${isCurrent ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-3'}`}>
                <button onClick={() => saveToCart({ priceEco: standard, selectedPrice: standard, priceType: 'eco' })} className={`p-6 rounded-xl text-center transition-all ${isCurrent ? 'bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg' : 'bg-gray-100 border border-gray-300'}`} disabled={!isCurrent}>
                    <h4 className={`font-bold mb-2 ${isCurrent ? 'text-lg' : 'text-sm'}`}>💚 Eco</h4>
                    <p className={`font-bold text-gray-900 ${isCurrent ? 'text-3xl' : 'text-lg'}`}>{standard}€</p>
                    {isCurrent && <p className="text-sm text-gray-600 mt-2">Configuration de base</p>}
                </button>
                <button onClick={() => saveToCart({ priceStandard: confort, selectedPrice: confort, priceType: 'standard' })} className={`p-6 rounded-xl text-center transition-all relative ${isCurrent ? 'bg-white border-4 border-blue-600 shadow-xl hover:shadow-2xl' : 'bg-gray-100 border border-gray-300'}`} disabled={!isCurrent}>
                    {isCurrent && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">RECOMMANDÉ</div>}
                    <h4 className={`font-bold mb-2 ${isCurrent ? 'text-xl text-blue-600' : 'text-sm text-gray-700'}`}>⭐ Standard</h4>
                    <p className={`font-bold text-gray-900 ${isCurrent ? 'text-4xl text-blue-600' : 'text-lg'}`}>{confort}€</p>
                    {isCurrent && <p className="text-sm text-gray-600 mt-2">Options confort</p>}
                </button>
                <button onClick={() => saveToCart({ pricePremium: premium, selectedPrice: premium, priceType: 'premium' })} className={`p-6 rounded-xl text-center transition-all ${isCurrent ? 'bg-white border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg' : 'bg-gray-100 border border-gray-300'}`} disabled={!isCurrent}>
                    <h4 className={`font-bold mb-2 ${isCurrent ? 'text-lg' : 'text-sm'}`}>👑 Premium</h4>
                    <p className={`font-bold text-gray-900 ${isCurrent ? 'text-3xl' : 'text-lg'}`}>{premium}€</p>
                    {isCurrent && <p className="text-sm text-gray-600 mt-2">Tout équipé</p>}
                </button>
            </div>
        </div>
    );
  };
  
  // 🔥 Extraire open_model_selector en fonction séparée
  const renderModelSelectorTool = (tool: CustomToolCall, isCurrent: boolean) => {
    const input = (tool.input as Record<string, unknown>) || {};
    const modelsToDisplay = input.models_to_display as string[] || [];
    
    const width = input.width as number || null;
    const depth = input.depth as number || null;
    const frameColor = input.frame_color as string || null;
    const fabricColor = input.fabric_color as string || null;
    const exposure = input.exposure as string || null;
    const withMotor = input.with_motor !== undefined ? input.with_motor as boolean : true;
    
    console.log('🎨 Configuration reçue de l\'IA:', { width, depth, frameColor, fabricColor, exposure, withMotor });
    
    const filteredModels = modelsToDisplay.map(id => Object.values(STORE_MODELS).find(m => m.id === id)).filter(Boolean) as StoreModel[];
    return (
      <div className={`grid gap-6 ${isCurrent ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3'}`}>
        {filteredModels.map((model) => {
          const isSelected = selectedModelId === model.id;
          return (
          <div key={model.id} className={`flex flex-col border-2 rounded-xl overflow-hidden shadow-sm bg-white transition-all ${
            isSelected ? 'border-4 border-green-500 bg-green-50 border-x-2' : `border-gray-200 ${isCurrent ? 'hover:shadow-lg' : 'opacity-70'}`
          }`}>
            {isSelected && isCurrent && (
              <div className="bg-green-500 text-white px-3 py-1 text-xs font-bold text-center">
                ✅ SÉLECTIONNÉ
              </div>
            )}
            <div className={`relative w-full bg-gray-100 ${isCurrent ? 'h-60' : 'h-40'}`}>
              <Image src={`/images/models/${model.id.toUpperCase()}.png`} alt={model.name} fill className="object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/models/placeholder.png'; }} />
            </div>
            <div className={`p-${isCurrent ? '6' : '3'} flex flex-col flex-1`}>
              <h4 className={`font-bold text-gray-900 mb-1 ${isCurrent ? 'text-lg' : 'text-sm'}`}>{model.name}</h4>
              {width && depth && (
                <p className={`text-blue-600 font-semibold mb-2 ${isCurrent ? 'text-xs' : 'text-xs'}`}>
                  📏 {width}cm × {depth}cm {exposure ? `| ${exposure}` : ''}
                </p>
              )}
              {isCurrent && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{model.description}</p>}
              {isCurrent && <ul className="text-sm text-gray-500 mb-4 space-y-1">{model.features.slice(0, 2).map((feature, idx) => <li key={idx}>• {feature}</li>)}</ul>}
              {isCurrent && (
                <div className="mt-auto space-y-2">
                  <button onClick={() => { 
                    saveToCart({ modelId: model.id, modelName: model.name }); 
                    setSelectedModelId(model.id);
                    addToolResult({ toolCallId: tool.toolCallId, tool: tool.toolName, output: { modelId: model.id, modelName: model.name, validated: true } }); 
                  }} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">Configurer ce store</button>
                  <button onClick={() => { setSelectedModelForModal(model); setIsModalOpen(true); }} className="w-full py-2 text-blue-600 font-semibold hover:bg-blue-50 transition-colors rounded-lg">Voir la fiche produit</button>
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>
    );
  };

  // 🔥 Afficher sélecteur de couleurs
  const renderColorSelectorTool = (tool: CustomToolCall, isCurrent: boolean) => {
    const input = tool.input as any;
    const { selected_model, width, depth } = input;
    
    return (
      <div className={`p-6 rounded-xl border-2 ${isCurrent ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
        <h3 className={`text-center mb-6 ${isCurrent ? 'text-2xl font-bold text-gray-900' : 'text-lg font-semibold text-gray-700'}`}>
          🎨 {isCurrent ? 'Choisissez votre Couleur d\'Armature' : 'Couleurs d\'armature (antérieure)'}
        </h3>
        <div className={`grid gap-4 ${isCurrent ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5' : 'grid-cols-5'}`}>
          {FRAME_COLORS.map((color) => {
            const isSelected = selectedColorId === color.id;
            return (
              <button
                key={color.id}
                onClick={() => {
                  setSelectedColorId(color.id);
                  saveToCart({ colorId: color.id });
                  if (isCurrent) {
                    addToolResult({ toolCallId: tool.toolCallId, tool: tool.toolName, output: { color_id: color.id, color_name: color.name, validated: true } });
                  }
                }}
                disabled={!isCurrent}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  isSelected 
                    ? 'border-4 border-green-500 ring-2 ring-green-300 shadow-lg' 
                    : `border-gray-300 ${isCurrent ? 'hover:border-gray-500 hover:shadow-md' : 'opacity-60'}`
                }`}
              >
                <div 
                  className={`w-full h-16 rounded-lg mb-2 border-2 border-gray-400 transition-all`}
                  style={{ backgroundColor: color.hex }}
                  title={color.hex}
                />
                <p className={`text-xs font-semibold ${isCurrent ? 'text-gray-900' : 'text-gray-600'}`}>{color.name}</p>
                {color.price > 0 && <p className={`text-xs ${isCurrent ? 'text-orange-600' : 'text-gray-500'}`}>+{color.price}€</p>}
                {isSelected && <p className="text-xs text-green-600 font-bold mt-1">✅</p>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // 🔥 Afficher sélecteur de toiles
  const renderFabricSelectorTool = (tool: CustomToolCall, isCurrent: boolean) => {
    const input = tool.input as any;
    const { frame_color } = input;
    
    return (
      <div className={`p-6 rounded-xl border-2 ${isCurrent ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
        <h3 className={`text-center mb-6 ${isCurrent ? 'text-2xl font-bold text-gray-900' : 'text-lg font-semibold text-gray-700'}`}>
          🧵 {isCurrent ? 'Choisissez votre Toile' : 'Toiles (antérieure)'}
        </h3>
        <div className={`grid gap-4 ${isCurrent ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3'}`}>
          {FABRICS.map((fabric) => {
            const isSelected = selectedFabricId === fabric.id;
            return (
              <button
                key={fabric.id}
                onClick={() => {
                  setSelectedFabricId(fabric.id);
                  saveToCart({ fabricId: fabric.id });
                  if (isCurrent) {
                    addToolResult({ toolCallId: tool.toolCallId, tool: tool.toolName, output: { fabric_id: fabric.id, fabric_name: fabric.name, validated: true } });
                  }
                }}
                disabled={!isCurrent}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected 
                    ? 'border-4 border-green-500 ring-2 ring-green-300 shadow-lg' 
                    : `border-gray-300 ${isCurrent ? 'hover:border-gray-500 hover:shadow-md' : 'opacity-60'}`
                }`}
              >
                <div className={`w-full h-24 rounded-lg mb-2 bg-gray-200 border border-gray-400 overflow-hidden`}>
                  {/* Placeholder pour image de toile */}
                  <div className={`w-full h-full flex items-center justify-center text-xs text-gray-600`}>
                    {fabric.category.toUpperCase()}
                  </div>
                </div>
                <p className={`text-xs font-semibold ${isCurrent ? 'text-gray-900' : 'text-gray-600'} line-clamp-2`}>{fabric.ref}</p>
                <p className={`text-xs ${isCurrent ? 'text-gray-700' : 'text-gray-500'}`}>{fabric.name}</p>
                {fabric.price > 0 && <p className={`text-xs ${isCurrent ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>+{fabric.price}€</p>}
                {isSelected && <p className="text-xs text-green-600 font-bold mt-1">✅</p>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const quickQuestions = [
    { label: "Quel store choisir ?", text: "J'aimerais trouver le store parfait pour ma terrasse." },
    { label: "TVA à 10%", text: "Comment bénéficier de la TVA à 10% ?" },
    { label: "Prix des couleurs", text: "Les couleurs hors-blanc sont-elles plus chères ?" }
  ];

  return (
    <div className="w-full h-full bg-white flex flex-col">
       {isModalOpen && <ProductModal model={selectedModelForModal} onClose={() => setIsModalOpen(false)} />}
       <header className="bg-gray-900 text-white p-4 sticky top-0 z-10 rounded-t-xl"><h2 className="text-xl font-bold">Expert Storal - Assistant Personnalisé</h2><p className="text-sm text-gray-300">Configurez votre produit idéal</p></header>
       <div className="flex-1 overflow-y-auto p-6 space-y-6">
         {messages.length === 0 && (
          <div className="text-center py-8">
             <h3 className="text-2xl font-bold text-gray-900 mb-4">Bienvenue !</h3>
             <p className="text-base text-gray-600 mb-6">Posez une question ou utilisez nos suggestions pour démarrer.</p>
             <div className="flex justify-center flex-wrap gap-3">
               {quickQuestions.map((q, idx) => (<button key={idx} onClick={() => handleQuickClick(q.text)} disabled={isLoading} className="px-4 py-2 bg-white border border-gray-300 hover:border-gray-500 hover:bg-gray-50 text-sm font-medium text-gray-700 rounded-full transition-all">{q.label}</button>))}
            </div>
          </div>
        )}
         {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-4xl rounded-2xl px-4 py-3 ${message.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
              {message.role === 'assistant' && <div className="text-xs font-semibold text-gray-500 mb-2">Expert Storal</div>}
              <span className="whitespace-pre-wrap text-sm leading-relaxed">{getMessageText(message)}</span>
            </div>
          </div>
        ))}
        {renderActiveTool()}
        <div ref={messagesEndRef} />
      
       </div>
       {isLoading && !activeTool && (
         <div className="flex justify-start p-4">
           <div className="bg-gray-100 rounded-2xl px-4 py-3">
             <div className="flex space-x-2">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
             </div>
           </div>
         </div>
       )}
       <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white sticky bottom-0 rounded-b-xl">
         <div className="flex space-x-2">
           <input 
             type="text" 
             value={input} 
             onChange={(e) => setInput(e.target.value)} 
             placeholder="Ex: Je veux un store de 5x3m" 
             disabled={isLoading} 
             className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600" 
           />
           <button 
             type="submit" 
             disabled={isLoading || !input.trim()} 
             className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:bg-gray-300"
           >
             {isLoading ? '⏳' : '📤'}
           </button>
         </div>
       </form>
     </div>
  );
}