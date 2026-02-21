/**
 * Types et interfaces pour le catalogue de stores
 */

export interface PriceEntry {
  maxW: number;  // Largeur maximum en mm
  priceHT: number; // Prix d'achat HT fournisseur en €
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
  buyPrices: Record<number, PriceEntry[]>;
  // Prix PROMO pour largeur < 6m (ARMOR et ARMOR+ uniquement)
  promoPrices?: Record<number, PriceEntry[]>;
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
      angle_optimal_degres: number;     // Angle optimal recommandé
      reglage_usine_possible: boolean;  // Si true, angle réglé en usine selon la dimension de fenêtre fournie
    };
    fixation: {
      type: string;                     // Type de fixation (mur, plafond, etc.)
      entraxe_supports_min_cm: number;  // Distance minimum entre les supports
      entraxe_supports_max_cm: number;  // Distance maximum entre les supports
    };
    manoeuvre: {
      type: string;                     // Type de manœuvre (manivelle, moteur, etc.)
      hauteur_manivelle_cm?: number;    // Hauteur recommandée pour la manivelle
      position_moteur?: string;         // Position du moteur (gauche, droite)
    };
  };
}

