/**
 * Catalogue des toiles - Version compacte - Généré automatiquement depuis Supabase
 * Date de génération: 2026-02-15T11:18:13.752Z
 * 
 * ⚠️ NE PAS MODIFIER MANUELLEMENT
 * Pour mettre à jour: npm run generate:catalogs
 * 
 * Structure optimisée : 284 références groupées par 3 types
 */

// ============================================
// INTERFACES
// ============================================

export interface ToileTypeCompact {
  id: number;
  name: string;
  manufacturer: string;
  code: string;
  purchase_price_ht: number;
  sales_coefficient: number;
  composition: string | null;
  description: string | null;
  compatible_categories: string[];
  is_active: boolean;
  // Liste des références disponibles (ex: ["U095", "6088", "7124", ...])
  available_refs: string[];
  ref_count: number;
  // Quelques exemples pour la documentation
  examples: Array<{ref: string, name: string, family: string}>;
}

// ============================================
// TYPES DE TOILES (3 gammes, 284 références)
// ============================================

export const TOILE_TYPES: ToileTypeCompact[] = [
  {
    "id": 1,
    "name": "Dickson Orchestra",
    "manufacturer": "DICKSON",
    "code": "ORCH",
    "purchase_price_ht": 22.5,
    "sales_coefficient": 1.5,
    "compatible_store_ids": null,
    "compatible_categories": [
      "BELHARRA",
      "KALYO",
      "DYNASTA",
      "HELIOM",
      "KISSIMY",
      "",
      "STORE-BANNE-BRAS-CROISES",
      "STORE-BANNE-ANTIBES",
      "STORE-BANNE-MADRID",
      "STORE-BANNE-BELHARRA",
      "STORE-BANNE-DYNASTA",
      "STORE-BANNE-KALYO",
      "STORE-BANNE-KITANGUY",
      "STORE-BANNE-HELIOM-PLUS",
      "STORE-BANNE-BELHARRA-2",
      "STORE-BANNE-HELIOM",
      "STORE-BANNE-KISSIMY",
      "STORE-BANNE-KITANGUY-2"
    ],
    "default_width": 120,
    "composition": "100% Acrylique teint masse",
    "weight_range": null,
    "description": "Collection classique Orchestra avec unis et décors. Excellente tenue aux UV et aux intempéries.",
    "features": null,
    "is_active": true,
    "display_order": 1,
    "created_at": "2026-02-02T11:15:04.310532",
    "updated_at": "2026-02-02T14:57:36.259757",
    "available_refs": [
      "0001",
      "0003",
      "0017",
      "0018",
      "0020",
      "0034",
      "0613",
      "0681",
      "0744",
      "0745",
      "0842",
      "0867",
      "3914",
      "6020",
      "6022",
      "6028 ",
      "6088",
      "6171",
      "6172",
      "6196",
      "6228",
      "6272",
      "6273",
      "6275",
      "6292",
      "6316",
      "6318",
      "6610",
      "6687 ",
      "6688",
      "6720",
      "7109",
      "7120",
      "7124",
      "7130",
      "7132",
      "7133",
      "7244",
      "7264",
      "7297",
      "7330",
      "7351",
      "7466",
      "7467",
      "7485",
      "7548",
      "7552",
      "7554",
      "7559",
      "7560",
      "7972",
      "8200",
      "8201",
      "8203",
      "8204",
      "8205",
      "8206",
      "8207",
      "8211",
      "8224",
      "8230",
      "8238 bleu nuit",
      "8396",
      "8402",
      "8544",
      "8552",
      "8553",
      "8556",
      "8557",
      "8612",
      "8614",
      "8615",
      "8776",
      "8777",
      "8778",
      "8779",
      "8891",
      "8901",
      "8902",
      "8904 Lin chiné",
      "8906",
      "8907",
      "8910",
      "8919",
      "8921",
      "8922",
      "8931",
      "8935",
      "D100",
      "D103",
      "D104",
      "D107",
      "D108",
      "D113",
      "D302",
      "D303",
      "D304",
      "D305",
      "D306",
      "D307",
      "D308",
      "D309",
      "D310",
      "D311",
      "D312",
      "D314",
      "D317",
      "D318",
      "D319",
      "D321",
      "D323",
      "D330",
      "D332",
      "D335",
      "D338",
      "D339",
      "D532",
      "D533",
      "D534",
      "D535",
      "D536",
      "D537",
      "D538",
      "D539",
      "D540",
      "D541",
      "D542",
      "D543",
      "D544",
      "D545",
      "D548",
      "D549",
      "D550",
      "D551",
      "D552",
      "D554",
      "D555",
      "D556",
      "U095 gris basalte",
      "U104",
      "U105",
      "U137",
      "U140",
      "U170",
      "U171",
      "U190",
      "U224",
      "U235",
      "U321",
      "U335",
      "U337",
      "U343",
      "U370",
      "U371",
      "U373",
      "U387",
      "U388",
      "U402",
      "U404",
      "U406",
      "U407",
      "U408",
      "U409",
      "U410",
      "U411",
      "U413",
      "U415",
      "U416",
      "U767",
      "U768",
      "U784",
      "U785",
      "U786",
      "U787",
      "U788",
      "U789",
      "U791",
      "U792",
      "U793",
      "U794",
      "U795",
      "U796",
      "U797",
      "U798",
      "U799",
      "U800",
      "U801",
      "U802",
      "U803",
      "U804",
      "U805",
      "U806",
      "U807",
      "U808",
      "U809",
      "U810",
      "U811",
      "U812",
      "U813",
      "U814"
    ],
    "ref_count": 200,
    "examples": [
      {
        "ref": "0001",
        "name": "Orchestra 0001",
        "family": "Neutre"
      },
      {
        "ref": "0003",
        "name": "Orchestra 0003",
        "family": "Neutre"
      },
      {
        "ref": "0017",
        "name": "Orchestra 0017",
        "family": "Neutre"
      },
      {
        "ref": "0018",
        "name": "Orchestra 0018",
        "family": "Neutre"
      },
      {
        "ref": "0020",
        "name": "Orchestra 0020",
        "family": "Neutre"
      },
      {
        "ref": "0034",
        "name": "Orchestra 0034",
        "family": "Neutre"
      },
      {
        "ref": "0613",
        "name": "Orchestra 0613",
        "family": "Neutre"
      },
      {
        "ref": "0681",
        "name": "Orchestra 0681",
        "family": "Neutre"
      },
      {
        "ref": "0744",
        "name": "Orchestra Décor 0744",
        "family": "Neutre"
      },
      {
        "ref": "0745",
        "name": "Orchestra Décor 0745",
        "family": "Neutre"
      }
    ]
  },
  {
    "id": 2,
    "name": "Dickson Orchestra Max",
    "manufacturer": "DICKSON",
    "code": "ORCH_MAX",
    "purchase_price_ht": 35,
    "sales_coefficient": 1.7,
    "compatible_store_ids": null,
    "compatible_categories": [
      "BELHARRA",
      "KALYO",
      "DYNASTA",
      "HELIOM",
      "STORE-BANNE-BRAS-CROISES",
      "STORE-BANNE-ANTIBES",
      "STORE-BANNE-MADRID"
    ],
    "default_width": 120,
    "composition": "100% Acrylique haute performance",
    "weight_range": null,
    "description": "Collection Orchestra Max, version renforcée avec meilleure résistance et durabilité accrue.",
    "features": null,
    "is_active": true,
    "display_order": 2,
    "created_at": "2026-02-02T11:15:04.310532",
    "updated_at": "2026-02-02T16:46:43.092965",
    "available_refs": [
      "0001",
      "0681",
      "3914",
      "6020",
      "6028",
      "6088",
      "6196",
      "6687",
      "7133",
      "7548",
      "7559",
      "8203",
      "8206",
      "8396",
      "8779",
      "U104",
      "U171",
      "U767",
      "U768",
      "U786",
      "U793",
      "U806",
      "U808",
      "U811"
    ],
    "ref_count": 24,
    "examples": [
      {
        "ref": "0001",
        "name": "Orchestra Max 0001",
        "family": "Blanc"
      },
      {
        "ref": "0681",
        "name": "Orchestra Max 0681",
        "family": "Blanc"
      },
      {
        "ref": "3914",
        "name": "Orchestra Max 3914",
        "family": "Beige"
      },
      {
        "ref": "6020",
        "name": "Orchestra Max 6020",
        "family": "Gris"
      },
      {
        "ref": "6028",
        "name": "Orchestra Max 6028",
        "family": "Gris"
      },
      {
        "ref": "6088",
        "name": "Orchestra Max 6088",
        "family": "Gris"
      },
      {
        "ref": "6196",
        "name": "Orchestra Max 6196",
        "family": "Gris"
      },
      {
        "ref": "6687",
        "name": "Orchestra Max 6687",
        "family": "Bleu"
      },
      {
        "ref": "7133",
        "name": "Orchestra Max 7133",
        "family": "Bleu"
      },
      {
        "ref": "7548",
        "name": "Orchestra Max 7548",
        "family": "Bleu"
      }
    ]
  },
  {
    "id": 3,
    "name": "Sattler",
    "manufacturer": "SATTLER",
    "code": "SATT",
    "purchase_price_ht": 32,
    "sales_coefficient": 1.6,
    "compatible_store_ids": null,
    "compatible_categories": [
      "BELHARRA",
      "KALYO",
      "DYNASTA",
      "STORE-BANNE-BELHARRA",
      "STORE-BANNE-BELHARRA-2",
      "STORE-BANNE-HELIOM",
      "STORE-BANNE-KISSIMY",
      "STORE-BANNE-KITANGUY-2",
      "STORE-BANNE-ANTIBES",
      "STORE-BANNE-MADRID",
      "STORE-BANNE-DYNASTA",
      "STORE-BANNE-KALYO",
      "STORE-BANNE-KITANGUY",
      "STORE-BANNE-HELIOM-PLUS",
      "STORE-BANNE-BRAS-CROISES"
    ],
    "default_width": 120,
    "composition": "100% Solution dyed acrylic",
    "weight_range": null,
    "description": "Toiles Sattler haute qualité avec traitement déperlant et anti-salissures.",
    "features": null,
    "is_active": true,
    "display_order": 3,
    "created_at": "2026-02-02T11:15:04.310532",
    "updated_at": "2026-02-02T15:07:53.881979",
    "available_refs": [
      "30A734",
      "314001",
      "314007",
      "314010",
      "314020",
      "314022",
      "314028",
      "314030",
      "314070",
      "314081",
      "314083",
      "314085",
      "314154",
      "314182",
      "314325",
      "314362",
      "314364",
      "314398",
      "314402",
      "314414",
      "314546",
      "314550",
      "314638",
      "314660",
      "314718",
      "314763",
      "314780",
      "314818",
      "314819",
      "314828",
      "314838",
      "314840",
      "314851",
      "314858",
      "314880",
      "314888",
      "314941",
      "314E67",
      "320180",
      "320190",
      "320212",
      "320235",
      "320253",
      "320309",
      "320408",
      "320434",
      "320452",
      "320679",
      "320692",
      "320833",
      "320923",
      "320925",
      "320928",
      "320937",
      "320954",
      "320956",
      "320992",
      "320994",
      "364053",
      "364598"
    ],
    "ref_count": 60,
    "examples": [
      {
        "ref": "30A734",
        "name": "Sattler 30A734",
        "family": "Neutre"
      },
      {
        "ref": "314001",
        "name": "Sattler 314001",
        "family": "Beige"
      },
      {
        "ref": "314007",
        "name": "Sattler 314007",
        "family": "Beige"
      },
      {
        "ref": "314010",
        "name": "Sattler 314010",
        "family": "Beige"
      },
      {
        "ref": "314020",
        "name": "Sattler 314020",
        "family": "Beige"
      },
      {
        "ref": "314022",
        "name": "Sattler 314022",
        "family": "Beige"
      },
      {
        "ref": "314028",
        "name": "Sattler 314028",
        "family": "Beige"
      },
      {
        "ref": "314030",
        "name": "Sattler 314030",
        "family": "Beige"
      },
      {
        "ref": "314070",
        "name": "Sattler 314070",
        "family": "Beige"
      },
      {
        "ref": "314081",
        "name": "Sattler 314081",
        "family": "Beige"
      }
    ]
  }
];

// ============================================
// HELPERS
// ============================================

/**
 * Récupère un type de toile par son code
 */
export function getToileTypeByCode(code: string): ToileTypeCompact | undefined {
  return TOILE_TYPES.find(t => t.code === code);
}

/**
 * Récupère un type de toile par son ID
 */
export function getToileTypeById(id: number): ToileTypeCompact | undefined {
  return TOILE_TYPES.find(t => t.id === id);
}

/**
 * Récupère un type de toile par son nom
 */
export function getToileTypeByName(name: string): ToileTypeCompact | undefined {
  return TOILE_TYPES.find(t => t.name.toLowerCase() === name.toLowerCase());
}

/**
 * Vérifie si une référence existe pour un type
 */
export function isRefAvailable(typeId: number, ref: string): boolean {
  const type = getToileTypeById(typeId);
  return type?.available_refs.includes(ref) || false;
}

/**
 * Récupère tous les types compatibles avec un produit
 */
export function getCompatibleToileTypes(productSlug: string): ToileTypeCompact[] {
  const upperSlug = productSlug.toUpperCase();
  return TOILE_TYPES.filter(t => 
    t.compatible_categories?.includes(upperSlug) || 
    t.compatible_categories?.includes('ALL')
  );
}

/**
 * Calcule le prix de vente TTC d'une toile (par m²)
 * Le prix ne dépend que du TYPE de toile, pas de la couleur
 */
export function calculateToilePriceTTC(
  typeIdOrCode: number | string, 
  surface_m2: number = 1, 
  tva: number = 1.20
): number {
  const type = typeof typeIdOrCode === 'number' 
    ? getToileTypeById(typeIdOrCode)
    : getToileTypeByCode(typeIdOrCode);
    
  if (!type) return 0;
  
  const priceHT = type.purchase_price_ht * type.sales_coefficient * surface_m2;
  return priceHT * tva;
}

/**
 * Récupère le nombre total de références disponibles
 */
export function getTotalRefsCount(): number {
  return TOILE_TYPES.reduce((sum, type) => sum + type.ref_count, 0);
}

/**
 * Récupère les types par fabricant
 */
export function getTypesByManufacturer(manufacturer: string): ToileTypeCompact[] {
  return TOILE_TYPES.filter(t => 
    t.manufacturer.toLowerCase() === manufacturer.toLowerCase()
  );
}

/**
 * Génère un résumé pour le chatbot
 */
export function getToilesSummaryForChatbot(): string {
  return TOILE_TYPES.map(type => 
    `- ${type.name} (${type.manufacturer}): ${type.ref_count} références disponibles
  Exemples: ${type.examples.slice(0, 5).map(e => `${e.ref} "${e.name}"`).join(', ')}
  Prix: ${type.purchase_price_ht}€/m² HT × coeff ${type.sales_coefficient}`
  ).join('\n\n');
}
