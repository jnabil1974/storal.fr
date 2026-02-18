'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

export default function TopBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-2.5 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <div className="flex items-center gap-2 text-sm md:text-base font-semibold">
          <span className="hidden sm:inline">🎉</span>
          <span>
            <span className="font-black">Offre de lancement :</span> -5% sur tout le site avec le code{' '}
            <span className="bg-white text-orange-600 px-2 py-0.5 rounded font-mono font-black">
              STORAL5
            </span>
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-orange-700 rounded-full transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
