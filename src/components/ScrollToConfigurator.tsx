'use client';

/**
 * Bouton CTA pour scroller vers le configurateur
 * Client Component nécessaire pour le onClick handler
 */
export default function ScrollToConfigurator() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('configurateur')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  return (
    <a
      href="#configurateur"
      onClick={handleClick}
      className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
    >
      🚀 Configurer mon store
    </a>
  );
}
