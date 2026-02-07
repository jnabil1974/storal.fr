'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { UIMessage } from 'ai';
import { parseMessage, type Badge } from '@/lib/parseMessage';

// Questions de démarrage
const quickQuestions = [
  { label: '🏡 Quel modèle pour une maison moderne ?', text: 'Quel modèle me conseillez-vous pour une maison moderne avec toit plat ?' },
  { label: '📉 Avantage TVA 10% ?', text: 'Comment bénéficier de la TVA à 10% sur mon store banne ?' },
  { label: '💰 Prix pour 4m x 3m ?', text: 'Quel est le prix estimé pour un store de 4m de large et 3m d\'avancée ?' },
];

// Composant pour détecter et transformer les données configurateur en bouton
const MessageContent = ({ content, onLinkClick }: { content: string; onLinkClick: (url: string) => void }) => {
  console.log('🚨🚨🚨 MESSAGECOMPONENT APPELÉ 🚨🚨🚨');
  console.log('Contenu complet reçu:', content);
  
  const { text: textMessage, config: parsedConfig, badges } = parseMessage(content);

  console.log('🔍 MessageContent - texte:', textMessage);
  console.log('🔍 MessageContent - JSON:', parsedConfig);
  console.log('🔍 MessageContent - Badges:', badges);

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
        const url = `/panier?model=${parsedConfig.model}&width=${parsedConfig.width}&projection=${parsedConfig.projection}&color=${parsedConfig.color}&motor=${parsedConfig.motor || ''}&sensor=${parsedConfig.sensor || ''}&promo=BIENVENUE2026`;

        console.log('✅ Config extraite:', parsedConfig);
        console.log('✅ URL générée:', url);

        return (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={() => onLinkClick(url)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span className="text-lg">🛒</span>
              <span>Ajouter mon store au panier</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <p className="text-[10px] text-gray-400 mt-2 text-center uppercase tracking-widest font-semibold">
              Heliom {parsedConfig.width}×{parsedConfig.projection}cm · {parsedConfig.color}
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
  
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    id: chatId, // ID unique pour éviter la réutilisation de l'historique
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    console.log('🚀 Envoi message input:', input.trim());
    sendMessage({ text: input.trim() });
    setInput('');
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
          className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">
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

            {messages.map((msg) => {
              console.log('💬 Message reçu:', msg.role, msg);
              return (
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
                    {(() => {
                      console.log('🔄 Rendu du message:', msg.role);
                      const text = getMessageText(msg);
                      console.log('📝 Texte extrait:', text);
                      return msg.role === 'assistant' ? (
                        <MessageContent 
                          content={text} 
                          onLinkClick={handleConfiguratorLink}
                        />
                      ) : (
                        text
                      );
                    })()}
                  </div>
                </div>
              </div>
            )})}


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
      )}
    </div>
  );
}
