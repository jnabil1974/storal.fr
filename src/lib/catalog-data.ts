// Fichier : lib/catalog-data.ts

// --- TYPES (Pour TypeScript) ---
export interface ProductModel {
  name: string;
  description: string;
  coefficient: number; // Marge spécifique au produit
  widthSteps: number[];
  prices: Record<number, (number | null)[]>;
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
export const DESIGN_OPTIONS = {
  frameColors: [
    { id: 'ral_9016', name: 'Blanc Signalisation (Mat)', hex: '#ffffff' },
    { id: 'ral_7016', name: 'Gris Anthracite (Texturé)', hex: '#37424a' },
    { id: 'ral_1015', name: 'Ivoire Clair', hex: '#e6d9bd' },
    { id: 'ral_9006', name: 'Gris Aluminium', hex: '#a5a5a5' },
  ],
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