// Fichier : lib/catalog-data.ts

// --- TYPES (Pour TypeScript) ---
export interface ProductModel {
  name: string;
  description: string;
  coefficient: number; // Marge spécifique au produit
  widthSteps: number[];
  prices: Record<number, (number | null)[]>;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  family?: string;
}

export interface StoreModelCompatibility {
  lambrequin_enroulable: boolean;
  led_arms: boolean;
  led_box: boolean;
  max_width: number;
}

export interface StoreModel {
  id: string;
  name: string;
  type: 'coffre' | 'monobloc';
  shape: 'carre' | 'galbe' | 'na';
  is_promo: boolean;
  description: string;
  compatibility: StoreModelCompatibility;
  image: string;
}

// ==========================================
// 1. PARAMÈTRES GLOBAUX
// ==========================================
export const CATALOG_SETTINGS = {
  promoCode: "BIENVENUE2026",
  promoDiscount: 0.05, // -5%
  promoEndDate: "2026-04-06",
  defaultOptionCoefficient: 2.0, // Marge par défaut pour les pièces seules
};

// ==========================================
// 2. PRIX DES OPTIONS (PRIX ACHAT HT MATEST)
// ==========================================
export const OPTIONS_PRICING = {
  motor_somfy_io: 0,    // Inclus
  motor_somfy_csi: 108, // Manivelle secours
  sensor_wind: 90,      // Eolis 3D
  sensor_sun: 150,      // Sunis
  pose_plafond: 307,    // Plus-value support
};

// ==========================================
// 3. ESTHÉTIQUE
// ==========================================
export const STANDARD_COLORS: ColorOption[] = [
  { id: 'ral_9016', name: 'RAL 9016 Blanc', hex: '#ffffff', family: 'neutral' },
  { id: 'ral_1015', name: 'RAL 1015 Ivoire', hex: '#e6d9bd', family: 'neutral' },
  { id: 'ral_7016', name: 'RAL 7016 Anthracite', hex: '#2f3336', family: 'neutral' },
  { id: 'ral_9006', name: 'RAL 9006 Gris Alu', hex: '#a5a5a5', family: 'neutral' },
  { id: 'ral_9005', name: 'RAL 9005 Noir', hex: '#0b0b0b', family: 'neutral' },
  { id: 'ral_8019', name: 'RAL 8019 Brun', hex: '#3b2f2a', family: 'neutral' },
];

export const CUSTOM_COLORS: ColorOption[] = [
  ...STANDARD_COLORS,
  { id: 'ral_3004', name: 'RAL 3004 Rouge Pourpre (Matest)', hex: '#6f1f2a', family: 'reds' },
  { id: 'ral_6005', name: 'RAL 6005 Vert Mousse (Matest)', hex: '#0f3b2e', family: 'greens' },
  { id: 'ral_5011', name: 'RAL 5011 Bleu Acier (Matest)', hex: '#1f2e3d', family: 'blues' },
];

export const STORE_MODELS: StoreModel[] = [
  // --- LES 2 PROMOS (Toujours Galbés) ---
  {
    id: 'promo_smart',
    name: 'Coffre Promo Smart',
    type: 'coffre',
    shape: 'galbe',
    is_promo: true,
    description: 'L\'essentiel du store coffre à prix réduit.',
    compatibility: {
      lambrequin_enroulable: false,
      led_arms: true,
      led_box: false,
      max_width: 4800,
    },
    image: '/images/promo-smart.jpg',
  },
  {
    id: 'promo_design',
    name: 'Coffre Promo Design',
    type: 'coffre',
    shape: 'galbe',
    is_promo: true,
    description: 'Design arrondi élégant avec option LED.',
    compatibility: {
      lambrequin_enroulable: false,
      led_arms: true,
      led_box: false,
      max_width: 5000,
    },
    image: '/images/promo-design.jpg',
  },

  // --- LES COFFRES STANDARDS (Exemples Carrés et Galbés) ---
  {
    id: 'heliom',
    name: 'Heliom',
    type: 'coffre',
    shape: 'carre',
    is_promo: false,
    description: 'Le best-seller cubique. Protection totale.',
    compatibility: {
      lambrequin_enroulable: true,
      led_arms: true,
      led_box: true,
      max_width: 6000,
    },
    image: '/images/heliom.jpg',
  },
  {
    id: 'k_box',
    name: 'K-Box',
    type: 'coffre',
    shape: 'carre',
    is_promo: false,
    description: 'Coffre carré compact pour façades modernes.',
    compatibility: {
      lambrequin_enroulable: false,
      led_arms: true,
      led_box: false,
      max_width: 5500,
    },
    image: '/images/kbox.jpg',
  },
  {
    id: 'prisma',
    name: 'Prisma',
    type: 'coffre',
    shape: 'carre',
    is_promo: false,
    description: 'Coffre carré premium à lignes tendues.',
    compatibility: {
      lambrequin_enroulable: true,
      led_arms: true,
      led_box: true,
      max_width: 6200,
    },
    image: '/images/prisma.jpg',
  },
  {
    id: 'linea',
    name: 'Linea',
    type: 'coffre',
    shape: 'carre',
    is_promo: false,
    description: 'Design minimaliste pour architecture contemporaine.',
    compatibility: {
      lambrequin_enroulable: false,
      led_arms: true,
      led_box: true,
      max_width: 5800,
    },
    image: '/images/linea.jpg',
  },
  {
    id: 'curvea',
    name: 'Curvea',
    type: 'coffre',
    shape: 'galbe',
    is_promo: false,
    description: 'Coffre galbé élégant, façade douce.',
    compatibility: {
      lambrequin_enroulable: false,
      led_arms: true,
      led_box: false,
      max_width: 5400,
    },
    image: '/images/curvea.jpg',
  },
  {
    id: 'ovalis',
    name: 'Ovalis',
    type: 'coffre',
    shape: 'galbe',
    is_promo: false,
    description: 'Galbé raffiné pour façades classiques.',
    compatibility: {
      lambrequin_enroulable: true,
      led_arms: true,
      led_box: false,
      max_width: 5200,
    },
    image: '/images/ovalis.jpg',
  },
  {
    id: 'sfera',
    name: 'Sfera',
    type: 'coffre',
    shape: 'galbe',
    is_promo: false,
    description: 'Coffre galbé compact et polyvalent.',
    compatibility: {
      lambrequin_enroulable: false,
      led_arms: true,
      led_box: false,
      max_width: 5000,
    },
    image: '/images/sfera.jpg',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    type: 'coffre',
    shape: 'galbe',
    is_promo: false,
    description: 'Lignes douces, option LED bras.',
    compatibility: {
      lambrequin_enroulable: true,
      led_arms: true,
      led_box: false,
      max_width: 5600,
    },
    image: '/images/aurora.jpg',
  },

  // --- LES MONOBLOCS ---
  {
    id: 'loggia',
    name: 'Loggia',
    type: 'monobloc',
    shape: 'na',
    is_promo: false,
    description: 'Idéal sous toiture.',
    compatibility: {
      lambrequin_enroulable: false,
      led_arms: false,
      led_box: false,
      max_width: 5000,
    },
    image: '/images/loggia.jpg',
  },
  {
    id: 'tempo',
    name: 'Tempo',
    type: 'monobloc',
    shape: 'na',
    is_promo: false,
    description: 'Monobloc robuste pour grandes avancées.',
    compatibility: {
      lambrequin_enroulable: false,
      led_arms: false,
      led_box: false,
      max_width: 5200,
    },
    image: '/images/tempo.jpg',
  },
  {
    id: 'classic',
    name: 'Classic',
    type: 'monobloc',
    shape: 'na',
    is_promo: false,
    description: 'Solution économique et fiable.',
    compatibility: {
      lambrequin_enroulable: false,
      led_arms: false,
      led_box: false,
      max_width: 4800,
    },
    image: '/images/classic.jpg',
  },
];

export const DESIGN_OPTIONS = {
  frameColors: STANDARD_COLORS,
  fabrics: {
    category: "Dickson Orchestra",
    price: 0, 
  }
};

// ==========================================
// 4. CATALOGUE PRODUITS
// ==========================================
export const PRODUCT_CATALOG: Record<string, ProductModel> = {
  
  // --- HELIOM (Premium) ---
  heliom: {
    name: "Heliom",
    description: "Coffre intégral cubique, design moderne.",
    coefficient: 2.2, // Achat x 2.2
    widthSteps: [2400, 3580, 4200, 5290, 6000], 
    prices: {
      1500: [1950, 2019, 2124, 2301, 2362],
      2000: [2058, 2166, 2353, 2421, null], 
      2500: [2111, 2222, 2421, 2496, null],
      3000: [2291, 2485, 2577, null, null],
      3500: [2541, 2641, null, null, null], 
    }
  },

  // --- KITANGUY (Entrée de gamme) ---
  kitanguy: {
    name: "Kitanguy 2",
    description: "Store coffre traditionnel, robuste.",
    coefficient: 1.9, // Achat x 1.9 (Plus agressif)
    widthSteps: [2470, 3650, 4830, 5610, 5850],
    prices: {
      1500: [1433, 1520, 1654, 1756, 1901],
      2000: [1514, 1607, 1760, 1870, 2018],
      2500: [1672, 1839, 1991, 2155, null],
      3000: [1748, 1931, 2146, 2317, null],
    }
  }
};