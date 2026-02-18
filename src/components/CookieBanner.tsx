'use client';

import { useState } from 'react';
import { useConsent } from '@/hooks/useConsent';
import type { ConsentPreferences } from '@/types/consent';

/**
 * Banner de consentement cookies conforme CNIL
 * 
 * Respect des obligations légales (RGPD + ePrivacy) :
 * ✅ Aucun cookie tiers avant consentement explicite
 * ✅ Refus aussi facile qu'acceptation (2 boutons au même niveau)
 * ✅ Bouton "Personnaliser" visible dès le départ
 * ✅ Informations claires sur les finalités
 * ✅ Lien vers politique de confidentialité
 * ✅ Consentement renouvelable tous les 13 mois
 * ✅ Cookies techniques exemptés de consentement
 */
export default function CookieBanner() {
  const { hasConsent, acceptAll, rejectAll, saveConsent, isLoading } = useConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [customPreferences, setCustomPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  // Ne pas afficher le banner si consentement déjà donné ou en chargement
  if (isLoading || hasConsent) {
    return null;
  }

  const handleAcceptAll = () => {
    acceptAll();
  };

  const handleRejectAll = () => {
    rejectAll();
  };

  const handleSaveCustom = () => {
    saveConsent(customPreferences);
  };

  const togglePreference = (key: keyof ConsentPreferences) => {
    if (key === 'necessary') return; // Les cookies nécessaires ne peuvent pas être désactivés
    setCustomPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      {/* Overlay semi-transparent (CNIL : le banner doit être visible et ne pas être ignorable facilement) */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]" />
      
      {/* Banner de consentement */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white shadow-2xl border-t-4 border-blue-600 animate-slide-up">
        <div className="max-w-7xl mx-auto p-6 md:p-8">
          
          {/* Vue simplifiée (par défaut) */}
          {!showDetails ? (
            <div className="space-y-4">
              {/* Titre et description */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-3xl" role="img" aria-label="Cookie">
                  🍪
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Respect de votre vie privée
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Nous utilisons des cookies pour améliorer votre expérience, mesurer l'audience de notre site 
                    et vous proposer des offres personnalisées. Les{' '}
                    <strong className="font-semibold">cookies techniques</strong> sont nécessaires au fonctionnement 
                    du site. Les autres cookies nécessitent votre consentement explicite.
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Pour en savoir plus, consultez notre{' '}
                    <a 
                      href="/confidentialite" 
                      className="text-blue-600 hover:underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      politique de confidentialité
                    </a>.
                  </p>
                </div>
              </div>

              {/* Boutons d'action (CNIL : refus doit être aussi simple qu'acceptation) */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Bouton REFUSER (priorité visuelle égale) */}
                <button
                  onClick={handleRejectAll}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors border-2 border-gray-300 hover:border-gray-400"
                >
                  Tout refuser
                </button>

                {/* Bouton PERSONNALISER */}
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex-1 px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-lg transition-colors border-2 border-blue-600 hover:bg-blue-50"
                >
                  Personnaliser
                </button>

                {/* Bouton ACCEPTER */}
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Tout accepter
                </button>
              </div>
            </div>
          ) : (
            /* Vue détaillée (personnalisation) */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Personnaliser mes préférences
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  aria-label="Retour"
                >
                  ×
                </button>
              </div>

              <p className="text-sm text-gray-600">
                Choisissez les catégories de cookies que vous souhaitez autoriser. 
                Vous pouvez modifier vos préférences à tout moment.
              </p>

              {/* Liste des catégories de cookies */}
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                
                {/* COOKIES NÉCESSAIRES (toujours actifs) */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">Cookies nécessaires</h3>
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                          Toujours actifs
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Ces cookies sont indispensables au fonctionnement du site (panier, session, sécurité). 
                        Ils ne peuvent pas être désactivés.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="mt-1 h-5 w-5 text-green-600 rounded cursor-not-allowed opacity-50"
                    />
                  </div>
                </div>

                {/* COOKIES ANALYTIQUES */}
                <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Cookies analytiques</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Google Analytics nous permet de comprendre comment vous utilisez notre site 
                        (pages vues, durée de visite, taux de rebond). Ces données sont anonymisées.
                      </p>
                      <details className="text-xs text-gray-500">
                        <summary className="cursor-pointer hover:text-blue-600 font-medium">
                          En savoir plus
                        </summary>
                        <ul className="mt-2 ml-4 list-disc space-y-1">
                          <li>Fournisseur : Google LLC (USA)</li>
                          <li>Durée de conservation : 26 mois</li>
                          <li>Finalité : Amélioration UX et mesure d'audience</li>
                          <li>Transfert hors UE : Oui (avec CCT)</li>
                        </ul>
                      </details>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={customPreferences.analytics}
                        onChange={() => togglePreference('analytics')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* COOKIES MARKETING */}
                <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Cookies marketing</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Google Ads nous permet de vous proposer des publicités pertinentes 
                        et de mesurer l'efficacité de nos campagnes.
                      </p>
                      <details className="text-xs text-gray-500">
                        <summary className="cursor-pointer hover:text-blue-600 font-medium">
                          En savoir plus
                        </summary>
                        <ul className="mt-2 ml-4 list-disc space-y-1">
                          <li>Fournisseur : Google LLC (USA)</li>
                          <li>Durée de conservation : 13 mois</li>
                          <li>Finalité : Publicité ciblée et remarketing</li>
                          <li>Transfert hors UE : Oui (avec CCT)</li>
                        </ul>
                      </details>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={customPreferences.marketing}
                        onChange={() => togglePreference('marketing')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* COOKIES DE PRÉFÉRENCES */}
                <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Cookies de préférences</h3>
                      <p className="text-sm text-gray-600">
                        Ces cookies mémorisent vos choix (langue, thème, paramètres d'affichage) 
                        pour vous offrir une expérience personnalisée.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={customPreferences.preferences}
                        onChange={() => togglePreference('preferences')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Boutons de sauvegarde */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveCustom}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Enregistrer mes choix
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
