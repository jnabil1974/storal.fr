/**
 * Fonctions utilitaires pour catalog-data
 * Ces fonctions ne changent pas lors de la régénération des prix
 */

import { StoreModel } from './catalog-types';
import { STORE_MODELS, CATALOG_SETTINGS, OPTIONS_PRICES } from './catalog-data';

export function calculateArmsForLargeWidth(modelId: string, width: number, projection: number): number {
  const isLargeFormat = ['dynasta', 'belharra', 'belharra_2'].includes(modelId);
  
  if (width <= 6000) {
    return 2;
  }

  if (projection === 3500 && width >= 6001 && width <= 6144) {
    throw new Error(
      `Impossible de fabriquer ce store : largeur ${width}mm combinée à avancée ${projection}mm crée un conflit mécanique des bras repliés.`
    );
  }

  if (projection === 4000 && width >= 6001 && width <= 6894) {
    throw new Error(
      `Impossible de fabriquer ce store : largeur ${width}mm combinée à avancée ${projection}mm est incompatible avec la rétraction du mécanisme.`
    );
  }

  if (!isLargeFormat) {
    return 2;
  }

  if (projection <= 3000) {
    if (width >= 6001 && width <= 7736) return 3;
    if (width >= 7737 && width <= 12000) return 4;
  } else if (projection === 3250) {
    if (width >= 6001 && width <= 8174) return 3;
    if (width >= 8175 && width <= 12000) return 4;
  } else if (projection === 3500) {
    if (width >= 6145 && width <= 8612) return 3;
    if (width >= 8613 && width <= 12000) return 4;
  } else if (projection === 4000) {
    if (width >= 6895 && width <= 9532) return 3;
    if (width >= 9533 && width <= 12000) return 4;
  }

  return 2;
}

export function getArmCount(modelLogic: string, width: number): number {
  switch (modelLogic) {
    case 'standard_2': 
      return 2; 
    case 'force_2_3_4': 
      if (width > 5950) return 3; 
      return 2;
    case 'couples_4_6':
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
    maxWidth: model.compatibility?.max_width || 0,
    minProjection: projections[0],
    maxProjection: projections[projections.length - 1],
    availableProjections: projections,
    minWidthsMap: model.minWidths
  };
}

export function convertLambrequinConfig(lambrequinConfig: any): {
  lambrequinFixe: boolean;
  lambrequinEnroulable: boolean;
  lambrequinMotorized: boolean;
  lambrequinHeight?: number;
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
      lambrequinHeight: lambrequinConfig.height ?? 220
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
    lambrequinFixe?: boolean,
    lambrequinEnroulable?: boolean,
    lambrequinMotorized?: boolean,
    isPosePro?: boolean,
    isCustomColor?: boolean,
    isPosePlafond?: boolean
  }
}) {
  const model = STORE_MODELS[config.modelId];
  if (!model) return null;

  const minWidthRequired = model.minWidths[config.projection];
  if (minWidthRequired && config.width < minWidthRequired) {
    return null; 
  }

  const isLargeFormat = ['dynasta', 'belharra', 'belharra_2'].includes(config.modelId);
  if (isLargeFormat && config.width > 6000) {
    if (config.projection === 3500 && config.width >= 6001 && config.width <= 6144) {
      return null;
    }
    if (config.projection === 4000 && config.width >= 6001 && config.width <= 6894) {
      return null;
    }
  }

  let usedProjection = config.projection;
  let grid = model.buyPrices[config.projection];
  
  if (!grid) {
    const availableProjections = Object.keys(model.buyPrices).map(Number).sort((a, b) => a - b);
    const nextProjection = availableProjections.find(p => p > config.projection);
    
    if (!nextProjection) {
      return null;
    }
    
    usedProjection = nextProjection;
    grid = model.buyPrices[nextProjection];
  }
  
  if (!grid) return null;
  const tier = grid.find((t: { maxW: number; priceHT: number }) => config.width <= t.maxW);
  if (!tier) return null;

  let totalAchatHT = tier.priceHT;

  if (config.options.ledArms && model.compatibility?.led_arms) {
    let nbBras = 2;
    try {
      nbBras = calculateArmsForLargeWidth(config.modelId, config.width, config.projection);
    } catch (error) {
      return null;
    }
    
    const ledGrid = OPTIONS_PRICES.LED_ARMS[usedProjection];
    
    if (ledGrid) {
      totalAchatHT += ledGrid[nbBras] || ledGrid[2] || 0;
    }
  }
  
  if (config.options.ledBox && model.compatibility?.led_box) {
    totalAchatHT += model.ledCoffretPrice ?? OPTIONS_PRICES.LED_CASSETTE;
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
  
  if (config.options.lambrequinFixe && model.compatibility?.lambrequin_fixe) {
    totalAchatHT += OPTIONS_PRICES.LAMBREQUIN_FIXE;
  }

  if (config.options.lambrequinEnroulable && model.compatibility?.lambrequin_enroulable) {
    if (config.modelId === 'kalyo' && config.projection > 3250) {
      // Restriction technique KALY'O
    } else {
      const grid = model.lambrequinEnroulablePrices;
      const tiers = config.options.lambrequinMotorized ? grid?.motorized : grid?.manual;
      if (tiers && tiers.length > 0) {
          const tier = tiers.find((t: { maxW: number; price: number }) => config.width <= t.maxW && t.maxW <= 6000);
        if (tier) totalAchatHT += tier.price;
      }
    }
  }

  const prixStoreBaseAchatHT = tier.priceHT;
  
  const getOptionCoeff = (optionKey: keyof typeof CATALOG_SETTINGS.OPTIONS_COEFFICIENTS) => {
    return model.optionsCoefficients?.[optionKey] ?? CATALOG_SETTINGS.OPTIONS_COEFFICIENTS[optionKey];
  };
  
  const coeffStore = model.salesCoefficient ?? CATALOG_SETTINGS.COEFF_MARGE;
  let totalVenteHT = prixStoreBaseAchatHT * coeffStore;
  
  if (config.options.ledArms && model.compatibility?.led_arms) {
    let nbBras = 2;
    try {
      nbBras = calculateArmsForLargeWidth(config.modelId, config.width, config.projection);
    } catch (error) {}
    const ledGrid = OPTIONS_PRICES.LED_ARMS[usedProjection];
    if (ledGrid) {
      const ledPriceAchatHT = ledGrid[nbBras] || ledGrid[2] || 0;
      totalVenteHT += ledPriceAchatHT * getOptionCoeff('LED_ARMS');
    }
  }
  
  if (config.options.ledBox && model.compatibility?.led_box) {
    const ledCoffrePriceHT = model.ledCoffretPrice ?? OPTIONS_PRICES.LED_CASSETTE;
    totalVenteHT += ledCoffrePriceHT * getOptionCoeff('LED_CASSETTE');
  }
  
  if (config.options.isCustomColor) {
    totalVenteHT += OPTIONS_PRICES.FRAME_SPECIFIC_RAL * getOptionCoeff('FRAME_COLOR_CUSTOM');
  }
  
  if (config.options.isPosePlafond) {
    const ceilingGrid = model.ceilingMountPrices;
    if (ceilingGrid && ceilingGrid.length > 0) {
      const tier = ceilingGrid.find((t: { maxW: number; price: number }) => config.width <= t.maxW);
      if (tier) {
        totalVenteHT += tier.price * getOptionCoeff('CEILING_MOUNT');
      }
    }
  }
  
  if (config.options.lambrequinFixe && model.compatibility?.lambrequin_fixe) {
    totalVenteHT += OPTIONS_PRICES.LAMBREQUIN_FIXE * getOptionCoeff('LAMBREQUIN_FIXE');
  }
  
  if (config.options.lambrequinEnroulable && model.compatibility?.lambrequin_enroulable) {
    if (config.modelId !== 'kalyo' || config.projection <= 3250) {
      const grid = model.lambrequinEnroulablePrices;
      const tiers = config.options.lambrequinMotorized ? grid?.motorized : grid?.manual;
      if (tiers && tiers.length > 0) {
        const tier = tiers.find(t => config.width <= t.maxW && t.maxW <= 6000);
        if (tier) {
          totalVenteHT += tier.price * getOptionCoeff('LAMBREQUIN_ENROULABLE');
        }
      }
    }
  }
  
  const prixStoreBaseVenteHT = prixStoreBaseAchatHT * coeffStore;
  
  let ledArmsHT = 0;
  let ledBoxHT = 0;
  let lambrequinHT = 0;
  
  if (config.options.ledArms && model.compatibility?.led_arms) {
    let nbBras = 2;
    try {
      nbBras = calculateArmsForLargeWidth(config.modelId, config.width, config.projection);
    } catch (error) {}
    const ledGrid = OPTIONS_PRICES.LED_ARMS[usedProjection];
    if (ledGrid) {
      const ledPriceAchatHT = ledGrid[nbBras] || ledGrid[2] || 0;
      ledArmsHT = ledPriceAchatHT * getOptionCoeff('LED_ARMS');
    }
  }
  
  if (config.options.ledBox && model.compatibility?.led_box) {
    const ledCoffrePriceHT = model.ledCoffretPrice ?? OPTIONS_PRICES.LED_CASSETTE;
    ledBoxHT = ledCoffrePriceHT * getOptionCoeff('LED_CASSETTE');
  }
  
  if (config.options.lambrequinEnroulable && model.compatibility?.lambrequin_enroulable) {
    if (config.modelId !== 'kalyo' || config.projection <= 3250) {
      const grid = model.lambrequinEnroulablePrices;
      const tiers = config.options.lambrequinMotorized ? grid?.motorized : grid?.manual;
      if (tiers && tiers.length > 0) {
        const tier = tiers.find((t: { maxW: number; price: number }) => config.width <= t.maxW && t.maxW <= 6000);
        if (tier) {
          lambrequinHT = tier.price * getOptionCoeff('LAMBREQUIN_ENROULABLE');
        }
      }
    }
  }

  const tauxTva = config.options.isPosePro ? CATALOG_SETTINGS.TVA_REDUIT : CATALOG_SETTINGS.TVA_NORMAL;
  let totalVenteTTC = totalVenteHT * tauxTva;
  
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
    details: {
      base_price_ht: Math.round(prixStoreBaseVenteHT),
      led_arms_price_ht: Math.round(ledArmsHT),
      led_box_price_ht: Math.round(ledBoxHT),
      lambrequin_price_ht: Math.round(lambrequinHT),
      taux_tva: tauxTva === CATALOG_SETTINGS.TVA_REDUIT ? 10 : 20
    },
    transport: {
      applicable: transportApplicable,
      montantHT: Math.round(transportHT),
      montantTTC: Math.round(transportTTC),
      raison: transportApplicable ? `Largeur ${config.width}mm > ${CATALOG_SETTINGS.TRANSPORT.SEUIL_LARGEUR_MM}mm` : null
    }
  };
}
