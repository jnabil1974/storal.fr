// Types de produits disponibles
export enum ProductType {
  STORE_BANNE = 'store_banne',
  PORTE_BLINDEE = 'porte_blindee',
  STORE_ANTICHALEUR = 'store_antichaleur',
  FENETRE_MENUISERIE = 'fenetre_menuiserie',
  ARMOIRE_PLACARD = 'armoire_placard',
}

// Interface de base pour tous les produits
export interface BaseProduct {
  id: string;
  name: string;
  description: string;
  type: ProductType;
  basePrice: number;
  image: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

// Configuration Store Banne
export interface StoreBanneConfig {
  width: number; // cm
  depth: number; // cm
  motorized: boolean;
  motorType?: 'manuel' | 'electrique' | 'smarty';
  fabric: 'acrylique' | 'polyester' | 'micro-perforé';
  fabricColor: string;
  frameColor: 'blanc' | 'gris' | 'noir' | 'bronze' | 'inox';
  armType: 'coffre' | 'semi-coffre' | 'ouvert';
  windSensor: boolean;
  rainSensor: boolean;
}

// Produit Store Banne
export interface StoreBanneProduct extends BaseProduct {
  type: ProductType.STORE_BANNE;
  specifications: {
    minWidth: number;
    maxWidth: number;
    minDepth: number;
    maxDepth: number;
    availableFabrics: string[];
    availableFrameColors: string[];
    motorOptions: string[];
  };
}

// Configuration Porte Blindée
export interface PorteBlindeeConfig {
  width: number; // cm
  height: number; // cm
  thickness: number; // mm
  material: 'acier' | 'aluminium' | 'composite' | 'bois';
  doorType: 'battante' | 'coulissante' | 'pliante';
  securityLevel: 'A2P_1' | 'A2P_2' | 'A2P_3'; // Niveaux de certification
  color: string;
  glassType?: 'aucun' | 'simple' | 'securisé' | 'blindé';
  glassPercentage?: number; // % de vitrage
  lockType: 'simple' | 'double' | 'triple';
  soundProofing: boolean;
  thermalProofing: boolean;
}

// Produit Porte Blindée
export interface PorteBlindeeProduct extends BaseProduct {
  type: ProductType.PORTE_BLINDEE;
  specifications: {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    availableMaterials: string[];
    availableTypes: string[];
    securityLevels: string[];
    availableColors: string[];
  };
}

// Configuration Store Antichaleur
export interface StoreAntichaleurConfig {
  width: number; // cm
  height: number; // cm
  fabricType: 'screen' | 'occultant' | 'semi-occultant';
  fabricColor: string;
  orientation: 'interieur' | 'exterieur';
  motorized: boolean;
  motorType?: 'manuel' | 'electrique' | 'solaire';
  fixationType: 'standard' | 'sans-percage' | 'encastre';
  uvProtection: boolean;
  thermalControl: boolean;
}

// Configuration Store Banne Coffre KISSIMY - formulaire simplifié
export interface StoreBanneKissimyConfig {
  // Dimensions (grille de tarification)
  avancee: number; // mm: 1500, 2000, 2500, 3000
  largeur: number; // mm: 1800-4830 (par plage)
  
  // Couleur cadre
  couleurCadre: 'RAL_9010' | 'RAL_1015' | 'RAL_7016' | 'AUTRE_RAL'; // RAL_*: 0€, AUTRE_RAL: +86€
  
  // Toile (choix unique par référence Dickson)
  toile: string; // ref toile ex: 'ORCH_290', 'ORCH_SCREEN', etc.
  
  // Accessoires (coches optionnelles)
  poseSousPlafond?: boolean; // +39€
  capteurVent?: boolean; // +90€
  tahoma?: boolean; // +117€
  cablage10m?: boolean; // +48€
  
  // Nouvelles options (nouvelles fonctionnalités)
  ledBras?: boolean; // LED dans les bras
  ledCoffre?: boolean; // LED sous coffre
  lambrequin?: boolean; // Lambrequin enroulable
  lambrequinMotorized?: boolean; // Lambrequin motorisé
}

// Configuration Store Banne Modern (format configurateur/chat AI)
export interface StoreBanneModernConfig {
  modelKey?: string;
  modelName?: string;
  largeur?: number; // cm ou mm selon contexte
  avancee?: number; // cm ou mm selon contexte
  width?: number; // mm
  projection?: number; // mm
  model?: string;
  
  // Frame/Color
  frameColorId?: string;
  frameColorName?: string;
  color?: string;
  
  // Fabric
  fabricRef?: string;
  fabricName?: string;
  fabric_id?: string;
  
  // Motor & Sensors
  motor?: string;
  sensor?: string;
  support?: string;
  
  // LED Options
  ledBras?: boolean;
  ledCoffre?: boolean;
  ledArms?: boolean;
  ledBox?: boolean;
  
  // Lambrequin
  lambrequin?: boolean;
  lambrequinMotorized?: boolean;
  
  // Installation
  posePro?: boolean;
  style?: string;
  description?: string;
  price?: number;
  
  // Anciens champs pour compatibilité
  [key: string]: any;
}

// Options disponibles pour KISSIMY (utilisé dans le configurateur)
export interface KissimyOption {
  id: string;
  name: string;
  description: string;
  priceHT: number;
  priceIncrementTTC?: number; // Calculé depuis priceHT + coefficient
  category: 'motorisation' | 'telecommande' | 'accessoires' | 'couleur';
  mandatory: boolean; // SUNEA IO est inclus
  values?: string[]; // Pour les options avec plusieurs valeurs (télécommande)
}

// Produit Store Antichaleur
export interface StoreAntichaleurProduct extends BaseProduct {
  type: ProductType.STORE_ANTICHALEUR;
  specifications: {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    availableFabricTypes: string[];
    availableColors: string[];
    motorOptions: string[];
  };
}

// Produit Store Banne Coffre KISSIMY
export interface StoreBanneKissimyProduct extends BaseProduct {
  type: ProductType.STORE_BANNE;
  model: 'kissimy'; // Identifiant du modèle spécifique
  specifications: {
    avanceeOptions: number[]; // [1500, 2000, 2500, 3000] mm
    largeurMin: number; // 1800 mm
    largeurMax: number; // 4830 mm
    pricingGrid: {
      avancee: number;
      largeurMin: number;
      largeurMax: number;
      priceHT: number; // Prix base HT
    }[];
    framColors: string[];
    availableOptions: KissimyOption[];
  };
}

// Union type pour tous les produits
export type Product = StoreBanneProduct | PorteBlindeeProduct | StoreAntichaleurProduct | StoreBanneKissimyProduct;

// Configuration de produit (union de toutes les configs)
export type ProductConfig = StoreBanneConfig | PorteBlindeeConfig | StoreAntichaleurConfig | StoreBanneKissimyConfig | StoreBanneModernConfig;

// Interface pour le devis
export interface QuoteItem {
  productId: string;
  productType: ProductType;
  productName: string;
  basePrice: number;
  configuration: ProductConfig;
  quantity: number;
  totalPrice: number;
  customizations: Record<string, any>;
}

export interface Quote {
  id: string;
  items: QuoteItem[];
  totalPrice: number;
  customerEmail: string;
  customerName: string;
  createdAt: Date;
  expiresAt: Date;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

// Interface pour le panier
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productType: ProductType;
  configuration: ProductConfig;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  addedAt: Date;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  lastUpdated: Date;
}
