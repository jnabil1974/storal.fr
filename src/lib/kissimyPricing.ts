import { StoreBanneKissimyConfig } from '@/types/products';
import { calculatePriceTTC, PRICING_CONFIG } from '@/lib/pricingConfig';
import { getPricingCoefficient } from '@/lib/pricingRules';
import { DICKSON_TOILES } from '@/lib/dicksonToiles';

/**
 * Grille de prix KISSIMY en HT (avant coefficient)
 * Source: PRIX DIM KISSIMY.csv
 */
const KISSIMY_PRICING_GRID = [
  { avancee: 1500, largeurMin: 1800, largeurMax: 2470, priceHT: 1010 },
  { avancee: 1500, largeurMin: 2470, largeurMax: 3650, priceHT: 1039 },
  { avancee: 1500, largeurMin: 3650, largeurMax: 4830, priceHT: 1068 },
  
  { avancee: 2000, largeurMin: 1800, largeurMax: 2470, priceHT: 1095 },
  { avancee: 2000, largeurMin: 2470, largeurMax: 3650, priceHT: 1125 },
  { avancee: 2000, largeurMin: 3650, largeurMax: 4830, priceHT: 1154 },
  
  { avancee: 2500, largeurMin: 1800, largeurMax: 2470, priceHT: 1181 },
  { avancee: 2500, largeurMin: 2470, largeurMax: 3650, priceHT: 1210 },
  { avancee: 2500, largeurMin: 3650, largeurMax: 4830, priceHT: 1239 },
  
  { avancee: 3000, largeurMin: 1800, largeurMax: 2470, priceHT: 1268 },
  { avancee: 3000, largeurMin: 2470, largeurMax: 3650, priceHT: 1296 },
  { avancee: 3000, largeurMin: 3650, largeurMax: 4830, priceHT: 1295 },
];

/**
 * Prix des options KISSIMY en HT (avant coefficient)
 */
const KISSIMY_OPTIONS_PRICES = {
  // Couleur cadre
  couleurCadre: {
    RAL_9010: 0,
    RAL_1015: 0,
    RAL_7016: 0,
    AUTRE_RAL: 86,
  },
  // Accessoires
  accessoires: {
    poseSousPlafond: 39,
    capteurVent: 90,
    tahoma: 117,
    cablage10m: 48,
  },
};

/**
 * Retourne le prix HT pour la couleur de cadre sélectionnée.
 */
function getCouleurCadrePriceHT(couleurCadre: string): number {
  const map = KISSIMY_OPTIONS_PRICES.couleurCadre as Record<string, number>;
  return map[couleurCadre] ?? 0;
}

/**
 * Récupère le prix de base HT du grid de tarification KISSIMY
 * 
 * @param avancee Avancée en mm (1500, 2000, 2500, 3000)
 * @param largeur Largeur en mm (1800-4830)
 * @returns Prix HT du produit de base, ou null si dimensions invalides
 */
export function getKissimyBasePriceHT(avancee: number, largeur: number): number | null {
  const row = KISSIMY_PRICING_GRID.find(
    (item) =>
      item.avancee === avancee &&
      largeur >= item.largeurMin &&
      largeur <= item.largeurMax
  );

  return row ? row.priceHT : null;
}

/**
 * Calcule le prix total TTC pour une configuration KISSIMY
 * 
 * @param config Configuration KISSIMY
 * @param coefficient Coefficient de tarification (marge + taxes)
 * @returns Objet avec détails du prix
 */
export function calculateKissimyPriceTTC(
  config: StoreBanneKissimyConfig,
  coefficient: number
): {
  basePriceHT: number | null;
  optionsPriceHT: number;
  totalPriceHT: number;
  totalPriceTTC: number;
  breakdownHT: { [key: string]: number };
} {
  // Récupérer le prix de base
  const basePriceHT = getKissimyBasePriceHT(config.avancee, config.largeur);
  
  if (basePriceHT === null) {
    throw new Error(`Invalid dimensions: avancee=${config.avancee}, largeur=${config.largeur}`);
  }

  // Calculer le prix des options
  const optionsPriceHT = calculateKissimyOptionsPrice(config);
  
  // Total HT
  const totalPriceHT = basePriceHT + optionsPriceHT;

  // Appliquer le coefficient et la TVA
  const totalPriceTTC = calculatePriceTTC(totalPriceHT, coefficient);

  // Détail
  const breakdown: { [key: string]: number } = { base: basePriceHT };
  if (config.poseSousPlafond) {
    breakdown['poseSousPlafond'] = KISSIMY_OPTIONS_PRICES.accessoires.poseSousPlafond;
  }
  if (config.capteurVent) {
    breakdown['capteurVent'] = KISSIMY_OPTIONS_PRICES.accessoires.capteurVent;
  }
  if (config.tahoma) {
    breakdown['tahoma'] = KISSIMY_OPTIONS_PRICES.accessoires.tahoma;
  }
  if (config.cablage10m) {
    breakdown['cablage10m'] = KISSIMY_OPTIONS_PRICES.accessoires.cablage10m;
  }
  if (config.couleurCadre) {
    const colorPrice = getCouleurCadrePriceHT(config.couleurCadre);
    if (colorPrice > 0) {
      breakdown[`couleurCadre_${config.couleurCadre}`] = colorPrice;
    }
  }

  return {
    basePriceHT,
    optionsPriceHT,
    totalPriceHT,
    totalPriceTTC,
    breakdownHT: breakdown,
  };
}

/**
 * Calcule uniquement le prix des options en HT
 */
export function calculateKissimyOptionsPrice(config: StoreBanneKissimyConfig): number {
  let total = 0;

  if (config.poseSousPlafond) {
    total += KISSIMY_OPTIONS_PRICES.accessoires.poseSousPlafond;
  }

  if (config.capteurVent) {
    total += KISSIMY_OPTIONS_PRICES.accessoires.capteurVent;
  }

  if (config.tahoma) {
    total += KISSIMY_OPTIONS_PRICES.accessoires.tahoma;
  }

  if (config.cablage10m) {
    total += KISSIMY_OPTIONS_PRICES.accessoires.cablage10m;
  }

  // Couleur de cadre
  total += getCouleurCadrePriceHT(config.couleurCadre);

  return total;
}

/**
 * Récupère toutes les options disponibles pour KISSIMY
 */
export function getKissimyAvailableOptions() {
  return {
    couleurCadre: [
      { value: 'RAL_9010', label: 'Blanc RAL 9010', priceHT: 0 },
      { value: 'RAL_1015', label: 'Beige RAL 1015', priceHT: 0 },
      { value: 'RAL_7016', label: 'Gris Anthracite RAL 7016', priceHT: 0 },
      { value: 'AUTRE_RAL', label: 'Autre couleur RAL', priceHT: 86 },
    ],
    toiles: DICKSON_TOILES.map((t) => ({
      ref: t.ref,
      name: t.name,
      description: t.description,
      imageUrl: t.imageUrl,
      priceHT: t.priceHT ?? 0,
    })),
  };
}

/**
 * Valide une configuration KISSIMY
 */
export function validateKissimyConfig(config: Partial<StoreBanneKissimyConfig>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.avancee) {
    errors.push('Avancée requise');
  } else if (![1500, 2000, 2500, 3000].includes(config.avancee)) {
    errors.push('Avancée invalide. Valeurs acceptées: 1500, 2000, 2500, 3000mm');
  }

  if (!config.largeur) {
    errors.push('Largeur requise');
  } else if (config.largeur < 1800 || config.largeur > 4830) {
    errors.push('Largeur doit être entre 1800 et 4830mm');
  }

  if (!config.couleurCadre) {
    errors.push('Couleur du cadre requise');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
