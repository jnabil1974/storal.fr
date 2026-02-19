'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { STORE_MODELS, getMinimumPrice, getModelDimensions, getSortedRanges, getProductsByRange, getMinPriceForRange, getModelCountForRange, getModelSlug, type MarketingRange } from '@/lib/catalog-data';

// Fonts Google (Epilogue comme AstroTalky)
import { Epilogue } from 'next/font/google';

const epilogue = Epilogue({ 
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
});

export default function HomePage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [selectedRange, setSelectedRange] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handler pour la recherche conversationnelle
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;
    
    // Redirection vers /assistant avec le message
    router.push(`/assistant?msg=${encodeURIComponent(searchInput.trim())}`);
  };

  // Handler pour les suggestions rapides
  const handleQuickSuggestion = (suggestion: string) => {
    router.push(`/assistant?msg=${encodeURIComponent(suggestion)}`);
  };

  // Suggestions rapides
  const quickSuggestions = [
    "Je cherche un store de 6m pour ma terrasse",
    "Quel est le prix pour un modèle Kissimy ?",
    "Je veux un store banne anthracite motorisé",
    "Quelle différence entre coffre intégral et semi-coffre ?"
  ];

  // Récupérer les gammes et les produits
  const sortedRanges = getSortedRanges();
  const productsByRange = getProductsByRange();
  
  // Filtrer les produits selon la gamme sélectionnée
  const filteredModels = selectedRange
    ? productsByRange[selectedRange] || []
    : Object.values(STORE_MODELS);

  return (
    <>
      {/* === HEADER === */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#2c3e50] uppercase">
              Storal
            </h1>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-10">
            <Link 
              href="/" 
              className="text-sm font-bold text-[#2c3e50] hover:text-blue-600 transition-colors uppercase tracking-wider"
            >
              Accueil
            </Link>
            
            <Link 
              href="/gammes" 
              className="text-sm font-bold text-[#2c3e50] hover:text-blue-600 transition-colors uppercase tracking-wider"
            >
              Nos Gammes
            </Link>
            
            <Link 
              href="/assistant" 
              className="text-sm font-bold text-[#2c3e50] hover:text-blue-600 transition-colors uppercase tracking-wider"
            >
              Assistant IA
            </Link>
            
            <Link 
              href="/about" 
              className="text-sm font-bold text-[#2c3e50] hover:text-blue-600 transition-colors uppercase tracking-wider"
            >
              À Propos
            </Link>
            
            <Link 
              href="/contact" 
              className="text-sm font-bold text-[#2c3e50] hover:text-blue-600 transition-colors uppercase tracking-wider"
            >
              Contact
            </Link>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-4">
            <Link 
              href="/assistant" 
              className="hidden sm:block bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider hover:brightness-110 transition-all celestial-glow"
            >
              Démarrer
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="flex flex-col px-6 py-4 space-y-4">
              <Link 
                href="/" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-[#2c3e50] hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Accueil
              </Link>
              <Link 
                href="/gammes" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-[#2c3e50] hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Nos Gammes
              </Link>
              <Link 
                href="/assistant" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-[#2c3e50] hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Assistant IA
              </Link>
              <Link 
                href="/about" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-[#2c3e50] hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                À Propos
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-[#2c3e50] hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Contact
              </Link>
              <Link 
                href="/assistant" 
                onClick={() => setIsMenuOpen(false)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider text-center"
              >
                Démarrer
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className={`min-h-screen bg-[#f5f7fa] ${epilogue.className}`}>
      
      {/* === HERO SECTION === */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="relative overflow-hidden rounded-3xl min-h-[520px] flex items-center justify-center p-8" 
             style={{
               backgroundImage: 'url(/images/hero-store-moderne.jpg), linear-gradient(135deg, rgba(37, 99, 235, 0.85) 0%, rgba(59, 130, 246, 0.7) 100%)',
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             }}>
          <div className="absolute inset-0 bg-[#2c3e50]/30 mix-blend-multiply"></div>
          
          <div className="relative z-10 max-w-2xl text-center space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 bg-blue-600/20 text-blue-300 rounded-full text-xs font-black uppercase tracking-widest border border-blue-400/30">
                L'expertise combinée à l'IA
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
                Votre Store<br/>Sur Mesure
              </h2>
              <p className="text-lg text-white/80 font-medium">
                Configurez votre store banne en quelques clics grâce à notre assistant IA et aux conseils d'experts certifiés.
              </p>
            </div>
            
            {/* Champ de recherche conversationnel */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20">
              <div className="flex-1 flex items-center px-4 gap-3 text-white">
                <svg className="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-white placeholder:text-white/50 w-full text-lg py-4 outline-none"
                  placeholder="Ex: Je cherche un store de 6m pour ma terrasse..."
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Envoyer
              </button>
            </form>
            
            {/* Stats badges */}
            <div className="flex justify-center gap-6 text-white/60 text-sm font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>10K+ Installations</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Garantie 12 ans</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Assistance IA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === SECTION CATALOGUE === */}
      <section id="products" className="max-w-7xl mx-auto px-6 pt-4 pb-12">
        <div className="space-y-12">
          
          {/* Header section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-[#2c3e50] uppercase tracking-tight">
              {selectedRange ? 'Nos Modèles' : 'Choisissez Votre Gamme'}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {selectedRange 
                ? 'Découvrez tous les modèles disponibles dans cette gamme'
                : 'Sélectionnez la gamme qui correspond à vos besoins et votre budget'}
            </p>
            
            {/* Bouton retour si une gamme est sélectionnée */}
            {selectedRange && (
              <button
                onClick={() => setSelectedRange(null)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour aux gammes
              </button>
            )}
          </div>

          {/* Grille des cartes de gammes */}
          {!selectedRange && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedRanges.map((range) => {
                const modelCount = getModelCountForRange(range.id);
                const minPrice = getMinPriceForRange(range.id);
                
                return (
                  <Link
                    key={range.id}
                    href={`/gammes#${range.id}`}
                    className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-500 
                               p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block"
                  >
                    {/* Badge optionnel */}
                    {range.badge && (
                      <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                        {range.badge}
                      </div>
                    )}
                    
                    {/* Image et titre */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${range.gradientFrom} ${range.gradientTo} rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform relative`}>
                          <Image
                            src={range.imageUrl}
                            alt={range.label}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-black text-[#2c3e50] uppercase tracking-tight leading-tight">
                            {range.label.replace('Gamme ', '')}
                          </h3>
                          <p className="text-sm font-bold text-blue-600">{range.tagline}</p>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {range.description}
                      </p>
                      
                      {/* Stats */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold">À partir de</p>
                          <p className="text-xl font-black text-[#2c3e50]">
                            {minPrice.toLocaleString('fr-FR')}€
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 font-semibold">
                            {modelCount} {modelCount > 1 ? 'modèles' : 'modèle'}
                          </p>
                          <div className="flex items-center gap-1 text-blue-600 font-bold text-sm mt-1">
                            <span>Découvrir</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Bouton pour voir toutes les gammes avec comparatif */}
          {!selectedRange && (
            <div className="text-center pt-8">
              <Link
                href="/gammes"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>Voir toutes les gammes avec comparatif détaillé</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}

          {/* Grille des produits */}
          {selectedRange && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredModels.map((model) => (
              <Link
                href={`/produits/${getModelSlug(model)}`}
                key={model.id}
                className="group relative bg-white border border-gray-100 p-5 rounded-3xl flex flex-col gap-5 cursor-pointer transition-all hover:shadow-[0_0_25px_rgba(37,99,235,0.25)] shadow-[0_0_15px_rgba(37,99,235,0.1)] block"
                style={{ boxShadow: '0 0 15px rgba(37, 99, 235, 0.1)' }}
              >
                {/* Badge promo en haut à droite */}
                {model.is_promo && (
                  <div className="absolute top-3 right-3 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                    PROMO
                  </div>
                )}

                {/* Image du produit */}
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl">
                  {model.image ? (
                    <Image
                      src={model.image}
                      alt={model.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <span className="text-6xl">🏠</span>
                    </div>
                  )}
                </div>

                {/* Contenu de la carte */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-black text-[#2c3e50]">{model.name}</h4>
                      <p className="text-sm text-blue-600 font-bold">{model.description}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5">
                    {model.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Options Disponibles */}
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Options Disponibles</p>
                    <div className="flex flex-wrap gap-2">
                      {model.compatibility.led_arms && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                          <span className="text-base">💡</span>
                          <span className="text-[9px] font-bold text-blue-700">LED Bras</span>
                        </div>
                      )}
                      {model.compatibility.led_box && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 border border-purple-200 rounded-lg">
                          <span className="text-base">✨</span>
                          <span className="text-[9px] font-bold text-purple-700">LED Coffre</span>
                        </div>
                      )}
                      {model.compatibility.lambrequin_fixe && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-lg">
                          <span className="text-base">📐</span>
                          <span className="text-[9px] font-bold text-green-700">Lambrequin</span>
                        </div>
                      )}
                      {model.compatibility.lambrequin_enroulable && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 border border-orange-200 rounded-lg">
                          <span className="text-base">🎭</span>
                          <span className="text-[9px] font-bold text-orange-700">Enroulable</span>
                        </div>
                      )}
                      {model.ceilingMountPrices && model.ceilingMountPrices.length > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg">
                          <span className="text-base">⬆️</span>
                          <span className="text-[9px] font-bold text-gray-700">Pose Plafond</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Dimensions</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-gray-50 px-2 py-1 rounded">
                        <span className="text-gray-500 font-semibold">Largeur:</span>
                        <span className="text-gray-700 font-bold ml-1">
                          {(() => {
                            const dims = getModelDimensions(model);
                            return `${(dims.minWidth / 1000).toFixed(1)}-${(dims.maxWidth / 1000).toFixed(1)}m`;
                          })()}
                        </span>
                      </div>
                      <div className="bg-gray-50 px-2 py-1 rounded">
                        <span className="text-gray-500 font-semibold">Avancée:</span>
                        <span className="text-gray-700 font-bold ml-1">
                          {(() => {
                            const dims = getModelDimensions(model);
                            return `${(dims.minProjection / 1000).toFixed(1)}-${(dims.maxProjection / 1000).toFixed(1)}m`;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Prix et CTA */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="text-sm font-black text-gray-500">
                      À partir de<span className="block text-lg text-[#2c3e50]">{getMinimumPrice(model).toLocaleString('fr-FR')}€</span>
                      <span className="text-[9px] font-semibold text-gray-400">TTC (TVA 10%)</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickSuggestion(`Je veux configurer un store ${model.name} (modèle: ${model.id}). Peux-tu me donner un devis personnalisé ?`);
                      }}
                      className="bg-[#2c3e50] text-white w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          )}

          {/* Message si aucun produit */}
          {selectedRange && filteredModels.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun produit disponible dans cette gamme pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* === SECTION AVANTAGES === */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-black text-[#2c3e50]">Pourquoi choisir Storal ?</h3>
            <p className="text-gray-500">L'excellence au service de votre confort</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Avantage 1 */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 transition-all hover:shadow-[0_0_25px_rgba(37,99,235,0.25)]" 
                 style={{ boxShadow: '0 0 15px rgba(37, 99, 235, 0.1)' }}>
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto text-white">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-lg font-black text-[#2c3e50] mb-2 text-center uppercase tracking-wider">Garantie 12 ans</h3>
              <p className="text-gray-500 text-sm text-center">
                Protection totale sur tous nos produits
              </p>
            </div>

            {/* Avantage 2 */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 transition-all hover:shadow-[0_0_25px_rgba(37,99,235,0.25)]" 
                 style={{ boxShadow: '0 0 15px rgba(37, 99, 235, 0.1)' }}>
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto text-white">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-lg font-black text-[#2c3e50] mb-2 text-center uppercase tracking-wider">Fabrication 24h</h3>
              <p className="text-gray-500 text-sm text-center">
                Production rapide en atelier français
              </p>
            </div>

            {/* Avantage 3 */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 transition-all hover:shadow-[0_0_25px_rgba(37,99,235,0.25)]" 
                 style={{ boxShadow: '0 0 15px rgba(37, 99, 235, 0.1)' }}>
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto text-white">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-lg font-black text-[#2c3e50] mb-2 text-center uppercase tracking-wider">Livraison 7 jours</h3>
              <p className="text-gray-500 text-sm text-center">
                Partout en France métropolitaine
              </p>
            </div>

            {/* Avantage 4 */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 transition-all hover:shadow-[0_0_25px_rgba(37,99,235,0.25)]" 
                 style={{ boxShadow: '0 0 15px rgba(37, 99, 235, 0.1)' }}>
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto text-white">
                <span className="text-3xl">🔧</span>
              </div>
              <h3 className="text-lg font-black text-[#2c3e50] mb-2 text-center uppercase tracking-wider">Pose Pro</h3>
              <p className="text-gray-500 text-sm text-center">
                Installation par nos experts certifiés
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === GUIDE DE PRISE DE MESURES === */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-12">
            {/* En-tête */}
            <div className="text-center space-y-4">
              <span className="inline-block px-4 py-1.5 bg-blue-600/10 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest border border-blue-600/20">
                📏 Guide Expert
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-[#2c3e50] uppercase tracking-tight">
                Préparez votre projet :<br/>Prenez vos mesures en 3 étapes
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Munissez-vous d&apos;un mètre ruban et suivez ces 3 étapes cruciales pour commander votre store banne sur mesure.
              </p>
            </div>

            {/* 3 Colonnes - Étapes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Étape 1 : Largeur */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 hover:border-blue-500">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Icône */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
                    </svg>
                  </div>
                  
                  {/* Titre */}
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-black mb-2">
                      ÉTAPE 1
                    </span>
                    <h3 className="text-2xl font-black text-[#2c3e50]">La Largeur</h3>
                    <p className="text-sm text-blue-600 font-bold mt-1">Quelle envergure choisir ?</p>
                  </div>

                  {/* Contenu détaillé */}
                  <div className="text-left space-y-4 text-sm text-gray-700">
                    <p className="font-medium text-gray-600 leading-relaxed">
                      Pour une ombre optimale et un rendu esthétique, votre store doit être plus large que votre baie vitrée.
                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <p className="font-bold text-blue-900 mb-2">✓ Le minimum technique :</p>
                      <p className="text-blue-800">
                        Mesurez la largeur de votre fenêtre/baie vitrée et ajoutez au strict minimum <strong>20 à 30 cm de chaque côté</strong> (soit 40 à 60 cm de plus au total).
                      </p>
                    </div>

                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                      <p className="font-bold text-amber-900 mb-2">💡 Le conseil de l&apos;Expert :</p>
                      <p className="text-amber-800">
                        N&apos;oubliez pas que le soleil tourne ! Selon l&apos;exposition de votre terrasse, l&apos;ombre va se décaler sur les côtés au fil de la journée. 
                        <strong className="block mt-2">⭐ Choisissez la plus grande largeur possible</strong> que votre façade (et votre budget) vous permet d&apos;installer.
                      </p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                      <p className="font-bold text-red-900 mb-2">⚠️ Attention :</p>
                      <p className="text-red-800">
                        Vérifiez qu&apos;aucun obstacle (gouttière, luminaire, mur perpendiculaire) ne gêne le déploiement sur cette largeur.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Étape 2 : Avancée */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 hover:border-blue-500">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Icône */}
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  
                  {/* Titre */}
                  <div>
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black mb-2">
                      ÉTAPE 2
                    </span>
                    <h3 className="text-2xl font-black text-[#2c3e50]">L&apos;Avancée</h3>
                    <p className="text-sm text-amber-600 font-bold mt-1">Quelle surface d&apos;ombre ?</p>
                  </div>

                  {/* Contenu détaillé */}
                  <div className="text-left space-y-4 text-sm text-gray-700">
                    <p className="font-medium text-gray-600 leading-relaxed">
                      L&apos;avancée correspond à la longueur des bras dépliés. N&apos;oubliez pas l&apos;inclinaison : l&apos;ombre projetée ne sera jamais exactement sous le store !
                    </p>

                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                      <p className="font-bold text-green-900 mb-2">💡 Le conseil de l&apos;expert :</p>
                      <p className="text-green-800">
                        Pour pouvoir <strong>déjeuner confortablement à l&apos;ombre</strong> autour d&apos;une table (4 à 6 personnes), une avancée de <strong>3 mètres minimum</strong> est fortement recommandée (idéalement 3,50m).
                      </p>
                    </div>

                    <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
                      <p className="font-bold text-gray-900 mb-2">ℹ️ À savoir :</p>
                      <p className="text-gray-700">
                        Une avancée de <strong>2m ou 2,50m</strong> est plutôt réservée aux petits balcons ou pour ombrager l&apos;intérieur de la maison.
                      </p>
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                      <p className="text-xs text-amber-900 font-bold uppercase tracking-wider mb-2">Astuce Pro</p>
                      <p className="text-amber-800 text-sm">
                        Plus l&apos;avancée est grande, plus vous profiterez d&apos;ombre en milieu de journée quand le soleil est haut ! ☀️
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Étape 3 : Hauteur */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 hover:border-blue-500">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Icône */}
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  </div>
                  
                  {/* Titre */}
                  <div>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-black mb-2">
                      ÉTAPE 3
                    </span>
                    <h3 className="text-2xl font-black text-[#2c3e50]">La Hauteur de Pose</h3>
                    <p className="text-sm text-purple-600 font-bold mt-1">L&apos;encombrement</p>
                  </div>

                  {/* Contenu détaillé */}
                  <div className="text-left space-y-4 text-sm text-gray-700">
                    <p className="font-medium text-red-700 leading-relaxed bg-red-50 p-3 rounded-lg border border-red-200">
                      ⚠️ <strong>C&apos;est l&apos;erreur la plus fréquente :</strong> oublier de vérifier la place au-dessus de la fenêtre !
                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <p className="font-bold text-blue-900 mb-2">📐 L&apos;espace requis :</p>
                      <p className="text-blue-800">
                        Mesurez la distance disponible entre <strong>le haut de votre menuiserie</strong> (ou le caisson de votre volet roulant) et le toit (ou le balcon supérieur). C&apos;est votre <strong>&quot;hauteur totale utile&quot;</strong>.
                      </p>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                      <p className="font-bold text-green-900 mb-2">✓ Ce qu&apos;il vous faut :</p>
                      <p className="text-green-800">
                        Il vous faut au minimum <strong>25 à 30 cm de hauteur libre</strong> pour pouvoir fixer le coffre du store confortablement.
                      </p>
                    </div>

                    <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                      <p className="font-bold text-indigo-900 mb-2">🎯 Hauteur de fixation idéale :</p>
                      <p className="text-indigo-800">
                        Pour une circulation fluide sous le store ouvert, prévoyez de fixer le coffre à environ <strong>2,50m à 3,00m du sol</strong> (n&apos;oubliez pas que le store a une légère inclinaison vers le bas !).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bannière CTA Assistant IA */}
            <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-white text-left">
                    <p className="text-xl md:text-2xl font-black leading-tight">
                      💡 Un doute sur vos dimensions ?
                    </p>
                    <p className="text-blue-100 text-sm md:text-base font-medium mt-1">
                      Demandez à notre <strong>Assistant IA en bas à droite</strong>, il calculera la configuration idéale pour vous !
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/assistant')}
                  className="px-8 py-4 bg-white text-blue-600 font-black rounded-xl uppercase tracking-wider
                    hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap"
                >
                  🤖 Lancer l&apos;assistant
                </button>
              </div>
            </div>

            {/* Note finale */}
            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                <strong className="text-gray-700">Exemple de demande :</strong> <em>&quot;Ma baie vitrée fait 4 mètres de large et je veux manger à 6 personnes&quot;</em> 
                → Notre IA calculera immédiatement la configuration idéale pour votre projet !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === FOOTER CTA === */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-blue-600 rounded-3xl p-10 text-center shadow-xl shadow-blue-600/20">
          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-wide">
            Une question ? Besoin d&apos;aide ?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Notre assistant IA est disponible 24/7 pour vous accompagner dans votre projet
          </p>
          <button
            onClick={() => router.push('/assistant')}
            className="px-10 py-4 bg-white text-blue-600 font-black text-lg rounded-xl uppercase tracking-wider
              hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            💬 Discuter avec l&apos;assistant
          </button>
        </div>
      </section>
    </main>
    </>
  );
}
