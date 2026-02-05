'use client';

import { useState } from 'react';
import StoreBanneVisualPreview from '@/components/StoreBanneVisualPreview';
import StoreBanneWizard from '@/components/StoreBanneWizard';

export default function StoreBanneProductPage() {
  // État partagé pour la configuration
  const [largeur, setLargeur] = useState(300);
  const [avancee, setAvancee] = useState('250');
  const [modele, setModele] = useState('coffre');
  const [toile, setToile] = useState('gris');
  const [ajouterLED, setAjouterLED] = useState(false);
  const [capteurVent, setCapteurVent] = useState(false);
  const [avecPose, setAvecPose] = useState(true);

  // Calcul du prix (simplifié pour l'affichage)
  const prixBase = 1400;
  const prixOptions = 150 + (ajouterLED ? 250 : 0) + (capteurVent ? 99 : 0);
  const sousTotal = prixBase + prixOptions;
  const tauxTVA = avecPose ? 0.10 : 0.20;
  const prixTotal = sousTotal + (sousTotal * tauxTVA);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Container principal - Split Screen Desktop */}
      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          
          {/* COLONNE GAUCHE - APERÇU VISUEL STICKY */}
          <div className="order-1 lg:sticky lg:top-20 lg:self-start h-fit">
            <div className="bg-white rounded-2xl shadow-2xl p-4 border">
              <StoreBanneVisualPreview
                largeur={largeur}
                avancee={avancee}
                modele={modele}
                toile={toile}
                ajouterLED={ajouterLED}
                capteurVent={capteurVent}
              />
              <p className="text-xs text-gray-500 text-center mt-3 italic">
                Aperçu indicatif - Les vraies images seront ajoutées prochainement
              </p>
            </div>
          </div>

          {/* COLONNE DROITE - CONTENU SCROLLABLE */}
          <div className="order-2 space-y-6">
            
            {/* En-tête Produit */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Store Banne sur Mesure
              </h1>
              
              {/* Avis étoiles */}
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400 text-xl">
                  ⭐⭐⭐⭐⭐
                </div>
                <span className="text-sm text-gray-600">(248 avis)</span>
              </div>

              {/* Prix */}
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 border-2 border-rose-200">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-rose-600">
                    {prixTotal.toFixed(0)}€
                  </span>
                  <span className="text-lg text-gray-600">TTC</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
                    ✓ TVA 10% disponible
                  </span>
                  <span className="text-sm text-gray-600">avec pose pro</span>
                </div>
              </div>
            </div>

            {/* Configurateur Wizard - Mise en avant */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border-2 border-rose-100">
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🎨 Configurez votre Store
                </h2>
                <p className="text-gray-600 text-sm">
                  Personnalisez en 4 étapes simples
                </p>
              </div>
              <StoreBanneWizard
                onConfigChange={(config) => {
                  setLargeur(config.largeur);
                  setAvancee(config.avancee);
                  setModele(config.modele);
                  setToile(config.toile);
                  setAjouterLED(config.ajouterLED);
                  setCapteurVent(config.capteurVent);
                  setAvecPose(config.avecPose);
                }}
              />
            </div>

            {/* Caractéristiques Techniques - Accordéons */}
            <div className="bg-white rounded-xl shadow-lg border">
              <details className="group border-b last:border-b-0">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition">
                  <span className="font-bold text-gray-900">📏 Dimensions & Capacités</span>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="p-5 bg-gray-50 text-sm space-y-2">
                  <p><strong>Largeur :</strong> de 180 cm à 500 cm</p>
                  <p><strong>Avancée :</strong> 250 cm, 300 cm ou 350 cm</p>
                  <p><strong>Surface max :</strong> jusqu'à 17,5 m²</p>
                </div>
              </details>

              <details className="group border-b last:border-b-0">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition">
                  <span className="font-bold text-gray-900">🎨 Personnalisation</span>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="p-5 bg-gray-50 text-sm space-y-2">
                  <p><strong>Toiles :</strong> Plus de 300 coloris Dickson disponibles</p>
                  <p><strong>Structure :</strong> RAL au choix (blanc, gris, anthracite...)</p>
                  <p><strong>Options :</strong> LED, capteur vent, télécommande Somfy</p>
                </div>
              </details>

              <details className="group border-b last:border-b-0">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition">
                  <span className="font-bold text-gray-900">🛡️ Garanties</span>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="p-5 bg-gray-50 text-sm space-y-2">
                  <p><strong>Armature :</strong> 10 ans</p>
                  <p><strong>Moteur Somfy :</strong> 5 ans</p>
                  <p><strong>Toile acrylique :</strong> 5 ans</p>
                  <p><strong>Finition peinture :</strong> 8 ans</p>
                </div>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition">
                  <span className="font-bold text-gray-900">🚚 Livraison & Installation</span>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="p-5 bg-gray-50 text-sm space-y-2">
                  <p><strong>Fabrication :</strong> Sous 48h en France</p>
                  <p><strong>Livraison :</strong> Gratuite en France métropolitaine</p>
                  <p><strong>Installation :</strong> Par nos techniciens agréés (TVA 10%)</p>
                  <p><strong>SAV :</strong> Joignable 7j/7</p>
                </div>
              </details>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Un store banne sur-mesure pour votre terrasse
              </h2>
              <div className="prose prose-sm text-gray-700 space-y-3">
                <p>
                  Protégez-vous du soleil avec élégance grâce à notre store banne coffre intégral. 
                  Fabriqué en France avec des matériaux premium, il s'adapte parfaitement à vos besoins.
                </p>
                <p>
                  <strong>Le coffre intégral</strong> protège entièrement la toile et les bras lorsque le store est fermé, 
                  garantissant une durée de vie exceptionnelle face aux intempéries.
                </p>
                <p>
                  <strong>Motorisation Somfy IO</strong> incluse pour un confort optimal : pilotez votre store 
                  depuis votre smartphone ou votre télécommande.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION COMPLÈTE EN BAS - Caractéristiques détaillées */}
        <div className="mt-12 pt-12 border-t">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Caractéristiques Techniques Complètes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fabrication */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <div className="text-4xl mb-4 text-center">🏭</div>
              <h3 className="font-bold text-xl text-gray-900 mb-3 text-center">Fabrication Française</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Fabriqué en France</li>
                <li>✓ Délai 48-72h</li>
                <li>✓ Aluminium extrudé premium</li>
                <li>✓ Peinture thermolaquée QUALICOAT</li>
              </ul>
            </div>

            {/* Motorisation */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <div className="text-4xl mb-4 text-center">⚙️</div>
              <h3 className="font-bold text-xl text-gray-900 mb-3 text-center">Motorisation Somfy</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Moteur Somfy IO inclus</li>
                <li>✓ Télécommande fournie</li>
                <li>✓ Compatible domotique</li>
                <li>✓ Garantie 5 ans</li>
              </ul>
            </div>

            {/* Garanties */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <div className="text-4xl mb-4 text-center">🛡️</div>
              <h3 className="font-bold text-xl text-gray-900 mb-3 text-center">Garanties Premium</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Armature 10 ans</li>
                <li>✓ Peinture 8 ans</li>
                <li>✓ Toile 5 ans</li>
                <li>✓ SAV réactif 7j/7</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
