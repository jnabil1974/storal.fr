'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StoreAntichaleureePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48"></div>
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Protégez votre véranda
          </h1>
          <p className="text-xl text-blue-50 mb-8">
            Avec des stores antichaleur pour un confort optimal toute l'année
          </p>
          <Link
            href="#pourquoi"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Découvrir nos solutions
          </Link>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Un problème d'été courant
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Les vérandas sont des espaces merveilleux pour profiter de la lumière naturelle tout en étant à l'abri des intempéries. 
            Cependant, elles peuvent rapidement devenir des fournaises en été. C'est là que les <strong>stores antichaleur</strong> entrent en jeu.
          </p>
        </div>
      </section>

      {/* Pourquoi Stores Antichaleur */}
      <section id="pourquoi" className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Pourquoi opter pour des stores antichaleur ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Avantage 1 */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Réduction de la chaleur
              </h3>
              <p className="text-gray-600">
                Nos stores antichaleur sont conçus pour bloquer jusqu'à 90% des rayons UV, 
                gardant ainsi votre véranda agréable et fraîche même en plein été.
              </p>
            </div>

            {/* Avantage 2 */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Économies d'énergie
              </h3>
              <p className="text-gray-600">
                En régulant la température intérieure, vous réduisez la nécessité d'utiliser la climatisation, 
                ce qui se traduit par des économies sur vos factures d'électricité.
              </p>
            </div>

            {/* Avantage 3 */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mb-4">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Protection des meubles
              </h3>
              <p className="text-gray-600">
                En filtrant les rayons UV, vos meubles, tapis et autres objets décoratifs sont 
                protégés du jaunissement et de la décoloration.
              </p>
            </div>

            {/* Avantage 4 */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Confort visuel
              </h3>
              <p className="text-gray-600">
                Ces stores réduisent l'éblouissement tout en permettant une diffusion agréable 
                de la lumière naturelle.
              </p>
            </div>

            {/* Avantage 5 */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 mb-4">
                <svg
                  className="w-6 h-6 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Esthétique et style
              </h3>
              <p className="text-gray-600">
                Disponibles en divers styles et couleurs, nos stores s'intégreront parfaitement 
                à l'esthétique de votre véranda.
              </p>
            </div>

            {/* Avantage 6 - Bonus */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Toute l'année
              </h3>
              <p className="text-gray-600">
                Profitez d'une véranda confortable et élégante tout au long de l'année, 
                en hiver comme en été.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Solutions */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Nos solutions de stores antichaleur
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Solution 1 */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 border-2 border-blue-200">
            <div className="w-16 h-16 bg-blue-200 rounded-lg mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Stores enrouleurs
            </h3>
            <p className="text-gray-700">
              Simples et élégants, ils s'adaptent à toutes les vérandas et se règlent facilement 
              pour un confort optimal.
            </p>
          </div>

          {/* Solution 2 */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8 border-2 border-green-200">
            <div className="w-16 h-16 bg-green-200 rounded-lg mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Stores plissés
            </h3>
            <p className="text-gray-700">
              Pour une touche de sophistication supplémentaire. Leurs plis permettent une 
              meilleure isolation thermique.
            </p>
          </div>

          {/* Solution 3 */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-8 border-2 border-purple-200">
            <div className="w-16 h-16 bg-purple-200 rounded-lg mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Stores vénitiens
            </h3>
            <p className="text-gray-700">
              Offrent un excellent contrôle de la lumière et un look contemporain. 
              Faciles à nettoyer et très pratiques.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à transformer votre véranda ?
          </h2>
          <p className="text-xl text-blue-50 mb-8">
            Notre équipe est à votre service pour vous conseiller et vous proposer la solution 
            la mieux adaptée à vos besoins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Nous contacter
            </Link>
            <Link
              href="/store-banne"
              className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors border-2 border-white"
            >
              Voir tous les stores
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-slate-50 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Contactez notre équipe
          </h2>
          <p className="text-lg text-gray-600 text-center mb-8">
            Pour découvrir toutes nos options et obtenir des conseils personnalisés, 
            contactez notre équipe dès aujourd'hui. Nous sommes là pour vous aider à 
            trouver la solution parfaite pour votre véranda.
          </p>
          <div className="text-center">
            <Link
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Les stores antichaleur</h3>
              <p className="text-gray-400">
                Protégez votre espace de vie avec nos solutions de stores antichaleur performantes 
                et esthétiques.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Avantages clés</h3>
              <ul className="text-gray-400 space-y-2">
                <li>✓ Réduction de chaleur jusqu'à 90%</li>
                <li>✓ Économies d'énergie</li>
                <li>✓ Protection UV</li>
                <li>✓ Esthétique et confort</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Rapide</h3>
              <p className="text-gray-400">
                Installation rapide et facile par nos professionnels qualifiés. 
                Service après-vente garanti.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Storal.fr - Tous droits réservés</p>
          </div>
        </div>
      </section>
    </div>
  );
}
