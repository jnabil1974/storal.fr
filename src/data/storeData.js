// --- CONFIGURATION DE LA MARGE ET TVA ---
export const COEFF_MARGE = 1.8; // À ajuster selon votre rentabilité
export const TVA_TAUX_NORMAL = 1.20; // 20%
export const TVA_TAUX_REDUIT = 1.10; // 10% (Pose par pro)

// --- 1. LES COULEURS D'ARMATURE (FRAME_COLORS) ---
export const FRAME_COLORS = [
  // GROUPE A : STANDARDS (Stock = Rapide)
  { id: '9010', name: 'Blanc (RAL 9010)', hex: '#FFFFFF', price: 0, category: 'standard' },
  { id: '1015', name: 'Beige (RAL 1015)', hex: '#F3E5AB', price: 0, category: 'standard' },
  { id: '7016', name: 'Gris Anthracite (RAL 7016)', hex: '#383E42', price: 0, category: 'standard' },

  // GROUPE B : NUANCIER MATEST (Gratuit mais délai fab)
  // Source Catalogue : "sans aucune plus-value 88 autres couleurs"
  { id: '9006', name: 'Gris Argent (9006)', hex: '#A5A5A5', price: 0, category: 'matest' },
  { id: '8019', name: 'Brun Gris (8019)', hex: '#3F3A3A', price: 0, category: 'matest' },
  { id: '3004', name: 'Rouge Pourpre (3004)', hex: '#6B242D', price: 0, category: 'matest' },
  { id: '5003', name: 'Bleu Saphir (5003)', hex: '#1D2E50', price: 0, category: 'matest' },
  { id: '6005', name: 'Vert Mousse (6005)', hex: '#0E2919', price: 0, category: 'matest' },
  { id: '9005', name: 'Noir Profond (9005)', hex: '#0A0A0A', price: 0, category: 'matest' },
  // ... Vous pourrez ajouter les 80 autres ici plus tard

  // GROUPE C : HORS NUANCIER (Option Payante)
  // Source Catalogue : "hors nuancier +89,00"
  { id: 'custom', name: 'Autre RAL Spécifique', hex: 'linear-gradient(135deg, #eee 25%, #ccc 25%, #ccc 50%, #eee 50%, #eee 75%, #ccc 75%, #ccc 100%)', price: 89, category: 'custom' }
];


// --- 2. LES TOILES (FABRICS) ---
export const FABRICS = [
  // --- DOSSIER : UNIS ---
  { 
    id: 'orc_0001', 
    ref: '0001', 
    name: 'Écru', 
    folder: 'public/images/Toiles/DICKSON/DICKSON ORCHESTREA UNI',     // Nom exact du dossier
    category: 'uni',    // Pour le filtre du site
    price: 0 
  },
  { 
    id: 'orc_6088', 
    ref: '6088', 
    name: 'Gris Anthracite', 
    folder: 'public/images/Toiles/DICKSON/DICKSON ORCHESTREA UNI', 
    category: 'uni',
    price: 0 
  },

  // --- DOSSIER : RAYÉS ---
  { 
    id: 'orc_8902', 
    ref: '8902', 
    name: 'Manosque Gris', 
    folder: 'public/images/Toiles/DICKSON/ORCHESTRA DECORS',    // Attention aux accents dans les noms de dossier
    category: 'raye', 
    price: 0 
  },
  
  // --- DOSSIER : GOLDIES ---
  { 
    id: 'gold_D100', 
    ref: 'D100', 
    name: 'Sable Gold', 
    folder: 'public/images/Toiles/DICKSON/ORCHESTRA DECORS', 
    category: 'goldies',
    price: 0 
  },
];


// --- 3. LES MODÈLES ET PRIX (STORES_DATA) ---
export const STORES_DATA = {
  "kissimy": {
    name: "KISSIMY (Coffre Galbé)",
    style: "galbe",
    description: "La capsule hermétique aux lignes douces.",
    features: ["Coffre intégral", "Design arrondi", "Idéal Résidentiel"],
    basePriceIncludes: "Moteur Somfy IO",
    options: { ledsArms: 426, ledsBoxPrice: 0 }, // Pas de LED coffre sur ce modèle
    prices: {
      "250": [
        { maxW: 2470, priceHT: 1295 },
        { maxW: 3650, priceHT: 1524 },
        { maxW: 4830, priceHT: 1676 }
      ],
      "300": [
        { maxW: 2470, priceHT: 1354 },
        { maxW: 3650, priceHT: 1593 },
        { maxW: 4830, priceHT: 1760 }
      ]
    }
  },
  "heliom": {
    name: "HELIOM (Coffre Carré)",
    style: "carre",
    description: "Design cubique contemporain 100% intégré.",
    features: ["Lignes droites", "Architectural", "Grandes dimensions"],
    basePriceIncludes: "Moteur Somfy IO",
    options: { ledsArms: 426, ledsBoxPrice: 350 }, // LED Coffre possible (+350€)
    prices: {
      "250": [
        { maxW: 2400, priceHT: 2040 },
        { maxW: 3580, priceHT: 2147 },
        { maxW: 4200, priceHT: 2339 },
        { maxW: 5290, priceHT: 2412 }
      ],
      "300": [
        { maxW: 2400, priceHT: 2214 },
        { maxW: 3580, priceHT: 2401 },
        { maxW: 4200, priceHT: 2490 }
      ]
    }
  }
};

// --- 4. FONCTION DE CALCUL ---
export function getStorePrice(modelKey, widthCm, projectionCm, options = {}) {
  const model = STORES_DATA[modelKey];
  if (!model) return { error: "Modèle introuvable" };

  // 1. PRIX BASE (Selon dimensions)
  const projectionKey = String(projectionCm);
  const priceGrid = model.prices[projectionKey];
  if (!priceGrid) return { error: "Avancée non disponible" };

  const widthMm = widthCm * 10;
  const tier = priceGrid.find(p => p.maxW >= widthMm);
  if (!tier) return { error: "Dimension hors standard (Sur devis)" };

  let totalHT = tier.priceHT;

  // 2. OPTIONS COULEUR ARMATURE
  // On cherche la couleur choisie dans notre liste FRAME_COLORS
  if (options.frameColorId) {
    const colorObj = FRAME_COLORS.find(c => c.id === options.frameColorId);
    if (colorObj) {
      totalHT += colorObj.price; // Ajoute 0€ si Matest, 89€ si Custom
    }
  }

  // 3. OPTIONS LED & MOTEUR
  if (options.ledBras) totalHT += model.options.ledsArms;
  if (options.ledCoffre) totalHT += (model.options.ledsBoxPrice || 0);

  // 4. CALCUL FINAL
  const sellingPriceHT = totalHT * COEFF_MARGE;
  const tva = options.posePro ? TVA_TAUX_REDUIT : TVA_TAUX_NORMAL;
  const finalPriceTTC = sellingPriceHT * tva;

  return {
    buyPriceHT: totalHT,
    sellingPriceHT: Math.round(sellingPriceHT),
    finalPriceTTC: Math.round(finalPriceTTC)
  };
}