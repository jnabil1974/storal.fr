'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { UIMessage } from 'ai';
import { parseMessage, type Badge } from '@/lib/parseMessage';

// Questions rapides prédéfinies
const quickQuestions = [
  { label: "🏡 Quel modèle choisir ?", text: "J'hésite entre le style Galbé et Carré, que me conseillez-vous pour ma maison ?" },
  { label: "📉 Payer moins de TVA", text: "Comment bénéficier de la TVA à 10% sur mon store ?" },
  { label: "🎨 Prix des couleurs", text: "Est-ce que les couleurs hors blanc sont plus chères ?" }
];

export default function ChatAssistant() {
  const router = useRouter();
  const [input, setInput] = useState('');
  
  // Générer un ID unique à chaque montage pour éviter la persistance
  const [chatId] = useState(() => `chat-${Date.now()}-${Math.random().toString(36).substring(7)}`);
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    id: chatId, // ID unique pour éviter la réutilisation de l'historique
    initialMessages: [], // Démarrer avec un tableau vide
    onError: (err) => {
      console.error('❌ Erreur ChatAssistant useChat:', err);
    },
  });
  const isLoading = status === 'submitted' || status === 'streaming';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Nettoyer l'ancien localStorage au montage
  useEffect(() => {
    // Nettoyer les anciennes conversations du localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('ai-chat-')) {
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
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('');

  const handleConfiguratorLink = (url: string) => {
    router.push(url);
  };

  const MessageContent = ({ content }: { content: string }) => {
    const { text, config, badges } = parseMessage(content);
    const url = config
      ? `/configurateur?model=${config.model}&width=${config.width}&projection=${config.projection}&color=${config.color}`
      : '';

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
        {text && <span className="whitespace-pre-wrap text-sm">{text}</span>}

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

        {config && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={() => handleConfiguratorLink(`/panier?model=${config.model}&width=${config.width}&projection=${config.projection}&color=${config.color}&motor=${config.motor || ''}&sensor=${config.sensor || ''}&promo=BIENVENUE2026`)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span className="text-lg">🛒</span>
              <span>Ajouter mon store au panier</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <p className="text-[10px] text-gray-400 mt-2 text-center uppercase tracking-widest font-semibold">
              Heliom {config.width}×{config.projection}cm · {config.color}
            </p>
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput('');
  };

  const handleQuickClick = (text: string) => {
    if (isLoading) return;
    sendMessage({ text });
  };

  const handleNewConversation = () => {
    // Recharger la page pour obtenir un nouvel ID de chat
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-[600px] border border-gray-200 rounded-2xl shadow-lg bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">💬 L'Expert Storal</h3>
          <p className="text-sm text-gray-300">Votre conseiller stores bannes</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleNewConversation}
            className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            title="Nouvelle conversation"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Recommencer</span>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-5xl mb-4">👋</div>
            <p className="font-semibold mb-2">Bonjour ! Je suis l'Expert Storal.</p>
            <p className="text-sm">
              Posez-moi vos questions sur nos stores bannes :
            </p>
            
            {/* Questions rapides */}
            <div className="flex flex-col gap-2 mt-6 px-4">
              <p className="text-xs text-gray-400 font-medium mb-1 text-left">Questions fréquentes :</p>
              {quickQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickClick(q.text)}
                  disabled={isLoading}
                  className="text-left text-sm bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-700 p-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="text-xs font-semibold text-gray-500 mb-1">
                  Expert Storal
                </div>
              )}
              <MessageContent content={getMessageText(message)} />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
              onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : 'Envoyer'}
          </button>
        </div>
      </form>
      
      <div ref={messagesEndRef} />
    </div>
  );
}
