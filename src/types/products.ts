// Types de produits disponibles
export enum ProductType {
  STORE_BANNE = 'store_banne',
  PORTE_BLINDEE = 'porte_blindee',
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

// Union type pour tous les produits
export type Product = StoreBanneProduct | PorteBlindeeProduct;

// Configuration de produit (union de toutes les configs)
export type ProductConfig = StoreBanneConfig | PorteBlindeeConfig;

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
