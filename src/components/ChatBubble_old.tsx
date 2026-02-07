'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { UIMessage } from 'ai';
import ReactMarkdown from 'react-markdown';

// Questions de démarrage
const quickQuestions = [
  { label: '🏡 Quel modèle pour une maison moderne ?', text: 'Quel modèle me conseillez-vous pour une maison moderne avec toit plat ?' },
  { label: '📉 Avantage TVA 10% ?', text: 'Comment bénéficier de la TVA à 10% sur mon store banne ?' },
  { label: '💰 Prix pour 4m x 3m ?', text: 'Quel est le prix estimé pour un store de 4m de large et 3m d\'avancée ?' },
];

export default function ChatBubble() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const isLoading = status === 'submitted' || status === 'streaming';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fonction pour transformer les liens markdown en boutons cliquables
  const tryBuildConfiguratorLink = (text: string) => {
    const normalized = text.toLowerCase();

    const model = /\bheliom\b/i.test(text)
      ? 'heliom'
      : /\bkissimy\b/i.test(text)
        ? 'kissimy'
        : undefined;

    const ralMatch = text.match(/RAL\s*(\d{4})/i);
    const colorByName: Record<string, string> = {
      'gris anthracite': '7016',
      anthracite: '7016',
      'gris charbon': '7016',
      blanc: '9010',
      noir: '9005',
      ivoire: '1015',
    };
    const color = ralMatch?.[1] ?? Object.keys(colorByName).find((k) => normalized.includes(k));
    const ral = ralMatch?.[1] ?? (color ? colorByName[color] : undefined);

    const widthFromCm = text.match(/largeur[^\d]{0,10}(\d{3,4})\s*cm/i);
    const widthFromM = text.match(/largeur[^\d]{0,10}(\d+(?:[.,]\d+)?)\s*m/i);
    let width = widthFromCm ? parseInt(widthFromCm[1], 10) : undefined;
    if (!width && widthFromM) {
      width = Math.round(parseFloat(widthFromM[1].replace(',', '.')) * 100);
    }
    if (!width) {
      const wideMatch = text.match(/(\d+(?:[.,]\d+)?)\s*m\s*(?:de\s*)?(?:large|largeur)/i);
      if (wideMatch) {
        width = Math.round(parseFloat(wideMatch[1].replace(',', '.')) * 100);
      }
    }
    if (!width) {
      const maybeWidth = text.match(/\b(\d+(?:[.,]\d+)?)\s*m\b/i);
      if (maybeWidth) {
        const candidate = Math.round(parseFloat(maybeWidth[1].replace(',', '.')) * 100);
        if (candidate >= 300 && candidate <= 800) width = candidate;
      }
    }
    if (!width) {
      const maybeWidth = text.match(/\b(\d{3,4})\b/);
      if (maybeWidth) {
        const candidate = parseInt(maybeWidth[1], 10);
        if (candidate >= 300 && candidate <= 800) width = candidate;
      }
    }

    const projCmMatch = text.match(/avanc(?:ée|ee)?[^\d]{0,10}(250|300|350)\b/i);
    const projMMatch = text.match(/avanc(?:ée|ee)?[^\d]{0,10}(2[.,]5|3|3[.,]5)\s*m/i);
    let projection = projCmMatch ? parseInt(projCmMatch[1], 10) : undefined;
    if (!projection && projMMatch) {
      const m = parseFloat(projMMatch[1].replace(',', '.'));
      projection = m >= 3 ? 300 : 250;
    }
    if (projection === 350) projection = 300;

    if (model && width && projection && ral) {
      return `/configurateur?model=${model}&width=${width}&projection=${projection}&color=${ral}`;
    }
    return undefined;
  };

  const getMessageTextFromParts = (parts: UIMessage['parts']) =>
    parts
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map((part) => part.text)
      .join('');

  const getConfiguratorHrefFromParts = (parts: UIMessage['parts']) => {
    for (const part of parts) {
      if (part.type === 'source-url' && part.url?.includes('/configurateur')) {
        return part.url;
      }
      if (part.type.startsWith('data-')) {
        const dataPart = part as { data?: { url?: string } };
        if (dataPart.data?.url?.includes('/configurateur')) {
          return dataPart.data.url;
        }
      }
    }
    return undefined;
  };

  // Fonction pour transformer les liens markdown en boutons cliquables
  const renderMessageWithLinks = (msg: UIMessage): React.ReactNode => {
    const text = getMessageTextFromParts(msg.parts);
    const sanitized = text.replace(/[\u200B-\u200D\uFEFF]/g, '');

    const hrefFromParts = getConfiguratorHrefFromParts(msg.parts);
    const markdownMatch = sanitized.match(/\[([^\]]+)\]\s*\(([^)]*\/configurateur[^)]*)\)/i);

    const href = hrefFromParts ?? markdownMatch?.[2];
    const linkText = markdownMatch?.[1] ?? 'Voir ma configuration';

    if (href) {
      const cleanedText = markdownMatch
        ? sanitized.replace(markdownMatch[0], linkText).trim()
        : sanitized.trim();

      return (
        <>
          {cleanedText && <span>{cleanedText} </span>}
          <button
            onClick={() => {
              router.push(href);
              setIsOpen(false);
            }}
            className="block w-full mt-3 mb-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-3 px-4 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg text-sm animate-pulse"
          >
            🛒 {linkText}
          </button>
        </>
      );
    }

    const rawUrlMatch = sanitized.match(/(\/configurateur\?[^\s)]+)/i);
    const fallbackHref = rawUrlMatch?.[1] ?? tryBuildConfiguratorLink(sanitized);

    if (fallbackHref || sanitized.includes('/configurateur')) {
      const cleanedText = sanitized.replace(rawUrlMatch?.[1] ?? '', '').trim();
      const hrefFallback = fallbackHref ?? '/configurateur';
      return (
        <>
          {cleanedText && <span>{cleanedText} </span>}
          <button
            onClick={() => {
              router.push(hrefFallback);
              setIsOpen(false);
            }}
            className="block w-full mt-3 mb-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-3 px-4 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg text-sm animate-pulse"
          >
            🛒 Voir ma configuration
          </button>
        </>
      );
    }

    if (/voir ma configuration|configuration personnalisée/i.test(sanitized)) {
      const hrefFallback = tryBuildConfiguratorLink(sanitized) ?? '/configurateur';
      return (
        <>
          {sanitized && <span>{sanitized} </span>}
          <button
            onClick={() => {
              router.push(hrefFallback);
              setIsOpen(false);
            }}
            className="block w-full mt-3 mb-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-3 px-4 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg text-sm animate-pulse"
          >
            🛒 Voir ma configuration
          </button>
        </>
      );
    }

    return text;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMessageText = (msg: UIMessage) => getMessageTextFromParts(msg.parts);

  const handleQuickClick = (text: string) => {
    if (isLoading) return;
    sendMessage({ text });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput('');
  };

  return (
    <>
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

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
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
                    {msg.role === 'assistant'
                      ? renderMessageWithLinks(msg)
                      : getMessageText(msg)
                    }
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
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
    </>
  );
}
