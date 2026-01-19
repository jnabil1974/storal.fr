import { StoreBanneConfig, PorteBlindeeConfig, StoreAntichaleurConfig, ProductConfig } from '@/types/products';

// Calcul du prix pour Store Banne
export function calculateStoreBannePrice(basePrice: number, config: StoreBanneConfig): number {
  let price = basePrice;

  const area = (config.width * config.depth) / 10000; // m²
  price += area * 50;

  if (config.motorized) {
    const motorPrices: Record<string, number> = {
      manuel: 0,
      electrique: 350,
      smarty: 650,
    };
    price += motorPrices[config.motorType || 'electrique'] || 350;
  }

  const fabricPrices: Record<string, number> = {
    acrylique: 0,
    polyester: 150,
    'micro-perforé': 250,
  };
  price += fabricPrices[config.fabric] || 0;

  if (config.windSensor) price += 120;
  if (config.rainSensor) price += 120;

  const armPrices: Record<string, number> = {
    coffre: 200,
    'semi-coffre': 100,
    ouvert: 0,
  };
  price += armPrices[config.armType] || 0;

  return Math.round(price);
}

// Calcul du prix pour Porte Blindée
export function calculatePorteBlindeePrice(basePrice: number, config: PorteBlindeeConfig): number {
  let price = basePrice;

  const area = (config.width * config.height) / 10000; // m²
  price += area * 40;

  const doorTypePrices: Record<string, number> = {
    battante: 0,
    coulissante: 300,
    pliante: 500,
  };
  price += doorTypePrices[config.doorType] || 0;

  const materialPrices: Record<string, number> = {
    acier: 0,
    aluminium: 200,
    composite: 350,
    bois: 400,
  };
  price += materialPrices[config.material] || 0;

  const securityPrices: Record<string, number> = {
    A2P_1: 0,
    A2P_2: 250,
    A2P_3: 600,
  };
  price += securityPrices[config.securityLevel] || 0;

  const lockPrices: Record<string, number> = {
    simple: 0,
    double: 150,
    triple: 350,
  };
  price += lockPrices[config.lockType] || 0;

  if (config.glassType && config.glassType !== 'aucun') {
    const glassPrices: Record<string, number> = {
      simple: 100,
      securisé: 300,
      blindé: 600,
    };
    const baseGlassPrice = glassPrices[config.glassType] || 100;
    const glassPercentage = config.glassPercentage || 0;
    price += (baseGlassPrice * glassPercentage) / 100;
  }

  if (config.soundProofing) price += 200;
  if (config.thermalProofing) price += 180;

  return Math.round(price);
}

// Calcul du prix pour Store Antichaleur
export function calculateStoreAntichaleurPrice(basePrice: number, config: StoreAntichaleurConfig): number {
  let price = basePrice;

  const area = (config.width * config.height) / 10000; // m²
  price += area * 80;

  const fabricPrices: Record<string, number> = {
    screen: 0,
    'semi-occultant': 30,
    occultant: 50,
  };
  price += fabricPrices[config.fabricType] || 0;

  if (config.orientation === 'exterieur') {
    price += 100;
  }

  if (config.motorized) {
    price += 150;
    if (config.motorType === 'solaire') {
      price += 200;
    }
  }

  const fixationPrices: Record<string, number> = {
    standard: 0,
    'sans-percage': 40,
    encastre: 150,
  };
  price += fixationPrices[config.fixationType] || 0;

  if (config.uvProtection) price += 30;
  if (config.thermalControl) price += 40;

  return Math.round(price);
}

// Fonction générique pour calculer le prix
export function calculateProductPrice(basePrice: number, config: ProductConfig): number {
  if ('motorized' in config && 'windSensor' in config) {
    return calculateStoreBannePrice(basePrice, config as StoreBanneConfig);
  } else if ('motorized' in config && 'fabricType' in config) {
    return calculateStoreAntichaleurPrice(basePrice, config as StoreAntichaleurConfig);
  }
  return calculatePorteBlindeePrice(basePrice, config as PorteBlindeeConfig);
}

// Fonction pour obtenir un détail du prix (breakdown)
export function getPriceBreakdown(basePrice: number, config: ProductConfig) {
  const breakdown: Record<string, number> = {
    'Prix de base': basePrice,
  };

  if ('motorized' in config && 'windSensor' in config) {
    const sbConfig = config as StoreBanneConfig;
    const area = (sbConfig.width * sbConfig.depth) / 10000;
    breakdown['Dimensions'] = area * 50;

    if (sbConfig.motorized) {
      const motorPrices: Record<string, number> = {
        manuel: 0,
        electrique: 350,
        smarty: 650,
      };
      breakdown['Motorisation'] = motorPrices[sbConfig.motorType || 'electrique'] || 350;
    }

    const fabricPrices: Record<string, number> = {
      acrylique: 0,
      polyester: 150,
      'micro-perforé': 250,
    };
    if (fabricPrices[sbConfig.fabric]) {
      breakdown['Type de tissu'] = fabricPrices[sbConfig.fabric];
    }

    if (sbConfig.windSensor) breakdown['Capteur vent'] = 120;
    if (sbConfig.rainSensor) breakdown['Capteur pluie'] = 120;

    const armPrices: Record<string, number> = {
      coffre: 200,
      'semi-coffre': 100,
      ouvert: 0,
    };
    if (armPrices[sbConfig.armType]) {
      breakdown['Type de bras'] = armPrices[sbConfig.armType];
    }
    return breakdown;
  }

  if ('motorized' in config && 'fabricType' in config) {
    const saConfig = config as StoreAntichaleurConfig;
    const area = (saConfig.width * saConfig.height) / 10000;
    breakdown['Dimensions'] = area * 80;

    const fabricPrices: Record<string, number> = {
      screen: 0,
      'semi-occultant': 30,
      occultant: 50,
    };
    if (fabricPrices[saConfig.fabricType]) {
      breakdown['Type de tissu'] = fabricPrices[saConfig.fabricType];
    }

    if (saConfig.orientation === 'exterieur') {
      breakdown['Orientation extérieure'] = 100;
    }

    if (saConfig.motorized) {
      let motorPrice = 150;
      if (saConfig.motorType === 'solaire') motorPrice += 200;
      breakdown['Motorisation'] = motorPrice;
    }

    const fixationPrices: Record<string, number> = {
      standard: 0,
      'sans-percage': 40,
      encastre: 150,
    };
    if (fixationPrices[saConfig.fixationType]) {
      breakdown['Type de fixation'] = fixationPrices[saConfig.fixationType];
    }

    if (saConfig.uvProtection) breakdown['Protection UV'] = 30;
    if (saConfig.thermalControl) breakdown['Contrôle thermique'] = 40;
    return breakdown;
  }

  const pbConfig = config as PorteBlindeeConfig;
  const area = (pbConfig.width * pbConfig.height) / 10000;
  breakdown['Dimensions'] = area * 40;

  const doorTypePrices: Record<string, number> = {
    battante: 0,
    coulissante: 300,
    pliante: 500,
  };
  if (doorTypePrices[pbConfig.doorType]) {
    breakdown['Type de porte'] = doorTypePrices[pbConfig.doorType];
  }

  const materialPrices: Record<string, number> = {
    acier: 0,
    aluminium: 200,
    composite: 350,
    bois: 400,
  };
  if (materialPrices[pbConfig.material]) {
    breakdown['Matériau'] = materialPrices[pbConfig.material];
  }

  const securityPrices: Record<string, number> = {
    A2P_1: 0,
    A2P_2: 250,
    A2P_3: 600,
  };
  if (securityPrices[pbConfig.securityLevel]) {
    breakdown['Niveau sécurité'] = securityPrices[pbConfig.securityLevel];
  }

  const lockPrices: Record<string, number> = {
    simple: 0,
    double: 150,
    triple: 350,
  };
  if (lockPrices[pbConfig.lockType]) {
    breakdown['Type de serrure'] = lockPrices[pbConfig.lockType];
  }

  if (pbConfig.soundProofing) breakdown['Insonorisation'] = 200;
  if (pbConfig.thermalProofing) breakdown['Isolation thermique'] = 180;

  return breakdown;
}
