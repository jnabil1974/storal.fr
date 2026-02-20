// /src/lib/catalog-data.ts
// ⚠️ PRIX FINAUX: Tous les prix dans ce fichier sont des prix de VENTE HT
// Les coefficients de marge ont été pré-appliqués lors de la génération
// Coefficient utilisé: 1.8 (Prix Vente HT = Prix Achat HT × 1.8)
// Backup original disponible dans: catalog-data.backup.ts
// 
// 📌 SÉCURITÉ: Ces commentaires sont uniquement visibles dans le code source (côté serveur).
// Le client ne voit que les prix de vente finaux dans le bundle, sans aucun coefficient.


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
  
  // Les prix sont déjà des prix de vente HT finaux (coefficient déjà appliqué)
  const priceVenteHT = minPriceHT;
  
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
  buyPrices: Record<number, { maxW: number, priceHT: number }[]>; // Prix de vente HT finaux (coefficient déjà appliqué)
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
  TVA_NORMAL: 1.20,
  TVA_REDUIT: 1.10,
  promoCode: 'BIENVENUE2026',
  promoDiscount: 0.05,
  
  // Frais de transport pour stores de grande dimension
  TRANSPORT: {
    SEUIL_LARGEUR_MM: 3650,  // Seuil de déclenchement en millimètres de largeur
    FRAIS_HT: 139,           // Frais de transport en € HT (appliqués si largeur > seuil)
  }
};

// ==========================================
// 3. OPTIONS & PRIX (PRIX FINAUX DE VENTE HT)
// ==========================================
// ⚠️ IMPORTANT: Tous les prix sont des prix de VENTE HT finaux
// Le coefficient de marge a déjà été appliqué (×1.8)
// Coefficient utilisé: Prix Vente HT = Prix Achat HT × 1.8
export const OPTIONS_PRICES = {
  // Prix de VENTE HT du kit LED selon Avancée (clé) et Nombre de bras (sous-clé)
  // Coefficient 1.8 déjà appliqué sur tous les tarifs
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
  
  FRAME_SPECIFIC_RAL: 248,
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
// ⚠️ PRIX FINAUX: Tous les prix dans buyPrices sont des PRIX DE VENTE HT finaux
// Coefficient 1.8 déjà appliqué (Prix Vente HT = Prix Achat HT × 1.8)
// Ces informations sont uniquement visibles dans le code source (côté serveur).

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
    image: "/images/produits/kissimy_promo/1.jpg",
    compatible_toile_types: ['ORCH'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 4830, max_projection: 3000, allowed_colors: ['9010', '1015', '7016'] },
    arm_type: 'standard',
    wind_class: 'classe_2',
    armLogic: 'standard_2',
    minWidths: { 1500: 1835, 1750: 2085, 2000: 2335, 2500: 2835, 3000: 3355 },
    buyPrices: {
    1500: [{ maxW: 2470, priceHT: 1818 }, { maxW: 3650, priceHT: 1885 }, { maxW: 4830, priceHT: 1946 }],
    1750: [{ maxW: 2470, priceHT: 1870 }, { maxW: 3650, priceHT: 1953 }, { maxW: 4830, priceHT: 2027 }],
    2000: [{ maxW: 2470, priceHT: 1915 }, { maxW: 3650, priceHT: 2009 }, { maxW: 4830, priceHT: 2081 }],
    2500: [{ maxW: 3650, priceHT: 2097 }, { maxW: 4830, priceHT: 2205 }],
    3000: [{ maxW: 3650, priceHT: 2203 }, { maxW: 4830, priceHT: 2331 }]
    },
    ceilingMountPrices: [
      { maxW: 4830, price: 39 }  // Forfait fixe peu importe la dimension
    ],    deliveryType: 'ready_to_install',
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
    image: "/images/produits/kitanguy/1.jpg",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 5850, max_projection: 3250 },
    arm_type: 'standard',
    wind_class: 'classe_2',
    armLogic: 'standard_2',
    minWidths: { 1500: 1895, 1750: 2145, 2000: 2395, 2500: 2895, 3000: 3415, 3250: 3645 },
  buyPrices: {
    1500: [{ maxW: 2470, priceHT: 2435 }, { maxW: 3650, priceHT: 2583 }, { maxW: 4830, priceHT: 2810 }, { maxW: 5610, priceHT: 2983 }, { maxW: 5850, priceHT: 3229 }],
    1750: [{ maxW: 2470, priceHT: 2500 }, { maxW: 3650, priceHT: 2660 }, { maxW: 4830, priceHT: 2903 }, { maxW: 5610, priceHT: 3082 }, { maxW: 5850, priceHT: 3334 }],
    2000: [{ maxW: 2470, priceHT: 2570 }, { maxW: 3650, priceHT: 2729 }, { maxW: 4830, priceHT: 2988 }, { maxW: 5610, priceHT: 3177 }, { maxW: 5850, priceHT: 3427 }],
    2500: [{ maxW: 3650, priceHT: 2839 }, { maxW: 4830, priceHT: 3123 }, { maxW: 5610, priceHT: 3382 }, { maxW: 5850, priceHT: 3659 }],
    3000: [{ maxW: 3650, priceHT: 2968 }, { maxW: 4830, priceHT: 3280 }, { maxW: 5610, priceHT: 3643 }, { maxW: 5850, priceHT: 3935 }],
    3250: [{ maxW: 4830, priceHT: 3123 }, { maxW: 5610, priceHT: 3451 }, { maxW: 5850, priceHT: 3866 }]
    },
    ceilingMountPrices: [
      { maxW: 5850, price: 39 }  // Forfait fixe peu importe la dimension
    ],    deliveryType: 'ready_to_install',
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
    image: "/images/produits/kitanguy_2/1.jpg",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: true, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 5850, max_projection: 3250 },
    arm_type: 'standard',
    wind_class: 'classe_2',
    armLogic: 'standard_2',
    minWidths: { 1500: 1910, 1750: 2160, 2000: 2410, 2500: 2910, 3000: 3410, 3250: 3660 },
    buyPrices: {
      1500: [{ maxW: 2470, priceHT: 2579 }, { maxW: 3650, priceHT: 2736 }, { maxW: 4830, priceHT: 2977 }, { maxW: 5610, priceHT: 3161 }, { maxW: 5850, priceHT: 3422 }],
      1750: [{ maxW: 2470, priceHT: 2651 }, { maxW: 3650, priceHT: 2821 }, { maxW: 4830, priceHT: 3076 }, { maxW: 5610, priceHT: 3265 }, { maxW: 5850, priceHT: 3532 }],
      2000: [{ maxW: 2470, priceHT: 2725 }, { maxW: 3650, priceHT: 2893 }, { maxW: 4830, priceHT: 3168 }, { maxW: 5610, priceHT: 3366 }, { maxW: 5850, priceHT: 3632 }],
      2500: [{ maxW: 3650, priceHT: 3010 }, { maxW: 4830, priceHT: 3310 }, { maxW: 5610, priceHT: 3584 }, { maxW: 5850, priceHT: 3879 }],
      3000: [{ maxW: 3650, priceHT: 3146 }, { maxW: 4830, priceHT: 3476 }, { maxW: 5610, priceHT: 3863 }, { maxW: 5850, priceHT: 4171 }],
      3250: [{ maxW: 4830, priceHT: 3310 }, { maxW: 5610, priceHT: 3658 }, { maxW: 5850, priceHT: 4099 }]
    },
    ceilingMountPrices: [
      { maxW: 5850, price: 39 }  // Forfait fixe peu importe la dimension
    ],
    ledCoffretPrice: 362,  // Prix LED coffre spécifique pour ce modèle
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
    image: "/images/produits/heliom/1.jpg",
    compatible_toile_types: ['ORCH', 'ORCH_MAX', 'SATT'],
    compatibility: { led_arms: true, led_box: true, lambrequin_fixe: false, lambrequin_enroulable: false, max_width: 6000, max_projection: 3500 },
    arm_type: 'standard',
    wind_class: 'classe_2',
    armLogic: 'standard_2',
    minWidths: { 1500: 2340, 2000: 2840, 2500: 3340, 2750: 3590, 3000: 3840, 3250: 4090, 3500: 4340 },
    buyPrices: {
      1500: [{ maxW: 2400, priceHT: 3510 }, { maxW: 3580, priceHT: 3634 }, { maxW: 4200, priceHT: 3823 }, { maxW: 5290, priceHT: 4142 }, { maxW: 6000, priceHT: 4252 }],
      2000: [{ maxW: 3580, priceHT: 3704 }, { maxW: 4200, priceHT: 3899 }, { maxW: 5290, priceHT: 4235 }, { maxW: 6000, priceHT: 4358 }],
      2500: [{ maxW: 3580, priceHT: 3800 }, { maxW: 4200, priceHT: 4000 }, { maxW: 5290, priceHT: 4358 }, { maxW: 6000, priceHT: 4493 }],
      2750: [{ maxW: 4200, priceHT: 4077 }, { maxW: 5290, priceHT: 4421 }, { maxW: 6000, priceHT: 4579 }],
      3000: [{ maxW: 4200, priceHT: 4124 }, { maxW: 5290, priceHT: 4473 }, { maxW: 6000, priceHT: 4639 }],
      3250: [{ maxW: 4200, priceHT: 4169 }, { maxW: 5290, priceHT: 4522 }, { maxW: 6000, priceHT: 4696 }],
      3500: [{ maxW: 5290, priceHT: 4574 }, { maxW: 6000, priceHT: 4754 }]
    },
    ceilingMountPrices: [
      { maxW: 2400, price: 307 }, { maxW: 3580, price: 307 }, { maxW: 4200, price: 460 },
      { maxW: 5290, price: 460 }, { maxW: 6000, price: 460 }
    ],
    ledCoffretPrice: 362,  // Prix LED coffre spécifique pour ce modèle
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
    image: "/images/produits/heliom_plus/1.jpg",
    compatible_toile_types: ['ORCH', 'ORCH_MAX', 'SATT'],
    compatibility: { led_arms: true, led_box: true, lambrequin_fixe: false, lambrequin_enroulable: true, max_width: 6000, max_projection: 4000 },
    arm_type: 'standard',
    wind_class: 'classe_2',
    armLogic: 'standard_2',
    minWidths: { 2500: 3420, 2750: 3670, 3000: 3920, 3250: 4170, 3500: 4420, 4000: 4920 },
    buyPrices: {
      2500: [{ maxW: 3580, priceHT: 3933 }, { maxW: 4200, priceHT: 4154 }, { maxW: 5290, priceHT: 4493 }, { maxW: 6000, priceHT: 4626 }],
      2750: [{ maxW: 4200, priceHT: 4198 }, { maxW: 5290, priceHT: 4547 }, { maxW: 6000, priceHT: 4685 }],
      3000: [{ maxW: 4200, priceHT: 4241 }, { maxW: 5290, priceHT: 4601 }, { maxW: 6000, priceHT: 4748 }],
      3250: [{ maxW: 4200, priceHT: 4324 }, { maxW: 5290, priceHT: 4705 }, { maxW: 6000, priceHT: 4865 }],
      3500: [{ maxW: 5290, priceHT: 4772 }, { maxW: 6000, priceHT: 4941 }],
      4000: [{ maxW: 5290, priceHT: 5108 }, { maxW: 6000, priceHT: 5288 }]
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
    image: "/images/produits/kalyo/1.jpg",
    compatible_toile_types: ['ORCH', 'ORCH_MAX', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: true, max_width: 6000, max_projection: 3500 },
    arm_type: 'standard',
    wind_class: 'classe_2',
    armLogic: 'standard_2',
    minWidths: { 1500: 2160, 2000: 2660, 2500: 3160, 2750: 3410, 3000: 3720, 3250: 3970, 3500: 4220 },
    buyPrices: {
      1500: [{ maxW: 2400, priceHT: 2860 }, { maxW: 3580, priceHT: 3460 }, { maxW: 4760, priceHT: 3830 }, { maxW: 5610, priceHT: 4190 }, { maxW: 6000, priceHT: 4394 }],
      2000: [{ maxW: 3580, priceHT: 3535 }, { maxW: 4760, priceHT: 3926 }, { maxW: 5610, priceHT: 4304 }, { maxW: 6000, priceHT: 4531 }],
      2500: [{ maxW: 3580, priceHT: 3627 }, { maxW: 4760, priceHT: 4039 }, { maxW: 5610, priceHT: 4424 }, { maxW: 6000, priceHT: 4734 }],
      2750: [{ maxW: 3580, priceHT: 3685 }, { maxW: 4760, priceHT: 4124 }, { maxW: 5610, priceHT: 4572 }, { maxW: 6000, priceHT: 4824 }],
      3000: [{ maxW: 4760, priceHT: 4203 }, { maxW: 5610, priceHT: 4639 }, { maxW: 6000, priceHT: 4937 }],
      3250: [{ maxW: 4760, priceHT: 4286 }, { maxW: 5610, priceHT: 4727 }, { maxW: 6000, priceHT: 5087 }],
      3500: [{ maxW: 4760, priceHT: 4361 }, { maxW: 5610, priceHT: 4869 }, { maxW: 6000, priceHT: 5245 }]
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
    },    deliveryType: 'ready_to_install',
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
    image: "/images/produits/dynasta/1.jpg",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 12000, max_projection: 4000, allowed_colors: ['9010', '1015', '7016'] },
    arm_type: 'ultra_renforce',
    wind_class: 'classe_2',
    armLogic: 'couples_4_6',
    minWidths: { 1500: 2050, 2000: 2550, 2500: 3130, 2750: 3380, 3000: 3630, 3250: 3880, 3500: 4130, 4000: 4630 },
    buyPrices: {
     1500: [{ maxW: 4760, priceHT: 2970 }, { maxW: 5610, priceHT: 3134 }, { maxW: 6000, priceHT: 3195 }, { maxW: 7110, priceHT: 4939 }, { maxW: 8280, priceHT: 5767 }, { maxW: 9450, priceHT: 5911 }, { maxW: 10620, priceHT: 6439 }, { maxW: 11220, priceHT: 6745 }, { maxW: 12000, priceHT: 7130 }],
     2000: [{ maxW: 4760, priceHT: 35478 }, { maxW: 5610, priceHT: 3265 }, { maxW: 6000, priceHT: 3357 }, { maxW: 7110, priceHT: 5114 }, { maxW: 8280, priceHT: 5971 }, { maxW: 9450, priceHT: 6136 }, { maxW: 10620, priceHT: 6691 }, { maxW: 11220, priceHT: 7016 }, { maxW: 12000, priceHT: 7427 }],
     2500: [{ maxW: 4760, priceHT: 3220 }, { maxW: 5610, priceHT: 3433 }, { maxW: 6000, priceHT: 3539 }, { maxW: 7110, priceHT: 5355 }, { maxW: 8280, priceHT: 6228 }, { maxW: 9450, priceHT: 6424 }, { maxW: 10620, priceHT: 6995 }, { maxW: 11220, priceHT: 7349 }, { maxW: 12000, priceHT: 7787 }],
     2750: [{ maxW: 4760, priceHT: 3262 }, { maxW: 5610, priceHT: 3481 }, { maxW: 6000, priceHT: 3609 }, { maxW: 7110, priceHT: 5422 }, { maxW: 8280, priceHT: 6311 }, { maxW: 9450, priceHT: 6511 }, { maxW: 10620, priceHT: 7099 }, { maxW: 11220, priceHT: 7461 }, { maxW: 12000, priceHT: 7913 }],
     3000: [{ maxW: 4760, priceHT: 3339 }, { maxW: 5610, priceHT: 3569 }, { maxW: 6000, priceHT: 3722 }, { maxW: 7110, priceHT: 5557 }, { maxW: 8280, priceHT: 6457 }, { maxW: 9450, priceHT: 6665 }, { maxW: 10620, priceHT: 7268 }, { maxW: 11220, priceHT: 7646 }, { maxW: 12000, priceHT: 8127 }],
     3250: [{ maxW: 4760, priceHT: 3559 }, { maxW: 5610, priceHT: 3800 }, { maxW: 6000, priceHT: 3964 }, { maxW: 7110, priceHT: 6005 }, { maxW: 8280, priceHT: 6784 }, { maxW: 9450, priceHT: 7051 }, { maxW: 10620, priceHT: 7693 }, { maxW: 11220, priceHT: 8060 }, { maxW: 12000, priceHT: 8543 }],
     3500: [{ maxW: 4760, priceHT: 3631 }, { maxW: 5610, priceHT: 3881 }, { maxW: 6000, priceHT: 4055 }, { maxW: 7110, priceHT: 6052 }, { maxW: 8280, priceHT: 6856 }, { maxW: 9450, priceHT: 7182 }, { maxW: 10620, priceHT: 7830 }, { maxW: 11220, priceHT: 8212 }, { maxW: 12000, priceHT: 8710 }],
     4000: [{ maxW: 4760, priceHT: 3807 }, { maxW: 5610, priceHT: 4082 }, { maxW: 6000, priceHT: 4099 }, { maxW: 7110, priceHT: 6212 }, { maxW: 8280, priceHT: 7013 }, { maxW: 9450, priceHT: 7504 }, { maxW: 10620, priceHT: 8181 }, { maxW: 11220, priceHT: 8581 }, { maxW: 12000, priceHT: 9103 }] 
   },
    ceilingMountPrices: [
      { maxW: 4760, price: 544 }, { maxW: 5610, price: 544 }, { maxW: 6000, price: 573 },
      { maxW: 7110, price: 791 }, { maxW: 8280, price: 1056 }, { maxW: 9450, price: 1072 },
      { maxW: 10620, price: 1072 }, { maxW: 11220, price: 1225 }, { maxW: 12000, price: 1294 }
    ],    deliveryType: 'ready_up_to_6m',
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
    image: "/images/produits/belharra/1.jpg",
    compatible_toile_types: ['ORCH','SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: true, max_width: 12000, max_projection: 4000 },
    arm_type: 'ultra_renforce',
    wind_class: 'classe_2',
    armLogic: 'couples_4_6',
    minWidths: { 1500: 2400, 2000: 2050, 2500: 3130, 2750: 3380, 3000: 3630, 3250: 3880, 3500: 4130, 4000: 4630 },
    buyPrices: {
      1500: [
        { maxW: 4760, priceHT: 3362 }, { maxW: 5610, priceHT: 3573 }, { maxW: 6000, priceHT: 3667 }, // Belharra Promo
        { maxW: 7110, priceHT: 5531 }, { maxW: 8280, priceHT: 6458 }, { maxW: 9450, priceHT: 6620 }, // Belharra Standard
        { maxW: 10620, priceHT: 7214 }, { maxW: 11220, priceHT: 7555 }, { maxW: 12000, priceHT: 7979 }
      ],
      2000: [
        { maxW: 4760, priceHT: 3487 }, { maxW: 5610, priceHT: 3721 }, { maxW: 6000, priceHT: 3839 }, // Belharra Promo
        { maxW: 7110, priceHT: 5729 }, { maxW: 8280, priceHT: 6685 }, { maxW: 9450, priceHT: 6871 }, // Belharra Standard
        { maxW: 10620, priceHT: 7493 }, { maxW: 11220, priceHT: 7857 }, { maxW: 12000, priceHT: 8318 }
      ],
      2500: [
        { maxW: 4760, priceHT: 3650 }, { maxW: 5610, priceHT: 3908 }, { maxW: 6000, priceHT: 4052 }, // Belharra Promo
        { maxW: 7110, priceHT: 5996 }, { maxW: 8280, priceHT: 6979 }, { maxW: 9450, priceHT: 7189 }, // Belharra Standard
        { maxW: 10620, priceHT: 7835 }, { maxW: 11220, priceHT: 8230 }, { maxW: 12000, priceHT: 8725 }
      ],
      2750: [
        { maxW: 4760, priceHT: 3699 }, { maxW: 5610, priceHT: 3965 }, { maxW: 6000, priceHT: 4126 }, // Belharra Promo
        { maxW: 7110, priceHT: 6071 }, { maxW: 8280, priceHT: 7063 }, { maxW: 9450, priceHT: 7290 }, // Belharra Standard
        { maxW: 10620, priceHT: 7952 }, { maxW: 11220, priceHT: 8357 }, { maxW: 12000, priceHT: 8863 }
      ],
      3000: [
        { maxW: 4760, priceHT: 3782 }, { maxW: 5610, priceHT: 4064 }, { maxW: 6000, priceHT: 4252 }, // Belharra Promo
        { maxW: 7110, priceHT: 6221 }, { maxW: 8280, priceHT: 7231 }, { maxW: 9450, priceHT: 7472 }, // Belharra Standard
        { maxW: 10620, priceHT: 8141 }, { maxW: 11220, priceHT: 8561 }, { maxW: 12000, priceHT: 9101 }
      ],
      3250: [
        { maxW: 4760, priceHT: 4030 }, { maxW: 5610, priceHT: 4453 }, { maxW: 6000, priceHT: 4666 }, // Belharra Promo
        { maxW: 7110, priceHT: 6732 }, { maxW: 8280, priceHT: 7596 }, { maxW: 9450, priceHT: 7900 }, // Belharra Standard
        { maxW: 10620, priceHT: 8617 }, { maxW: 11220, priceHT: 9027 }, { maxW: 12000, priceHT: 9572 }
      ],
      3500: [
        { maxW: 4760, priceHT: 4108 }, { maxW: 5610, priceHT: 4547 }, { maxW: 6000, priceHT: 4774 }, // Belharra Promo
        { maxW: 7110, priceHT: 6784 }, { maxW: 8280, priceHT: 7666 }, { maxW: 9450, priceHT: 8041 }, // Belharra Standard
        { maxW: 10620, priceHT: 8775 }, { maxW: 11220, priceHT: 9196 }, { maxW: 12000, priceHT: 9760 }
      ],
      4000: [
        { maxW: 4760, priceHT: 4313 }, { maxW: 5610, priceHT: 4772 }, { maxW: 6000, priceHT: 5026 }, // Belharra Promo
        { maxW: 7110, priceHT: 6959 }, { maxW: 8280, priceHT: 7794 }, { maxW: 9450, priceHT: 8406 }, // Belharra Standard
        { maxW: 10620, priceHT: 9162 }, { maxW: 11220, priceHT: 9617 }, { maxW: 12000, priceHT: 10202 }
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
    },    deliveryType: 'ready_up_to_6m',
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
    image: "/images/produits/belharra_2/1.jpg",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: true, lambrequin_fixe: true, lambrequin_enroulable: true, max_width: 12000, max_projection: 4000 },
    arm_type: 'ultra_renforce',
    wind_class: 'classe_2',
    armLogic: 'couples_4_6',
    minWidths: { 1500: 2400, 2000: 2050, 2500: 3130, 2750: 3380, 3000: 3630, 3250: 3880, 3500: 4130, 4000: 4630 },
    buyPrices: {
      1500: [{ maxW: 2400, priceHT: 2999 }, { maxW: 3580, priceHT: 3478 }, { maxW: 4760, priceHT: 4084 }, { maxW: 5610, priceHT: 4513 }, { maxW: 6000, priceHT: 4811 }, { maxW: 7110, priceHT: 6068 }, { maxW: 8280, priceHT: 7085 }, { maxW: 9450, priceHT: 7263 }, { maxW: 10620, priceHT: 7915 }, { maxW: 11220, priceHT: 8289 }, { maxW: 12000, priceHT: 8753 }],
      2000: [{ maxW: 3580, priceHT: 3586 }, { maxW: 4760, priceHT: 4219 }, { maxW: 5610, priceHT: 4675 }, { maxW: 6000, priceHT: 5002 }, { maxW: 7110, priceHT: 6286 }, { maxW: 8280, priceHT: 7335 }, { maxW: 9450, priceHT: 7538 }, { maxW: 10620, priceHT: 8221 }, { maxW: 11220, priceHT: 8620 }, { maxW: 12000, priceHT: 9124 }],
      2500: [{ maxW: 3580, priceHT: 3731 }, { maxW: 4760, priceHT: 4401 }, { maxW: 5610, priceHT: 4880 }, { maxW: 6000, priceHT: 5234 }, { maxW: 7110, priceHT: 6579 }, { maxW: 8280, priceHT: 7657 }, { maxW: 9450, priceHT: 7888 }, { maxW: 10620, priceHT: 8595 }, { maxW: 11220, priceHT: 9029 }, { maxW: 12000, priceHT: 9572 }],
      2750: [{ maxW: 3580, priceHT: 3776 }, { maxW: 4760, priceHT: 4453 }, { maxW: 5610, priceHT: 4943 }, { maxW: 6000, priceHT: 5317 }, { maxW: 7110, priceHT: 6660 }, { maxW: 8280, priceHT: 7749 }, { maxW: 9450, priceHT: 7997 }, { maxW: 10620, priceHT: 8725 }, { maxW: 11220, priceHT: 9169 }, { maxW: 12000, priceHT: 9724 }],
      3000: [{ maxW: 4760, priceHT: 4543 }, { maxW: 5610, priceHT: 5051 }, { maxW: 6000, priceHT: 5454 }, { maxW: 7110, priceHT: 6824 }, { maxW: 8280, priceHT: 7933 }, { maxW: 9450, priceHT: 8197 }, { maxW: 10620, priceHT: 8932 }, { maxW: 11220, priceHT: 9391 }, { maxW: 12000, priceHT: 9985 }],
      3250: [{ maxW: 4760, priceHT: 4815 }, { maxW: 5610, priceHT: 5477 }, { maxW: 6000, priceHT: 5909 }, { maxW: 7110, priceHT: 7385 }, { maxW: 8280, priceHT: 8334 }, { maxW: 9450, priceHT: 8667 }, { maxW: 10620, priceHT: 9454 }, { maxW: 11220, priceHT: 9904 }, { maxW: 12000, priceHT: 10501 }],
      3500: [{ maxW: 4760, priceHT: 4901 }, { maxW: 5610, priceHT: 5582 }, { maxW: 6000, priceHT: 6026 }, { maxW: 7110, priceHT: 7443 }, { maxW: 8280, priceHT: 8411 }, { maxW: 9450, priceHT: 8822 }, { maxW: 10620, priceHT: 9628 }, { maxW: 11220, priceHT: 10091 }, { maxW: 12000, priceHT: 10706 }],
      4000: [{ maxW: 4760, priceHT: 5126 }, { maxW: 5610, priceHT: 5827 }, { maxW: 6000, priceHT: 6304 }, { maxW: 7110, priceHT: 7634 }, { maxW: 8280, priceHT: 8552 }, { maxW: 9450, priceHT: 9221 }, { maxW: 10620, priceHT: 10051 }, { maxW: 11220, priceHT: 10552 }, { maxW: 12000, priceHT: 11192 }]
    },
    ceilingMountPrices: [
      { maxW: 3580, price: 388 },{ maxW: 5610, price: 544 },{ maxW: 6000, price: 573 }, { maxW: 7110, price: 791 }, { maxW: 8280, price: 1056 }, { maxW: 10620, price: 1072 }, { maxW: 11220, price: 1225 }, { maxW: 12000, price: 1294 }
    ],
    lambrequinEnroulablePrices: {
      manual: [],
      motorized: [{ maxW: 2400, price: 476 }, { maxW: 3580, price: 631 }, { maxW: 4760, price: 688 }, { maxW: 5610, price: 859 }, { maxW: 6000, price: 878 }]
    },
    ledCoffretPrice: 362,  // Prix LED coffre spécifique pour ce modèle
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
    image: "/images/produits/antibes/1.jpg",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 12000, max_projection: 3000 },
    arm_type: 'standard',
    wind_class: 'classe_2',
    armLogic: 'standard_2',
    minWidths: { 1500: 2390, 1750: 2390, 2000: 2390, 2500: 3570, 3000: 4750 },
    buyPrices: {
      1500: [
        { maxW: 2390, priceHT: 1834 }, { maxW: 3570, priceHT: 2255 }, { maxW: 4750, priceHT: 2020 }, 
        { maxW: 5610, priceHT: 2536 }, { maxW: 6000, priceHT: 2752 }, { maxW: 7110, priceHT: 3580 }, 
        { maxW: 8280, priceHT: 3852 }, { maxW: 9450, priceHT: 4199 }, { maxW: 10790, priceHT: 4502 }, 
        { maxW: 11220, priceHT: 4793 }, { maxW: 12000, priceHT: 4999 }
      ],
      1750: [
        { maxW: 2390, priceHT: 1849 }, { maxW: 3570, priceHT: 2036 }, { maxW: 4750, priceHT: 2268 }, 
        { maxW: 5610, priceHT: 2549 }, { maxW: 6000, priceHT: 2772 }, { maxW: 7110, priceHT: 3586 }, 
        { maxW: 8280, priceHT: 3863 }, { maxW: 9450, priceHT: 4214 }, { maxW: 10790, priceHT: 4513 }, 
        { maxW: 11220, priceHT: 4806 }, { maxW: 12000, priceHT: 5011 }
      ],
      2000: [
        { maxW: 2390, priceHT: 1858 }, { maxW: 3570, priceHT: 2047 }, { maxW: 4750, priceHT: 2282 }, 
        { maxW: 5610, priceHT: 2558 }, { maxW: 6000, priceHT: 2783 }, { maxW: 7110, priceHT: 3613 }, 
        { maxW: 8280, priceHT: 3888 }, { maxW: 9450, priceHT: 4239 }, { maxW: 10790, priceHT: 4531 }, 
        { maxW: 11220, priceHT: 4826 }, { maxW: 12000, priceHT: 5040 }
      ],
      2500: [
        { maxW: 3570, priceHT: 2059 }, { maxW: 4750, priceHT: 2290 }, { maxW: 5610, priceHT: 2567 }, 
        { maxW: 6000, priceHT: 2797 }, { maxW: 7110, priceHT: 3663 }, { maxW: 8280, priceHT: 3935 }, 
        { maxW: 9450, priceHT: 4277 }, { maxW: 10790, priceHT: 4577 }, { maxW: 11220, priceHT: 4869 }, 
        { maxW: 12000, priceHT: 5087 }
      ],
      3000: [
        { maxW: 4750, priceHT: 2327 }, { maxW: 5610, priceHT: 2605 }, { maxW: 6000, priceHT: 2830 }, 
        { maxW: 7110, priceHT: 3730 }, { maxW: 8280, priceHT: 4349 }, { maxW: 9450, priceHT: 4007 }, 
        { maxW: 10790, priceHT: 4653 }, { maxW: 11220, priceHT: 4946 }, { maxW: 12000, priceHT: 5170 }
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
    ],    deliveryType: 'ready_to_install',
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
    image: "/images/produits/madrid/1.jpg",
    compatible_toile_types: ['ORCH', 'ORCH_MAX', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: true, max_width: 18000, max_projection: 4000 },
    arm_type: 'renforce',
    wind_class: 'classe_2',
    armLogic: 'couples_4_6',
    minWidths: { 1500: 2390, 2000: 2390, 2500: 3570, 3000: 3570, 3500: 4750, 4000: 4750 },
    buyPrices: {
      1500: [
        { maxW: 2390, priceHT: 1895 }, { maxW: 3570, priceHT: 2133 }, { maxW: 4750, priceHT: 2354 }, 
        { maxW: 5610, priceHT: 2624 }, { maxW: 6000, priceHT: 2858 }, { maxW: 7110, priceHT: 3821 }, 
        { maxW: 8280, priceHT: 4077 }, { maxW: 9450, priceHT: 4396 }, { maxW: 10790, priceHT: 4651 }, 
        { maxW: 11220, priceHT: 4959 }, { maxW: 12000, priceHT: 5197 }, { maxW: 12970, priceHT: 6151 }, 
        { maxW: 14140, priceHT: 6311 }, { maxW: 15310, priceHT: 6736 }, { maxW: 16480, priceHT: 6914 }, 
        { maxW: 16830, priceHT: 7088 }, { maxW: 18000, priceHT: 7438 }
      ],
      2000: [
        { maxW: 2390, priceHT: 1969 }, { maxW: 3570, priceHT: 2234 }, { maxW: 4750, priceHT: 2489 }, 
        { maxW: 5610, priceHT: 2786 }, { maxW: 6000, priceHT: 3044 }, { maxW: 7110, priceHT: 4073 }, 
        { maxW: 8280, priceHT: 4354 }, { maxW: 9450, priceHT: 4702 }, { maxW: 10790, priceHT: 4997 }, 
        { maxW: 11220, priceHT: 5332 }, { maxW: 12000, priceHT: 5575 }, { maxW: 12970, priceHT: 6572 }, 
        { maxW: 14140, priceHT: 6779 }, { maxW: 15310, priceHT: 7231 }, { maxW: 16480, priceHT: 7438 }, 
        { maxW: 16830, priceHT: 7643 }, { maxW: 18000, priceHT: 7999 }
      ],
      2500: [
        { maxW: 3570, priceHT: 2376 }, { maxW: 4750, priceHT: 2662 }, { maxW: 5610, priceHT: 2979 }, 
        { maxW: 6000, priceHT: 3278 }, { maxW: 7110, priceHT: 4412 }, { maxW: 8280, priceHT: 4725 }, 
        { maxW: 9450, priceHT: 5110 }, { maxW: 10790, priceHT: 5436 }, { maxW: 11220, priceHT: 5801 }, 
        { maxW: 12000, priceHT: 6044 }, { maxW: 12970, priceHT: 7160 }, { maxW: 14140, priceHT: 7402 }, 
        { maxW: 15310, priceHT: 7886 }, { maxW: 16480, priceHT: 8125 }, { maxW: 16830, priceHT: 8361 }, 
        { maxW: 18000, priceHT: 8728 }
      ],
      3000: [
        { maxW: 3570, priceHT: 2497 }, { maxW: 4750, priceHT: 2815 }, { maxW: 5610, priceHT: 3157 }, 
        { maxW: 6000, priceHT: 3478 }, { maxW: 7110, priceHT: 4655 }, { maxW: 8280, priceHT: 4999 }, 
        { maxW: 9450, priceHT: 5413 }, { maxW: 10790, priceHT: 5773 }, { maxW: 11220, priceHT: 6169 }, 
        { maxW: 12000, priceHT: 6422 }, { maxW: 12970, priceHT: 7580 }, { maxW: 14140, priceHT: 7848 }, 
        { maxW: 15310, priceHT: 8370 }, { maxW: 16480, priceHT: 8638 }, { maxW: 16830, priceHT: 8905 }, 
        { maxW: 18000, priceHT: 9275 }
      ],
      3500: [
        { maxW: 4750, priceHT: 3017 }, { maxW: 5610, priceHT: 3388 }, { maxW: 6000, priceHT: 3740 }, 
        { maxW: 7110, priceHT: 4826 }, { maxW: 8280, priceHT: 5362 }, { maxW: 9450, priceHT: 5855 }, 
        { maxW: 10790, priceHT: 6244 }, { maxW: 11220, priceHT: 6669 }, { maxW: 12000, priceHT: 6935 }, 
        { maxW: 12970, priceHT: 8197 }, { maxW: 14140, priceHT: 8494 }, { maxW: 15310, priceHT: 9052 }, 
        { maxW: 16480, priceHT: 9355 }, { maxW: 16830, priceHT: 9655 }, { maxW: 18000, priceHT: 10046 }
      ],
      4000: [
        { maxW: 4750, priceHT: 3343 }, { maxW: 5610, priceHT: 3735 }, { maxW: 6000, priceHT: 4136 }, 
        { maxW: 7110, priceHT: 5245 }, { maxW: 8280, priceHT: 5611 }, { maxW: 9450, priceHT: 6449 }, 
        { maxW: 10790, priceHT: 6878 }, { maxW: 11220, priceHT: 7333 }, { maxW: 12000, priceHT: 7614 }, 
        { maxW: 12970, priceHT: 8642 }, { maxW: 14140, priceHT: 9387 }, { maxW: 15310, priceHT: 9976 }, 
        { maxW: 16480, priceHT: 10305 }, { maxW: 16830, priceHT: 10627 }, { maxW: 18000, priceHT: 11061 }
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
    ],    deliveryType: 'ready_up_to_6m',
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
    image: "/images/produits/genes/1.jpg",
    compatible_toile_types: ['ORCH'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 5550, max_projection: 2500 },
    arm_type: 'standard',
    wind_class: 'classe_2',
    armLogic: 'standard_2',
    minWidths: { 1500: 2390, 1750: 2390, 2000: 2390, 2500: 2750 },
    buyPrices: {
      1500: [{ maxW: 2390, priceHT: 1210 }, { maxW: 3570, priceHT: 1352 }, { maxW: 4750, priceHT: 1537 }, { maxW: 5550, priceHT: 1715 }],
      1750: [{ maxW: 2390, priceHT: 1219 }, { maxW: 3570, priceHT: 1364 }, { maxW: 4750, priceHT: 1546 }, { maxW: 5550, priceHT: 1724 }],
      2000: [{ maxW: 2390, priceHT: 1228 }, { maxW: 3570, priceHT: 1381 }, { maxW: 4750, priceHT: 1561 }, { maxW: 5550, priceHT: 1741 }],
      2500: [{ maxW: 2750, priceHT: 1397 }, { maxW: 4750, priceHT: 1575 }]
    },
    auventEtJouesPrices: [
      { maxW: 2390, price: 203 }, { maxW: 3570, price: 288 }, { maxW: 4750, price: 300 }, { maxW: 5550, price: 352 }
    ],
    lambrequinFixeDifferentFabricPrices: [
      { maxW: 2390, price: 80 }, { maxW: 3570, price: 92 }, { maxW: 4750, price: 106 }, { maxW: 5550, price: 112 }
    ],    deliveryType: 'disassembled',
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
    image: "/images/produits/menton/1.jpg",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: false, max_width: 12000, max_projection: 3000 },
    arm_type: 'renforce',
    wind_class: 'classe_2',
    armLogic: 'standard_2',
    minWidths: { 1500: 2390, 1750: 2390, 2000: 2390, 2500: 3570, 3000: 4750 },
    buyPrices: {
      1500: [{ maxW: 2390, priceHT: 1751 }, { maxW: 3570, priceHT: 1935 }, { maxW: 4750, priceHT: 2111 }, { maxW: 5700, priceHT: 2313 }, { maxW: 6000, priceHT: 2545 }, { maxW: 7110, priceHT: 3463 }, { maxW: 8280, priceHT: 3695 }, { maxW: 9450, priceHT: 3904 }, { maxW: 10750, priceHT: 4144 }, { maxW: 11400, priceHT: 4316 }, { maxW: 12000, priceHT: 4482 }],
      1750: [{ maxW: 2390, priceHT: 1764 }, { maxW: 3570, priceHT: 1946 }, { maxW: 4750, priceHT: 2131 }, { maxW: 5700, priceHT: 2326 }, { maxW: 6000, priceHT: 2551 }, { maxW: 7110, priceHT: 3481 }, { maxW: 8280, priceHT: 3722 }, { maxW: 9450, priceHT: 3924 }, { maxW: 10750, priceHT: 4169 }, { maxW: 11400, priceHT: 4336 }, { maxW: 12000, priceHT: 4502 }],
      2000: [{ maxW: 2390, priceHT: 1771 }, { maxW: 3570, priceHT: 1957 }, { maxW: 4750, priceHT: 2140 }, { maxW: 5700, priceHT: 2333 }, { maxW: 6000, priceHT: 2563 }, { maxW: 7110, priceHT: 3505 }, { maxW: 8280, priceHT: 3739 }, { maxW: 9450, priceHT: 3944 }, { maxW: 10750, priceHT: 4192 }, { maxW: 11400, priceHT: 4360 }, { maxW: 12000, priceHT: 4525 }],
      2500: [{ maxW: 3570, priceHT: 1980 }, { maxW: 4750, priceHT: 2167 }, { maxW: 5700, priceHT: 2365 }, { maxW: 6000, priceHT: 2590 }, { maxW: 7110, priceHT: 3553 }, { maxW: 8280, priceHT: 3787 }, { maxW: 9450, priceHT: 3992 }, { maxW: 10750, priceHT: 4243 }, { maxW: 11400, priceHT: 4408 }, { maxW: 12000, priceHT: 4588 }],
      3000: [{ maxW: 4750, priceHT: 2200 }, { maxW: 5700, priceHT: 2396 }, { maxW: 6000, priceHT: 2633 }, { maxW: 7110, priceHT: 3629 }, { maxW: 8280, priceHT: 3866 }, { maxW: 9450, priceHT: 4077 }, { maxW: 10750, priceHT: 4320 }, { maxW: 11400, priceHT: 4493 }, { maxW: 12000, priceHT: 4671 }]
    },
    auventEtJouesPrices: [
      { maxW: 2390, price: 215 }, { maxW: 3570, price: 221 }, { maxW: 4750, price: 277 }, { maxW: 5700, price: 335 }, { maxW: 6000, price: 358 }, { maxW: 7110, price: 448 }, { maxW: 8280, price: 511 }, { maxW: 9450, price: 560 }, { maxW: 10750, price: 618 }, { maxW: 11400, price: 671 }, { maxW: 12000, price: 717 }
    ],    deliveryType: 'disassembled',
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
    image: "/images/produits/lisbonne/1.jpg",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: true, max_width: 18000, max_projection: 4000 },
    arm_type: 'ultra_renforce',
    wind_class: 'classe_2',
    armLogic: 'couples_4_6',
    minWidths: { 1500: 2750, 2000: 3250, 2500: 3750, 3000: 4250, 3500: 4750, 4000: 4750 },
    buyPrices: {
      1500: [{ maxW: 2750, priceHT: 1879 }, { maxW: 3250, priceHT: 1993 }, { maxW: 3750, priceHT: 2104 }, { maxW: 4250, priceHT: 2218 }, { maxW: 4750, priceHT: 2329 }, { maxW: 5250, priceHT: 2443 }, { maxW: 5750, priceHT: 2554 }, { maxW: 6250, priceHT: 2668 }, { maxW: 6750, priceHT: 2779 }, { maxW: 7250, priceHT: 2893 }, { maxW: 7750, priceHT: 3004 }, { maxW: 8000, priceHT: 3060 }],
      2000: [{ maxW: 3250, priceHT: 2104 }, { maxW: 3750, priceHT: 2218 }, { maxW: 4250, priceHT: 2329 }, { maxW: 4750, priceHT: 2443 }, { maxW: 5250, priceHT: 2554 }, { maxW: 5750, priceHT: 2668 }, { maxW: 6250, priceHT: 2779 }, { maxW: 6750, priceHT: 2893 }, { maxW: 7250, priceHT: 3004 }, { maxW: 7750, priceHT: 3118 }, { maxW: 8000, priceHT: 3173 }],
      2500: [{ maxW: 3750, priceHT: 2329 }, { maxW: 4250, priceHT: 2443 }, { maxW: 4750, priceHT: 2554 }, { maxW: 5250, priceHT: 2668 }, { maxW: 5750, priceHT: 2779 }, { maxW: 6250, priceHT: 2893 }, { maxW: 6750, priceHT: 3004 }, { maxW: 7250, priceHT: 3118 }, { maxW: 7750, priceHT: 3229 }, { maxW: 8000, priceHT: 3285 }],
      3000: [{ maxW: 4250, priceHT: 2554 }, { maxW: 4750, priceHT: 2668 }, { maxW: 5250, priceHT: 2779 }, { maxW: 5750, priceHT: 2893 }, { maxW: 6250, priceHT: 3004 }, { maxW: 6750, priceHT: 3118 }, { maxW: 7250, priceHT: 3229 }, { maxW: 7750, priceHT: 3343 }, { maxW: 8000, priceHT: 3398 }],
      3500: [{ maxW: 4750, priceHT: 2779 }, { maxW: 5250, priceHT: 2893 }, { maxW: 5750, priceHT: 3004 }, { maxW: 6250, priceHT: 3118 }, { maxW: 6750, priceHT: 3229 }, { maxW: 7250, priceHT: 3343 }, { maxW: 7750, priceHT: 3454 }, { maxW: 8000, priceHT: 3510 }],
      4000: [{ maxW: 4750, priceHT: 3004 }, { maxW: 5250, priceHT: 3118 }, { maxW: 5700, priceHT: 3460 }, { maxW: 6000, priceHT: 3852 }, { maxW: 6500, priceHT: 4077 }, { maxW: 7000, priceHT: 4302 }, { maxW: 7500, priceHT: 4527 }, { maxW: 8000, priceHT: 4752 }]
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
    ],    deliveryType: 'disassembled',
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
    image: "/images/produits/bras_croises/1.jpg",
    compatible_toile_types: ['ORCH', 'SATT'],
    compatibility: { led_arms: true, led_box: false, lambrequin_fixe: true, lambrequin_enroulable: true, max_width: 3835, max_projection: 3500 },
    arm_type: 'standard',
    wind_class: 'classe_2',
    armLogic: 'standard_2',
    minWidths: { 1500: 1100, 2000: 1100, 2500: 2390, 2750: 2390, 3000: 2390, 3250: 2390, 3500: 2390 },
    buyPrices: {
      1500: [{ maxW: 2390, priceHT: 2059 }],
      2000: [{ maxW: 2390, priceHT: 2092 }],
      2500: [{ maxW: 2390, priceHT: 2153 }, { maxW: 3570, priceHT: 2347 }],
      2750: [{ maxW: 2390, priceHT: 2171 }, { maxW: 3570, priceHT: 2367 }],
      3000: [{ maxW: 2390, priceHT: 2192 }, { maxW: 3570, priceHT: 2380 }],
      3250: [{ maxW: 2390, priceHT: 2219 }, { maxW: 3570, priceHT: 2414 }, { maxW: 3835, priceHT: 2651 }],
      3500: [{ maxW: 2390, priceHT: 2239 }, { maxW: 3570, priceHT: 2430 }, { maxW: 3835, priceHT: 2686 }]
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
    ],    deliveryType: 'ready_to_install',
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
    awning?: boolean,                 // Auvent et joues
    isPosePro?: boolean,
    isCustomColor?: boolean,
    isPosePlafond?: boolean           // Fixation plafond
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

  // Option Auvent et Joues (disponible pour certains modèles monoblocs)
  if (config.options.awning && model.auventEtJouesPrices) {
    const tier = model.auventEtJouesPrices.find(t => config.width <= t.maxW);
    if (tier) totalAchatHT += tier.price;
  }

  // Option Sous-coffre (si disponible - prix à définir)
  // Note: Prix sous-coffre non défini dans le catalogue actuel
  // if (config.options.sousCoffre && model.sousCoffrePrices) {
  //   const tier = model.sousCoffrePrices.find(t => config.width <= t.maxW);
  //   if (tier) totalAchatHT += tier.price;
  // }

  // 4. Calcul du prix total de vente HT
  // Les prix dans les grilles sont déjà des prix de vente HT finaux (coefficient déjà appliqué)
  let totalVenteHT = totalAchatHT; // En réalité totalAchatHT contient déjà les prix finaux
  
  // 5. Détails des prix par option pour le retour
  const prixStoreBaseVenteHT = tier.priceHT; // Prix final déjà
  
  let ledArmsHT = 0;
  let ledBoxHT = 0;
  let lambrequinHT = 0;
  let awningHT = 0;
  let posePlafondHT = 0;
  
  if (config.options.ledArms && model.compatibility.led_arms) {
    let nbBras = 2;
    try {
      nbBras = calculateArmsForLargeWidth(config.modelId, config.width, config.projection);
    } catch (error) {
      // Déjà géré
    }
    const ledGrid = OPTIONS_PRICES.LED_ARMS[usedProjection];
    if (ledGrid) {
      ledArmsHT = ledGrid[nbBras] || ledGrid[2] || 0;
    }
  }
  
  if (config.options.ledBox && model.compatibility.led_box) {
    ledBoxHT = model.ledCoffretPrice ?? OPTIONS_PRICES.LED_CASSETTE;
  }
  
  if (config.options.lambrequinEnroulable && model.compatibility.lambrequin_enroulable) {
    if (config.modelId !== 'kalyo' || config.projection <= 3250) {
      const grid = model.lambrequinEnroulablePrices;
      const tiers = config.options.lambrequinMotorized ? grid?.motorized : grid?.manual;
      if (tiers && tiers.length > 0) {
        const tier = tiers.find(t => config.width <= t.maxW && t.maxW <= 6000);
        if (tier) {
          lambrequinHT = tier.price;
        }
      }
    }
  }

  if (config.options.awning && model.auventEtJouesPrices) {
    const tier = model.auventEtJouesPrices.find(t => config.width <= t.maxW);
    if (tier) awningHT = tier.price;
  }

  if (config.options.isPosePlafond && model.ceilingMountPrices) {
    const tier = model.ceilingMountPrices.find(t => config.width <= t.maxW);
    if (tier) posePlafondHT = tier.price;
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
      awning_price_ht: Math.round(awningHT),
      pose_plafond_price_ht: Math.round(posePlafondHT),
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
    imageUrl: "/images/produits/kissimy_promo/1.jpg",
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
    imageUrl: "/images/produits/dynasta/1.jpg",
    description: "Jusqu'à 12m de large, la référence pour les grandes surfaces et CHR",
    color: "red",
    gradientFrom: "from-red-500",
    gradientTo: "to-red-600",
    order: 2,
    badge: "PROMO"
  },
  GAMME_EXCELLENCE: {
    id: "GAMME_EXCELLENCE",
    label: "Gamme Excellence",
    tagline: "Le Haut de Gamme",
    imageUrl: "/images/produits/kitanguy_2/1.jpg",
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
    imageUrl: "/images/produits/heliom/1.jpg",
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
    imageUrl: "/images/produits/antibes/1.jpg",
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
    imageUrl: "/images/produits/kalyo/1.jpg",
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
    imageUrl: "/images/produits/bras_croises/1.jpg",
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
    imageUrl: "/images/produits/genes/1.jpg",
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
