'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ProductType } from '@/types/products';

// Matrice de prix par paliers
const PRIX_BASE = {
  'coffre': {
    '250': [
      { max: 240, prix: 1200 },
      { max: 300, prix: 1400 },
      { max: 360, prix: 1600 },
      { max: 420, prix: 1850 },
      { max: 500, prix: 2100 }
    ],
    '300': [
      { max: 240, prix: 1300 },
      { max: 300, prix: 1550 },
      { max: 360, prix: 1800 },
      { max: 420, prix: 2050 },
      { max: 500, prix: 2350 }
    ],
    '350': [
      { max: 240, prix: 1400 },
      { max: 300, prix: 1700 },
      { max: 360, prix: 2000 },
      { max: 420, prix: 2300 },
      { max: 500, prix: 2600 }
    ]
  },
  'semi-coffre': {
    '250': [
      { max: 240, prix: 950 },
      { max: 300, prix: 1150 },
      { max: 360, prix: 1350 },
      { max: 420, prix: 1600 },
      { max: 500, prix: 1850 }
    ],
    '300': [
      { max: 240, prix: 1050 },
      { max: 300, prix: 1300 },
      { max: 360, prix: 1550 },
      { max: 420, prix: 1800 },
      { max: 500, prix: 2100 }
    ],
    '350': [
      { max: 240, prix: 1150 },
      { max: 300, prix: 1450 },
      { max: 360, prix: 1750 },
      { max: 420, prix: 2050 },
      { max: 500, prix: 2350 }
    ]
  },
  'monobloc': {
    '250': [
      { max: 240, prix: 750 },
      { max: 300, prix: 900 },
      { max: 360, prix: 1050 },
      { max: 420, prix: 1250 },
      { max: 500, prix: 1450 }
    ],
    '300': [
      { max: 240, prix: 850 },
      { max: 300, prix: 1050 },
      { max: 360, prix: 1250 },
      { max: 420, prix: 1450 },
      { max: 500, prix: 1700 }
    ],
    '350': [
      { max: 240, prix: 950 },
      { max: 300, prix: 1200 },
      { max: 360, prix: 1450 },
      { max: 420, prix: 1700 },
      { max: 500, prix: 1950 }
    ]
  }
};

const TOILES = [
  { id: 'gris', nom: 'Gris', couleur: '#6B7280' },
  { id: 'blanc', nom: 'Blanc Cassé', couleur: '#F3F4F6' },
  { id: 'taupe', nom: 'Taupe', couleur: '#9CA3AF' },
  { id: 'bleu', nom: 'Bleu Marine', couleur: '#1E40AF' },
  { id: 'raye', nom: 'Rayé Bleu/Blanc', couleur: 'linear-gradient(90deg, #1E40AF 50%, #F3F4F6 50%)' }
];

const MODELES = [
  { id: 'coffre', nom: 'Coffre Intégral', description: 'Protection maximale', badge: 'BEST-SELLER' },
  { id: 'semi-coffre', nom: 'Semi-Coffre', description: 'Rapport qualité/prix', badge: '' },
  { id: 'monobloc', nom: 'Monobloc', description: 'Solution économique', badge: '' }
];

interface WizardProps {
  onConfigChange?: (config: {
    largeur: number;
    avancee: string;
    modele: string;
    toile: string;
    ajouterLED: boolean;
    capteurVent: boolean;
    avecPose: boolean;
  }) => void;
  showPreview?: boolean;
}

export default function StoreBanneWizard({ onConfigChange, showPreview = false }: WizardProps) {
  const { addItem } = useCart();
  
  // État du wizard
  const [etape, setEtape] = useState(1);
  
  // Configuration
  const [largeur, setLargeur] = useState(300);
  const [avancee, setAvancee] = useState('250');
  const [modele, setModele] = useState('coffre');
  const [toile, setToile] = useState('gris');
  const [ajouterLED, setAjouterLED] = useState(false);
  const [capteurVent, setCapteurVent] = useState(false);
  const [avecPose, setAvecPose] = useState(true);
  
  // Notifier le parent à chaque changement
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange({ largeur, avancee, modele, toile, ajouterLED, capteurVent, avecPose });
    }
  }, [largeur, avancee, modele, toile, ajouterLED, capteurVent, avecPose, onConfigChange]);
  
  // Calcul du prix
  const calculerPrixBase = () => {
    const paliers = PRIX_BASE[modele as keyof typeof PRIX_BASE][avancee as keyof typeof PRIX_BASE['coffre']];
    if (!paliers) return 0;
    
    const palierTrouve = paliers.find(p => largeur <= p.max);
    return palierTrouve ? palierTrouve.prix : paliers[paliers.length - 1].prix;
  };
  
  const prixBase = calculerPrixBase();
  const prixMoteur = 150; // Somfy IO inclus
  const prixLED = ajouterLED ? 250 : 0;
  const prixCapteur = capteurVent ? 99 : 0;
  const prixOptions = prixMoteur + prixLED + prixCapteur;
  
  const sousTotal = prixBase + prixOptions;
  const tauxTVA = avecPose ? 0.10 : 0.20;
  const montantTVA = sousTotal * tauxTVA;
  const prixTotal = sousTotal + montantTVA;
  const economie = avecPose ? sousTotal * 0.10 : 0;
  
  const suivant = () => {
    if (etape < 4) setEtape(etape + 1);
  };
  
  const precedent = () => {
    if (etape > 1) setEtape(etape - 1);
  };
  
  const ajouterAuPanier = () => {
    const toileSelec = TOILES.find(t => t.id === toile);
    const modeleSelec = MODELES.find(m => m.id === modele);
    
    // Mapping vers armType
    const armTypeMap: Record<string, 'coffre' | 'semi-coffre' | 'ouvert'> = {
      'coffre': 'coffre',
      'semi-coffre': 'semi-coffre',
      'monobloc': 'ouvert'
    };
    
    addItem({
      productId: `store-${Date.now()}`,
      productType: ProductType.STORE_BANNE,
      productName: `Store Banne ${modeleSelec?.nom} - ${largeur}cm x ${avancee}cm`,
      basePrice: prixBase,
      pricePerUnit: prixTotal,
      quantity: 1,
      configuration: {
        width: largeur,
        depth: parseInt(avancee),
        motorized: true,
        motorType: 'smarty',
        fabric: 'acrylique',
        fabricColor: toileSelec?.nom || 'Gris',
        frameColor: 'blanc',
        armType: armTypeMap[modele] || 'coffre',
        windSensor: capteurVent,
        rainSensor: false
      }
    });
  };

  return (
    <div>
      {/* Barre de progression */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                etape >= num 
                  ? 'bg-rose-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {num}
              </div>
              {num < 4 && (
                <div className={`w-12 md:w-20 h-1 mx-2 transition-all ${
                  etape > num ? 'bg-rose-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>Dimensions</span>
          <span>Modèle</span>
          <span>Options</span>
          <span>Installation</span>
        </div>
      </div>

      {/* Formulaire Wizard */}
      <div className="space-y-6">
              
        {/* ÉTAPE 1: DIMENSIONS */}
        {etape === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dimensions de votre store</h2>
                  
                  {/* Largeur */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      Largeur de façade (cm)
                    </label>
                    <input
                      type="number"
                      value={largeur}
                      onChange={(e) => setLargeur(Number(e.target.value))}
                      min="180"
                      max="500"
                      className="w-full px-6 py-4 text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition"
                    />
                    <p className="text-sm text-gray-500 mt-2">Entre 180 cm et 500 cm</p>
                  </div>

                  {/* Avancée */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      Avancée souhaitée
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {['250', '300', '350'].map((val) => (
                        <button
                          key={val}
                          onClick={() => setAvancee(val)}
                          className={`py-6 px-4 rounded-xl font-bold text-xl transition-all ${
                            avancee === val
                              ? 'bg-rose-600 text-white shadow-lg scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {val} cm
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

        {/* ÉTAPE 2: MODÈLE & STYLE */}
        {etape === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Modèle & Style</h2>
                  
                  {/* Type de store */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      Type de store
                    </label>
                    <div className="space-y-3">
                      {MODELES.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setModele(m.id)}
                          className={`w-full p-4 rounded-xl text-left transition-all relative ${
                            modele === m.id
                              ? 'bg-rose-600 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {m.badge && (
                            <span className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded">
                              {m.badge}
                            </span>
                          )}
                          <div className="font-bold text-xl">{m.nom}</div>
                          <div className={`text-sm ${modele === m.id ? 'text-white/80' : 'text-gray-500'}`}>
                            {m.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Choix toile */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      Couleur de toile
                    </label>
                    <div className="flex gap-4">
                      {TOILES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setToile(t.id)}
                          className={`relative group`}
                          title={t.nom}
                        >
                          <div
                            className={`w-16 h-16 rounded-full transition-all ${
                              toile === t.id ? 'ring-4 ring-rose-600 scale-110' : 'hover:scale-105'
                            }`}
                            style={{
                              background: t.id === 'raye' ? t.couleur : undefined,
                              backgroundColor: t.id !== 'raye' ? t.couleur : undefined
                            }}
                          />
                          {toile === t.id && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

        {/* ÉTAPE 3: OPTIONS */}
        {etape === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Options & Confort</h2>
                  
                  {/* Moteur */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-bold text-gray-900">Motorisation Somfy IO</div>
                        <div className="text-sm text-gray-600">Incluse avec télécommande</div>
                      </div>
                      <div className="ml-auto font-bold text-blue-600">+{prixMoteur}€</div>
                    </div>
                  </div>

                  {/* LED */}
                  <label className={`block p-4 rounded-xl cursor-pointer transition-all ${
                    ajouterLED ? 'bg-rose-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={ajouterLED}
                        onChange={(e) => setAjouterLED(e.target.checked)}
                        className="w-6 h-6"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-lg">Éclairage LED</div>
                        <div className={`text-sm ${ajouterLED ? 'text-white/80' : 'text-gray-600'}`}>
                          Bandeau LED intégré pour vos soirées
                        </div>
                      </div>
                      <div className="font-bold text-xl">+250€</div>
                    </div>
                  </label>

                  {/* Capteur vent */}
                  <label className={`block p-4 rounded-xl cursor-pointer transition-all ${
                    capteurVent ? 'bg-rose-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={capteurVent}
                        onChange={(e) => setCapteurVent(e.target.checked)}
                        className="w-6 h-6"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-lg">Capteur de Vent Eolis 3D</div>
                        <div className={`text-sm ${capteurVent ? 'text-white/80' : 'text-gray-600'}`}>
                          Remonte automatiquement en cas de rafales
                        </div>
                      </div>
                      <div className="font-bold text-xl">+99€</div>
                    </div>
                  </label>
                </div>
              )}

        {/* ÉTAPE 4: INSTALLATION */}
        {etape === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Installation & TVA</h2>
                  
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-bold text-gray-900 mb-1">💰 Économisez jusqu'à 10% !</div>
                        <div className="text-sm text-gray-700">
                          En choisissant notre forfait pose par un professionnel, vous bénéficiez de la TVA réduite à 10% au lieu de 20%.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Pose perso */}
                    <button
                      onClick={() => setAvecPose(false)}
                      className={`w-full p-6 rounded-xl text-left transition-all ${
                        !avecPose
                          ? 'bg-gray-800 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center ${
                          !avecPose ? 'border-white' : 'border-gray-400'
                        }`}>
                          {!avecPose && <div className="w-3 h-3 rounded-full bg-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-xl mb-1">Je pose moi-même</div>
                          <div className={`text-sm ${!avecPose ? 'text-white/80' : 'text-gray-500'}`}>
                            TVA à 20% · Livraison incluse
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{prixTotal.toFixed(2)}€</div>
                          <div className={`text-xs ${!avecPose ? 'text-white/60' : 'text-gray-400'}`}>TTC</div>
                        </div>
                      </div>
                    </button>

                    {/* Pose pro */}
                    <button
                      onClick={() => setAvecPose(true)}
                      className={`w-full p-6 rounded-xl text-left transition-all relative overflow-hidden ${
                        avecPose
                          ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {avecPose && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                          RECOMMANDÉ
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center ${
                          avecPose ? 'border-white' : 'border-gray-400'
                        }`}>
                          {avecPose && <div className="w-3 h-3 rounded-full bg-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-xl mb-1">Pose par un professionnel</div>
                          <div className={`text-sm ${avecPose ? 'text-white/90' : 'text-gray-500'}`}>
                            TVA à 10% · Installation garantie
                          </div>
                          {avecPose && economie > 0 && (
                            <div className="text-sm font-semibold text-yellow-300 mt-1">
                              ✓ Vous économisez {economie.toFixed(2)}€
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{prixTotal.toFixed(2)}€</div>
                          <div className={`text-xs ${avecPose ? 'text-white/60' : 'text-gray-400'}`}>TTC</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

        {/* Boutons navigation */}
        <div className="flex justify-between mt-6 pt-6 border-t">
          <button
            onClick={precedent}
            disabled={etape === 1}
            className="px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Précédent
          </button>
          
          {etape < 4 ? (
            <button
              onClick={suivant}
              className="px-8 py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg transition"
            >
              Suivant →
            </button>
          ) : (
            <button
              onClick={ajouterAuPanier}
              className="px-8 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg transition flex items-center gap-2"
            >
              🛒 Ajouter au panier
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
