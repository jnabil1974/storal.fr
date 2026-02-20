// /src/lib/catalog-data.ts

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

// ==========================================
// HELPERS - Prix et Dimensions
// ==========================================

/**
 * Génère un slug URL-friendly depuis un nom de produit
 */
export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD') // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-') // Remplace les caractères non alphanumériques par des tirets
    .replace(/^-+|-+$/g, ''); // Supprime les tirets en début et fin
}

/**
 * Trouve un modèle par son slug
 */
export function getModelBySlug(slug: string): StoreModel | undefined {
  const models = Object.values(STORE_MODELS);
  return models.find(model => {
    // Si le modèle a un slug défini, on l'utilise
    if (model.slug) {
      return model.slug === slug;
    }
    // Sinon, on génère le slug à partir du nom avec le préfixe "store-"
    const generatedSlug = 'store-' + createSlug(model.name);
    return generatedSlug === slug;
  });
}

/**
 * Retourne le slug d'un modèle (utilise le champ slug ou génère depuis le name)
 */
export function getModelSlug(modelIdOrModel: string | StoreModel): string {
  const model = typeof modelIdOrModel === 'string' 
    ? STORE_MODELS[modelIdOrModel] 
    : modelIdOrModel;
  
  if (!model) return '';
  // Si le modèle a un slug prédéfini, on l'utilise
  if (model.slug) return model.slug;
  // Sinon, on génère le slug à partir du nom avec le préfixe "store-"
  return 'store-' + createSlug(model.name);
}

/**
 * Vérifie si la largeur nécessite une alerte de livraison en 2 parties
 * 
 * @param model - Modèle de store
 * @param largeur - Largeur du store en mm
 * @returns Message d'alerte ou null
 */
export function checkDeliveryConditions(
  model: StoreModel,
  largeur: number
): string | null {
  if (!model.deliveryWarningThreshold) {
    return null;
  }
  
  if (largeur > model.deliveryWarningThreshold) {
    return `⚠️ Attention : En raison d'une largeur supérieure à ${model.deliveryWarningThreshold / 1000}m, la livraison s'effectuera en deux parties via un transporteur spécialisé.`;
  }
  
  return null;
}

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

/*
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
  image_url: string | null;
}

export type ColorOption = FrameColor;

export interface Fabric {
  id: string;
  ref: string;
  name: string;
  folder: string;
  category: 'uni' | 'raye';
  price: number;
  image_url: string | null;
  toile_type_code: string;
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
  slug?: string; // URL-friendly version du name (ex: "storal-compact")
  marketingRange?: string; // GAMME_COMPACT, GAMME_ARMOR, GAMME_EXCELLENCE, etc.
  type: 'coffre' | 'monobloc' | 'traditionnel' | 'specialite';
  shape?: 'carre' | 'galbe'; // Uniquement pour les stores coffre
  is_promo: boolean;
  description: string;
  features: string[];
  compatibility: StoreModelCompatibility;
  image: string;
  // Types de toiles compatibles (codes: ORCH, ORCH_MAX, SATTLER)
  compatible_toile_types?: string[];
  // Type de bras (argument commercial important)
  arm_type: 'standard' | 'renforce' | 'ultra_renforce';
  // Classe au vent selon la norme NF EN 13561 (Août 2015) - Classe 2 = Standard haute performance (70 N/m²)
  wind_class: 'classe_2';
  // Logique pour déterminer le nombre de bras (impacte le prix LED)
  armLogic: 'standard_2' | 'force_2_3_4' | 'couples_4_6';
  // Largeur Minimale de fabrication pour chaque avancée { 1500: 1840 }
  minWidths: Record<number, number>; 
  // Grille de prix : Clé = Avancée, Valeur = Tableau de paliers
  buyPrices: Record<number, { maxW: number, priceHT: number }[]>;
  // Prix PROMO pour largeur < 6m (ARMOR et ARMOR+ uniquement)
  promoPrices?: Record<number, { maxW: number, priceHT: number }[]>;
  // Seuil de largeur pour basculer de promo à standard (en mm, défaut: 6000)
  promoWidthThreshold?: number;
  // Option pose plafond : prix selon largeur (si non defini, considere inclus)
  ceilingMountPrices?: { maxW: number, price: number }[];
  // Option lambrequin enroulable : prix selon largeur et manoeuvre
  lambrequinEnroulablePrices?: {
    manual: { maxW: number, price: number }[];
    motorized: { maxW: number, price: number }[];
  };
  // Option auvent et joues : prix selon largeur (spécifique à certains modèles)
  auventEtJouesPrices?: { maxW: number, price: number }[];
  // Option lambrequin fixe avec toile différente : prix selon largeur
  lambrequinFixeDifferentFabricPrices?: { maxW: number, price: number }[];
  // Prix spécifique LED coffre pour ce modèle (si absent, utilise OPTIONS_PRICES.LED_CASSETTE par défaut)
  ledCoffretPrice?: number;
  // Coefficient de vente spécifique au modèle (si absent, utilise COEFF_MARGE par défaut)
  salesCoefficient?: number;
  // Coefficients spécifiques pour les options de ce produit (surcharge OPTIONS_COEFFICIENTS global)
  // Permet de faire des promos ou prix coûtant sur certaines options
  optionsCoefficients?: Partial<{
    LED_ARMS: number;
    LED_CASSETTE: number;
    LAMBREQUIN_FIXE: number;
    LAMBREQUIN_ENROULABLE: number;
    CEILING_MOUNT: number;
    AUVENT: number;
    FABRIC: number;
    FRAME_COLOR_CUSTOM: number;
    INSTALLATION: number;
  }>;
  // Type de livraison (argument commercial important)
  deliveryType: 'ready_to_install' | 'ready_up_to_6m' | 'disassembled';
  // Message commercial affiché au client
  deliveryNote: string;
  // Stratégie de tarification des couleurs
  colorStrategy: 'PROMO_LIMITED' | 'STANDARD_ALL' | 'HYBRID_ARMOR';
  // Seuil d'alerte livraison en 2 parties (en mm, généralement 6000)
  deliveryWarningThreshold?: number;
  // ⚙️ DIMENSIONS TECHNIQUES (Service "Prêt à poser" - Réglage Usine)
  dimensions_techniques?: {
    encombrement: {
      hauteur_coffre_cm: number;        // Hauteur du coffre fermé
      profondeur_coffre_cm: number;     // Profondeur du coffre
      hauteur_totale_utile_cm: number;  // Espace minimum requis au-dessus de la fenêtre pour fixer le store
    };
    inclinaison: {
      angle_min_degres: number;         // Angle minimum d'inclinaison
      angle_max_degres: number;         // Angle maximum d'inclinaison
      angle_usine_defaut: number;       // Angle par défaut réglé en usine (service "Prêt à poser")
    };
  };
}

// ==========================================
// 2. PARAMÈTRES COMMERCIAUX
// ==========================================

export const CATALOG_SETTINGS = {
  COEFF_MARGE: 1,
  TVA_NORMAL: 1.20,
  TVA_REDUIT: 1.10,
  promoCode: 'BIENVENUE2026',
  promoDiscount: 0.05,
  
  // Coefficients par type d'option (marges différenciées)
  OPTIONS_COEFFICIENTS: {
    LED_ARMS: 1,           // 100% de marge sur technologie LED bras
    LED_CASSETTE: 1,       // 100% de marge sur LED coffre
    LAMBREQUIN_FIXE: 1,    // 50% de marge sur accessoire basique
    LAMBREQUIN_ENROULABLE: 1, // 80% de marge sur lambrequin motorisé
    CEILING_MOUNT: 1,      // 60% de marge sur pose plafond
    AUVENT: 1,             // 70% de marge sur auvent
    FABRIC: 1,             // 40% de marge sur toile (commodité)
    FRAME_COLOR_CUSTOM: 1, // 80% de marge sur RAL spécifique
    INSTALLATION: 1,       // 30% de marge sur main d'œuvre
  },
  
  // Frais de transport pour stores de grande dimension
  TRANSPORT: {
    SEUIL_LARGEUR_MM: 3650,  // Seuil de déclenchement en millimètres de largeur
    FRAIS_HT: 139,           // Frais de transport en € HT (appliqués si largeur > seuil)
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
  
  LED_CASSETTE: 1,
  
  // Prix forfaitaire pour le lambrequin fixe (Kissimy, Kitangi, Dynasta, Belharra)
  LAMBREQUIN_FIXE: 1, 

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
import { TOILE_TYPES, TOILE_IMAGES, getCompatibleToileTypes, getToilesSummaryForChatbot, getToileImageUrl } from './catalog-toiles';

// Adapter le format pour la compatibilité avec le code existant
export const FRAME_COLORS: FrameColor[] = [
  { id: '9016', name: 'Blanc (RAL 9016)', hex: '#FFFFFF', price: 0, category: 'standard', image_url: '/images/matest/pdf-thumbs/page-1/9016-mat.png' },
  { id: '1015', name: 'Beige (RAL 1015)', hex: '#F3E5AB', price: 0, category: 'standard', image_url: null },
  { id: '7016', name: 'Gris Anthracite (RAL 7016)', hex: '#383E42', price: 0, category: 'standard', image_url: '/images/matest/pdf-thumbs/page-1/7016-mat.png' },
  { id: 'custom', name: 'Autre RAL (Hors Nuancier)', hex: '#cccccc', price: 138, category: 'custom', image_url: null }
];

// Pour accéder au catalogue complet Matest depuis le chatbot
export { MATEST_COLORS, STANDARD_COLORS, getColorByRAL } from './catalog-couleurs';
export { TOILE_TYPES, TOILE_IMAGES, getCompatibleToileTypes, getToilesSummaryForChatbot, getToileImageUrl } from './catalog-toiles';

// Génération dynamique des toiles depuis catalog-toiles.ts
function generateFabricsFromToileTypes(): Fabric[] {
  const fabrics: Fabric[] = [];
  
  TOILE_TYPES.forEach(toileType => {
    toileType.examples.forEach((example, index) => {
      // Afficher TOUTES les toiles disponibles (284 toiles)
      const imageUrl = example.image_url || getToileImageUrl(example.ref);
      
      // Pour Orchestra, séparer Unis et Décors
      let typeCode = toileType.code;
      if (toileType.code === 'ORCH') {
        typeCode = example.name.includes('Décor') ? 'ORCH_DECOR' : 'ORCH_UNI';
      }
      
      fabrics.push({
        id: `${toileType.code.toLowerCase()}_${example.ref}`,
        ref: example.ref,
        name: example.name,
        folder: imageUrl ? imageUrl.substring(0, imageUrl.lastIndexOf('/')) : '',
        category: example.family.toLowerCase().includes('décor') || example.family.toLowerCase().includes('ray') ? 'raye' : 'uni',
        price: 0, //Prix inclus dans le type de toile
        image_url: imageUrl,
        toile_type_code: typeCode
      });
    });
  });
  
  return fabrics;
}

export const FABRICS: Fabric[] = generateFabricsFromToileTypes();

export const FABRIC_OPTIONS = {
  MAIN_STORE: FABRICS,
  LAMBREQUIN: [
    { 
      id: 'soltis_86', 
      ref: '86-XXXX', 
      name: 'Soltis 86 (Micro-aéré)', 
      folder: '/images/Toiles/SOLTIS', 
      category: 'uni' as const, 
      price: 0,
      image_url: null,
      toile_type_code: 'SOLTIS' 
    },
    { 
      id: 'soltis_92', 
      ref: '92-XXXX', 
      name: 'Soltis 92 (Thermique)', 
      folder: '/images/Toiles/SOLTIS', 
      category: 'uni' as const, 
      price: 0,
      image_url: null,
      toile_type_code: 'SOLTIS' 
    },
  ]
};

// ==========================================
// 5. CATALOGUE DES 12 MODÈLES
// ==========================================
// /src/lib/catalog-data.ts

export const STORE_MODELS: Record<string, StoreModel> = {

  // --- 1. KISSIMY PROMO - STORAL COMPACT (Page 34) ---
  // Tarifs mis à jour le 19/02/2026
  "kissimy_promo": {
    id: "kissimy_promo",
    slug: "store-banne-coffre-compact-sur-mesure",
    name: "STORAL COMPACT (Série Limitée)",
    marketingRange: "GAMME_COMPACT",
    type: "coffre",
    shape: "galbe",
    is_promo: true,
    description: "L'essentiel du store coffre à prix serré. Moteur Sunea iO inclus. LED disponibles intégrées dans les bras.",
    features: ["PRIX PROMO", "Moteur Sunea iO", "LED intégrées dans les bras (option)"],
    image: "/images/stores/KISSIMY.png",
    compatible_toile_types: ['ORCH'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 4830, max_projection: 3000, allowed_colors: ['9010', '1015', '7016'] },
    arm_type: 'standard',
    wind_class: 'classe_2',
    armLogic: 'standard_2',
    minWidths: { 1500: 1835, 1750: 2085, 2000: 2335, 2500: 2835, 3000: 3355 },
    buyPrices: {
    1500: [{ maxW: 2470, priceHT: 1010 }, { maxW: 3650, priceHT: 1047 }, { maxW: 4830, priceHT: 1081 }],
    1750: [{ maxW: 2470, priceHT: 1039 }, { maxW: 3650, priceHT: 1085 }, { maxW: 4830, priceHT: 1126 }],
    2000: [{ maxW: 2470, priceHT: 1064 }, { maxW: 3650, priceHT: 1116 }, { maxW: 4830, priceHT: 1156 }],
    2500: [{ maxW: 3650, priceHT: 1165 }, { maxW: 4830, priceHT: 1225 }],
    3000: [{ maxW: 3650, priceHT: 1224 }, { maxW: 4830, priceHT: 1295 }]
    },
    ceilingMountPrices: [
      { maxW: 4830, price: 39 }  // Forfait fixe peu importe la dimension
    ],
    salesCoefficient: 1,  // Marge réduite pour l'entrée de gamme promo
    optionsCoefficients: {
      LED_ARMS: 1,
      LED_CASSETTE: 1,
      LAMBREQUIN_FIXE: 1,
      LAMBREQUIN_ENROULABLE: 1,
      CEILING_MOUNT: 1,
      AUVENT: 1,
      FABRIC: 1,
      FRAME_COLOR_CUSTOM: 1,
      INSTALLATION: 1
    },
    deliveryType: 'ready_to_install',
    deliveryNote: "Store livré fini, toile réglée et prêt à poser",
    colorStrategy: 'PROMO_LIMITED',  // Blanc/Beige/Gris inclus, reste +200€
    dimensions_techniques: {
      encombrement: {
        hauteur_coffre_cm: 22,
        profondeur_coffre_cm: 24,
        hauteur_totale_utile_cm: 30
      },
      inclinaison: {
        angle_min_degres: 5,
        angle_max_degres: 35,
        angle_usine_defaut: 15
      }
    }
  },

  // --- 2. KITANGUY - STORAL COMPACT + (Page 34-35) ---
  // Tarifs mis à jour le 19/02/2026
  "kitanguy": {
    id: "kitanguy",
    slug: "store-banne-coffre-compact-renforce",
    name: "STORAL COMPACT +",
    marketingRange: "GAMME_COMPACT",
    type: "coffre",
    shape: "galbe",
    is_promo: false,
    description: "Le best-seller polyvalent jusqu'à 3.25m d'avancée. LED disponibles intégrées dans les bras.",
    features: ["Robuste", "Polyvalent", "LED intégrées dans les bras (option)"],
    image: "/images/stores/KITANGUY.png",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 5850, max_projection: 3250 },
    arm_type: 'standard',
    wind_class: 'classe_2',
    armLogic: 'standard_2',
    minWidths: { 1500: 1895, 1750: 2145, 2000: 2395, 2500: 2895, 3000: 3415, 3250: 3645 },
  buyPrices: {
    1500: [{ maxW: 2470, priceHT: 1353 }, { maxW: 3650, priceHT: 1435 }, { maxW: 4830, priceHT: 1561 }, { maxW: 5610, priceHT: 1657 }, { maxW: 5850, priceHT: 1794 }],
    1750: [{ maxW: 2470, priceHT: 1389 }, { maxW: 3650, priceHT: 1478 }, { maxW: 4830, priceHT: 1613 }, { maxW: 5610, priceHT: 1712 }, { maxW: 5850, priceHT: 1852 }],
    2000: [{ maxW: 2470, priceHT: 1428 }, { maxW: 3650, priceHT: 1516 }, { maxW: 4830, priceHT: 1660 }, { maxW: 5610, priceHT: 1765 }, { maxW: 5850, priceHT: 1904 }],
    2500: [{ maxW: 3650, priceHT: 1577 }, { maxW: 4830, priceHT: 1735 }, { maxW: 5610, priceHT: 1879 }, { maxW: 5850, priceHT: 2033 }],
    3000: [{ maxW: 3650, priceHT: 1649 }, { maxW: 4830, priceHT: 1822 }, { maxW: 5610, priceHT: 2024 }, { maxW: 5850, priceHT: 2186 }],
    3250: [{ maxW: 4830, priceHT: 1735 }, { maxW: 5610, priceHT: 1917 }, { maxW: 5850, priceHT: 2148 }]
    },
    ceilingMountPrices: [
      { maxW: 5850, price: 39 }  // Forfait fixe peu importe la dimension
    ],
    salesCoefficient: 1,  // Coefficient standard
    optionsCoefficients: {
      LED_ARMS: 1,
      LED_CASSETTE: 1,
      LAMBREQUIN_FIXE: 1,
      LAMBREQUIN_ENROULABLE: 1,
      CEILING_MOUNT: 1,
      AUVENT: 1,
      FABRIC: 1,
      FRAME_COLOR_CUSTOM: 1,
      INSTALLATION: 1
    },
    deliveryType: 'ready_to_install',
    deliveryNote: "Store livré fini, toile réglée et prêt à poser",
    colorStrategy: 'STANDARD_ALL',  // Toutes couleurs incluses
    dimensions_techniques: {
      encombrement: {
        hauteur_coffre_cm: 22,
        profondeur_coffre_cm: 24,
        hauteur_totale_utile_cm: 30
      },
      inclinaison: {
        angle_min_degres: 5,
        angle_max_degres: 35,
        angle_usine_defaut: 15
      }
    }
  },

  // --- 3. KITANGUY 2 - STORAL EXCELLENCE (Page 36) ---
  // Tarifs mis à jour le 19/02/2026
  "kitanguy_2": {
    id: "kitanguy_2",
    slug: "store-banne-coffre-excellence-led",
    name: "STORAL EXCELLENCE",
    marketingRange: "GAMME_EXCELLENCE",
    type: "coffre",
    shape: "galbe",
    is_promo: false,
    description: "Design premium avec LED encastrées dans le coffre ET intégrées dans les bras (option). Double éclairage pour une ambiance unique.",
    features: ["Nouveau Design", "LED coffre encastrées", "LED bras intégrées (option)"],
    image: "/images/stores/KITANGUY_2.png",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: true, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 5850, max_projection: 3250 },
    arm_type: 'standard',
    wind_class: 'classe_2',
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
      { maxW: 5850, price: 39 }  // Forfait fixe peu importe la dimension
    ],
    ledCoffretPrice: 362,  // Prix LED coffre spécifique pour ce modèle
    salesCoefficient: 1,  // Haut de gamme
    optionsCoefficients: {
      LED_ARMS: 1,
      LED_CASSETTE: 1,
      LAMBREQUIN_FIXE: 1,
      LAMBREQUIN_ENROULABLE: 1,
      CEILING_MOUNT: 1,
      AUVENT: 1,
      FABRIC: 1,
      FRAME_COLOR_CUSTOM: 1,
      INSTALLATION: 1
    },
    deliveryType: 'ready_to_install',
    deliveryNote: "Store livré fini, toile réglée et prêt à poser",
    colorStrategy: 'STANDARD_ALL',  // Toutes couleurs incluses
    deliveryWarningThreshold: 6000,  // Alerte si > 6m (bien que max soit 5850mm)
    dimensions_techniques: {
      encombrement: {
        hauteur_coffre_cm: 24,
        profondeur_coffre_cm: 26,
        hauteur_totale_utile_cm: 32
      },
      inclinaison: {
        angle_min_degres: 5,
        angle_max_degres: 35,
        angle_usine_defaut: 15
      }
    }
  },

  // --- 4. HELIOM - STORAL KUBE (Page 38) ---
  // Tarifs mis à jour le 19/02/2026
  "heliom": {
    id: "heliom",
    slug: "store-banne-coffre-rectangulaire-kube",
    name: "STORAL KUBE",
    marketingRange: "GAMME_KUBE",
    type: "coffre",
    shape: "carre",
    is_promo: false,
    description: "Design cubique ultra-tendance pour architecture moderne. LED encastrées dans le coffre ET intégrées dans les bras (option).",
    features: ["Coffre Carré", "LED coffre encastrées", "LED bras intégrées (option)"],
    image: "/images/stores/HELIOM.png",
    compatible_toile_types: ['ORCH', 'ORCH_MAX', 'SATT'],
    compatibility: { led_arms: true, led_box: true, lambrequin_fixe: false, lambrequin_enroulable: false, max_width: 6000, max_projection: 3500 },
    arm_type: 'standard',
    wind_class: 'classe_2',
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
      { maxW: 2400, price: 307 }, { maxW: 3580, price: 307 }, { maxW: 4200, price: 460 },
      { maxW: 5290, price: 460 }, { maxW: 6000, price: 460 }
    ],
    ledCoffretPrice: 362,  // Prix LED coffre spécifique pour ce modèle
    salesCoefficient: 1,  // Design premium
    optionsCoefficients: {
      LED_ARMS: 1,
      LED_CASSETTE: 1,
      LAMBREQUIN_FIXE: 1,
      LAMBREQUIN_ENROULABLE: 1,
      CEILING_MOUNT: 1,
      AUVENT: 1,
      FABRIC: 1,
      FRAME_COLOR_CUSTOM: 1,
      INSTALLATION: 1
    },
    deliveryType: 'ready_to_install',
    deliveryNote: "Store livré fini, toile réglée et prêt à poser",
    colorStrategy: 'STANDARD_ALL',  // Toutes couleurs incluses
    dimensions_techniques: {
      encombrement: {
        hauteur_coffre_cm: 25,
        profondeur_coffre_cm: 27,
        hauteur_totale_utile_cm: 32
      },
      inclinaison: {
        angle_min_degres: 5,
        angle_max_degres: 35,
        angle_usine_defaut: 15
      }
    }
  },

  // --- 5. HELIOM PLUS - STORAL KUBE + (Page 38) ---
  // Tarifs mis à jour le 19/02/2026
  "heliom_plus": {
    id: "heliom_plus",
    slug: "store-banne-design-architecte-kube",
    name: "STORAL KUBE +",
    marketingRange: "GAMME_KUBE",
    type: "coffre",
    shape: "carre",
    is_promo: false,
    description: "Version renforcée jusqu'à 4m d'avancée avec lambrequin enroulable. LED encastrées dans le coffre ET intégrées dans les bras (option).",
    features: ["Avancée 4m", "LED coffre + bras (option)", "Lambrequin Enroulable"],
    image: "/images/stores/HELIOM.png",
    compatible_toile_types: ['ORCH', 'ORCH_MAX', 'SATT'],
    compatibility: { led_arms: true, led_box: true, lambrequin_fixe: false, lambrequin_enroulable: true, max_width: 6000, max_projection: 4000 },
    arm_type: 'standard',
    wind_class: 'classe_2',
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
      { maxW: 2400, price: 307 }, { maxW: 3580, price: 307 }, { maxW: 4200, price: 460 },
      { maxW: 5290, price: 460 }, { maxW: 6000, price: 460 }
    ],
    lambrequinEnroulablePrices: {
      manual: [
        { maxW: 2400, price: 358 },
        { maxW: 3580, price: 416 },
        { maxW: 4200, price: 451 },
        { maxW: 5290, price: 650 },
        { maxW: 6000, price: 667 }
      ],
      motorized: [
        { maxW: 2400, price: 598 },
        { maxW: 3580, price: 656 },
        { maxW: 4200, price: 683 },
        { maxW: 5290, price: 892 },
        { maxW: 6000, price: 912 }
      ]
    },
    ledCoffretPrice: 362,  // Prix LED coffre spécifique pour ce modèle
    salesCoefficient: 1,  // Design premium avec lambrequin
    optionsCoefficients: {
      LED_ARMS: 1,
      LED_CASSETTE: 1,
      LAMBREQUIN_FIXE: 1,
      LAMBREQUIN_ENROULABLE: 1,
      CEILING_MOUNT: 1,
      AUVENT: 1,
      FABRIC: 1,
      FRAME_COLOR_CUSTOM: 1,
      INSTALLATION: 1
    },
    deliveryType: 'ready_to_install',
    deliveryNote: "Store livré fini, toile réglée et prêt à poser",
    colorStrategy: 'STANDARD_ALL',  // Toutes couleurs incluses
    deliveryWarningThreshold: 6000  // Alerte si > 6m
  },

  // --- 6. KALY'O - STORAL K (Page 44) ---
  // Tarifs mis à jour le 19/02/2026
  "kalyo": {
    id: "kalyo",
    slug: "store-banne-carre-coffre-compact",
    name: "STORAL K",
    marketingRange: "GAMME_KARE_COMPACT",
    type: "coffre",
    shape: "carre",
    is_promo: false,
    description: "La nouveauté 2026. Polyvalent avec lambrequin enroulable optionnel. LED intégrées dans les bras (option).",
    features: ["Nouveauté", "Lambrequin Optionnel", "LED bras intégrées (option)"],
    image: "/images/stores/KALY_O.png",
    compatible_toile_types: ['ORCH', 'ORCH_MAX', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: true, max_width: 6000, max_projection: 3500 },
    arm_type: 'standard',
    wind_class: 'classe_2',
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
      { maxW: 2400, price: 140 }, { maxW: 3580, price: 140 }, { maxW: 4760, price: 239 },
      { maxW: 5610, price: 239 }, { maxW: 6000, price: 239 }
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
    },
    salesCoefficient: 1,  // Standard rénovation
    optionsCoefficients: {
      LED_ARMS: 1,
      LED_CASSETTE: 1,
      LAMBREQUIN_FIXE: 1,
      LAMBREQUIN_ENROULABLE: 1,
      CEILING_MOUNT: 1,
      AUVENT: 1,
      FABRIC: 1,
      FRAME_COLOR_CUSTOM: 1,
      INSTALLATION: 1
    },
    deliveryType: 'ready_to_install',
    deliveryNote: "Store livré fini, toile réglée et prêt à poser",
    colorStrategy: 'STANDARD_ALL',  // Toutes couleurs incluses
    deliveryWarningThreshold: 6000,  // Alerte si > 6m
    dimensions_techniques: {
      encombrement: {
        hauteur_coffre_cm: 24,
        profondeur_coffre_cm: 25,
        hauteur_totale_utile_cm: 30
      },
      inclinaison: {
        angle_min_degres: 5,
        angle_max_degres: 35,
        angle_usine_defaut: 15
      }
    }
  },
  // RÈGLE IMPORTANTE : Largeur <6m = Prix PROMO + Couleurs limitées (9010, 1015, 7016)
  //                    Largeur ≥6m = Prix STANDARD + Toutes couleurs incluses
  // Tarifs mis à jour le 19/02/2026
  "dynasta": {
    id: "dynasta",
    slug: "store-banne-grande-largeur-armor",
    name: "STORAL ARMOR",
    marketingRange: "GAMME_ARMOR",
    type: "coffre",
    shape: "galbe",
    is_promo: false, // Promo dynamique selon largeur
    description: "Le géant des terrasses, jusqu'à 12m de large. Bras ultra-renforcés certifiés Classe 2 (NF EN 13561). LED intégrées dans les bras (option).",
    features: ["Jusqu'à 12m", "Bras Ultra-Renforcés", "LED bras intégrées (option)"],
    image: "/images/stores/DYNASTA.png",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 12000, max_projection: 4000, allowed_colors: ['9010', '1015', '7016'] },
    arm_type: 'ultra_renforce',
    wind_class: 'classe_2',
    armLogic: 'couples_4_6',
    minWidths: { 1500: 2050, 2000: 2550, 2500: 3130, 2750: 3380, 3000: 3630, 3250: 3880, 3500: 4130, 4000: 4630 },
    buyPrices: {
     1500: [{ maxW: 4760, priceHT: 1650 }, { maxW: 5610, priceHT: 1741 }, { maxW: 6000, priceHT: 1775 }, { maxW: 7110, priceHT: 2744 }, { maxW: 8280, priceHT: 3204 }, { maxW: 9450, priceHT: 3284 }, { maxW: 10620, priceHT: 3577 }, { maxW: 11220, priceHT: 3747 }, { maxW: 12000, priceHT: 3961 }],
     2000: [{ maxW: 4760, priceHT: 19710 }, { maxW: 5610, priceHT: 1814 }, { maxW: 6000, priceHT: 1865 }, { maxW: 7110, priceHT: 2841 }, { maxW: 8280, priceHT: 3317 }, { maxW: 9450, priceHT: 3409 }, { maxW: 10620, priceHT: 3717 }, { maxW: 11220, priceHT: 3898 }, { maxW: 12000, priceHT: 4126 }],
     2500: [{ maxW: 4760, priceHT: 1789 }, { maxW: 5610, priceHT: 1907 }, { maxW: 6000, priceHT: 1966 }, { maxW: 7110, priceHT: 2975 }, { maxW: 8280, priceHT: 3460 }, { maxW: 9450, priceHT: 3569 }, { maxW: 10620, priceHT: 3886 }, { maxW: 11220, priceHT: 4083 }, { maxW: 12000, priceHT: 4326 }],
     2750: [{ maxW: 4760, priceHT: 1812 }, { maxW: 5610, priceHT: 1934 }, { maxW: 6000, priceHT: 2005 }, { maxW: 7110, priceHT: 3012 }, { maxW: 8280, priceHT: 3506 }, { maxW: 9450, priceHT: 3617 }, { maxW: 10620, priceHT: 3944 }, { maxW: 11220, priceHT: 4145 }, { maxW: 12000, priceHT: 4396 }],
     3000: [{ maxW: 4760, priceHT: 1855 }, { maxW: 5610, priceHT: 1983 }, { maxW: 6000, priceHT: 2068 }, { maxW: 7110, priceHT: 3087 }, { maxW: 8280, priceHT: 3587 }, { maxW: 9450, priceHT: 3703 }, { maxW: 10620, priceHT: 4038 }, { maxW: 11220, priceHT: 4248 }, { maxW: 12000, priceHT: 4515 }],
     3250: [{ maxW: 4760, priceHT: 1977 }, { maxW: 5610, priceHT: 2111 }, { maxW: 6000, priceHT: 2202 }, { maxW: 7110, priceHT: 3336 }, { maxW: 8280, priceHT: 3769 }, { maxW: 9450, priceHT: 3917 }, { maxW: 10620, priceHT: 4274 }, { maxW: 11220, priceHT: 4478 }, { maxW: 12000, priceHT: 4746 }],
     3500: [{ maxW: 4760, priceHT: 2017 }, { maxW: 5610, priceHT: 2156 }, { maxW: 6000, priceHT: 2253 }, { maxW: 7110, priceHT: 3362 }, { maxW: 8280, priceHT: 3809 }, { maxW: 9450, priceHT: 3990 }, { maxW: 10620, priceHT: 4350 }, { maxW: 11220, priceHT: 4562 }, { maxW: 12000, priceHT: 4839 }],
     4000: [{ maxW: 4760, priceHT: 2115 }, { maxW: 5610, priceHT: 2268 }, { maxW: 6000, priceHT: 2277 }, { maxW: 7110, priceHT: 3451 }, { maxW: 8280, priceHT: 3896 }, { maxW: 9450, priceHT: 4169 }, { maxW: 10620, priceHT: 4545 }, { maxW: 11220, priceHT: 4767 }, { maxW: 12000, priceHT: 5057 }] 
   },
    ceilingMountPrices: [
      { maxW: 4760, price: 544 }, { maxW: 5610, price: 544 }, { maxW: 6000, price: 573 },
      { maxW: 7110, price: 791 }, { maxW: 8280, price: 1056 }, { maxW: 9450, price: 1072 },
      { maxW: 10620, price: 1072 }, { maxW: 11220, price: 1225 }, { maxW: 12000, price: 1294 }
    ],
    salesCoefficient: 1,  // Standard
    optionsCoefficients: {
      LED_ARMS: 1,
      LAMBREQUIN_FIXE: 1,
      CEILING_MOUNT: 1,
      FABRIC: 1,
      INSTALLATION: 1,
      LED_CASSETTE: 1,
      LAMBREQUIN_ENROULABLE: 1,
      AUVENT: 1,
      FRAME_COLOR_CUSTOM: 1
    },
    deliveryType: 'ready_up_to_6m',
    deliveryNote: "Store livré fini, toile réglée et prêt à poser jusqu'à 6m. Au-delà, livré en 2 parties.",
    colorStrategy: 'HYBRID_ARMOR',  // < 6m: +200€ si non standard, ≥ 6m: inclus
    promoWidthThreshold: 6000,  // Seuil de bascule tarifaire
    deliveryWarningThreshold: 6000,  // Alerte livraison 2 parties
    dimensions_techniques: {
      encombrement: {
        hauteur_coffre_cm: 26,
        profondeur_coffre_cm: 28,
        hauteur_totale_utile_cm: 35
      },
      inclinaison: {
        angle_min_degres: 5,
        angle_max_degres: 35,
        angle_usine_defaut: 15
      }
    }
  },

  // --- 8. BELHARRA - STORAL ARMOR + (Page 40) ---
  // Tarifs mis à jour le 19/02/2026
  "belharra": {
    id: "belharra",
    slug: "store-banne-coffre-armor-design",
    name: "STORAL ARMOR +",
    marketingRange: "GAMME_ARMOR",
    type: "coffre",
    shape: "galbe",
    is_promo: false,
    description: "Le haut de gamme absolu jusqu'à 12m. Bras ultra-renforcés certifiés Classe 2 (NF EN 13561). LED intégrées dans les bras (option).",
    features: ["Jusqu'à 12m", "Finition Luxe", "LED bras intégrées (option)"],
    image: "/images/stores/BELHARRA.png",
    compatible_toile_types: ['ORCH','SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: true, max_width: 12000, max_projection: 4000 },
    arm_type: 'ultra_renforce',
    wind_class: 'classe_2',
    armLogic: 'couples_4_6',
    minWidths: { 1500: 2400, 2000: 2050, 2500: 3130, 2750: 3380, 3000: 3630, 3250: 3880, 3500: 4130, 4000: 4630 },
    buyPrices: {
      1500: [
        { maxW: 4760, priceHT: 1868 }, { maxW: 5610, priceHT: 1985 }, { maxW: 6000, priceHT: 2037 }, // Belharra Promo
        { maxW: 7110, priceHT: 3073 }, { maxW: 8280, priceHT: 3588 }, { maxW: 9450, priceHT: 3678 }, // Belharra Standard
        { maxW: 10620, priceHT: 4008 }, { maxW: 11220, priceHT: 4197 }, { maxW: 12000, priceHT: 4433 }
      ],
      2000: [
        { maxW: 4760, priceHT: 1937 }, { maxW: 5610, priceHT: 2067 }, { maxW: 6000, priceHT: 2133 }, // Belharra Promo
        { maxW: 7110, priceHT: 3183 }, { maxW: 8280, priceHT: 3714 }, { maxW: 9450, priceHT: 3817 }, // Belharra Standard
        { maxW: 10620, priceHT: 4163 }, { maxW: 11220, priceHT: 4365 }, { maxW: 12000, priceHT: 4621 }
      ],
      2500: [
        { maxW: 4760, priceHT: 2028 }, { maxW: 5610, priceHT: 2171 }, { maxW: 6000, priceHT: 2251 }, // Belharra Promo
        { maxW: 7110, priceHT: 3331 }, { maxW: 8280, priceHT: 3877 }, { maxW: 9450, priceHT: 3994 }, // Belharra Standard
        { maxW: 10620, priceHT: 4353 }, { maxW: 11220, priceHT: 4572 }, { maxW: 12000, priceHT: 4847 }
      ],
      2750: [
        { maxW: 4760, priceHT: 2055 }, { maxW: 5610, priceHT: 2203 }, { maxW: 6000, priceHT: 2292 }, // Belharra Promo
        { maxW: 7110, priceHT: 3373 }, { maxW: 8280, priceHT: 3924 }, { maxW: 9450, priceHT: 4050 }, // Belharra Standard
        { maxW: 10620, priceHT: 4418 }, { maxW: 11220, priceHT: 4643 }, { maxW: 12000, priceHT: 4924 }
      ],
      3000: [
        { maxW: 4760, priceHT: 2101 }, { maxW: 5610, priceHT: 2258 }, { maxW: 6000, priceHT: 2362 }, // Belharra Promo
        { maxW: 7110, priceHT: 3456 }, { maxW: 8280, priceHT: 4017 }, { maxW: 9450, priceHT: 4151 }, // Belharra Standard
        { maxW: 10620, priceHT: 4523 }, { maxW: 11220, priceHT: 4756 }, { maxW: 12000, priceHT: 5056 }
      ],
      3250: [
        { maxW: 4760, priceHT: 2239 }, { maxW: 5610, priceHT: 2474 }, { maxW: 6000, priceHT: 2592 }, // Belharra Promo
        { maxW: 7110, priceHT: 3740 }, { maxW: 8280, priceHT: 4220 }, { maxW: 9450, priceHT: 4389 }, // Belharra Standard
        { maxW: 10620, priceHT: 4787 }, { maxW: 11220, priceHT: 5015 }, { maxW: 12000, priceHT: 5318 }
      ],
      3500: [
        { maxW: 4760, priceHT: 2282 }, { maxW: 5610, priceHT: 2526 }, { maxW: 6000, priceHT: 2652 }, // Belharra Promo
        { maxW: 7110, priceHT: 3769 }, { maxW: 8280, priceHT: 4259 }, { maxW: 9450, priceHT: 4467 }, // Belharra Standard
        { maxW: 10620, priceHT: 4875 }, { maxW: 11220, priceHT: 5109 }, { maxW: 12000, priceHT: 5422 }
      ],
      4000: [
        { maxW: 4760, priceHT: 2396 }, { maxW: 5610, priceHT: 2651 }, { maxW: 6000, priceHT: 2792 }, // Belharra Promo
        { maxW: 7110, priceHT: 3866 }, { maxW: 8280, priceHT: 4330 }, { maxW: 9450, priceHT: 4670 }, // Belharra Standard
        { maxW: 10620, priceHT: 5090 }, { maxW: 11220, priceHT: 5343 }, { maxW: 12000, priceHT: 5668 }
      ]
    },
    ceilingMountPrices: [
      { maxW: 4760, price: 544 }, { maxW: 5610, price: 544 }, { maxW: 6000, price: 573 },
      { maxW: 7110, price: 791 }, { maxW: 8280, price: 1056 }, { maxW: 9450, price: 1072 },
      { maxW: 10620, price: 1072 }, { maxW: 11220, price: 1225 }, { maxW: 12000, price: 1294 }
    ],
    lambrequinEnroulablePrices: {
      manual: [],
      motorized: [
        { maxW: 4760, price: 715 }, { maxW: 5610, price: 892 }, { maxW: 6000, price: 912 }
      ]
    },
    salesCoefficient: 1,  // Premium
    optionsCoefficients: {
      LED_ARMS: 1,
      LED_CASSETTE: 1,
      LAMBREQUIN_FIXE: 1,
      LAMBREQUIN_ENROULABLE: 1,
      CEILING_MOUNT: 1,
      AUVENT: 1,
      FABRIC: 1,
      FRAME_COLOR_CUSTOM: 1,
      INSTALLATION: 1
    },
    deliveryType: 'ready_up_to_6m',
    deliveryNote: "Store livré fini, toile réglée et prêt à poser jusqu'à 6m. Au-delà, livré en 2 parties.",
    colorStrategy: 'HYBRID_ARMOR',  // < 6m: +200€ si non standard, ≥ 6m: inclus
    promoWidthThreshold: 6000,  // Seuil de bascule tarifaire
    deliveryWarningThreshold: 6000,  // Alerte livraison 2 parties
    dimensions_techniques: {
      encombrement: {
        hauteur_coffre_cm: 26,
        profondeur_coffre_cm: 28,
        hauteur_totale_utile_cm: 35
      },
      inclinaison: {
        angle_min_degres: 5,
        angle_max_degres: 35,
        angle_usine_defaut: 15
      }
    }
  },

  // --- 9. BELHARRA 2 - STORAL EXCELLENCE + (Bras SB100 Standard) ---
  // Tarifs mis à jour le 19/02/2026
  "belharra_2": {
    id: "belharra_2",
    slug: "store-banne-excellence-grandes-dimensions",
    name: "STORAL EXCELLENCE +",
    marketingRange: "GAMME_EXCELLENCE",
    type: "coffre",
    shape: "galbe",
    is_promo: false,
    description: "Store semi-coffre avec auvent intégré jusqu'à 12m. Bras ultra-renforcés certifiés Classe 2 (NF EN 13561). LED encastrées dans le coffre ET intégrées dans les bras (option).",
    features: ["Auvent Intégré", "LED coffre + bras (option)", "Jusqu'à 12m"],
    image: "/images/stores/BELHARRA_2.png",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: true, lambrequin_fixe: true, lambrequin_enroulable: true, max_width: 12000, max_projection: 4000 },
    arm_type: 'ultra_renforce',
    wind_class: 'classe_2',
    armLogic: 'couples_4_6',
    minWidths: { 1500: 2400, 2000: 2050, 2500: 3130, 2750: 3380, 3000: 3630, 3250: 3880, 3500: 4130, 4000: 4630 },
    buyPrices: {
      1500: [{ maxW: 2400, priceHT: 1666 }, { maxW: 3580, priceHT: 1932 }, { maxW: 4760, priceHT: 2269 }, { maxW: 5610, priceHT: 2507 }, { maxW: 6000, priceHT: 2673 }, { maxW: 7110, priceHT: 3371 }, { maxW: 8280, priceHT: 3936 }, { maxW: 9450, priceHT: 4035 }, { maxW: 10620, priceHT: 4397 }, { maxW: 11220, priceHT: 4605 }, { maxW: 12000, priceHT: 4863 }],
      2000: [{ maxW: 3580, priceHT: 1992 }, { maxW: 4760, priceHT: 2344 }, { maxW: 5610, priceHT: 2597 }, { maxW: 6000, priceHT: 2779 }, { maxW: 7110, priceHT: 3492 }, { maxW: 8280, priceHT: 4075 }, { maxW: 9450, priceHT: 4188 }, { maxW: 10620, priceHT: 4567 }, { maxW: 11220, priceHT: 4789 }, { maxW: 12000, priceHT: 5069 }],
      2500: [{ maxW: 3580, priceHT: 2073 }, { maxW: 4760, priceHT: 2445 }, { maxW: 5610, priceHT: 2711 }, { maxW: 6000, priceHT: 2908 }, { maxW: 7110, priceHT: 3655 }, { maxW: 8280, priceHT: 4254 }, { maxW: 9450, priceHT: 4382 }, { maxW: 10620, priceHT: 4775 }, { maxW: 11220, priceHT: 5016 }, { maxW: 12000, priceHT: 5318 }],
      2750: [{ maxW: 3580, priceHT: 2098 }, { maxW: 4760, priceHT: 2474 }, { maxW: 5610, priceHT: 2746 }, { maxW: 6000, priceHT: 2954 }, { maxW: 7110, priceHT: 3700 }, { maxW: 8280, priceHT: 4305 }, { maxW: 9450, priceHT: 4443 }, { maxW: 10620, priceHT: 4847 }, { maxW: 11220, priceHT: 5094 }, { maxW: 12000, priceHT: 5402 }],
      3000: [{ maxW: 4760, priceHT: 2524 }, { maxW: 5610, priceHT: 2806 }, { maxW: 6000, priceHT: 3030 }, { maxW: 7110, priceHT: 3791 }, { maxW: 8280, priceHT: 4407 }, { maxW: 9450, priceHT: 4554 }, { maxW: 10620, priceHT: 4962 }, { maxW: 11220, priceHT: 5217 }, { maxW: 12000, priceHT: 5547 }],
      3250: [{ maxW: 4760, priceHT: 2675 }, { maxW: 5610, priceHT: 3043 }, { maxW: 6000, priceHT: 3283 }, { maxW: 7110, priceHT: 4103 }, { maxW: 8280, priceHT: 4630 }, { maxW: 9450, priceHT: 4815 }, { maxW: 10620, priceHT: 5252 }, { maxW: 11220, priceHT: 5502 }, { maxW: 12000, priceHT: 5834 }],
      3500: [{ maxW: 4760, priceHT: 2723 }, { maxW: 5610, priceHT: 3101 }, { maxW: 6000, priceHT: 3348 }, { maxW: 7110, priceHT: 4135 }, { maxW: 8280, priceHT: 4673 }, { maxW: 9450, priceHT: 4901 }, { maxW: 10620, priceHT: 5349 }, { maxW: 11220, priceHT: 5606 }, { maxW: 12000, priceHT: 5948 }],
      4000: [{ maxW: 4760, priceHT: 2848 }, { maxW: 5610, priceHT: 3237 }, { maxW: 6000, priceHT: 3502 }, { maxW: 7110, priceHT: 4241 }, { maxW: 8280, priceHT: 4751 }, { maxW: 9450, priceHT: 5123 }, { maxW: 10620, priceHT: 5584 }, { maxW: 11220, priceHT: 5862 }, { maxW: 12000, priceHT: 6218 }]
    },
    ceilingMountPrices: [
      { maxW: 3580, price: 388 },{ maxW: 5610, price: 544 },{ maxW: 6000, price: 573 }, { maxW: 7110, price: 791 }, { maxW: 8280, price: 1056 }, { maxW: 10620, price: 1072 }, { maxW: 11220, price: 1225 }, { maxW: 12000, price: 1294 }
    ],
    lambrequinEnroulablePrices: {
      manual: [],
      motorized: [{ maxW: 2400, price: 476 }, { maxW: 3580, price: 631 }, { maxW: 4760, price: 688 }, { maxW: 5610, price: 859 }, { maxW: 6000, price: 878 }]
    },
    ledCoffretPrice: 362,  // Prix LED coffre spécifique pour ce modèle
    salesCoefficient: 1,  // Très haut de gamme
    optionsCoefficients: {
      LED_ARMS: 1,
      LED_CASSETTE: 1,
      LAMBREQUIN_FIXE: 1,
      LAMBREQUIN_ENROULABLE: 1,
      CEILING_MOUNT: 1,
      AUVENT: 1,
      FABRIC: 1,
      FRAME_COLOR_CUSTOM: 1,
      INSTALLATION: 1
    },
    deliveryType: 'ready_up_to_6m',
    deliveryNote: "Store livré fini, toile réglée et prêt à poser jusqu'à 6m. Au-delà, livré en 2 parties.",
    colorStrategy: 'STANDARD_ALL',  // Toutes couleurs incluses
    deliveryWarningThreshold: 6000,  // Alerte si > 6m
    dimensions_techniques: {
      encombrement: {
        hauteur_coffre_cm: 28,
        profondeur_coffre_cm: 30,
        hauteur_totale_utile_cm: 35
      },
      inclinaison: {
        angle_min_degres: 5,
        angle_max_degres: 35,
        angle_usine_defaut: 15
      }
    }
  },

  // --- 10. ANTIBES - STORAL CLASSIQUE (Monobloc Standard) ---
  // Tarifs mis à jour le 19/02/2026
  "antibes": {
    id: "antibes",
    slug: "store-banne-coffre-traditionnel-antibes",
    name: "STORAL CLASSIQUE",
    marketingRange: "GAMME_CLASSIQUE",
    type: "monobloc",
    is_promo: false,
    description: "Store monobloc sans coffre avec tube carré 40×40 jusqu'à 12m. Solution économique et compacte avec lambrequin fixe compris. LED intégrées dans les bras, auvent et joues (options).",
    features: ["Jusqu'à 12m", "Lambrequin fixe compris", "LED bras intégrées (option)", "Auvent et Joues (option)"],
    image: "/images/stores/store_monobloc.png",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 12000, max_projection: 3000 },
    arm_type: 'standard',
    wind_class: 'classe_2',
    armLogic: 'standard_2',
    minWidths: { 1500: 2390, 1750: 2390, 2000: 2390, 2500: 3570, 3000: 4750 },
    buyPrices: {
      1500: [
        { maxW: 2390, priceHT: 1019 }, { maxW: 3570, priceHT: 1253 }, { maxW: 4750, priceHT: 1122 }, 
        { maxW: 5610, priceHT: 1409 }, { maxW: 6000, priceHT: 1529 }, { maxW: 7110, priceHT: 1989 }, 
        { maxW: 8280, priceHT: 2140 }, { maxW: 9450, priceHT: 2333 }, { maxW: 10790, priceHT: 2501 }, 
        { maxW: 11220, priceHT: 2663 }, { maxW: 12000, priceHT: 2777 }
      ],
      1750: [
        { maxW: 2390, priceHT: 1027 }, { maxW: 3570, priceHT: 1131 }, { maxW: 4750, priceHT: 1260 }, 
        { maxW: 5610, priceHT: 1416 }, { maxW: 6000, priceHT: 1540 }, { maxW: 7110, priceHT: 1992 }, 
        { maxW: 8280, priceHT: 2146 }, { maxW: 9450, priceHT: 2341 }, { maxW: 10790, priceHT: 2507 }, 
        { maxW: 11220, priceHT: 2670 }, { maxW: 12000, priceHT: 2784 }
      ],
      2000: [
        { maxW: 2390, priceHT: 1032 }, { maxW: 3570, priceHT: 1137 }, { maxW: 4750, priceHT: 1268 }, 
        { maxW: 5610, priceHT: 1421 }, { maxW: 6000, priceHT: 1546 }, { maxW: 7110, priceHT: 2007 }, 
        { maxW: 8280, priceHT: 2160 }, { maxW: 9450, priceHT: 2355 }, { maxW: 10790, priceHT: 2517 }, 
        { maxW: 11220, priceHT: 2681 }, { maxW: 12000, priceHT: 2800 }
      ],
      2500: [
        { maxW: 3570, priceHT: 1144 }, { maxW: 4750, priceHT: 1272 }, { maxW: 5610, priceHT: 1426 }, 
        { maxW: 6000, priceHT: 1554 }, { maxW: 7110, priceHT: 2035 }, { maxW: 8280, priceHT: 2186 }, 
        { maxW: 9450, priceHT: 2376 }, { maxW: 10790, priceHT: 2543 }, { maxW: 11220, priceHT: 2705 }, 
        { maxW: 12000, priceHT: 2826 }
      ],
      3000: [
        { maxW: 4750, priceHT: 1293 }, { maxW: 5610, priceHT: 1447 }, { maxW: 6000, priceHT: 1572 }, 
        { maxW: 7110, priceHT: 2072 }, { maxW: 8280, priceHT: 2416 }, { maxW: 9450, priceHT: 2226 }, 
        { maxW: 10790, priceHT: 2585 }, { maxW: 11220, priceHT: 2748 }, { maxW: 12000, priceHT: 2872 }
      ]
    },
    ceilingMountPrices: [
      { maxW: 4750, price: 28 }, { maxW: 5610, price: 42 }, { maxW: 6000, price: 45 },
      { maxW: 7110, price: 55 }, { maxW: 11220, price: 81 }, { maxW: 12000, price: 84 }
    ],
    auventEtJouesPrices: [
      { maxW: 2390, price: 218 }, { maxW: 3570, price: 279 }, { maxW: 4750, price: 298 },
      { maxW: 5610, price: 318 }, { maxW: 6000, price: 377 }, { maxW: 7110, price: 493 },
      { maxW: 8280, price: 586 }, { maxW: 9450, price: 544 }, { maxW: 10790, price: 667 },
      { maxW: 11220, price: 704 }, { maxW: 12000, price: 729 }
    ],
    salesCoefficient: 1,  // Standard monobloc
    optionsCoefficients: {
      LED_ARMS: 1,
      LED_CASSETTE: 1,
      LAMBREQUIN_FIXE: 1,
      LAMBREQUIN_ENROULABLE: 1,
      CEILING_MOUNT: 1,
      AUVENT: 1,
      FABRIC: 1,
      FRAME_COLOR_CUSTOM: 1,
      INSTALLATION: 1
    },
    deliveryType: 'ready_to_install',
    deliveryNote: "Store livré fini, toile réglée et prêt à poser. Surtaxe transport pour stores > 3.65m.",
    colorStrategy: 'STANDARD_ALL',  // Toutes couleurs incluses
    deliveryWarningThreshold: 3650  // Alerte et surtaxe transport si > 3.65m
  },

  // --- 11. MADRID - STORAL CLASSIQUE + (Monobloc Standard) ---
  // Tarifs mis à jour le 19/02/2026
  "madrid": {
    id: "madrid",
    slug: "store-banne-coffre-robuste-madrid",
    name: "STORAL CLASSIQUE +",
    marketingRange: "GAMME_CLASSIQUE",
    type: "monobloc",
    is_promo: false,
    description: "Store monobloc sans coffre avec tube carré 40×40 jusqu'à 18m. Bras renforcés. LED intégrées dans les bras, auvent et joues, lambrequin déroulant (options).",
    features: ["Jusqu'à 18m", "Tube carré 40×40", "LED bras intégrées (option)", "Auvent et Joues (option)", "Lambrequin déroulant (option)"],
    image: "/images/stores/store semi coffre.png",
    compatible_toile_types: ['ORCH', 'ORCH_MAX', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: true, max_width: 18000, max_projection: 4000 },
    arm_type: 'renforce',
    wind_class: 'classe_2',
    armLogic: 'couples_4_6',
    minWidths: { 1500: 2390, 2000: 2390, 2500: 3570, 3000: 3570, 3500: 4750, 4000: 4750 },
    buyPrices: {
      1500: [
        { maxW: 2390, priceHT: 1053 }, { maxW: 3570, priceHT: 1185 }, { maxW: 4750, priceHT: 1308 }, 
        { maxW: 5610, priceHT: 1458 }, { maxW: 6000, priceHT: 1588 }, { maxW: 7110, priceHT: 2123 }, 
        { maxW: 8280, priceHT: 2265 }, { maxW: 9450, priceHT: 2442 }, { maxW: 10790, priceHT: 2584 }, 
        { maxW: 11220, priceHT: 2755 }, { maxW: 12000, priceHT: 2887 }, { maxW: 12970, priceHT: 3417 }, 
        { maxW: 14140, priceHT: 3506 }, { maxW: 15310, priceHT: 3742 }, { maxW: 16480, priceHT: 3841 }, 
        { maxW: 16830, priceHT: 3938 }, { maxW: 18000, priceHT: 4132 }
      ],
      2000: [
        { maxW: 2390, priceHT: 1094 }, { maxW: 3570, priceHT: 1241 }, { maxW: 4750, priceHT: 1383 }, 
        { maxW: 5610, priceHT: 1548 }, { maxW: 6000, priceHT: 1691 }, { maxW: 7110, priceHT: 2263 }, 
        { maxW: 8280, priceHT: 2419 }, { maxW: 9450, priceHT: 2612 }, { maxW: 10790, priceHT: 2776 }, 
        { maxW: 11220, priceHT: 2962 }, { maxW: 12000, priceHT: 3097 }, { maxW: 12970, priceHT: 3651 }, 
        { maxW: 14140, priceHT: 3766 }, { maxW: 15310, priceHT: 4017 }, { maxW: 16480, priceHT: 4132 }, 
        { maxW: 16830, priceHT: 4246 }, { maxW: 18000, priceHT: 4444 }
      ],
      2500: [
        { maxW: 3570, priceHT: 1320 }, { maxW: 4750, priceHT: 1479 }, { maxW: 5610, priceHT: 1655 }, 
        { maxW: 6000, priceHT: 1821 }, { maxW: 7110, priceHT: 2451 }, { maxW: 8280, priceHT: 2625 }, 
        { maxW: 9450, priceHT: 2839 }, { maxW: 10790, priceHT: 3020 }, { maxW: 11220, priceHT: 3223 }, 
        { maxW: 12000, priceHT: 3358 }, { maxW: 12970, priceHT: 3978 }, { maxW: 14140, priceHT: 4112 }, 
        { maxW: 15310, priceHT: 4381 }, { maxW: 16480, priceHT: 4514 }, { maxW: 16830, priceHT: 4645 }, 
        { maxW: 18000, priceHT: 4849 }
      ],
      3000: [
        { maxW: 3570, priceHT: 1387 }, { maxW: 4750, priceHT: 1564 }, { maxW: 5610, priceHT: 1754 }, 
        { maxW: 6000, priceHT: 1932 }, { maxW: 7110, priceHT: 2586 }, { maxW: 8280, priceHT: 2777 }, 
        { maxW: 9450, priceHT: 3007 }, { maxW: 10790, priceHT: 3207 }, { maxW: 11220, priceHT: 3427 }, 
        { maxW: 12000, priceHT: 3568 }, { maxW: 12970, priceHT: 4211 }, { maxW: 14140, priceHT: 4360 }, 
        { maxW: 15310, priceHT: 4650 }, { maxW: 16480, priceHT: 4799 }, { maxW: 16830, priceHT: 4947 }, 
        { maxW: 18000, priceHT: 5153 }
      ],
      3500: [
        { maxW: 4750, priceHT: 1676 }, { maxW: 5610, priceHT: 1882 }, { maxW: 6000, priceHT: 2078 }, 
        { maxW: 7110, priceHT: 2681 }, { maxW: 8280, priceHT: 2979 }, { maxW: 9450, priceHT: 3253 }, 
        { maxW: 10790, priceHT: 3469 }, { maxW: 11220, priceHT: 3705 }, { maxW: 12000, priceHT: 3853 }, 
        { maxW: 12970, priceHT: 4554 }, { maxW: 14140, priceHT: 4719 }, { maxW: 15310, priceHT: 5029 }, 
        { maxW: 16480, priceHT: 5197 }, { maxW: 16830, priceHT: 5364 }, { maxW: 18000, priceHT: 5581 }
      ],
      4000: [
        { maxW: 4750, priceHT: 1857 }, { maxW: 5610, priceHT: 2075 }, { maxW: 6000, priceHT: 2298 }, 
        { maxW: 7110, priceHT: 2914 }, { maxW: 8280, priceHT: 3117 }, { maxW: 9450, priceHT: 3583 }, 
        { maxW: 10790, priceHT: 3821 }, { maxW: 11220, priceHT: 4074 }, { maxW: 12000, priceHT: 4230 }, 
        { maxW: 12970, priceHT: 4801 }, { maxW: 14140, priceHT: 5215 }, { maxW: 15310, priceHT: 5542 }, 
        { maxW: 16480, priceHT: 5725 }, { maxW: 16830, priceHT: 5904 }, { maxW: 18000, priceHT: 6145 }
      ]
    },
    ceilingMountPrices: [
      { maxW: 3570, price: 20 }, { maxW: 6000, price: 50 }, { maxW: 7110, price: 59 },
      { maxW: 10635, price: 70 }, { maxW: 12000, price: 73 }, { maxW: 14140, price: 99 },
      { maxW: 18000, price: 102 }
    ],
    lambrequinEnroulablePrices: {
      manual: [
        { maxW: 2390, price: 321 }, { maxW: 3570, price: 437 }, { maxW: 4750, price: 524 },
        { maxW: 5610, price: 610 }, { maxW: 6000, price: 653 }
      ],
      motorized: [
        { maxW: 2390, price: 576 }, { maxW: 3570, price: 723 }, { maxW: 4750, price: 808 },
        { maxW: 5610, price: 895 }, { maxW: 6000, price: 938 }
      ]
    },
    auventEtJouesPrices: [
      { maxW: 2390, price: 218 }, { maxW: 3570, price: 279 }, { maxW: 4750, price: 298 },
      { maxW: 5610, price: 318 }, { maxW: 6000, price: 377 }, { maxW: 7110, price: 493 },
      { maxW: 8280, price: 544 }, { maxW: 9450, price: 586 }, { maxW: 10790, price: 667 },
      { maxW: 11220, price: 704 }, { maxW: 12000, price: 729 }, { maxW: 14140, price: 876 },
      { maxW: 15310, price: 886 }, { maxW: 18000, price: 1003 }
    ],
    salesCoefficient: 1,  // Premium monobloc
    optionsCoefficients: {
      LED_ARMS: 1,
      LED_CASSETTE: 1,
      LAMBREQUIN_FIXE: 1,
      LAMBREQUIN_ENROULABLE: 1,
      CEILING_MOUNT: 1,
      AUVENT: 1,
      FRAME_COLOR_CUSTOM: 1
    },
    deliveryType: 'ready_up_to_6m',
    deliveryNote: "Store livré fini, toile réglée et prêt à poser jusqu'à 6m. Au-delà, livré en 2 parties. Surtaxe transport pour stores > 3.65m.",
    colorStrategy: 'STANDARD_ALL',  // Toutes couleurs incluses
    deliveryWarningThreshold: 3650  // Alerte et surtaxe transport si > 3.65m
  },

  // --- 12. GENES - STORAL TRADITION (Traditionnel Standard) ---
  // Tarifs mis à jour le 19/02/2026
  "genes": {
    id: "genes",
    slug: "store-banne-loggia-sans-coffre",
    name: "STORAL TRADITION",
    marketingRange: "GAMME_TRADITION",
    type: "traditionnel",
    is_promo: false,
    description: "Le store traditionnel par excellence, idéal pour les balcons et budgets serrés. LED intégrées dans les bras (option).",
    features: ["Prix économique", "Installation simple", "LED bras intégrées (option)"],
    image: "/images/stores/store_traditionnel.png",
    compatible_toile_types: ['ORCH'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 5550, max_projection: 2500 },
    arm_type: 'standard',
    wind_class: 'classe_2',
    armLogic: 'standard_2',
    minWidths: { 1500: 2390, 1750: 2390, 2000: 2390, 2500: 2750 },
    buyPrices: {
      1500: [{ maxW: 2390, priceHT: 672 }, { maxW: 3570, priceHT: 751 }, { maxW: 4750, priceHT: 854 }, { maxW: 5550, priceHT: 953 }],
      1750: [{ maxW: 2390, priceHT: 677 }, { maxW: 3570, priceHT: 758 }, { maxW: 4750, priceHT: 859 }, { maxW: 5550, priceHT: 958 }],
      2000: [{ maxW: 2390, priceHT: 682 }, { maxW: 3570, priceHT: 767 }, { maxW: 4750, priceHT: 867 }, { maxW: 5550, priceHT: 967 }],
      2500: [{ maxW: 2750, priceHT: 776 }, { maxW: 4750, priceHT: 875 }]
    },
    auventEtJouesPrices: [
      { maxW: 2390, price: 203 }, { maxW: 3570, price: 288 }, { maxW: 4750, price: 300 }, { maxW: 5550, price: 352 }
    ],
    lambrequinFixeDifferentFabricPrices: [
      { maxW: 2390, price: 80 }, { maxW: 3570, price: 92 }, { maxW: 4750, price: 106 }, { maxW: 5550, price: 112 }
    ],
    salesCoefficient: 1,  // Économique
    optionsCoefficients: {
      LED_ARMS: 1,
      LED_CASSETTE: 1,
      LAMBREQUIN_FIXE: 1,
      LAMBREQUIN_ENROULABLE: 1,
      CEILING_MOUNT: 1,
      AUVENT: 1,
      FABRIC: 1,
      FRAME_COLOR_CUSTOM: 1,
      INSTALLATION: 1
    },
    deliveryType: 'disassembled',
    deliveryNote: "Store livré démonté (pose par nos soins ou par un professionnel recommandé). Fixation plafond sans plus-value.",
    colorStrategy: 'STANDARD_ALL'  // Toutes couleurs incluses
  },

  // --- 13. MENTON - STORAL TRADITION + (Traditionnel Renforcé) ---
  // Tarifs mis à jour le 19/02/2026
  "menton": {
    id: "menton",
    slug: "store-banne-traditionnel-renforce-menton",
    name: "STORAL TRADITION +",
    marketingRange: "GAMME_TRADITION",
    type: "traditionnel",
    is_promo: false,
    description: "Version renforcée du store traditionnel pour dimensions supérieures jusqu'à 12m. LED intégrées dans les bras (option).",
    features: ["Renforcé", "Jusqu'à 12m", "LED bras intégrées (option)"],
    image: "/images/stores/store_traditionnel.png",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 12000, max_projection: 3000 },
    arm_type: 'renforce',
    wind_class: 'classe_2',
    armLogic: 'standard_2',
    minWidths: { 1500: 2390, 1750: 2390, 2000: 2390, 2500: 3570, 3000: 4750 },
    buyPrices: {
      1500: [{ maxW: 2390, priceHT: 973 }, { maxW: 3570, priceHT: 1075 }, { maxW: 4750, priceHT: 1173 }, { maxW: 5700, priceHT: 1285 }, { maxW: 6000, priceHT: 1414 }, { maxW: 7110, priceHT: 1924 }, { maxW: 8280, priceHT: 2053 }, { maxW: 9450, priceHT: 2169 }, { maxW: 10750, priceHT: 2302 }, { maxW: 11400, priceHT: 2398 }, { maxW: 12000, priceHT: 2490 }],
      1750: [{ maxW: 2390, priceHT: 980 }, { maxW: 3570, priceHT: 1081 }, { maxW: 4750, priceHT: 1184 }, { maxW: 5700, priceHT: 1292 }, { maxW: 6000, priceHT: 1417 }, { maxW: 7110, priceHT: 1934 }, { maxW: 8280, priceHT: 2068 }, { maxW: 9450, priceHT: 2180 }, { maxW: 10750, priceHT: 2316 }, { maxW: 11400, priceHT: 2409 }, { maxW: 12000, priceHT: 2501 }],
      2000: [{ maxW: 2390, priceHT: 984 }, { maxW: 3570, priceHT: 1087 }, { maxW: 4750, priceHT: 1189 }, { maxW: 5700, priceHT: 1296 }, { maxW: 6000, priceHT: 1424 }, { maxW: 7110, priceHT: 1947 }, { maxW: 8280, priceHT: 2077 }, { maxW: 9450, priceHT: 2191 }, { maxW: 10750, priceHT: 2329 }, { maxW: 11400, priceHT: 2422 }, { maxW: 12000, priceHT: 2514 }],
      2500: [{ maxW: 3570, priceHT: 1100 }, { maxW: 4750, priceHT: 1204 }, { maxW: 5700, priceHT: 1314 }, { maxW: 6000, priceHT: 1439 }, { maxW: 7110, priceHT: 1974 }, { maxW: 8280, priceHT: 2104 }, { maxW: 9450, priceHT: 2218 }, { maxW: 10750, priceHT: 2357 }, { maxW: 11400, priceHT: 2449 }, { maxW: 12000, priceHT: 2549 }],
      3000: [{ maxW: 4750, priceHT: 1222 }, { maxW: 5700, priceHT: 1331 }, { maxW: 6000, priceHT: 1463 }, { maxW: 7110, priceHT: 2016 }, { maxW: 8280, priceHT: 2148 }, { maxW: 9450, priceHT: 2265 }, { maxW: 10750, priceHT: 2400 }, { maxW: 11400, priceHT: 2496 }, { maxW: 12000, priceHT: 2595 }]
    },
    auventEtJouesPrices: [
      { maxW: 2390, price: 215 }, { maxW: 3570, price: 221 }, { maxW: 4750, price: 277 }, { maxW: 5700, price: 335 }, { maxW: 6000, price: 358 }, { maxW: 7110, price: 448 }, { maxW: 8280, price: 511 }, { maxW: 9450, price: 560 }, { maxW: 10750, price: 618 }, { maxW: 11400, price: 671 }, { maxW: 12000, price: 717 }
    ],
    salesCoefficient: 1,  // Version renforcée
    optionsCoefficients: {
      LED_ARMS: 1,
      LED_CASSETTE: 1,
      LAMBREQUIN_FIXE: 1,
      LAMBREQUIN_ENROULABLE: 1,
      CEILING_MOUNT: 1,
      AUVENT: 1,
      FABRIC: 1,
      FRAME_COLOR_CUSTOM: 1,
      INSTALLATION: 1
    },
    deliveryType: 'disassembled',
    deliveryNote: "Store livré démonté - Installation par nos soins ou par un professionnel recommandé. Fixation plafond sans plus-value.",
    colorStrategy: 'STANDARD_ALL'  // Toutes couleurs incluses
  },

  // --- 14. LISBONNE - STORAL TRADITION 18M (Traditionnel Grande Portée) ---
  // Tarifs mis à jour le 19/02/2026
  "lisbonne": {
    id: "lisbonne",
    slug: "store-banne-traditionnel-grande-portee-18m",
    name: "STORAL TRADITION 18M",
    marketingRange: "GAMME_TRADITION",
    type: "traditionnel",
    is_promo: false,
    description: "Le store traditionnel pour très grandes dimensions jusqu'à 18m. Bras ultra-renforcés certifiés Classe 2 (NF EN 13561). LED intégrées dans les bras (option).",
    features: ["Jusqu'à 18m", "Bras Ultra-Renforcés", "LED bras intégrées (option)"],
    image: "/images/stores/store_traditionnel.png",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: true, max_width: 18000, max_projection: 4000 },
    arm_type: 'ultra_renforce',
    wind_class: 'classe_2',
    armLogic: 'couples_4_6',
    minWidths: { 1500: 2750, 2000: 3250, 2500: 3750, 3000: 4250, 3500: 4750, 4000: 4750 },
    buyPrices: {
      1500: [{ maxW: 2750, priceHT: 1044 }, { maxW: 3250, priceHT: 1107 }, { maxW: 3750, priceHT: 1169 }, { maxW: 4250, priceHT: 1232 }, { maxW: 4750, priceHT: 1294 }, { maxW: 5250, priceHT: 1357 }, { maxW: 5750, priceHT: 1419 }, { maxW: 6250, priceHT: 1482 }, { maxW: 6750, priceHT: 1544 }, { maxW: 7250, priceHT: 1607 }, { maxW: 7750, priceHT: 1669 }, { maxW: 8000, priceHT: 1700 }],
      2000: [{ maxW: 3250, priceHT: 1169 }, { maxW: 3750, priceHT: 1232 }, { maxW: 4250, priceHT: 1294 }, { maxW: 4750, priceHT: 1357 }, { maxW: 5250, priceHT: 1419 }, { maxW: 5750, priceHT: 1482 }, { maxW: 6250, priceHT: 1544 }, { maxW: 6750, priceHT: 1607 }, { maxW: 7250, priceHT: 1669 }, { maxW: 7750, priceHT: 1732 }, { maxW: 8000, priceHT: 1763 }],
      2500: [{ maxW: 3750, priceHT: 1294 }, { maxW: 4250, priceHT: 1357 }, { maxW: 4750, priceHT: 1419 }, { maxW: 5250, priceHT: 1482 }, { maxW: 5750, priceHT: 1544 }, { maxW: 6250, priceHT: 1607 }, { maxW: 6750, priceHT: 1669 }, { maxW: 7250, priceHT: 1732 }, { maxW: 7750, priceHT: 1794 }, { maxW: 8000, priceHT: 1825 }],
      3000: [{ maxW: 4250, priceHT: 1419 }, { maxW: 4750, priceHT: 1482 }, { maxW: 5250, priceHT: 1544 }, { maxW: 5750, priceHT: 1607 }, { maxW: 6250, priceHT: 1669 }, { maxW: 6750, priceHT: 1732 }, { maxW: 7250, priceHT: 1794 }, { maxW: 7750, priceHT: 1857 }, { maxW: 8000, priceHT: 1888 }],
      3500: [{ maxW: 4750, priceHT: 1544 }, { maxW: 5250, priceHT: 1607 }, { maxW: 5750, priceHT: 1669 }, { maxW: 6250, priceHT: 1732 }, { maxW: 6750, priceHT: 1794 }, { maxW: 7250, priceHT: 1857 }, { maxW: 7750, priceHT: 1919 }, { maxW: 8000, priceHT: 1950 }],
      4000: [{ maxW: 4750, priceHT: 1669 }, { maxW: 5250, priceHT: 1732 }, { maxW: 5700, priceHT: 1922 }, { maxW: 6000, priceHT: 2140 }, { maxW: 6500, priceHT: 2265 }, { maxW: 7000, priceHT: 2390 }, { maxW: 7500, priceHT: 2515 }, { maxW: 8000, priceHT: 2640 }]
    },
    auventEtJouesPrices: [
      { maxW: 3000, price: 200 }, { maxW: 3500, price: 200 }, { maxW: 4000, price: 210 }, { maxW: 4500, price: 220 }, { maxW: 5000, price: 230 }, { maxW: 5500, price: 240 }, { maxW: 6000, price: 250 }, { maxW: 6500, price: 260 }, { maxW: 7000, price: 270 }, { maxW: 7500, price: 280 }, { maxW: 8000, price: 290 }, { maxW: 8500, price: 300 }, { maxW: 9000, price: 310 }, { maxW: 9500, price: 320 }
    ],
    lambrequinEnroulablePrices: {
      manual: [{ maxW: 2390, price: 321 }, { maxW: 3570, price: 437 }, { maxW: 4750, price: 524 }, { maxW: 5700, price: 610 }, { maxW: 6000, price: 653 }],
      motorized: [{ maxW: 2390, price: 576 }, { maxW: 3570, price: 723 }, { maxW: 4750, price: 808 }, { maxW: 5700, price: 895 }, { maxW: 6000, price: 938 }]
    },
    ceilingMountPrices: [
      { maxW: 3570, price: 40 }, { maxW: 5700, price: 78 }, { maxW: 6000, price: 93 }, { maxW: 7110, price: 126 }, { maxW: 8280, price: 136 }, { maxW: 9450, price: 159 }, { maxW: 11220, price: 168 }, { maxW: 12000, price: 177 }, { maxW: 14140, price: 186 }, { maxW: 18000, price: 198 }
    ],
    salesCoefficient: 1,  // Projet sur mesure XXL
    optionsCoefficients: {
      LED_ARMS: 1,
      LED_CASSETTE: 1,
      LAMBREQUIN_FIXE: 1,
      LAMBREQUIN_ENROULABLE: 1,
      CEILING_MOUNT: 1,
      AUVENT: 1,
      FABRIC: 1,
      FRAME_COLOR_CUSTOM: 1,
      INSTALLATION: 1
    },
    deliveryType: 'disassembled',
    deliveryNote: "Store livré démonté par transporteur spécialisé - Installation professionnelle obligatoire",
    colorStrategy: 'STANDARD_ALL',  // Toutes couleurs incluses
    deliveryWarningThreshold: 4000  // Alerte livraison complexe
  },

  // --- 15. BRAS CROISÉS - STORAL BRAS CROISÉS (Spécialité pour balcons étroits) ---
  // Tarifs mis à jour le 19/02/2026
  "bras_croises": {
    id: "bras_croises",
    slug: "store-banne-balcon-etroit-bras-croises",
    name: "STORAL BRAS CROISÉS",
    marketingRange: "GAMME_SPECIAL",
    type: "specialite",
    is_promo: false,
    description: "La solution exclusive pour les terrasses et balcons étroits où l'avancée est supérieure à la largeur. Bras superposés avec mécanique spéciale. LED intégrées dans les bras (option uniquement 2 bras), auvent et joues, lambrequin déroulant (options).",
    features: ["Configuration Unique", "Bras Superposés", "LED 2 bras (option)", "Auvent et Joues (option)", "Lambrequin déroulant (option)"],
    image: "/images/stores/store coffre.png",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: true, max_width: 3835, max_projection: 3500 },
    arm_type: 'standard',
    wind_class: 'classe_2',
    armLogic: 'standard_2',
    minWidths: { 1500: 1100, 2000: 1100, 2500: 2390, 2750: 2390, 3000: 2390, 3250: 2390, 3500: 2390 },
    buyPrices: {
      1500: [{ maxW: 2390, priceHT: 1144 }],
      2000: [{ maxW: 2390, priceHT: 1162 }],
      2500: [{ maxW: 2390, priceHT: 1196 }, { maxW: 3570, priceHT: 1304 }],
      2750: [{ maxW: 2390, priceHT: 1206 }, { maxW: 3570, priceHT: 1315 }],
      3000: [{ maxW: 2390, priceHT: 1218 }, { maxW: 3570, priceHT: 1322 }],
      3250: [{ maxW: 2390, priceHT: 1233 }, { maxW: 3570, priceHT: 1341 }, { maxW: 3835, priceHT: 1473 }],
      3500: [{ maxW: 2390, priceHT: 1244 }, { maxW: 3570, priceHT: 1350 }, { maxW: 3835, priceHT: 1492 }]
    },
    ceilingMountPrices: [
      { maxW: 2390, price: 20 }, { maxW: 3570, price: 23 }, { maxW: 3835, price: 27 }
    ],
    lambrequinEnroulablePrices: {
      manual: [
        { maxW: 2390, price: 321 }, { maxW: 3570, price: 437 }, { maxW: 3835, price: 524 }
      ],
      motorized: [
        { maxW: 2390, price: 576 }, { maxW: 3570, price: 723 }, { maxW: 3835, price: 808 }
      ]
    },
    auventEtJouesPrices: [
      { maxW: 2390, price: 218 }, { maxW: 3570, price: 279 }, { maxW: 3835, price: 298 }
    ],
    salesCoefficient: 1,  // Spécialité
    optionsCoefficients: {
      LED_ARMS: 1,
      LED_CASSETTE: 1,
      LAMBREQUIN_FIXE: 1,
      LAMBREQUIN_ENROULABLE: 1,
      CEILING_MOUNT: 1,
      AUVENT: 1,
      FRAME_COLOR_CUSTOM: 1
    },
    deliveryType: 'ready_to_install',
    deliveryNote: "Store livré fini, toile réglée et prêt à poser. Solution spéciale pour balcons étroits.",
    colorStrategy: 'STANDARD_ALL'  // Toutes couleurs incluses
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
  
  // Helper pour obtenir le coefficient d'une option (spécifique au produit ou global)
  const getOptionCoeff = (optionKey: keyof typeof CATALOG_SETTINGS.OPTIONS_COEFFICIENTS) => {
    return model.optionsCoefficients?.[optionKey] ?? CATALOG_SETTINGS.OPTIONS_COEFFICIENTS[optionKey];
  };
  
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
      totalVenteHT += ledPriceAchatHT * getOptionCoeff('LED_ARMS');
    }
  }
  
  // LED Coffre
  if (config.options.ledBox && model.compatibility.led_box) {
    const ledCoffrePriceHT = model.ledCoffretPrice ?? OPTIONS_PRICES.LED_CASSETTE;
    totalVenteHT += ledCoffrePriceHT * getOptionCoeff('LED_CASSETTE');
  }
  
  // RAL spécifique
  if (config.options.isCustomColor) {
    totalVenteHT += OPTIONS_PRICES.FRAME_SPECIFIC_RAL * getOptionCoeff('FRAME_COLOR_CUSTOM');
  }
  
  // Pose plafond
  if (config.options.isPosePlafond) {
    const ceilingGrid = model.ceilingMountPrices;
    if (ceilingGrid && ceilingGrid.length > 0) {
      const tier = ceilingGrid.find(t => config.width <= t.maxW);
      if (tier) {
        totalVenteHT += tier.price * getOptionCoeff('CEILING_MOUNT');
      }
    }
  }
  
  // Lambrequin Fixe
  if (config.options.lambrequinFixe && model.compatibility.lambrequin_fixe) {
    totalVenteHT += OPTIONS_PRICES.LAMBREQUIN_FIXE * getOptionCoeff('LAMBREQUIN_FIXE');
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
          totalVenteHT += tier.price * getOptionCoeff('LAMBREQUIN_ENROULABLE');
        }
      }
    }
  }
  
  // 5. Recalculer les prix détaillés de chaque option POUR LE RETOUR
  // (On doit refaire le calcul car totalVenteHT contient déjà tout agrégé)
  const prixStoreBaseVenteHT = prixStoreBaseAchatHT * coeffStore;
  
  let ledArmsHT = 0;
  let ledBoxHT = 0;
  let lambrequinHT = 0;
  
  if (config.options.ledArms && model.compatibility.led_arms) {
    let nbBras = 2;
    try {
      nbBras = calculateArmsForLargeWidth(config.modelId, config.width, config.projection);
    } catch (error) {
      // Déjà géré
    }
    const ledGrid = OPTIONS_PRICES.LED_ARMS[usedProjection];
    if (ledGrid) {
      const ledPriceAchatHT = ledGrid[nbBras] || ledGrid[2] || 0;
      ledArmsHT = ledPriceAchatHT * getOptionCoeff('LED_ARMS');
    }
  }
  
  if (config.options.ledBox && model.compatibility.led_box) {
    const ledCoffrePriceHT = model.ledCoffretPrice ?? OPTIONS_PRICES.LED_CASSETTE;
    ledBoxHT = ledCoffrePriceHT * getOptionCoeff('LED_CASSETTE');
  }
  
  if (config.options.lambrequinEnroulable && model.compatibility.lambrequin_enroulable) {
    if (config.modelId !== 'kalyo' || config.projection <= 3250) {
      const grid = model.lambrequinEnroulablePrices;
      const tiers = config.options.lambrequinMotorized ? grid?.motorized : grid?.manual;
      if (tiers && tiers.length > 0) {
        const tier = tiers.find(t => config.width <= t.maxW && t.maxW <= 6000);
        if (tier) {
          lambrequinHT = tier.price * getOptionCoeff('LAMBREQUIN_ENROULABLE');
        }
      }
    }
  }

  // 6. Application de la TVA
  const tauxTva = config.options.isPosePro ? CATALOG_SETTINGS.TVA_REDUIT : CATALOG_SETTINGS.TVA_NORMAL;
  let totalVenteTTC = totalVenteHT * tauxTva;
  
  // 7. Frais de transport basés sur la dimension (largeur > 3650mm)
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
    // DÉTAILS POUR display_single_offer
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
// ==========================================
// 7. MAPPING PRODUITS PAR GAMME MARKETING
// ==========================================
// Export simplifié pour référence rapide des produits par gamme

export const products = {
  // --- GAMME COMPACT ---
  kissimy_promo: { label: "STORAL COMPACT", marketingRange: "GAMME_COMPACT" }, 
  kitanguy: { label: "STORAL COMPACT +", marketingRange: "GAMME_COMPACT" },

  // --- GAMME ARMOR ---
  dynasta: { label: "STORAL ARMOR", marketingRange: "GAMME_ARMOR" },
  belharra: { label: "STORAL ARMOR +", marketingRange: "GAMME_ARMOR" },

  // --- GAMME EXCELLENCE ---
  kitanguy_2: { label: "STORAL EXCELLENCE", marketingRange: "GAMME_EXCELLENCE" },
  belharra_2: { label: "STORAL EXCELLENCE +", marketingRange: "GAMME_EXCELLENCE" },

  // --- GAMME KUBE ---
  heliom: { label: "STORAL KUBE", marketingRange: "GAMME_KUBE" },
  heliom_plus: { label: "STORAL KUBE +", marketingRange: "GAMME_KUBE" },

  // --- GAMME CLASSIQUE (Monobloc) ---
  antibes: { label: "STORAL CLASSIQUE", marketingRange: "GAMME_CLASSIQUE" },
  madrid: { label: "STORAL CLASSIQUE +", marketingRange: "GAMME_CLASSIQUE" },

  // --- GAMME TRADITION ---
  genes: { label: "STORAL TRADITION", marketingRange: "GAMME_TRADITION" },
  menton: { label: "STORAL TRADITION +", marketingRange: "GAMME_TRADITION" },
  lisbonne: { label: "STORAL TRADITION 18M", marketingRange: "GAMME_TRADITION" },

  // --- SPÉCIAUX ---
  kalyo: { label: "STORAL K", marketingRange: "GAMME_KARE_COMPACT" },
  bras_croises: { label: "STORAL BRAS CROISÉS", marketingRange: "GAMME_SPECIAL" }
};

// ==========================================
// 8. MÉTADONNÉES DES GAMMES MARKETING
// ==========================================
// Configuration pour l'affichage des gammes sur la page d'accueil

export interface MarketingRange {
  id: string;
  label: string;
  tagline: string;
  imageUrl: string;
  description: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  order: number;
  badge?: string;
}

export const MARKETING_RANGES: Record<string, MarketingRange> = {
  GAMME_COMPACT: {
    id: "GAMME_COMPACT",
    label: "Gamme Compact",
    tagline: "L'Essentiel",
    imageUrl: "/images/stores/KISSIMY.png",
    description: "Votre premier store banne à prix mini, sans compromis sur la qualité",
    color: "blue",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-600",
    order: 1,
    badge: "PROMO"
  },
  GAMME_ARMOR: {
    id: "GAMME_ARMOR",
    label: "Gamme Armor",
    tagline: "Le Géant des Terrasses",
    imageUrl: "/images/stores/DYNASTA.png",
    description: "Jusqu'à 12m de large, la référence pour les grandes surfaces et CHR",
    color: "red",
    gradientFrom: "from-red-500",
    gradientTo: "to-red-600",
    order: 2
  },
  GAMME_EXCELLENCE: {
    id: "GAMME_EXCELLENCE",
    label: "Gamme Excellence",
    tagline: "Le Haut de Gamme",
    imageUrl: "/images/stores/KITANGUY_2.png",
    description: "Le luxe à la française, finitions exceptionnelles et options premium",
    color: "purple",
    gradientFrom: "from-purple-500",
    gradientTo: "to-purple-600",
    order: 3,
    badge: "PREMIUM"
  },
  GAMME_KUBE: {
    id: "GAMME_KUBE",
    label: "Gamme Kube",
    tagline: "Design Moderne",
    imageUrl: "/images/stores/HELIOM.png",
    description: "Le design au carré, l'élégance géométrique pour l'architecture contemporaine",
    color: "indigo",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-indigo-600",
    order: 4
  },
  GAMME_CLASSIQUE: {
    id: "GAMME_CLASSIQUE",
    label: "Gamme Classique",
    tagline: "Monobloc sur Mesure",
    imageUrl: "/images/stores/store_monobloc.png",
    description: "Le monobloc réinventé, robuste et élégant pour tous les styles",
    color: "amber",
    gradientFrom: "from-amber-500",
    gradientTo: "to-amber-600",
    order: 5
  },
  GAMME_KARE_COMPACT: {
    id: "GAMME_KARE_COMPACT",
    label: "Karé Compact",
    tagline: "Design Polyvalent",
    imageUrl: "/images/stores/KALY_O.png",
    description: "Le coffre carré compact, solution polyvalente avec options lambrequin enroulable",
    color: "teal",
    gradientFrom: "from-teal-500",
    gradientTo: "to-teal-600",
    order: 6
  },
  GAMME_SPECIAL: {
    id: "GAMME_SPECIAL",
    label: "Bras Croisés",
    tagline: "Configuration Unique",
    imageUrl: "/images/stores/store-banne-coffre.jpeg",
    description: "La solution exclusive pour balcons étroits : bras superposés, avancée > largeur",
    color: "pink",
    gradientFrom: "from-pink-500",
    gradientTo: "to-pink-600",
    order: 7
  },
  GAMME_TRADITION: {
    id: "GAMME_TRADITION",
    label: "Gamme Tradition",
    tagline: "L'Authentique",
    imageUrl: "/images/stores/store_traditionnel.png",
    description: "Le store traditionnel pour les bricoleurs avertis, à assembler soi-même",
    color: "green",
    gradientFrom: "from-green-500",
    gradientTo: "to-green-600",
    order: 8
  }
};

// ==========================================
// 9. HELPERS POUR LES GAMMES
// ==========================================

/**
 * Grouper les modèles de stores par gamme marketing
 */
export function getProductsByRange(): Record<string, StoreModel[]> {
  const grouped: Record<string, StoreModel[]> = {};
  
  Object.values(STORE_MODELS).forEach(model => {
    const range = model.marketingRange || 'AUTRES';
    if (!grouped[range]) {
      grouped[range] = [];
    }
    grouped[range].push(model);
  });
  
  return grouped;
}

/**
 * Obtenir toutes les gammes triées par ordre d'affichage
 */
export function getSortedRanges(): MarketingRange[] {
  return Object.values(MARKETING_RANGES).sort((a, b) => a.order - b.order);
}

/**
 * Obtenir le prix minimum d'une gamme
 */
export function getMinPriceForRange(rangeId: string): number {
  const models = getProductsByRange()[rangeId] || [];
  if (models.length === 0) return 0;
  
  const prices = models.map(model => getMinimumPrice(model));
  return Math.min(...prices);
}

/**
 * Compter le nombre de modèles dans une gamme
 */
export function getModelCountForRange(rangeId: string): number {
  const models = getProductsByRange()[rangeId] || [];
  return models.length;
}

/**
 * Méta-descriptions SEO personnalisées pour chaque produit
 * Optimisées pour Google (max 155 caractères, keywords ciblés, appel à l'action)
 */
export const META_DESCRIPTIONS: Record<string, string> = {
  'store-banne-coffre-compact-sur-mesure': "Le STORAL COMPACT : store banne idéal pour petits balcons. Fabrication sur mesure, coffre intégral et prix direct usine. Devis immédiat avec notre IA !",
  'store-banne-coffre-compact-renforce': "Alliez compacité et robustesse avec le COMPACT+. Structure renforcée pour une tenue au vent optimale. Personnalisez votre store en ligne avec l'IA.",
  'store-banne-grande-largeur-armor': "Protégez vos grandes terrasses avec le STORAL ARMOR. Jusqu'à 12m de large. Bras renforcés haute résistance. Configurez votre projet sur mesure dès maintenant.",
  'store-banne-coffre-armor-design': "Le store ARMOR+ : le mariage parfait entre design moderne et grande avancée. Finition premium, coffre galbé et options LED. Qualité française sur mesure.",
  'store-banne-coffre-excellence-led': "Illuminez vos soirées avec le STORAL EXCELLENCE. LED intégrées, design épuré et technologie domotique. Le store banne haut de gamme par excellence.",
  'store-banne-coffre-rectangulaire-kube': "Design minimaliste et cubique pour architectures modernes. Le STORAL KUBE s'intègre parfaitement à votre façade. Qualité premium et design épuré.",
  'store-banne-design-architecte-kube': "Le KUBE+ pousse le design encore plus loin. Finitions invisibles, grande avancée et esthétique cubique. Le choix des architectes pour votre terrasse.",
  'store-banne-renovation-coffre-compact': "Le STORAL K est spécialement conçu pour la rénovation. Installation simplifiée, coffre ultra-compact et protection maximale de la toile.",
  'store-banne-excellence-grandes-dimensions': "L'EXCELLENCE+ pour vos projets XXL. Confort domotique, éclairage LED puissant et structure ultra-robuste. Le luxe et la performance sur mesure.",
  'store-banne-coffre-traditionnel-antibes': "Retrouvez le charme du classique avec le STORAL ANTIBES. Coffre de protection traditionnel, mécanisme éprouvé et large choix de toiles.",
  'store-banne-coffre-robuste-madrid': "Le STORAL MADRID offre une robustesse à toute épreuve pour un usage intensif. Fiabilité mécanique et esthétique intemporelle pour votre maison.",
  'store-banne-loggia-sans-coffre': "Idéal pour les loggias et balcons abrités, le STORAL TRADITION offre une protection solaire efficace et économique sans encombrement inutile.",
  'store-banne-traditionnel-renforce-menton': "Le STORAL TRADITION+ offre une structure renforcée jusqu'à 8m. Installation professionnelle pour terrasses de grandes dimensions. Économique et robuste.",
  'store-banne-traditionnel-grande-portee-18m': "Le store TRADITION 18M pour projets XXL : jusqu'à 18 mètres de large ! Solution professionnelle pour restaurants, CHR et grandes structures. Prix sur devis.",
  'store-banne-balcon-etroit-bras-croises': "La solution pour les terrasses étroites : les bras croisés permettent une avancée supérieure à la largeur du store. Ingénieux et pratique.",
};
