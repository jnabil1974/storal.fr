'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { STORE_MODELS } from '@/lib/catalog-data';

export default function HomePage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

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

  // Filtrer les produits selon la catégorie active
  const allModels = Object.values(STORE_MODELS);
  const filteredModels = activeFilter === 'all' 
    ? allModels 
    : allModels.filter(model => {
        if (activeFilter === 'coffre') return model.type === 'coffre';
        if (activeFilter === 'traditionnel') return model.type === 'traditionnel';
        if (activeFilter === 'monobloc') return model.type === 'monobloc';
        if (activeFilter === 'specialite') return model.type === 'specialite';
        if (activeFilter === 'promo') return model.is_promo === true;
        return true;
      });

  return (
    <main className="min-h-screen bg-white">
      
      {/* === HERO SECTION === */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Card Hero encadrée */}
          <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-lg p-12 text-center">
            {/* Titre principal */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Votre projet de store banne,<br />
              <span className="text-blue-600">conçu par l&apos;IA</span>,<br />
              validé par l&apos;expert
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-10">
              Décrivez votre besoin, l'IA vous guide jusqu'au devis parfait
            </p>

            {/* Champ de recherche conversationnel */}
            <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ex: Je cherche un store de 6 mètres pour ma terrasse plein sud..."
                className="w-full px-6 py-5 pr-32 text-lg rounded-2xl border-2 border-gray-300 bg-white 
                  focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-8 py-3 bg-blue-600 
                  text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md 
                  hover:shadow-lg active:scale-95"
              >
                Envoyer
              </button>
            </form>

            {/* Suggestions rapides */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSuggestion(suggestion)}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 border border-gray-300 
                    rounded-full hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === SECTION CATALOGUE === */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          
          {/* Filtres par catégorie */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600'
              }`}
            >
              Tout
            </button>
            <button
              onClick={() => setActiveFilter('promo')}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                activeFilter === 'promo'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600'
              }`}
            >
              🔥 Promos
            </button>
            <button
              onClick={() => setActiveFilter('coffre')}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                activeFilter === 'coffre'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600'
              }`}
            >
              Coffre Intégral
            </button>
            <button
              onClick={() => setActiveFilter('traditionnel')}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                activeFilter === 'traditionnel'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600'
              }`}
            >
              Traditionnel
            </button>
            <button
              onClick={() => setActiveFilter('monobloc')}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                activeFilter === 'monobloc'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600'
              }`}
            >
              Monobloc
            </button>
          </div>

          {/* Grille Bento des produits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.slice(0, 9).map((model, index) => {
              // Variation de taille pour effet Bento
              const isLarge = (index === 0 || index === 4);
              const gridClass = isLarge ? 'md:col-span-2 md:row-span-2' : '';

              return (
                <div
                  key={model.id}
                  className={`group relative bg-white rounded-2xl overflow-hidden 
                    border-2 border-gray-200 shadow-lg hover:shadow-xl hover:border-blue-500 transition-all duration-300 
                    hover:scale-[1.02] ${gridClass}`}
                >
                  {/* Badge promo */}
                  {model.is_promo && (
                    <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      🔥 PROMO
                    </div>
                  )}

                  {/* Image du produit */}
                  <div className={`relative bg-gradient-to-br from-slate-100 to-slate-200 ${isLarge ? 'h-80' : 'h-48'}`}>
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      {model.image ? (
                        <Image
                          src={model.image}
                          alt={model.name}
                          width={isLarge ? 400 : 200}
                          height={isLarge ? 400 : 200}
                          className="object-contain w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <span className={`${isLarge ? 'text-8xl' : 'text-6xl'}`}>🏠</span>
                      )}
                    </div>
                  </div>

                  {/* Contenu de la carte */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{model.name}</h3>
                    <p className="text-slate-600 mb-4 text-sm">{model.description}</p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {model.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => handleQuickSuggestion(`Je veux configurer le modèle ${model.name}`)}
                      className="w-full py-3 bg-blue-600 text-white font-bold 
                        rounded-xl hover:bg-blue-700 transition-all shadow-md 
                        hover:shadow-lg active:scale-95"
                    >
                      Personnaliser avec l&apos;IA
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Voir tous les produits */}
          {filteredModels.length > 9 && (
            <div className="text-center mt-10">
              <button
                onClick={() => handleQuickSuggestion("Montre-moi tous les modèles disponibles")}
                className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 
                  rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all font-semibold"
              >
                Voir tous les modèles ({filteredModels.length})
              </button>
            </div>
          )}
        </div>
      </section>

      {/* === SECTION AVANTAGES === */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Pourquoi choisir Storal ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Avantage 1 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 
              hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Garantie 12 ans</h3>
              <p className="text-gray-600 text-sm text-center">
                Protection totale sur tous nos produits
              </p>
            </div>

            {/* Avantage 2 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 
              hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Fabrication 24h</h3>
              <p className="text-gray-600 text-sm text-center">
                Production rapide en atelier français
              </p>
            </div>

            {/* Avantage 3 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 
              hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Livraison 7 jours</h3>
              <p className="text-gray-600 text-sm text-center">
                Partout en France métropolitaine
              </p>
            </div>

            {/* Avantage 4 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 
              hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">🔧</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Pose pro</h3>
              <p className="text-gray-600 text-sm text-center">
                Installation par nos experts certifiés
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === FOOTER CTA === */}
      <section className="px-6 py-12 text-center bg-gray-50">
        <div className="max-w-3xl mx-auto bg-blue-600 rounded-3xl p-10 border-2 border-blue-700 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Une question ? Besoin d&apos;aide ?
          </h2>
          <p className="text-blue-100 mb-8">
            Notre assistant IA est disponible 24/7 pour vous accompagner dans votre projet
          </p>
          <button
            onClick={() => router.push('/assistant')}
            className="px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl 
              hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            💬 Discuter avec l&apos;assistant
          </button>
        </div>
      </section>
    </main>
  );
}
