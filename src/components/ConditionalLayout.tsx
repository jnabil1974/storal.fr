'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import ChatVisibilityController from './ChatVisibilityController';
import AssistantHeader from './AssistantHeader';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAssistantPage = pathname === '/assistant';

  if (isAssistantPage) {
    // Mode App : Header simplifié uniquement
    return (
      <>
        <AssistantHeader />
        {children}
      </>
    );
  }

  // Mode site classique
  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-slate-900 text-white text-sm py-3 border-b border-slate-700">
        <div className="w-full px-4 flex flex-wrap justify-center md:justify-between items-center gap-4">
          <div className="hidden md:flex space-x-6 text-gray-300">
            <span className="flex items-center gap-2">🇫🇷 Fabrication Française</span>
            <span className="flex items-center gap-2">🛡️ Garantie Jusqu'à 12 Ans</span>
            <span className="flex items-center gap-2">🚚 Livraison Incluse</span>
          </div>
          <div className="flex space-x-4 text-gray-300">
            <a href="tel:+33185093446" className="font-bold text-white hover:text-blue-400 transition">📞 01 85 09 34 46</a>
          </div>
        </div>
      </div>
      <Header />
      <main>{children}</main>
      <Footer />
      <ChatVisibilityController />
    </>
  );
}
