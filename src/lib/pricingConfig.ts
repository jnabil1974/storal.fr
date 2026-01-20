/**
 * Configuration des coefficients de tarification
 * Les prix du catalogue sont des prix d'achat HT
 * Le coefficient applique la marge et la TVA
 */

// Coefficient = (Prix achat HT × Coefficient) × 1.20 (TVA)
export const PRICING_CONFIG = {
  // Taux de TVA (20% pour la France)
  vatRate: 0.20,

  // Coefficients par défaut par produit
  // Formule: prix_vente_ttc = prix_achat_ht × coefficient × (1 + vatRate)
  defaultCoefficients: {
    store_banne_kissimy: 2.0, // Marge 100%
    store_banne_kitanguy: 2.0, // Marge 100%
    store_banne_monobloc: 2.0, // À adapter selon modèle
    porte_blindee: 2.2, // Marge 120%
    store_antichaleur: 2.5, // Marge 150%
  },

  // Coefficients globaux par type de produit
  byProductType: {
    store_banne: 2.0,
    porte_blindee: 2.2,
    store_antichaleur: 2.5,
    fenetre_menuiserie: 2.3,
    armoire_placard: 2.1,
  },
};

/**
 * Calcule le prix TTC à partir du prix d'achat HT
 * @param priceHT Prix d'achat HT
 * @param coefficient Coefficient de marge
 * @returns Prix TTC
 */
export function calculatePriceTTC(priceHT: number, coefficient: number): number {
  const priceBeforeTax = priceHT * coefficient;
  const priceTTC = priceBeforeTax * (1 + PRICING_CONFIG.vatRate);
  return Math.round(priceTTC * 100) / 100; // Arrondir à 2 décimales
}

/**
 * Calcule le prix HT avant TVA
 * @param priceHT Prix d'achat HT
 * @param coefficient Coefficient de marge
 * @returns Prix HT (avant TVA)
 */
export function calculatePriceHT(priceHT: number, coefficient: number): number {
  return priceHT * coefficient;
}

/**
 * Extraire la TVA du prix TTC
 * @param priceTTC Prix TTC
 * @returns Montant de TVA
 */
export function extractVAT(priceTTC: number): number {
  const vatAmount = priceTTC / (1 + PRICING_CONFIG.vatRate) * PRICING_CONFIG.vatRate;
  return Math.round(vatAmount * 100) / 100;
}

/**
 * Obtenir le coefficient pour un produit spécifique
 * Utilise d'abord les coefficients spécifiques, sinon le type par défaut
 */
export function getDefaultCoefficient(productKey: string): number {
  // Chercher coefficient spécifique (ex: store_banne_kissimy)
  if (productKey in PRICING_CONFIG.defaultCoefficients) {
    return PRICING_CONFIG.defaultCoefficients[productKey as keyof typeof PRICING_CONFIG.defaultCoefficients];
  }

  // Sinon, utiliser par type de produit
  const productType = productKey.split('_')[0] + '_' + productKey.split('_')[1]; // ex: store_banne
  return PRICING_CONFIG.byProductType[productType as keyof typeof PRICING_CONFIG.byProductType] || 2.0;
}
