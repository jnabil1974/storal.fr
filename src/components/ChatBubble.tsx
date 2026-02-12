'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import type { UIMessage } from 'ai';
import { parseMessage, type Badge } from '@/lib/parseMessage';
import { STORE_MODELS, FRAME_COLORS as CUSTOM_COLORS, FABRICS as FABRIC_OPTIONS } from '@/lib/catalog-data';

// Type definitions
type ColorOption = typeof CUSTOM_COLORS[0];
type FabricOption = typeof FABRIC_OPTIONS[0];

// Questions de démarrage
const quickQuestions = [
  { label: '🏡 Quel modèle pour une maison moderne ?', text: 'Quel modèle me conseillez-vous pour une maison moderne avec toit plat ?' },
  { label: '📉 Avantage TVA 10% ?', text: 'Comment bénéficier de la TVA à 10% sur mon store banne ?' },
  { label: '💰 Prix pour 4m x 3m ?', text: 'Quel est le prix estimé pour un store de 4m de large et 3m d\'avancée ?' },
];

// Composant pour détecter et transformer les données configurateur en bouton
const MessageContent = ({ content, onLinkClick }: { content: string; onLinkClick: (url: string) => void }) => {
  const { text: textMessage, config: parsedConfig, badges } = parseMessage(content);

  // Mappage des badges avec styles
  const badgeStyles: Record<Badge['type'], string> = {
    guarantee: 'bg-blue-100 text-blue-700 border-blue-300',
    tva: 'bg-green-100 text-green-700 border-green-300',
    wind: 'bg-orange-100 text-orange-700 border-orange-300',
    fabric: 'bg-purple-100 text-purple-700 border-purple-300',
    tech: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    safety: 'bg-red-100 text-red-700 border-red-300',
    smart: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    promo: 'bg-amber-100 text-amber-700 border-amber-300',
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Affichage du texte de l'IA */}
      <span className="whitespace-pre-wrap leading-relaxed">{textMessage.trim()}</span>

      {/* Badges interactifs */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {badges.map((badge, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyles[badge.type]}`}
            >
              {badge.type === 'guarantee' && '✓'}
              {badge.type === 'tva' && '💰'}
              {badge.type === 'wind' && '💨'}
              {badge.type === 'fabric' && '🧵'}
              {badge.type === 'tech' && '🔌'}
              {badge.type === 'safety' && '🛡️'}
              {badge.type === 'smart' && '🏠'}
              {badge.type === 'success' && '🚚'}
              {badge.type === 'promo' && '🎁'}
              {badge.label}
            </span>
          ))}
        </div>
      )}

      {/* Génération du bouton si données JSON présentes */}
      {parsedConfig && (() => {
        const widthMm = parsedConfig.width;
        const projectionMm = parsedConfig.projection;
        const widthCm = widthMm / 10;
        const projectionCm = projectionMm / 10;
        const url = `/cart?model=${parsedConfig.model}&width=${widthMm}&projection=${projectionMm}&color=${parsedConfig.color || 'ral_9010'}&fabric_id=${parsedConfig.fabric_id || ''}&support=${parsedConfig.support || ''}&motor=${parsedConfig.motor || ''}&sensor=${parsedConfig.sensor || ''}&ledArms=${parsedConfig.ledArms || false}&ledBox=${parsedConfig.ledBox || false}&lambrequin=${parsedConfig.lambrequin || false}&lambrequinMotorized=${parsedConfig.lambrequinMotorized || false}&promo=BIENVENUE2026`;
        const matchedModel = Object.values(STORE_MODELS).find((model) => model.id === parsedConfig.model);
        const modelLabel = matchedModel?.name ?? parsedConfig.model;
        const matchedColor = CUSTOM_COLORS.find((color) => color.id === parsedConfig.color);
        const colorLabel = matchedColor?.name ?? parsedConfig.color;
        const matchedFabric = FABRIC_OPTIONS.find((fabric) => fabric.id === (parsedConfig.fabric_id || parsedConfig.fabric));
        const fabricLabel = matchedFabric?.name ?? (parsedConfig.fabric_id || parsedConfig.fabric);
        const supportLabel = parsedConfig.support === 'beton'
          ? 'Béton'
          : parsedConfig.support === 'brique'
            ? 'Brique'
            : parsedConfig.support === 'ite'
              ? 'ITE'
              : parsedConfig.support || '';
        const motorLabel = parsedConfig.motor === 'io'
          ? 'Moteur Somfy io-homecontrol (inclus)'
          : parsedConfig.motor === 'csi'
            ? 'Manivelle secours (CSI)'
            : parsedConfig.motor || '';
        const sensorLabel = parsedConfig.sensor === 'wind'
          ? 'Capteur vent Eolis'
          : parsedConfig.sensor === 'sun'
            ? 'Capteur soleil Sunis'
            : '';

        return (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="mb-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Récapitulatif</p>
              <ul className="mt-2 space-y-1">
                <li><strong>Modèle :</strong> {modelLabel}</li>
                <li><strong>Dimensions :</strong> {widthCm}×{projectionCm}cm</li>
                {colorLabel && <li><strong>Couleur coffre :</strong> {colorLabel}</li>}
                {supportLabel && <li><strong>Support :</strong> {supportLabel}</li>}
                {fabricLabel && <li><strong>Toile :</strong> {fabricLabel}</li>}
                {motorLabel && <li><strong>Motorisation :</strong> {motorLabel}</li>}
                {sensorLabel && <li><strong>Capteur :</strong> {sensorLabel}</li>}
                {parsedConfig.ledArms && <li><strong>Option :</strong> LED Bras</li>}
                {parsedConfig.ledBox && <li><strong>Option :</strong> LED Coffre</li>}
                {parsedConfig.lambrequin && <li><strong>Option :</strong> Lambrequin {parsedConfig.lambrequinMotorized ? 'motorisé' : 'fixe'}</li>}
              </ul>
            </div>
            <button
              onClick={() => onLinkClick(url)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span className="text-lg">🛒</span>
              <span>Ajouter mon store au panier</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <p className="text-[10px] text-gray-400 mt-2 text-center uppercase tracking-widest font-semibold">
              {modelLabel} {widthCm}×{projectionCm}cm · {parsedConfig.color}
            </p>
          </div>
        );
      })()}
    </div>
  );
};

export default function ChatBubble({ isVisible = true }: { isVisible?: boolean }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  // Générer un ID unique à chaque montage pour éviter la persistance
  const [chatId] = useState(() => `bubble-${Date.now()}-${Math.random().toString(36).substring(7)}`);
  
  const { messages, sendMessage, status, error, addToolResult } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    id: chatId, // ID unique pour éviter la réutilisation de l'historique
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onError: (error) => {
      console.error('❌ Erreur ChatBubble useChat:', error);
    },
  });
  const isLoading = status === 'submitted' || status === 'streaming';
  
  // Debug: afficher le statut
  useEffect(() => {
    console.log('📊 ChatBubble Status:', status, 'Messages:', messages.length, 'Error:', error);
  }, [status, messages, error]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Nettoyer l'ancien localStorage au montage
  useEffect(() => {
    // Nettoyer les anciennes conversations du localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('ai-chat-') || key.startsWith('ai-bubble-')) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  const scrollToBottom = () => {
    // Utiliser scroll() directement sur le conteneur au lieu de scrollIntoView()
    // pour éviter de scroller le document entier
    if (messagesEndRef.current?.parentElement) {
      messagesEndRef.current.parentElement.scrollTop = messagesEndRef.current.parentElement.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMessageText = (msg: UIMessage): string =>
    msg.parts
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map((part) => part.text)
      .join('');

  const handleConfiguratorLink = (url: string) => {
    router.push(url);
    setIsOpen(false);
  };

  const handleQuickClick = (text: string) => {
    if (isLoading) return;
    console.log('🚀 Envoi message quick:', text);
    sendMessage({ text });
  };

  // Gérer l'ouverture/fermeture de la modale dialog
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (!isOpen && dialogRef.current) {
      dialogRef.current.close();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    console.log('🚀 Envoi message input:', input.trim());
    sendMessage({ text: input.trim() });
    setInput('');
    
    // Retirer le focus de l'input
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const visibilityClasses = isVisible
    ? 'opacity-100 pointer-events-auto'
    : 'opacity-0 pointer-events-none';

  return (
    <div
      className={`transition-opacity duration-500 ${visibilityClasses}`}
      aria-hidden={!isVisible}
    >
      {/* Bulle flottante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-[9999] w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <dialog
          ref={dialogRef}
          className="fixed inset-0 z-[9999] w-screen h-screen p-0 m-0 bg-transparent backdrop:bg-black/40"
          onClick={(e) => {
            // Fermer si on clique sur le backdrop
            if (e.target === dialogRef.current) {
              setIsOpen(false);
            }
          }}
        >
          <div className="fixed bottom-4 right-4 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <div>
                <h3 className="font-bold text-sm">Expert Storal</h3>
                <p className="text-xs text-gray-300">En ligne</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">👋</div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Bonjour !
                </p>
                <p className="text-xs text-gray-600 mb-4">
                  Je suis l'Expert Storal, comment puis-je vous aider ?
                </p>
                
                {/* Questions rapides */}
                <div className="space-y-2 px-2">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickClick(q.text)}
                      disabled={isLoading}
                      className="w-full text-left text-xs bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-700 p-2.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Icône de l'assistant */}
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="text-[10px] font-semibold text-gray-500 mb-1">
                      Expert Storal
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">
                    {msg.role === 'assistant' ? (
                      <>
                        <MessageContent 
                          content={getMessageText(msg)} 
                          onLinkClick={handleConfiguratorLink}
                        />
                        {/* Rendu des outils en ligne (Cartes) */}
                        {msg.toolInvocations?.map((toolInvocation) => {
                          const renderInlineTool = (toolInvocation: ToolInvocation) => {
                            // ===== SÉLECTEUR DE MODÈLES =====
                            if (toolInvocation.toolName === 'open_model_selector') {
                              if ('result' in toolInvocation) {
                                const result = toolInvocation.result as { modelName?: string };
                                return (
                                  <div className="mt-2 text-xs text-green-600 font-semibold">
                                    ✓ Modèle sélectionné : {result.modelName}
                                  </div>
                                );
                              }

                              const input = (toolInvocation.input as Record<string, unknown>) || {};
                              const modelsToDisplay = input.models_to_display as string[] || [];

                              const filteredModels = modelsToDisplay
                                .map(id => Object.values(STORE_MODELS).find(m => m.id === id))
                                .filter(Boolean) as StoreModel[];

                              if (filteredModels.length === 0) {
                                return (
                                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                                    ⚠️ Aucun modèle compatible trouvé pour vos dimensions.
                                  </div>
                                );
                              }

                              return (
                                <div className="mt-3 grid grid-cols-1 gap-2">
                                  {filteredModels.map((model) => (
                                    <button
                                      key={model.id}
                                      onClick={async () => {
                                        const result = {
                                          modelId: model.id,
                                          modelName: model.name,
                                          modelType: model.type,
                                          modelImage: model.image,
                                          timestamp: new Date().toISOString(),
                                          validated: true
                                        };
                                        addToolResult({ toolCallId: toolInvocation.toolCallId, result });
                                        await new Promise(resolve => setTimeout(resolve, 100));
                                        sendMessage({ text: '' });
                                      }}
                                      className="flex flex-col text-left p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                      <span className="font-semibold text-sm">{model.name}</span>
                                      <span className="text-xs text-gray-500 line-clamp-1">{model.description}</span>
                                    </button>
                                  ))}
                                </div>
                              );
                            }

                            // ===== SÉLECTEUR DE COULEUR INLINE =====
                            if (toolInvocation.toolName === 'open_color_selector') {
                              // Si déjà répondu, on affiche le choix
                              if ('result' in toolInvocation) {
                                const result = toolInvocation.result as { colorName?: string };
                                return <div key={toolInvocation.toolCallId} className="mt-2 text-xs text-green-600 font-semibold">✓ Couleur sélectionnée : {result.colorName}</div>;
                              }
                              // Sinon on affiche les boutons
                              const input = (toolInvocation.input as Record<string, unknown>) || {};
                              const allowedRalCodes = input.allowedRalCodes as string[] | undefined;
                              
                              const filteredColors = allowedRalCodes
                                ? CUSTOM_COLORS.filter(c => allowedRalCodes.includes(c.id))
                                : CUSTOM_COLORS.filter(c => c.category === 'standard');

                              return (
                                <div key={toolInvocation.toolCallId} className="mt-3 grid grid-cols-3 gap-2">
                                  {filteredColors.map((color) => (
                                    <button
                                      key={color.id}
                                      onClick={async () => {
                                        addToolResult({ toolCallId: toolInvocation.toolCallId, result: { colorId: color.id, colorName: color.name, timestamp: new Date().toISOString(), validated: true } });
                                        await new Promise(resolve => setTimeout(resolve, 100));
                                        sendMessage({ text: '' });
                                      }}
                                      className="flex flex-col items-center gap-1 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                      <div className="w-6 h-6 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: color.hex }} />
                                      <span className="text-[10px] text-center leading-tight">{color.name.replace(' (RAL', '\n(RAL')}</span>
                                    </button>
                                  ))}
                                </div>
                              );
                            }

                            // ===== SÉLECTEUR DE TOILES =====
                            if (toolInvocation.toolName === 'open_fabric_selector') {
                              if ('result' in toolInvocation) {
                                const result = toolInvocation.result as { fabricName?: string };
                                return (
                                  <div className="mt-2 text-xs text-green-600 font-semibold">
                                    ✓ Toile sélectionnée : {result.fabricName}
                                  </div>
                                );
                              }

                              const input = (toolInvocation.input as Record<string, unknown>) || {};
                              const pattern = input.pattern as 'uni' | 'raye' | undefined;
                              
                              const filteredFabrics = pattern
                                ? FABRIC_OPTIONS.filter(f => f.category === pattern)
                                : FABRIC_OPTIONS;

                              return (
                                <div className="mt-3 grid grid-cols-1 gap-2">
                                  {filteredFabrics.slice(0, 9).map((fabric) => (
                                    <button
                                      key={fabric.id}
                                      onClick={async () => {
                                        const result = {
                                          fabric_id: fabric.id,
                                          fabricName: fabric.name,
                                          collection: fabric.collection,
                                          timestamp: new Date().toISOString(),
                                          validated: true
                                        };
                                        addToolResult({ toolCallId: toolInvocation.toolCallId, result });
                                        await new Promise(resolve => setTimeout(resolve, 100));
                                        sendMessage({ text: '' });
                                      }}
                                      className="flex flex-col text-left p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                      <span className="font-semibold text-sm">{fabric.name}</span>
                                      <span className="text-xs text-gray-500 mt-0.5">Réf: {fabric.ref}</span>
                                      <span className="text-xs text-orange-700 font-medium">{fabric.category}</span>
                                    </button>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          };

                          return <div key={toolInvocation.toolCallId}>{renderInlineTool(toolInvocation)}</div>;
                        })}
                      </>
                    ) : (
                      getMessageText(msg)
                    )}
                  </div>
                </div>
              </div>
            ))}


            {isLoading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Votre question..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isLoading ? '...' : '→'}
              </button>
            </div>
          </form>
        </div>
        </dialog>
      )}

    </div>
  );
}
