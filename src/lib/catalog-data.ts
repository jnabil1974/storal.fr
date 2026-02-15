// /src/lib/catalog-data.ts

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

// ==========================================
// HELPERS - Prix et Dimensions
// ==========================================

/**
 * Calcule le prix minimum d'un modèle (prix de base TTC avec TVA 10%)
 * Prend la configuration la plus petite (avancée min, largeur min)
 */
export function getMinimumPrice(model: StoreModel): number {
  // Trouver l'avancée minimale disponible
  const projections = Object.keys(model.buyPrices).map(Number).sort((a, b) => a - b);
  if (projections.length === 0) return 0;
  
  const minProjection = projections[0];
  const priceGrid = model.buyPrices[minProjection];
  
  if (!priceGrid || priceGrid.length === 0) return 0;
  
  // Prendre le premier palier (largeur la plus petite)
  const minPriceHT = priceGrid[0].priceHT;
  
  // Appliquer le coefficient du modèle (ou COEFF_MARGE par défaut)
  const coeff = model.salesCoefficient ?? 1.8; // COEFF_MARGE sera défini plus bas
  const priceVenteHT = minPriceHT * coeff;
  
  // Appliquer TVA réduite 10%
  const priceTTC = priceVenteHT * 1.10;
  
  return Math.round(priceTTC);
}

/**
 * Extrait les dimensions min/max d'un modèle
 */
export function getModelDimensions(model: StoreModel): {
  minWidth: number;
  maxWidth: number;
  minProjection: number;
  maxProjection: number;
} {
  // Avancées disponibles
  const projections = Object.keys(model.buyPrices).map(Number).sort((a, b) => a - b);
  const minProjection = projections.length > 0 ? projections[0] : 0;
  const maxProjection = model.compatibility?.max_projection || (projections.length > 0 ? projections[projections.length - 1] : 0);
  
  // Largeur min : prendre la plus petite largeur min parmi toutes les avancées
  const minWidthValues = Object.values(model.minWidths || {});
  const minWidth = minWidthValues.length > 0 ? Math.min(...minWidthValues) : 0;
  
  // Largeur max : depuis compatibility
  const maxWidth = model.compatibility?.max_width || 0;
  
  return {
    minWidth,
    maxWidth,
    minProjection,
    maxProjection
  };
}
export interface FrameColor {
  id: string;
  name: string;
  hex: string;
  price: number;
  category: 'standard' | 'matest' | 'custom';
}

export type ColorOption = FrameColor;

export interface Fabric {
  id: string;
  ref: string;
  name: string;
  folder: string;
  category: 'uni' | 'raye' | 'goldies';
  price: number;
}

export interface StoreModelCompatibility {
  led_arms: boolean;       // LED dans les bras
  led_box: boolean;        // LED dans le coffre
  lambrequin_fixe: boolean; // NOUVEAU : Lambrequin fixe (Droit/Vague)
  lambrequin_enroulable: boolean; // Lambrequin déroulant (Store dans le store)
  max_width?: number;
  max_projection?: number;
  allowed_colors?: string[]; // NOUVEAU : Couleurs autorisées (pour PROMO limité aux 3 standards)
}

export interface StoreModel {
  id: string;
  name: string;
  type: 'coffre' | 'monobloc' | 'traditionnel' | 'specialite';
  shape: 'carre' | 'galbe';
  is_promo: boolean;
  description: string;
  features: string[];
  compatibility: StoreModelCompatibility;
  image: string;
  // Types de toiles compatibles (codes: ORCH, ORCH_MAX, SATTLER)
  compatible_toile_types?: string[];
  // Logique pour déterminer le nombre de bras (impacte le prix LED)
  armLogic: 'standard_2' | 'force_2_3_4' | 'couples_4_6';
  // Largeur Minimale de fabrication pour chaque avancée { 1500: 1840 }
  minWidths: Record<number, number>; 
  // Grille de prix : Clé = Avancée, Valeur = Tableau de paliers
  buyPrices: Record<number, { maxW: number, priceHT: number }[]>;
  // Option pose plafond : prix selon largeur (si non defini, considere inclus)
  ceilingMountPrices?: { maxW: number, price: number }[];
  // Option lambrequin enroulable : prix selon largeur et manoeuvre
  lambrequinEnroulablePrices?: {
    manual: { maxW: number, price: number }[];
    motorized: { maxW: number, price: number }[];
  };
  // Coefficient de vente spécifique au modèle (si absent, utilise COEFF_MARGE par défaut)
  salesCoefficient?: number;
}

// ==========================================
// 2. PARAMÈTRES COMMERCIAUX
// ==========================================
export const CATALOG_SETTINGS = {
  COEFF_MARGE: 1.8,
  TVA_NORMAL: 1.20,
  TVA_REDUIT: 1.10,
  promoCode: 'BIENVENUE2026',
  promoDiscount: 0.05,
  
  // Coefficients par type d'option (marges différenciées)
  OPTIONS_COEFFICIENTS: {
    LED_ARMS: 2.0,           // 100% de marge sur technologie LED bras
    LED_CASSETTE: 2.0,       // 100% de marge sur LED coffre
    LAMBREQUIN_FIXE: 1.5,    // 50% de marge sur accessoire basique
    LAMBREQUIN_ENROULABLE: 1.8, // 80% de marge sur lambrequin motorisé
    CEILING_MOUNT: 1.6,      // 60% de marge sur pose plafond
    AUVENT: 1.7,             // 70% de marge sur auvent
    FABRIC: 1.4,             // 40% de marge sur toile (commodité)
    FRAME_COLOR_CUSTOM: 1.8, // 80% de marge sur RAL spécifique
    INSTALLATION: 1.3,       // 30% de marge sur main d'œuvre
  },
  
  // Frais de transport pour stores de grande dimension
  TRANSPORT: {
    SEUIL_LARGEUR_MM: 3650,  // Seuil de déclenchement en millimètres de largeur
    FRAIS_HT: 150,           // Frais de transport en € HT (appliqués si largeur > seuil)
  }
};

// ==========================================
// 3. OPTIONS & PRIX (BASE MATEST 2026)
// ==========================================
export const OPTIONS_PRICES = {
  // Prix d'achat HT du kit LED selon Avancée (clé) et Nombre de bras (sous-clé)
  LED_ARMS: {
    1500: { 2: 441, 3: 562, 4: 721, 6: 1125 },
    1750: { 2: 462, 3: 592, 4: 764, 6: 1184 },
    2000: { 2: 481, 3: 624, 4: 805, 6: 1248 },
    2500: { 2: 524, 3: 690, 4: 892, 6: 1382 },
    2750: { 2: 553, 3: 736, 4: 950, 6: 1470 },
    3000: { 2: 567, 3: 757, 4: 981, 6: 1514 },
    3250: { 2: 595, 3: 795, 4: 1032, 6: 1590 },
    3500: { 2: 603, 3: 815, 4: 1057, 6: 1629 },
    4000: { 2: 641, 3: 881, 4: 1148, 6: 1762 }
  } as Record<number, Record<number, number>>,
  
  LED_CASSETTE: 362,
  
  // Prix forfaitaire pour le lambrequin fixe (Kissimy, Kitangi, Dynasta, Belharra)
  LAMBREQUIN_FIXE: 50, 

  // Prix pour le lambrequin enroulable (optionnel)
  LAMBREQUIN_ENROULABLE: {
    MANUAL: [{ max: 2400, price: 357 }, { max: 3580, price: 457 }, { max: 4800, price: 531 }, { max: 6000, price: 633 }],
    MOTORIZED: [{ max: 2400, price: 518 }, { max: 3580, price: 641 }, { max: 4800, price: 722 }, { max: 6000, price: 838 }]
  },

  // Prix de l'auvent (option pour monoblocs uniquement)

  AUVENT_PER_METER: 45 ,// 45 € HT par mètre linéaire de largeur
  
  FRAME_SPECIFIC_RAL: 138,
};

export const FABRIC_FAMILIES = {
    DICKSON_UNI: 'dickson_uni',
    DICKSON_RAYE: 'dickson_raye',
    SOLTIS_86: 'soltis_86',
    SOLTIS_92: 'soltis_92',
};


// ==========================================
// 4. COULEURS & TOILES
// ==========================================

// Import depuis les catalogues générés automatiquement
import { MATEST_COLORS, STANDARD_COLORS as MATEST_STANDARD_COLORS, getColorByRAL } from './catalog-couleurs';
import { TOILE_TYPES, getCompatibleToileTypes, getToilesSummaryForChatbot } from './catalog-toiles';

// Adapter le format pour la compatibilité avec le code existant
export const FRAME_COLORS: FrameColor[] = [
  { id: '9016', name: 'Blanc (RAL 9016)', hex: '#FFFFFF', price: 0, category: 'standard' },
  { id: '1015', name: 'Beige (RAL 1015)', hex: '#F3E5AB', price: 0, category: 'standard' },
  { id: '7016', name: 'Gris Anthracite (RAL 7016)', hex: '#383E42', price: 0, category: 'standard' },
  { id: 'custom', name: 'Autre RAL (Hors Nuancier)', hex: '#cccccc', price: 138, category: 'custom' }
];

// Pour accéder au catalogue complet Matest depuis le chatbot
export { MATEST_COLORS, STANDARD_COLORS, getColorByRAL } from './catalog-couleurs';
export { TOILE_TYPES, getCompatibleToileTypes, getToilesSummaryForChatbot } from './catalog-toiles';

export const FABRICS: Fabric[] = [
  { id: 'orc_0001', ref: '0001', name: 'Écru', folder: '/images/Toiles/DICKSON/DICKSON ORCHESTREA UNI', category: 'uni', price: 0 },
  { id: 'orc_6088', ref: '6088', name: 'Gris Anthracite', folder: '/images/Toiles/DICKSON/DICKSON ORCHESTREA UNI', category: 'uni', price: 0 },
  { id: 'test_bleu', ref: 'TEST-BLEU', name: 'Bleu Océan (Test)', folder: '/images/Toiles/TEST', category: 'uni', price: 0 },
];

export const FABRIC_OPTIONS = {
  MAIN_STORE: FABRICS,
  LAMBREQUIN: [
    { id: 'soltis_86', ref: '86-XXXX', name: 'Soltis 86 (Micro-aéré)', collection: 'Soltis', category: 'technique', folder: '', price: 0 },
    { id: 'soltis_92', ref: '92-XXXX', name: 'Soltis 92 (Thermique)', collection: 'Soltis', category: 'technique', folder: '', price: 0 },
  ]
};

// ==========================================
// 5. CATALOGUE DES 12 MODÈLES
// ==========================================
// /src/lib/catalog-data.ts

export const STORE_MODELS: Record<string, StoreModel> = {

  // --- 1. KISSIMY (Page 34-35) ---
  "kissimy": {
    id: "kissimy",
    name: "KISSIMY",
    type: "coffre",
    shape: "galbe",
    is_promo: false,
    description: "Le coffre compact sur mesure, idéal pour les balcons.",
    features: ["Design doux", "Compact", "Éclairage Bras"],
    image: "/images/stores/KISSIMY.png",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 4830, max_projection: 3000 },
    armLogic: 'standard_2',
    minWidths: { 1500: 1835, 1750: 2085, 2000: 2335, 2500: 2835, 3000: 3355 },
    buyPrices: {
      1500: [{ maxW: 2470, priceHT: 1110 }, { maxW: 3650, priceHT: 1177 }, { maxW: 4830, priceHT: 1281 }],
      1750: [{ maxW: 2470, priceHT: 1139 }, { maxW: 3650, priceHT: 1215 }, { maxW: 4830, priceHT: 1326 }],
      2000: [{ maxW: 2470, priceHT: 1164 }, { maxW: 3650, priceHT: 1246 }, { maxW: 4830, priceHT: 1356 }],
      2500: [{ maxW: 2470, priceHT: 1295 }, { maxW: 3650, priceHT: 1425 }, { maxW: 4830, priceHT: 1676 }],
      3000: [{ maxW: 2470, priceHT: 1354 }, { maxW: 3650, priceHT: 1495 }, { maxW: 4830, priceHT: 1760 }]
    },
    salesCoefficient: 1.0  // Coefficient de test pour vérification
  },

  // --- 2. KISSIMY PROMO (Page 34) ---
  "kissimy_promo": {
    id: "kissimy_promo",
    name: "KISSIMY PROMO (Série Limitée)",
    type: "coffre",
    shape: "galbe",
    is_promo: true,
    description: "L'essentiel du store coffre à prix serré. Moteur Sunea iO inclus.",
    features: ["PRIX PROMO", "Moteur Sunea iO", "Option LED Bras"],
    image: "/images/stores/KISSIMY.png",
    compatible_toile_types: ['ORCH'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 4830, max_projection: 3000, allowed_colors: ['9016', '1015', '7016'] },
    armLogic: 'standard_2',
    minWidths: { 1500: 1835, 1750: 2085, 2000: 2335, 2500: 2835, 3000: 3355 },
    buyPrices: {
      1500: [{ maxW: 2470, priceHT: 1010 }, { maxW: 3650, priceHT: 1047 }, { maxW: 4830, priceHT: 1081 }],
      1750: [{ maxW: 2470, priceHT: 1039 }, { maxW: 3650, priceHT: 1085 }, { maxW: 4830, priceHT: 1126 }],
      2000: [{ maxW: 2470, priceHT: 1064 }, { maxW: 3650, priceHT: 1116 }, { maxW: 4830, priceHT: 1156 }],
      2500: [{ maxW: 2470, priceHT: 1165 }, { maxW: 3650, priceHT: 1225 }, { maxW: 4830, priceHT: 1577 }],
      3000: [{ maxW: 2470, priceHT: 1224 }, { maxW: 3650, priceHT: 1295 }, { maxW: 4830, priceHT: 1649 }]
    },
    salesCoefficient: 1.0  // Coefficient de test pour vérification
  },

  // --- 3. KITANGUY (Page 34-35) ---
  "kitanguy": {
    id: "kitanguy",
    name: "KITANGUY",
    type: "coffre",
    shape: "galbe",
    is_promo: false,
    description: "Le best-seller polyvalent jusqu'à 3.25m d'avancée.",
    features: ["Robuste", "Polyvalent", "Sur mesure"],
    image: "/images/stores/KITANGUY.png",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 5850, max_projection: 3250 },
    armLogic: 'standard_2',
    minWidths: { 1500: 1895, 1750: 2145, 2000: 2395, 2500: 2895, 3000: 3415, 3250: 3645 },
    buyPrices: {
      1500: [{ maxW: 2470, priceHT: 1353 }, { maxW: 3650, priceHT: 1435 }, { maxW: 4830, priceHT: 1561 }, { maxW: 5610, priceHT: 1657 }, { maxW: 5850, priceHT: 1794 }],
      1750: [{ maxW: 2470, priceHT: 1389 }, { maxW: 3650, priceHT: 1478 }, { maxW: 4830, priceHT: 1613 }, { maxW: 5610, priceHT: 1712 }, { maxW: 5850, priceHT: 1852 }],
      2000: [{ maxW: 2470, priceHT: 1428 }, { maxW: 3650, priceHT: 1516 }, { maxW: 4830, priceHT: 1660 }, { maxW: 5610, priceHT: 1765 }, { maxW: 5850, priceHT: 1904 }],
      2500: [{ maxW: 3650, priceHT: 1735 }, { maxW: 4830, priceHT: 1879 }, { maxW: 5850, priceHT: 2033 }],
      3000: [{ maxW: 3650, priceHT: 1822 }, { maxW: 4830, priceHT: 2024 }, { maxW: 5850, priceHT: 2186 }],
      3250: [{ maxW: 4830, priceHT: 1917 }, { maxW: 5850, priceHT: 2148 }]
    },
    ceilingMountPrices: [
      { maxW: 3650, price: 0 },
      { maxW: 5850, price: 38 }
    ]
  },

  // --- 4. KITANGUY 2 (Page 36) ---
  "kitanguy_2": {
    id: "kitanguy_2",
    name: "KITANGUY 2 (LED Coffre)",
    type: "coffre",
    shape: "galbe",
    is_promo: false,
    description: "Design premium avec éclairage LED intégré au coffre.",
    features: ["Nouveau Design", "LED Coffre", "Finition Luxe"],
    image: "/images/stores/KITANGUY_2.png",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: true, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 5850, max_projection: 3250 },
    armLogic: 'standard_2',
    minWidths: { 1500: 1910, 1750: 2160, 2000: 2410, 2500: 2910, 3000: 3410, 3250: 3660 },
    buyPrices: {
      1500: [{ maxW: 2470, priceHT: 1433 }, { maxW: 3650, priceHT: 1520 }, { maxW: 4830, priceHT: 1654 }, { maxW: 5610, priceHT: 1756 }, { maxW: 5850, priceHT: 1901 }],
      1750: [{ maxW: 2470, priceHT: 1473 }, { maxW: 3650, priceHT: 1567 }, { maxW: 4830, priceHT: 1709 }, { maxW: 5610, priceHT: 1814 }, { maxW: 5850, priceHT: 1962 }],
      2000: [{ maxW: 2470, priceHT: 1514 }, { maxW: 3650, priceHT: 1607 }, { maxW: 4830, priceHT: 1760 }, { maxW: 5610, priceHT: 1870 }, { maxW: 5850, priceHT: 2018 }],
      2500: [{ maxW: 3650, priceHT: 1672 }, { maxW: 4830, priceHT: 1839 }, { maxW: 5610, priceHT: 1991 }, { maxW: 5850, priceHT: 2155 }],
      3000: [{ maxW: 3650, priceHT: 1748 }, { maxW: 4830, priceHT: 1931 }, { maxW: 5610, priceHT: 2146 }, { maxW: 5850, priceHT: 2317 }],
      3250: [{ maxW: 4830, priceHT: 1839 }, { maxW: 5610, priceHT: 2032 }, { maxW: 5850, priceHT: 2277 }]
    },
    ceilingMountPrices: [
      { maxW: 3650, price: 0 },
      { maxW: 5850, price: 38 }
    ]
  },

  // --- 5. HELIOM (Page 38) ---
  "heliom": {
    id: "heliom",
    name: "HELIOM",
    type: "coffre",
    shape: "carre",
    is_promo: false,
    description: "Design cubique ultra-tendance pour architecture moderne.",
    features: ["Coffre Carré", "Design épuré", "Avancée 3.5m"],
    image: "/images/stores/HELIOM.png",
    compatible_toile_types: ['ORCH', 'ORCH_MAX', 'SATT'],
    compatibility: { led_arms: true, led_box: true, lambrequin_fixe: false, lambrequin_enroulable: false, max_width: 6000, max_projection: 3500 },
    armLogic: 'standard_2',
    minWidths: { 1500: 2340, 2000: 2840, 2500: 3340, 2750: 3590, 3000: 3840, 3250: 4090, 3500: 4340 },
    buyPrices: {
      1500: [{ maxW: 2400, priceHT: 1950 }, { maxW: 3580, priceHT: 2019 }, { maxW: 4200, priceHT: 2124 }, { maxW: 5290, priceHT: 2301 }, { maxW: 6000, priceHT: 2362 }],
      2000: [{ maxW: 3580, priceHT: 2058 }, { maxW: 4200, priceHT: 2166 }, { maxW: 5290, priceHT: 2353 }, { maxW: 6000, priceHT: 2421 }],
      2500: [{ maxW: 3580, priceHT: 2111 }, { maxW: 4200, priceHT: 2222 }, { maxW: 5290, priceHT: 2421 }, { maxW: 6000, priceHT: 2496 }],
      2750: [{ maxW: 4200, priceHT: 2265 }, { maxW: 5290, priceHT: 2456 }, { maxW: 6000, priceHT: 2544 }],
      3000: [{ maxW: 4200, priceHT: 2291 }, { maxW: 5290, priceHT: 2485 }, { maxW: 6000, priceHT: 2577 }],
      3250: [{ maxW: 4200, priceHT: 2316 }, { maxW: 5290, priceHT: 2512 }, { maxW: 6000, priceHT: 2609 }],
      3500: [{ maxW: 5290, priceHT: 2541 }, { maxW: 6000, priceHT: 2641 }]
    },
    ceilingMountPrices: [
      { maxW: 3580, price: 297 },
      { maxW: 6000, price: 444 }
    ]
  },

  // --- 6. HELIOM PLUS (Page 38) ---
  "heliom_plus": {
    id: "heliom_plus",
    name: "HELIOM PLUS (Grande Avancée)",
    type: "coffre",
    shape: "carre",
    is_promo: false,
    description: "Version renforcée jusqu'à 4m d'avancée avec option lambrequin.",
    features: ["Avancée 4m", "Lambrequin Enroulable", "Bras Renforcés"],
    image: "/images/stores/HELIOM.png",
    compatible_toile_types: ['ORCH', 'ORCH_MAX', 'SATT'],
    compatibility: { led_arms: true, led_box: true, lambrequin_fixe: false, lambrequin_enroulable: true, max_width: 6000, max_projection: 4000 },
    armLogic: 'standard_2',
    minWidths: { 2500: 3420, 2750: 3670, 3000: 3920, 3250: 4170, 3500: 4420, 4000: 4920 },
    buyPrices: {
      2500: [{ maxW: 3580, priceHT: 2185 }, { maxW: 4200, priceHT: 2308 }, { maxW: 5290, priceHT: 2496 }, { maxW: 6000, priceHT: 2570 }],
      2750: [{ maxW: 4200, priceHT: 2332 }, { maxW: 5290, priceHT: 2526 }, { maxW: 6000, priceHT: 2603 }],
      3000: [{ maxW: 4200, priceHT: 2356 }, { maxW: 5290, priceHT: 2556 }, { maxW: 6000, priceHT: 2638 }],
      3250: [{ maxW: 4200, priceHT: 2402 }, { maxW: 5290, priceHT: 2614 }, { maxW: 6000, priceHT: 2703 }],
      3500: [{ maxW: 5290, priceHT: 2651 }, { maxW: 6000, priceHT: 2745 }],
      4000: [{ maxW: 5290, priceHT: 2838 }, { maxW: 6000, priceHT: 2938 }]
    },
    ceilingMountPrices: [
      { maxW: 3580, price: 297 },
      { maxW: 6000, price: 444 }
    ],
    lambrequinEnroulablePrices: {
      manual: [
        { maxW: 2390, price: 358 },
        { maxW: 3580, price: 416 },
        { maxW: 4760, price: 451 },
        { maxW: 5610, price: 614 },
        { maxW: 6000, price: 633 }
      ],
      motorized: [
        { maxW: 2390, price: 598 },
        { maxW: 3580, price: 656 },
        { maxW: 4760, price: 683 },
        { maxW: 5610, price: 802 },
        { maxW: 6000, price: 838 }
      ]
    }
  },

  // --- 7. KALY'O (Page 44) ---
  "kalyo": {
    id: "kalyo",
    name: "KALY'O",
    type: "coffre",
    shape: "galbe",
    is_promo: false,
    description: "La nouveauté 2026. Polyvalent avec option lambrequin enroulable.",
    features: ["Nouveauté", "Lambrequin Optionnel", "Éclairage Bras"],
    image: "/images/stores/KALY_O.png",
    compatible_toile_types: ['ORCH', 'ORCH_MAX', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: true, max_width: 6000, max_projection: 3500 },
    armLogic: 'standard_2',
    minWidths: { 1500: 2160, 2000: 2660, 2500: 3160, 2750: 3410, 3000: 3720, 3250: 3970, 3500: 4220 },
    buyPrices: {
      1500: [{ maxW: 2400, priceHT: 1589 }, { maxW: 3580, priceHT: 1922 }, { maxW: 4760, priceHT: 2128 }, { maxW: 5610, priceHT: 2328 }, { maxW: 6000, priceHT: 2441 }],
      2000: [{ maxW: 3580, priceHT: 1964 }, { maxW: 4760, priceHT: 2181 }, { maxW: 5610, priceHT: 2391 }, { maxW: 6000, priceHT: 2517 }],
      2500: [{ maxW: 3580, priceHT: 2015 }, { maxW: 4760, priceHT: 2244 }, { maxW: 5610, priceHT: 2458 }, { maxW: 6000, priceHT: 2630 }],
      2750: [{ maxW: 3580, priceHT: 2047 }, { maxW: 4760, priceHT: 2291 }, { maxW: 5610, priceHT: 2540 }, { maxW: 6000, priceHT: 2680 }],
      3000: [{ maxW: 4760, priceHT: 2335 }, { maxW: 5610, priceHT: 2577 }, { maxW: 6000, priceHT: 2743 }],
      3250: [{ maxW: 4760, priceHT: 2381 }, { maxW: 5610, priceHT: 2626 }, { maxW: 6000, priceHT: 2826 }],
      3500: [{ maxW: 4760, priceHT: 2423 }, { maxW: 5610, priceHT: 2705 }, { maxW: 6000, priceHT: 2914 }]
    },
    ceilingMountPrices: [
      { maxW: 3580, price: 135 },
      { maxW: 6000, price: 231 }
    ],
    lambrequinEnroulablePrices: {
      manual: [
        { maxW: 2400, price: 357 },
        { maxW: 3580, price: 457 },
        { maxW: 4760, price: 531 },
        { maxW: 5610, price: 614 },
        { maxW: 6000, price: 633 }
      ],
      motorized: [
        { maxW: 2400, price: 518 },
        { maxW: 3580, price: 641 },
        { maxW: 4760, price: 722 },
        { maxW: 5610, price: 802 },
        { maxW: 6000, price: 838 }
      ]
    }
  },

  // --- 8. DYNASTA (Page 40) ---
  "dynasta": {
    id: "dynasta",
    name: "DYNASTA (Grande Largeur)",
    type: "coffre",
    shape: "galbe",
    is_promo: false,
    description: "Le géant des terrasses, jusqu'à 12m de large.",
    features: ["Jusqu'à 12m", "Bras Renforcés", "Idéal CHR"],
    image: "/images/stores/DYNASTA.png",
    compatible_toile_types: ['ORCH', 'ORCH_MAX', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 12000, max_projection: 4000 },
    armLogic: 'couples_4_6',
    minWidths: { 1500: 2050, 2000: 2550, 2500: 3130, 2750: 3380, 3000: 3630, 3250: 3880, 3500: 4130, 4000: 4630 },
    buyPrices: {
      1500: [{ maxW: 4760, priceHT: 1850 }, { maxW: 5610, priceHT: 2041 }, { maxW: 6000, priceHT: 2175 }, { maxW: 7110, priceHT: 2744 }, { maxW: 8280, priceHT: 3204 }, { maxW: 9450, priceHT: 3284 }, { maxW: 10620, priceHT: 3577 }, { maxW: 11220, priceHT: 3747 }, { maxW: 12000, priceHT: 3961 }],
      2000: [{ maxW: 4760, priceHT: 1910 }, { maxW: 5610, priceHT: 2114 }, { maxW: 6000, priceHT: 2265 }, { maxW: 7110, priceHT: 3183 }, { maxW: 8280, priceHT: 3714 }, { maxW: 9450, priceHT: 3817 }, { maxW: 10620, priceHT: 4163 }, { maxW: 11220, priceHT: 4365 }, { maxW: 12000, priceHT: 4621 }],
      2500: [{ maxW: 4760, priceHT: 1989 }, { maxW: 5610, priceHT: 2207 }, { maxW: 6000, priceHT: 2366 }, { maxW: 7110, priceHT: 2975 }, { maxW: 8280, priceHT: 3460 }, { maxW: 9450, priceHT: 3569 }, { maxW: 10620, priceHT: 4353 }, { maxW: 11220, priceHT: 4572 }, { maxW: 12000, priceHT: 4847 }],
      2750: [{ maxW: 4760, priceHT: 2012 }, { maxW: 5610, priceHT: 2234 }, { maxW: 6000, priceHT: 2405 }, { maxW: 7110, priceHT: 3373 }, { maxW: 8280, priceHT: 3924 }, { maxW: 9450, priceHT: 4050 }, { maxW: 10620, priceHT: 4418 }, { maxW: 11220, priceHT: 4643 }, { maxW: 12000, priceHT: 4924 }],
      3000: [{ maxW: 4760, priceHT: 2137 }, { maxW: 5610, priceHT: 2365 }, { maxW: 6000, priceHT: 2550 }, { maxW: 7110, priceHT: 3309 }, { maxW: 8280, priceHT: 3729 }, { maxW: 9450, priceHT: 3845 }, { maxW: 10620, priceHT: 4699 }, { maxW: 11220, priceHT: 4922 }, { maxW: 12000, priceHT: 5212 }],
      3250: [{ maxW: 4760, priceHT: 2177 }, { maxW: 5610, priceHT: 2411 }, { maxW: 6000, priceHT: 2602 }, { maxW: 7110, priceHT: 3336 }, { maxW: 8280, priceHT: 3769 }, { maxW: 9450, priceHT: 3917 }, { maxW: 10620, priceHT: 4787 }, { maxW: 11220, priceHT: 5015 }, { maxW: 12000, priceHT: 5318 }],
      3500: [{ maxW: 4760, priceHT: 2217 }, { maxW: 5610, priceHT: 2456 }, { maxW: 6000, priceHT: 2653 }, { maxW: 7110, priceHT: 3362 }, { maxW: 8280, priceHT: 3809 }, { maxW: 9450, priceHT: 3990 }, { maxW: 10620, priceHT: 4875 }, { maxW: 11220, priceHT: 5109 }, { maxW: 12000, priceHT: 5422 }],
      4000: [{ maxW: 4760, priceHT: 2315 }, { maxW: 5610, priceHT: 2568 }, { maxW: 6000, priceHT: 2777 }, { maxW: 7110, priceHT: 3451 }, { maxW: 8280, priceHT: 3896 }, { maxW: 9450, priceHT: 4169 }, { maxW: 10620, priceHT: 5090 }, { maxW: 11220, priceHT: 5343 }, { maxW: 12000, priceHT: 5668 }]
    },
    ceilingMountPrices: [
      { maxW: 5610, price: 526 },
      { maxW: 6000, price: 554 },
      { maxW: 7110, price: 764 },
      { maxW: 8280, price: 1020 },
      { maxW: 10620, price: 1036 },
      { maxW: 11220, price: 1184 },
      { maxW: 12000, price: 1250 }
    ],
    salesCoefficient: 1.0  // Coefficient de test pour vérification
  },

  // --- 9. DYNASTA PROMO (Page 40) ---
  "dynasta_promo": {
    id: "dynasta_promo",
    name: "DYNASTA PROMO (Max 6m)",
    type: "coffre",
    shape: "galbe",
    is_promo: true,
    description: "La robustesse du Dynasta à prix promo (limité à 6m). Moteur Sunea iO.",
    features: ["PRIX PROMO", "Largeur Max 6m", "Option LED Bras"],
    image: "/images/stores/DYNASTA.png",
    compatible_toile_types: ['ORCH'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 6000, max_projection: 4000, allowed_colors: ['9016', '1015', '7016'] },
    armLogic: 'force_2_3_4',
    minWidths: { 1500: 2050, 2000: 2550, 2500: 3130, 2750: 3380, 3000: 3630, 3500: 4130, 4000: 4630 },
    buyPrices: {
      1500: [{ maxW: 4760, priceHT: 1650 }, { maxW: 5610, priceHT: 1741 }, { maxW: 6000, priceHT: 1775 }],
      2000: [{ maxW: 4760, priceHT: 1710 }, { maxW: 5610, priceHT: 1814 }, { maxW: 6000, priceHT: 1865 }],
      2500: [{ maxW: 4760, priceHT: 1789 }, { maxW: 5610, priceHT: 1907 }, { maxW: 6000, priceHT: 1966 }],
      2750: [{ maxW: 4760, priceHT: 1812 }, { maxW: 5610, priceHT: 1934 }, { maxW: 6000, priceHT: 2005 }],
      3000: [{ maxW: 4760, priceHT: 1855 }, { maxW: 5610, priceHT: 1983 }, { maxW: 6000, priceHT: 2068 }],
      3500: [{ maxW: 4760, priceHT: 2017 }, { maxW: 5610, priceHT: 2156 }, { maxW: 6000, priceHT: 2253 }],
      4000: [{ maxW: 4760, priceHT: 2115 }, { maxW: 5610, priceHT: 2268 }, { maxW: 6000, priceHT: 2377 }]
    },
    ceilingMountPrices: [
      { maxW: 5610, price: 526 },
      { maxW: 6000, price: 554 },
      { maxW: 7110, price: 764 },
      { maxW: 8280, price: 1020 },
      { maxW: 10620, price: 1036 },
      { maxW: 11220, price: 1184 },
      { maxW: 12000, price: 1250 }
    ],
    salesCoefficient: 1.0  // Coefficient de test pour vérification
  },

  // --- 10. BELHARRA (Page 40) ---
  "belharra": {
    id: "belharra",
    name: "BELHARRA (Grande Largeur)",
    type: "coffre",
    shape: "galbe",
    is_promo: false,
    description: "Le haut de gamme absolu jusqu'à 12m. Design fluide.",
    features: ["Jusqu'à 12m", "Finition Luxe", "Lambrequin Enroulable"],
    image: "/images/stores/BELHARRA.png",
    compatible_toile_types: ['ORCH', 'ORCH_MAX', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: true, max_width: 12000, max_projection: 4000 },
    armLogic: 'couples_4_6',
    minWidths: { 1500: 2050, 2000: 2550, 2500: 3130, 2750: 3380, 3000: 3630, 3250: 3880, 3500: 4130, 4000: 4630 },
    buyPrices: {
      1500: [{ maxW: 4760, priceHT: 2068 }, { maxW: 5610, priceHT: 2285 }, { maxW: 6000, priceHT: 2437 }, { maxW: 7110, priceHT: 3073 }, { maxW: 8280, priceHT: 3588 }, { maxW: 9450, priceHT: 3678 }, { maxW: 10620, priceHT: 4008 }, { maxW: 11220, priceHT: 4197 }, { maxW: 12000, priceHT: 4433 }],
      2000: [{ maxW: 4760, priceHT: 2137 }, { maxW: 5610, priceHT: 2367 }, { maxW: 6000, priceHT: 2533 }, { maxW: 7110, priceHT: 3241 }, { maxW: 8280, priceHT: 3717 }, { maxW: 9450, priceHT: 3817 }, { maxW: 10620, priceHT: 4163 }, { maxW: 11220, priceHT: 4365 }, { maxW: 12000, priceHT: 4621 }],
      2500: [{ maxW: 4760, priceHT: 2228 }, { maxW: 5610, priceHT: 2471 }, { maxW: 6000, priceHT: 2651 }, { maxW: 7110, priceHT: 3331 }, { maxW: 8280, priceHT: 3877 }, { maxW: 9450, priceHT: 3994 }, { maxW: 10620, priceHT: 4353 }, { maxW: 11220, priceHT: 4572 }, { maxW: 12000, priceHT: 4847 }],
      2750: [{ maxW: 4760, priceHT: 2255 }, { maxW: 5610, priceHT: 2503 }, { maxW: 6000, priceHT: 2692 }, { maxW: 7110, priceHT: 3412 }, { maxW: 8280, priceHT: 3924 }, { maxW: 9450, priceHT: 4050 }, { maxW: 10620, priceHT: 4418 }, { maxW: 11220, priceHT: 4643 }, { maxW: 12000, priceHT: 4924 }],
      3000: [{ maxW: 4760, priceHT: 2395 }, { maxW: 5610, priceHT: 2721 }, { maxW: 6000, priceHT: 2932 }, { maxW: 7110, priceHT: 3712 }, { maxW: 8280, priceHT: 4179 }, { maxW: 9450, priceHT: 4310 }, { maxW: 10620, priceHT: 4699 }, { maxW: 11220, priceHT: 4922 }, { maxW: 12000, priceHT: 5212 }],
      3250: [{ maxW: 4760, priceHT: 2439 }, { maxW: 5610, priceHT: 2774 }, { maxW: 6000, priceHT: 2992 }, { maxW: 7110, priceHT: 3740 }, { maxW: 8280, priceHT: 4220 }, { maxW: 9450, priceHT: 4389 }, { maxW: 10620, priceHT: 4787 }, { maxW: 11220, priceHT: 5015 }, { maxW: 12000, priceHT: 5318 }],
      3500: [{ maxW: 4760, priceHT: 2482 }, { maxW: 5610, priceHT: 2826 }, { maxW: 6000, priceHT: 3052 }, { maxW: 7110, priceHT: 3769 }, { maxW: 8280, priceHT: 4259 }, { maxW: 9450, priceHT: 4467 }, { maxW: 10620, priceHT: 4875 }, { maxW: 11220, priceHT: 5109 }, { maxW: 12000, priceHT: 5422 }],
      4000: [{ maxW: 4760, priceHT: 2596 }, { maxW: 5610, priceHT: 2951 }, { maxW: 6000, priceHT: 3192 }, { maxW: 7110, priceHT: 3866 }, { maxW: 8280, priceHT: 4330 }, { maxW: 9450, priceHT: 4670 }, { maxW: 10620, priceHT: 5090 }, { maxW: 11220, priceHT: 5343 }, { maxW: 12000, priceHT: 5668 }]
    },
    ceilingMountPrices: [
      { maxW: 5610, price: 526 },
      { maxW: 6000, price: 554 },
      { maxW: 7110, price: 764 },
      { maxW: 8280, price: 1020 },
      { maxW: 10620, price: 1036 },
      { maxW: 11220, price: 1184 },
      { maxW: 12000, price: 1250 }
    ],
    lambrequinEnroulablePrices: {
      manual: [
        { maxW: 2390, price: 358 },
        { maxW: 3580, price: 416 },
        { maxW: 4760, price: 451 },
        { maxW: 5610, price: 614 },
        { maxW: 6000, price: 633 }
      ],
      motorized: [
        { maxW: 2390, price: 598 },
        { maxW: 3580, price: 656 },
        { maxW: 4760, price: 683 },
        { maxW: 5610, price: 802 },
        { maxW: 6000, price: 838 }
      ]
    }
  },

  // --- 11. BELHARRA PROMO (Page 40) ---
  "belharra_promo": {
    id: "belharra_promo",
    name: "BELHARRA PROMO (Max 6m)",
    type: "coffre",
    shape: "galbe",
    is_promo: true,
    description: "Le design Belharra à prix promo (limité à 6m). Moteur Sunea iO.",
    features: ["PRIX PROMO", "Design Premium", "Option LED Bras"],
    image: "/images/stores/BELHARRA.png",
    compatible_toile_types: ['ORCH'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: true, max_width: 6000, max_projection: 4000, allowed_colors: ['9016', '1015', '7016'] },
    armLogic: 'force_2_3_4',
    minWidths: { 1500: 2050, 2000: 2550, 2500: 3130, 2750: 3380, 3000: 3630, 3500: 4130, 4000: 4630 },
    buyPrices: {
      1500: [{ maxW: 4760, priceHT: 1868 }, { maxW: 5610, priceHT: 1985 }, { maxW: 6000, priceHT: 2037 }],
      2000: [{ maxW: 4760, priceHT: 1937 }, { maxW: 5610, priceHT: 2067 }, { maxW: 6000, priceHT: 2133 }],
      2500: [{ maxW: 4760, priceHT: 2028 }, { maxW: 5610, priceHT: 2171 }, { maxW: 6000, priceHT: 2251 }],
      2750: [{ maxW: 4760, priceHT: 2055 }, { maxW: 5610, priceHT: 2203 }, { maxW: 6000, priceHT: 2292 }],
      3000: [{ maxW: 4760, priceHT: 2101 }, { maxW: 5610, priceHT: 2258 }, { maxW: 6000, priceHT: 2362 }],
      3500: [{ maxW: 4760, priceHT: 2282 }, { maxW: 5610, priceHT: 2526 }, { maxW: 6000, priceHT: 2652 }],
      4000: [{ maxW: 4760, priceHT: 2396 }, { maxW: 5610, priceHT: 2651 }, { maxW: 6000, priceHT: 2792 }]
    },
    ceilingMountPrices: [
      { maxW: 5610, price: 526 },
      { maxW: 6000, price: 554 },
      { maxW: 7110, price: 764 },
      { maxW: 8280, price: 1020 },
      { maxW: 10620, price: 1036 },
      { maxW: 11220, price: 1184 },
      { maxW: 12000, price: 1250 }
    ],
    lambrequinEnroulablePrices: {
      manual: [
        { maxW: 2390, price: 358 },
        { maxW: 3580, price: 416 },
        { maxW: 4760, price: 451 },
        { maxW: 5610, price: 614 },
        { maxW: 6000, price: 633 }
      ],
      motorized: [
        { maxW: 2390, price: 598 },
        { maxW: 3580, price: 656 },
        { maxW: 4760, price: 683 },
        { maxW: 5610, price: 802 },
        { maxW: 6000, price: 838 }
      ]
    }
  },

  // --- 12. BELHARRA 2 (Page 42) ---
  "belharra_2": {
    id: "belharra_2",
    name: "BELHARRA 2 (Full LED)",
    type: "coffre",
    shape: "galbe",
    is_promo: false,
    description: "Le Belharra ultime avec éclairage LED dans les bras ET le coffre.",
    features: ["LED Coffre + Bras", "Design Luxe", "Lambrequin Enroulable"],
    image: "/images/stores/BELHARRA_2.png",
    compatible_toile_types: ['ORCH', 'ORCH_MAX', 'SATT'],
    compatibility: { led_arms: true, led_box: true, lambrequin_fixe: true, lambrequin_enroulable: true, max_width: 12000, max_projection: 4000 },
    armLogic: 'couples_4_6',
    minWidths: { 1500: 2050, 2000: 2550, 2500: 3130, 2750: 3380, 3000: 3630, 3250: 3880, 3500: 4130, 4000: 4630 },
    buyPrices: {
      1500: [{ maxW: 2400, priceHT: 1666 }, { maxW: 3580, priceHT: 1932 }, { maxW: 4760, priceHT: 2269 }, { maxW: 5610, priceHT: 2507 }, { maxW: 6000, priceHT: 2673 }, { maxW: 7110, priceHT: 3371 }, { maxW: 8280, priceHT: 3936 }, { maxW: 9450, priceHT: 4035 }, { maxW: 10620, priceHT: 4397 }, { maxW: 11220, priceHT: 4863 }, { maxW: 12000, priceHT: 5129 }],
      2000: [{ maxW: 3580, priceHT: 1992 }, { maxW: 4760, priceHT: 2344 }, { maxW: 5610, priceHT: 2597 }, { maxW: 6000, priceHT: 2779 }, { maxW: 7110, priceHT: 3492 }, { maxW: 8280, priceHT: 4075 }, { maxW: 9450, priceHT: 4188 }, { maxW: 10620, priceHT: 4567 }, { maxW: 11220, priceHT: 4605 }, { maxW: 12000, priceHT: 5196 }],
      2500: [{ maxW: 3580, priceHT: 2073 }, { maxW: 4760, priceHT: 2445 }, { maxW: 5610, priceHT: 2711 }, { maxW: 6000, priceHT: 2908 }, { maxW: 7110, priceHT: 3655 }, { maxW: 8280, priceHT: 4254 }, { maxW: 9450, priceHT: 4382 }, { maxW: 10620, priceHT: 4775 }, { maxW: 11220, priceHT: 4789 }, { maxW: 12000, priceHT: 5504 }],
      2750: [{ maxW: 3580, priceHT: 2098 }, { maxW: 4760, priceHT: 2474 }, { maxW: 5610, priceHT: 2746 }, { maxW: 6000, priceHT: 2954 }, { maxW: 7110, priceHT: 3700 }, { maxW: 8280, priceHT: 4407 }, { maxW: 9450, priceHT: 4443 }, { maxW: 10620, priceHT: 4847 }, { maxW: 11220, priceHT: 5069 }, { maxW: 12000, priceHT: 5718 }],
      3000: [{ maxW: 3580, priceHT: 2176 }, { maxW: 4760, priceHT: 2546 }, { maxW: 5610, priceHT: 2813 }, { maxW: 6000, priceHT: 3021 }, { maxW: 7110, priceHT: 3767 }, { maxW: 8280, priceHT: 4367 }, { maxW: 9450, priceHT: 4495 }, { maxW: 10620, priceHT: 4888 }, { maxW: 11220, priceHT: 5094 }, { maxW: 12000, priceHT: 5400 }],
      3250: [{ maxW: 3580, priceHT: 2199 }, { maxW: 4760, priceHT: 2576 }, { maxW: 5610, priceHT: 2848 }, { maxW: 6000, priceHT: 3055 }, { maxW: 7110, priceHT: 3803 }, { maxW: 8280, priceHT: 4407 }, { maxW: 9450, priceHT: 4546 }, { maxW: 10620, priceHT: 4949 }, { maxW: 11220, priceHT: 5217 }, { maxW: 12000, priceHT: 5502 }],
      3500: [{ maxW: 4760, priceHT: 2723 }, { maxW: 5610, priceHT: 3101 }, { maxW: 6000, priceHT: 3348 }, { maxW: 7110, priceHT: 4135 }, { maxW: 8280, priceHT: 4673 }, { maxW: 9450, priceHT: 4901 }, { maxW: 10620, priceHT: 5349 }, { maxW: 11220, priceHT: 5431 }, { maxW: 12000, priceHT: 5948 }],
      4000: [{ maxW: 4760, priceHT: 2848 }, { maxW: 5610, priceHT: 3237 }, { maxW: 6000, priceHT: 3502 }, { maxW: 7110, priceHT: 4241 }, { maxW: 8280, priceHT: 4751 }, { maxW: 9450, priceHT: 5123 }, { maxW: 10620, priceHT: 5584 }, { maxW: 11220, priceHT: 5862 }, { maxW: 12000, priceHT: 6218 }]
    },
    ceilingMountPrices: [
      { maxW: 3580, price: 361 },
      { maxW: 5610, price: 506 },
      { maxW: 6000, price: 533 },
      { maxW: 7110, price: 735 },
      { maxW: 8280, price: 982 },
      { maxW: 10620, price: 997 },
      { maxW: 11220, price: 1140 },
      { maxW: 12000, price: 1203 }
    ],
    lambrequinEnroulablePrices: {
      manual: [
        { maxW: 2400, price: 361 },
        { maxW: 3580, price: 472 },
        { maxW: 5610, price: 650 },
        { maxW: 6000, price: 667 }
      ],
      motorized: [
        { maxW: 2400, price: 476 },
        { maxW: 3580, price: 631 },
        { maxW: 5610, price: 859 },
        { maxW: 6000, price: 878 }
      ]
    }
  },

  // --- 13. MADRID (Monobloc Standard) ---
  "madrid": {
    id: "madrid",
    name: "MADRID (Monobloc)",
    type: "monobloc",
    shape: "carre",
    is_promo: false,
    description: "Store monobloc sans coffre avec tube carré 40×40. Idéal pour hauteur de pose réduite.",
    features: ["Encombrement réduit", "Tube carré 40×40", "Option Auvent"],
    image: "/images/stores/store_monobloc.png",
    compatible_toile_types: ['ORCH', 'ORCH_MAX', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 12000, max_projection: 4000 },
    armLogic: 'couples_4_6',
    minWidths: { 1500: 2050, 2000: 2550, 2500: 3050, 3000: 3550, 3500: 4050, 4000: 4550 },
    buyPrices: {
      1500: [{ maxW: 4000, priceHT: 1450 }, { maxW: 6000, priceHT: 1650 }, { maxW: 8000, priceHT: 2100 }, { maxW: 10000, priceHT: 2650 }, { maxW: 12000, priceHT: 3200 }],
      2000: [{ maxW: 4000, priceHT: 1550 }, { maxW: 6000, priceHT: 1800 }, { maxW: 8000, priceHT: 2300 }, { maxW: 10000, priceHT: 2900 }, { maxW: 12000, priceHT: 3500 }],
      2500: [{ maxW: 4000, priceHT: 1680 }, { maxW: 6000, priceHT: 1950 }, { maxW: 8000, priceHT: 2500 }, { maxW: 10000, priceHT: 3150 }, { maxW: 12000, priceHT: 3800 }],
      3000: [{ maxW: 4000, priceHT: 1820 }, { maxW: 6000, priceHT: 2150 }, { maxW: 8000, priceHT: 2750 }, { maxW: 10000, priceHT: 3450 }, { maxW: 12000, priceHT: 4150 }],
      3500: [{ maxW: 4000, priceHT: 1980 }, { maxW: 6000, priceHT: 2350 }, { maxW: 8000, priceHT: 3000 }, { maxW: 10000, priceHT: 3750 }, { maxW: 12000, priceHT: 4500 }],
      4000: [{ maxW: 4000, priceHT: 2150 }, { maxW: 6000, priceHT: 2550 }, { maxW: 8000, priceHT: 3250 }, { maxW: 10000, priceHT: 4050 }, { maxW: 12000, priceHT: 4850 }]
    },
    ceilingMountPrices: [
      { maxW: 6000, price: 150 },
      { maxW: 12000, price: 300 }
    ]
  },

  // --- 14. BERLIN (Monobloc Poids Lourd) ---
  "berlin": {
    id: "berlin",
    name: "BERLIN (Monobloc Poids Lourd)",
    type: "monobloc",
    shape: "carre",
    is_promo: false,
    description: "Store monobloc renforcé avec bras XXL jusqu'à 4.5m d'avancée. Certifié Classe 3 vent.",
    features: ["Bras XXL 4.5m", "Classe 3 Vent", "Supports renforcés", "Option Auvent"],
    image: "/images/stores/store_traditionnel.png",
    compatible_toile_types: ['ORCH'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 12000, max_projection: 4500 },
    armLogic: 'couples_4_6',
    minWidths: { 1500: 2050, 2000: 2550, 2500: 3050, 3000: 3550, 3500: 4050, 4000: 4550, 4500: 5050 },
    buyPrices: {
      1500: [{ maxW: 4000, priceHT: 1650 }, { maxW: 6000, priceHT: 1950 }, { maxW: 8000, priceHT: 2500 }, { maxW: 10000, priceHT: 3150 }, { maxW: 12000, priceHT: 3800 }],
      2000: [{ maxW: 4000, priceHT: 1780 }, { maxW: 6000, priceHT: 2150 }, { maxW: 8000, priceHT: 2750 }, { maxW: 10000, priceHT: 3450 }, { maxW: 12000, priceHT: 4150 }],
      2500: [{ maxW: 4000, priceHT: 1950 }, { maxW: 6000, priceHT: 2350 }, { maxW: 8000, priceHT: 3000 }, { maxW: 10000, priceHT: 3750 }, { maxW: 12000, priceHT: 4500 }],
      3000: [{ maxW: 4000, priceHT: 2150 }, { maxW: 6000, priceHT: 2600 }, { maxW: 8000, priceHT: 3300 }, { maxW: 10000, priceHT: 4100 }, { maxW: 12000, priceHT: 4900 }],
      3500: [{ maxW: 4000, priceHT: 2350 }, { maxW: 6000, priceHT: 2850 }, { maxW: 8000, priceHT: 3600 }, { maxW: 10000, priceHT: 4500 }, { maxW: 12000, priceHT: 5400 }],
      4000: [{ maxW: 4000, priceHT: 2580 }, { maxW: 6000, priceHT: 3100 }, { maxW: 8000, priceHT: 3950 }, { maxW: 10000, priceHT: 4900 }, { maxW: 12000, priceHT: 5850 }],
      4500: [{ maxW: 4000, priceHT: 2850 }, { maxW: 6000, priceHT: 3400 }, { maxW: 8000, priceHT: 4350 }, { maxW: 10000, priceHT: 5400 }, { maxW: 12000, priceHT: 6450 }]
    },
    ceilingMountPrices: [
      { maxW: 6000, price: 200 },
      { maxW: 12000, price: 400 }
    ]
  },

  // --- 15. GÈNES (Traditionnel Standard) ---
  "genes": {
    id: "genes",
    name: "GÈNES (Traditionnel)",
    type: "traditionnel",
    shape: "galbe",
    is_promo: false,
    description: "Le store traditionnel par excellence, idéal pour les balcons et budgets serrés.",
    features: ["Prix économique", "Installation simple", "Option Auvent"],
    image: "/images/stores/store_traditionnel.png",
    compatible_toile_types: ['ORCH'],
    compatibility: { led_arms: false, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 6000, max_projection: 3000 },
    armLogic: 'standard_2',
    minWidths: { 1500: 1800, 2000: 2300, 2500: 2800, 3000: 3300 },
    buyPrices: {
      1500: [{ maxW: 3000, priceHT: 850 }, { maxW: 4000, priceHT: 950 }, { maxW: 5000, priceHT: 1100 }, { maxW: 6000, priceHT: 1250 }],
      2000: [{ maxW: 3000, priceHT: 920 }, { maxW: 4000, priceHT: 1050 }, { maxW: 5000, priceHT: 1220 }, { maxW: 6000, priceHT: 1400 }],
      2500: [{ maxW: 3000, priceHT: 1020 }, { maxW: 4000, priceHT: 1180 }, { maxW: 5000, priceHT: 1380 }, { maxW: 6000, priceHT: 1580 }],
      3000: [{ maxW: 3000, priceHT: 1150 }, { maxW: 4000, priceHT: 1350 }, { maxW: 5000, priceHT: 1580 }, { maxW: 6000, priceHT: 1800 }]
    },
    ceilingMountPrices: [
      { maxW: 6000, price: 100 }
    ]
  },

  // --- 16. MONTRÉAL (Traditionnel Largeur) ---
  "montreal": {
    id: "montreal",
    name: "MONTRÉAL (Traditionnel Grande Largeur)",
    type: "traditionnel",
    shape: "galbe",
    is_promo: false,
    description: "Version renforcée du store traditionnel pour couvrir de grandes largeurs à prix maîtrisé.",
    features: ["Jusqu'à 12m", "Supports renforcés", "Prix maîtrisé", "Option Auvent"],
    image: "/images/stores/store_traditionnel.png",
    compatible_toile_types: ['ORCH'],
    compatibility: { led_arms: false, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 12000, max_projection: 3500 },
    armLogic: 'couples_4_6',
    minWidths: { 1500: 1800, 2000: 2300, 2500: 2800, 3000: 3300, 3500: 3800 },
    buyPrices: {
      1500: [{ maxW: 4000, priceHT: 1200 }, { maxW: 6000, priceHT: 1450 }, { maxW: 8000, priceHT: 1850 }, { maxW: 10000, priceHT: 2350 }, { maxW: 12000, priceHT: 2850 }],
      2000: [{ maxW: 4000, priceHT: 1320 }, { maxW: 6000, priceHT: 1600 }, { maxW: 8000, priceHT: 2050 }, { maxW: 10000, priceHT: 2600 }, { maxW: 12000, priceHT: 3150 }],
      2500: [{ maxW: 4000, priceHT: 1480 }, { maxW: 6000, priceHT: 1800 }, { maxW: 8000, priceHT: 2300 }, { maxW: 10000, priceHT: 2900 }, { maxW: 12000, priceHT: 3500 }],
      3000: [{ maxW: 4000, priceHT: 1680 }, { maxW: 6000, priceHT: 2050 }, { maxW: 8000, priceHT: 2600 }, { maxW: 10000, priceHT: 3250 }, { maxW: 12000, priceHT: 3900 }],
      3500: [{ maxW: 4000, priceHT: 1920 }, { maxW: 6000, priceHT: 2350 }, { maxW: 8000, priceHT: 2950 }, { maxW: 10000, priceHT: 3700 }, { maxW: 12000, priceHT: 4450 }]
    },
    ceilingMountPrices: [
      { maxW: 6000, price: 150 },
      { maxW: 12000, price: 300 }
    ]
  },

  // --- 17. BRAS CROISÉS (Spécialité pour balcons étroits) ---
  "bras_croises": {
    id: "bras_croises",
    name: "BRAS CROISÉS (Balcons Étroits)",
    type: "specialite",
    shape: "carre",
    is_promo: false,
    description: "La solution exclusive pour les terrasses et balcons étroits où l'avancée est supérieure à la largeur. Bras superposés avec mécanique spéciale.",
    features: ["Configuration Unique", "Bras Superposés", "Avancée > Largeur", "Option Auvent"],
    image: "/images/stores/store_monobloc.png",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: false, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 4000, max_projection: 3500 },
    armLogic: 'standard_2',
    minWidths: { 1500: 1100, 2000: 1600, 2500: 2100, 3000: 2600, 3500: 3100 },
    buyPrices: {
      1500: [{ maxW: 1500, priceHT: 950 + 120 }, { maxW: 2500, priceHT: 1150 + 120 }, { maxW: 3500, priceHT: 1400 + 120 }, { maxW: 4000, priceHT: 1500 + 120 }],
      2000: [{ maxW: 1500, priceHT: 1050 + 120 }, { maxW: 2500, priceHT: 1300 + 120 }, { maxW: 3500, priceHT: 1600 + 120 }, { maxW: 4000, priceHT: 1700 + 120 }],
      2500: [{ maxW: 1500, priceHT: 1180 + 120 }, { maxW: 2500, priceHT: 1450 + 120 }, { maxW: 3500, priceHT: 1780 + 120 }, { maxW: 4000, priceHT: 1900 + 120 }],
      3000: [{ maxW: 1500, priceHT: 1350 + 120 }, { maxW: 2500, priceHT: 1650 + 120 }, { maxW: 3500, priceHT: 2000 + 120 }, { maxW: 4000, priceHT: 2150 + 120 }],
      3500: [{ maxW: 1500, priceHT: 1550 + 120 }, { maxW: 2500, priceHT: 1900 + 120 }, { maxW: 3500, priceHT: 2300 + 120 }, { maxW: 4000, priceHT: 2450 + 120 }]
    },
    ceilingMountPrices: [
      { maxW: 4000, price: 150 }
    ]
  }
};

// ==========================================
// 6. FONCTIONS UTILITAIRES
// ==========================================

/**
 * Valide et calcule le nombre de bras pour les GRANDES LARGEURS (> 6m)
 * Applique les règles physiques de fabrication (trous impossibles + nombre de bras)
 * 
 * @param modelId ID du modèle (pour identifier les modèles grands)
 * @param width Largeur en mm
 * @param projection Avancée en mm
 * @returns Nombre de bras
 * @throws Error si la dimension est impossible à fabriquer
 */
export function calculateArmsForLargeWidth(modelId: string, width: number, projection: number): number {
  // Les PROMO et modèles standard_2/force_2_3_4 ne sont PAS concernés
  const isLargeFormat = ['dynasta', 'belharra', 'belharra_2'].includes(modelId);
  
  // Si largeur <= 6000mm : toujours 2 bras
  if (width <= 6000) {
    return 2;
  }

  // ========== RÈGLE DES "TROUS" (zones impossibles à fabriquer) ==========
  
  // Si Avancée = 3500mm : Impossible si Largeur 6001-6144mm
  if (projection === 3500 && width >= 6001 && width <= 6144) {
    throw new Error(
      `Impossible de fabriquer ce store : largeur ${width}mm combinée à avancée ${projection}mm crée un conflit mécanique des bras repliés.`
    );
  }

  // Si Avancée = 4000mm : Impossible si Largeur 6001-6894mm
  if (projection === 4000 && width >= 6001 && width <= 6894) {
    throw new Error(
      `Impossible de fabriquer ce store : largeur ${width}mm combinée à avancée ${projection}mm est incompatible avec la rétraction du mécanisme.`
    );
  }

  // ========== CALCUL DU NOMBRE DE BRAS (largeur > 6000mm) ==========
  
  if (!isLargeFormat) {
    // Les autres modèles (PROMO, standard) restent en 2 bras
    return 2;
  }

  // Pour dynasta, belharra, belharra_2 : logique complexe selon avancée
  
  if (projection <= 3000) {
    // Avancée <= 3000: Pas de trou, zones continues
    if (width >= 6001 && width <= 7736) return 3;
    if (width >= 7737 && width <= 12000) return 4;
  } else if (projection === 3250) {
    // Avancée 3250
    if (width >= 6001 && width <= 8174) return 3;
    if (width >= 8175 && width <= 12000) return 4;
  } else if (projection === 3500) {
    // Avancée 3500 (trou 6001-6144 déjà rejeté ci-dessus)
    if (width >= 6145 && width <= 8612) return 3;
    if (width >= 8613 && width <= 12000) return 4;
  } else if (projection === 4000) {
    // Avancée 4000 (trou 6001-6894 déjà rejeté ci-dessus)
    if (width >= 6895 && width <= 9532) return 3;
    if (width >= 9533 && width <= 12000) return 4;
  }

  // Largeur > 12000 ou projection non reconnue : par défaut 2 bras
  return 2;
}

/**
 * Fonction legacy pour compatibilité (modèles simples sans projection)
 */
export function getArmCount(modelLogic: string, width: number): number {
  switch (modelLogic) {
    case 'standard_2': 
      return 2; 
    case 'force_2_3_4': 
      if (width > 5950) return 3; 
      return 2;
    case 'couples_4_6':
      // Code legacy - ne pas utiliser pour les vrais couples_4_6
      // Utiliser plutôt calculateArmsForLargeWidth
      if (width > 11000) return 6; 
      if (width > 6000) return 4;
      return 2;
    default:
      return 2;
  }
}


export function getDimensionInfo(model: StoreModel) {
  const projections = Object.keys(model.buyPrices).map(Number).sort((a, b) => a - b);
  
  return {
    globalMinWidth: model.minWidths[projections[0]] || 0,
    maxWidth: model.compatibility.max_width || 0,
    minProjection: projections[0],
    maxProjection: projections[projections.length - 1],
    availableProjections: projections,
    minWidthsMap: model.minWidths
  };
}

/**
 * Convertit la réponse du LambrequinSelector vers le format attendu par calculateFinalPrice
 * @param lambrequinConfig Réponse du composant LambrequinSelector
 * @returns Objet avec lambrequinFixe, lambrequinEnroulable, lambrequinMotorized, lambrequinHeight
 */
export function convertLambrequinConfig(lambrequinConfig: any): {
  lambrequinFixe: boolean;
  lambrequinEnroulable: boolean;
  lambrequinMotorized: boolean;
  lambrequinHeight?: number; // Hauteur du lambrequin fixe (150-300mm, défaut 220mm)
} {
  if (!lambrequinConfig || lambrequinConfig.type === 'none') {
    return {
      lambrequinFixe: false,
      lambrequinEnroulable: false,
      lambrequinMotorized: false
    };
  }

  if (lambrequinConfig.type === 'fixe') {
    return {
      lambrequinFixe: true,
      lambrequinEnroulable: false,
      lambrequinMotorized: false,
      lambrequinHeight: lambrequinConfig.height ?? 220 // Par défaut 220mm
    };
  }

  if (lambrequinConfig.type === 'enroulable') {
    return {
      lambrequinFixe: false,
      lambrequinEnroulable: true,
      lambrequinMotorized: lambrequinConfig.motorized ?? false
    };
  }

  return {
    lambrequinFixe: false,
    lambrequinEnroulable: false,
    lambrequinMotorized: false
  };
}

export function calculateFinalPrice(config: {
  modelId: string,
  width: number,
  projection: number,
  options: {
    ledArms?: boolean,
    ledBox?: boolean,
    lambrequinFixe?: boolean,         // Nouveau paramètre
    lambrequinEnroulable?: boolean,   // Renommé pour clarté
    lambrequinMotorized?: boolean,
    isPosePro?: boolean,
    isCustomColor?: boolean,
    isPosePlafond?: boolean
  }
}) {
  const model = STORE_MODELS[config.modelId];
  if (!model) return null;

  // 1. Vérification Largeur Mini
  const minWidthRequired = model.minWidths[config.projection];
  if (minWidthRequired && config.width < minWidthRequired) {
    return null; 
  }

  // 1bis. Vérification des "trous" impossibles de fabrication (grandes largeurs)
  // Applique les règles physiques WITHOUT erreur lancée (juste retour null)
  const isLargeFormat = ['dynasta', 'belharra', 'belharra_2'].includes(config.modelId);
  if (isLargeFormat && config.width > 6000) {
    // Trou 1 : Avancée 3500 / Largeur 6001-6144
    if (config.projection === 3500 && config.width >= 6001 && config.width <= 6144) {
      return null;
    }
    // Trou 2 : Avancée 4000 / Largeur 6001-6894
    if (config.projection === 4000 && config.width >= 6001 && config.width <= 6894) {
      return null;
    }
  }

  // 2. Prix de Base - Gestion des dimensions sur-mesure
  // Si la projection exacte n'existe pas dans les paliers, on utilise le palier immédiatement supérieur
  let usedProjection = config.projection;
  let grid = model.buyPrices[config.projection];
  
  if (!grid) {
    // La projection demandée n'existe pas, on cherche le palier supérieur
    const availableProjections = Object.keys(model.buyPrices).map(Number).sort((a, b) => a - b);
    const nextProjection = availableProjections.find(p => p > config.projection);
    
    if (!nextProjection) {
      // Aucun palier supérieur trouvé, projection trop grande
      return null;
    }
    
    usedProjection = nextProjection;
    grid = model.buyPrices[nextProjection];
  }
  
  if (!grid) return null;
  const tier = grid.find(t => config.width <= t.maxW);
  if (!tier) return null;

  let totalAchatHT = tier.priceHT;

  // 3. Calcul Options
  if (config.options.ledArms && model.compatibility.led_arms) {
    // Utiliser la nouvelle logique pour les grandes largeurs
    let nbBras = 2;
    try {
      nbBras = calculateArmsForLargeWidth(config.modelId, config.width, config.projection);
    } catch (error) {
      // Dimension impossible à fabriquer
      return null;
    }
    
    // Utiliser usedProjection (palier effectivement utilisé) pour le prix LED
    const ledGrid = OPTIONS_PRICES.LED_ARMS[usedProjection];
    
    if (ledGrid) {
      totalAchatHT += ledGrid[nbBras] || ledGrid[2] || 0;
    }
  }
  
  if (config.options.ledBox && model.compatibility.led_box) {
    totalAchatHT += OPTIONS_PRICES.LED_CASSETTE;
  }
  
  if (config.options.isCustomColor) {
    totalAchatHT += OPTIONS_PRICES.FRAME_SPECIFIC_RAL;
  }

  if (config.options.isPosePlafond) {
    const ceilingGrid = model.ceilingMountPrices;
    if (ceilingGrid && ceilingGrid.length > 0) {
      const tier = ceilingGrid.find(t => config.width <= t.maxW);
      if (tier) totalAchatHT += tier.price;
    }
  }
  
  // Option Lambrequin Fixe (Forfait 59€)
  if (config.options.lambrequinFixe && model.compatibility.lambrequin_fixe) {
    totalAchatHT += OPTIONS_PRICES.LAMBREQUIN_FIXE;
  }

  // Option Lambrequin Déroulant
  if (config.options.lambrequinEnroulable && model.compatibility.lambrequin_enroulable) {
    if (config.modelId === 'kalyo' && config.projection > 3250) {
      // Restriction technique KALY'O
    } else {
      const grid = model.lambrequinEnroulablePrices;
      const tiers = config.options.lambrequinMotorized ? grid?.motorized : grid?.manual;
      if (tiers && tiers.length > 0) {
        const tier = tiers.find(t => config.width <= t.maxW && t.maxW <= 6000);
        if (tier) totalAchatHT += tier.price;
      }
    }
  }

  // 4. Application des coefficients différenciés
  // Séparer le prix de base du store (tier.priceHT) des options déjà ajoutées
  const prixStoreBaseAchatHT = tier.priceHT;
  const prixOptionsAchatHT = totalAchatHT - prixStoreBaseAchatHT;
  
  // Appliquer coefficient spécifique au store (ou COEFF_MARGE par défaut)
  const coeffStore = model.salesCoefficient ?? CATALOG_SETTINGS.COEFF_MARGE;
  let totalVenteHT = prixStoreBaseAchatHT * coeffStore;
  
  // Pour les options, on recalcule avec les coefficients appropriés
  // LED Bras
  if (config.options.ledArms && model.compatibility.led_arms) {
    let nbBras = 2;
    try {
      nbBras = calculateArmsForLargeWidth(config.modelId, config.width, config.projection);
    } catch (error) {
      // Déjà géré ci-dessus
    }
    const ledGrid = OPTIONS_PRICES.LED_ARMS[usedProjection];
    if (ledGrid) {
      const ledPriceAchatHT = ledGrid[nbBras] || ledGrid[2] || 0;
      totalVenteHT += ledPriceAchatHT * CATALOG_SETTINGS.OPTIONS_COEFFICIENTS.LED_ARMS;
    }
  }
  
  // LED Coffre
  if (config.options.ledBox && model.compatibility.led_box) {
    totalVenteHT += OPTIONS_PRICES.LED_CASSETTE * CATALOG_SETTINGS.OPTIONS_COEFFICIENTS.LED_CASSETTE;
  }
  
  // RAL spécifique
  if (config.options.isCustomColor) {
    totalVenteHT += OPTIONS_PRICES.FRAME_SPECIFIC_RAL * CATALOG_SETTINGS.OPTIONS_COEFFICIENTS.FRAME_COLOR_CUSTOM;
  }
  
  // Pose plafond
  if (config.options.isPosePlafond) {
    const ceilingGrid = model.ceilingMountPrices;
    if (ceilingGrid && ceilingGrid.length > 0) {
      const tier = ceilingGrid.find(t => config.width <= t.maxW);
      if (tier) {
        totalVenteHT += tier.price * CATALOG_SETTINGS.OPTIONS_COEFFICIENTS.CEILING_MOUNT;
      }
    }
  }
  
  // Lambrequin Fixe
  if (config.options.lambrequinFixe && model.compatibility.lambrequin_fixe) {
    totalVenteHT += OPTIONS_PRICES.LAMBREQUIN_FIXE * CATALOG_SETTINGS.OPTIONS_COEFFICIENTS.LAMBREQUIN_FIXE;
  }
  
  // Lambrequin Déroulant
  if (config.options.lambrequinEnroulable && model.compatibility.lambrequin_enroulable) {
    if (config.modelId === 'kalyo' && config.projection > 3250) {
      // Restriction technique KALY'O
    } else {
      const grid = model.lambrequinEnroulablePrices;
      const tiers = config.options.lambrequinMotorized ? grid?.motorized : grid?.manual;
      if (tiers && tiers.length > 0) {
        const tier = tiers.find(t => config.width <= t.maxW && t.maxW <= 6000);
        if (tier) {
          totalVenteHT += tier.price * CATALOG_SETTINGS.OPTIONS_COEFFICIENTS.LAMBREQUIN_ENROULABLE;
        }
      }
    }
  }
  
  // 5. Application de la TVA
  const tauxTva = config.options.isPosePro ? CATALOG_SETTINGS.TVA_REDUIT : CATALOG_SETTINGS.TVA_NORMAL;
  let totalVenteTTC = totalVenteHT * tauxTva;
  
  // 6. Frais de transport basés sur la dimension (largeur > 3650mm)
  let transportHT = 0;
  let transportTTC = 0;
  const transportApplicable = config.width > CATALOG_SETTINGS.TRANSPORT.SEUIL_LARGEUR_MM;
  
  if (transportApplicable) {
    transportHT = CATALOG_SETTINGS.TRANSPORT.FRAIS_HT;
    transportTTC = transportHT * tauxTva;
    totalVenteHT += transportHT;
    totalVenteTTC += transportTTC;
  }
  
  return {
    ttc: Math.round(totalVenteTTC),
    ht: Math.round(totalVenteHT),
    transport: {
      applicable: transportApplicable,
      montantHT: Math.round(transportHT),
      montantTTC: Math.round(transportTTC),
      raison: transportApplicable ? `Largeur ${config.width}mm > ${CATALOG_SETTINGS.TRANSPORT.SEUIL_LARGEUR_MM}mm` : null
    }
  };
}