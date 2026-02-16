/**
 * Catalogue des couleurs de structure (Matest) - Généré automatiquement depuis Supabase
 * Date de génération: 2026-02-16T01:46:22.715Z
 * 
 * ⚠️ NE PAS MODIFIER MANUELLEMENT
 * Pour mettre à jour: npm run generate:catalogs
 */

// ============================================
// INTERFACES
// ============================================

export interface MatestFinishType {
  id: number;
  name: string;
  description: string | null;
  price_ht: number;
  image_url: string | null;
  product_slugs: string[];
  is_active: boolean;
}

export interface MatestColor {
  id: number;
  ral_code: string;
  name: string;
  hex_code: string;
  finish: string;
  category: string;
  image_url: string | null;
  swatch_url: string | null;
  is_available: boolean;
  is_standard: boolean;
  price_ht: number;
}

// ============================================
// TYPES DE FINITION (5 finitions)
// ============================================

export const MATEST_FINISH_TYPES: MatestFinishType[] = [
  {
    "id": 1,
    "name": "brillant",
    "icon": null,
    "color": null,
    "order_index": 1,
    "product_slugs": [
      "store-banne-belharra",
      "store-banne-dynasta",
      "store-banne-kalyo",
      "store-banne-kitanguy",
      "store-banne-heliom-plus",
      "store-banne-bras-croises",
      "store-banne-belharra-2",
      "store-banne-heliom",
      "store-banne-kissimy",
      "store-banne-kitanguy-2",
      "store-banne-antibes",
      "store-banne-madrid"
    ],
    "created_at": "2026-02-02T21:37:46.988819+00:00",
    "updated_at": "2026-02-02T21:37:46.988819+00:00"
  },
  {
    "id": 2,
    "name": "sablé",
    "icon": null,
    "color": null,
    "order_index": 2,
    "product_slugs": [
      "store-banne-belharra",
      "store-banne-dynasta",
      "store-banne-kalyo",
      "store-banne-kitanguy",
      "store-banne-heliom-plus",
      "store-banne-bras-croises",
      "store-banne-belharra-2",
      "store-banne-heliom",
      "store-banne-kissimy",
      "store-banne-kitanguy-2",
      "store-banne-antibes",
      "store-banne-madrid"
    ],
    "created_at": "2026-02-02T21:37:46.988819+00:00",
    "updated_at": "2026-02-02T21:37:46.988819+00:00"
  },
  {
    "id": 3,
    "name": "mat",
    "icon": null,
    "color": null,
    "order_index": 3,
    "product_slugs": [
      "store-banne-belharra",
      "store-banne-dynasta",
      "store-banne-kalyo",
      "store-banne-kitanguy",
      "store-banne-heliom-plus",
      "store-banne-bras-croises",
      "store-banne-belharra-2",
      "store-banne-heliom",
      "store-banne-kissimy",
      "store-banne-kitanguy-2",
      "store-banne-antibes",
      "store-banne-madrid"
    ],
    "created_at": "2026-02-02T21:37:46.988819+00:00",
    "updated_at": "2026-02-02T21:37:46.988819+00:00"
  },
  {
    "id": 4,
    "name": "promo",
    "icon": null,
    "color": null,
    "order_index": 4,
    "product_slugs": [],
    "created_at": "2026-02-02T21:37:46.988819+00:00",
    "updated_at": "2026-02-02T21:37:46.988819+00:00"
  },
  {
    "id": 5,
    "name": "spéciale",
    "icon": null,
    "color": null,
    "order_index": 5,
    "product_slugs": [
      "store-banne-belharra",
      "store-banne-dynasta",
      "store-banne-kalyo",
      "store-banne-belharra-2",
      "store-banne-heliom",
      "store-banne-kissimy",
      "store-banne-kitanguy",
      "store-banne-heliom-plus",
      "store-banne-bras-croises",
      "store-banne-antibes",
      "store-banne-kitanguy-2",
      "store-banne-madrid"
    ],
    "created_at": "2026-02-02T21:37:46.988819+00:00",
    "updated_at": "2026-02-02T21:37:46.988819+00:00"
  }
];

// ============================================
// COULEURS MATEST (91 références)
// ============================================

export const MATEST_COLORS: MatestColor[] = [
  {
    "id": 105,
    "ral_code": "1001",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-1001-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:48.710882+00:00"
  },
  {
    "id": 109,
    "ral_code": "1013",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-1013-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.046838+00:00"
  },
  {
    "id": 113,
    "ral_code": "1015",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-1015-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.254339+00:00"
  },
  {
    "id": 77,
    "ral_code": "1018",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-1018-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:47.112493+00:00"
  },
  {
    "id": 117,
    "ral_code": "1019",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-1019-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.464462+00:00"
  },
  {
    "id": 81,
    "ral_code": "2004",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-2004-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:47.385606+00:00"
  },
  {
    "id": 85,
    "ral_code": "3002",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-3002-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:47.615617+00:00"
  },
  {
    "id": 89,
    "ral_code": "3003",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-3003-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:47.830418+00:00"
  },
  {
    "id": 93,
    "ral_code": "3004",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-3004-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:48.052074+00:00"
  },
  {
    "id": 97,
    "ral_code": "3018",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-3018-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:48.275502+00:00"
  },
  {
    "id": 100,
    "ral_code": "3020",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-3020-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:48.447226+00:00"
  },
  {
    "id": 78,
    "ral_code": "5003",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-5003-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:47.207833+00:00"
  },
  {
    "id": 82,
    "ral_code": "5008",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-5008-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:47.444331+00:00"
  },
  {
    "id": 86,
    "ral_code": "5010",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-5010-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:47.674114+00:00"
  },
  {
    "id": 90,
    "ral_code": "5015",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-5015-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:47.886832+00:00"
  },
  {
    "id": 94,
    "ral_code": "5024",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-5024-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:48.107291+00:00"
  },
  {
    "id": 79,
    "ral_code": "6005",
    "name": "",
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-6005-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T20:47:34.699396+00:00"
  },
  {
    "id": 83,
    "ral_code": "6009",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-6009-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:47.49492+00:00"
  },
  {
    "id": 87,
    "ral_code": "6011",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-6011-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:47.727125+00:00"
  },
  {
    "id": 91,
    "ral_code": "6017",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-6017-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:47.941704+00:00"
  },
  {
    "id": 95,
    "ral_code": "6021",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-6021-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:48.161733+00:00"
  },
  {
    "id": 98,
    "ral_code": "6024",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-6024-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:48.332327+00:00"
  },
  {
    "id": 101,
    "ral_code": "6027",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-6027-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:48.499804+00:00"
  },
  {
    "id": 80,
    "ral_code": "7006",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-7006-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:47.33352+00:00"
  },
  {
    "id": 84,
    "ral_code": "7011",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-7011-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:47.547103+00:00"
  },
  {
    "id": 88,
    "ral_code": "7016",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-7016-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:47.779276+00:00"
  },
  {
    "id": 92,
    "ral_code": "7021",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-7021-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:47.996928+00:00"
  },
  {
    "id": 96,
    "ral_code": "7022",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-7022-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:48.219335+00:00"
  },
  {
    "id": 99,
    "ral_code": "7024",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-7024-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:48.387498+00:00"
  },
  {
    "id": 102,
    "ral_code": "7030",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-1/ral-7030-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:48.550307+00:00"
  },
  {
    "id": 103,
    "ral_code": "7035",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-7035-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:48.602244+00:00"
  },
  {
    "id": 107,
    "ral_code": "7036",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-7036-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:48.818608+00:00"
  },
  {
    "id": 111,
    "ral_code": "7037",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-7037-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.149305+00:00"
  },
  {
    "id": 115,
    "ral_code": "7038",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-7038-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.359106+00:00"
  },
  {
    "id": 119,
    "ral_code": "7039",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-7039-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.576706+00:00"
  },
  {
    "id": 123,
    "ral_code": "7042",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-7042-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.799143+00:00"
  },
  {
    "id": 127,
    "ral_code": "7044",
    "name": "",
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-7044-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.022639+00:00"
  },
  {
    "id": 104,
    "ral_code": "7047",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-7047-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:48.653924+00:00"
  },
  {
    "id": 121,
    "ral_code": "8001",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-8001-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.68567+00:00"
  },
  {
    "id": 125,
    "ral_code": "8003",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-8003-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.907368+00:00"
  },
  {
    "id": 128,
    "ral_code": "8007",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-8007-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.075107+00:00"
  },
  {
    "id": 106,
    "ral_code": "8011",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-8011-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:48.764318+00:00"
  },
  {
    "id": 110,
    "ral_code": "8014",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-8014-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.095523+00:00"
  },
  {
    "id": 114,
    "ral_code": "8016",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-8016-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.303777+00:00"
  },
  {
    "id": 118,
    "ral_code": "8017",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-8017-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.51623+00:00"
  },
  {
    "id": 122,
    "ral_code": "8019",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-8019-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.739217+00:00"
  },
  {
    "id": 108,
    "ral_code": "9001",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-9001-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:48.99396+00:00"
  },
  {
    "id": 112,
    "ral_code": "9002",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-9002-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.202353+00:00"
  },
  {
    "id": 116,
    "ral_code": "9003",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-9003-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.412057+00:00"
  },
  {
    "id": 126,
    "ral_code": "9005",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-9005-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.964057+00:00"
  },
  {
    "id": 120,
    "ral_code": "9010",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-9010-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.628118+00:00"
  },
  {
    "id": 124,
    "ral_code": "9016",
    "name": null,
    "finish": "brillant",
    "image_url": "/images/matest/pdf-thumbs/page-2/ral-9016-brillant.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:49.850247+00:00"
  },
  {
    "id": 158,
    "ral_code": "7016",
    "name": "Gris anthracite",
    "finish": "mat",
    "image_url": "/images/matest/pdf-thumbs/page-1/7016-mat.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-09T18:35:19.839701+00:00"
  },
  {
    "id": 157,
    "ral_code": "7035",
    "name": "Gris mat",
    "finish": "mat",
    "image_url": "/images/matest/pdf-thumbs/page-1/7035-mat.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-09T18:34:45.110264+00:00"
  },
  {
    "id": 159,
    "ral_code": "9005",
    "name": "noir",
    "finish": "mat",
    "image_url": "/images/matest/pdf-thumbs/page-1/9005-mat.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-09T18:35:54.487648+00:00"
  },
  {
    "id": 160,
    "ral_code": "9010",
    "name": "Blanc Mat",
    "finish": "mat",
    "image_url": "/images/matest/pdf-thumbs/page-1/9010-mat.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-09T18:36:18.396312+00:00"
  },
  {
    "id": 161,
    "ral_code": "9016",
    "name": "Blanc Mat",
    "finish": "mat",
    "image_url": "/images/matest/pdf-thumbs/page-1/9016-mat.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-09T18:36:48.376573+00:00"
  },
  {
    "id": 162,
    "ral_code": "9210",
    "name": "Blanc",
    "finish": "mat",
    "image_url": "/images/matest/pdf-thumbs/page-1/9210-mat.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-09T18:37:09.029299+00:00"
  },
  {
    "id": 129,
    "ral_code": "1015",
    "name": null,
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-1015-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.135091+00:00"
  },
  {
    "id": 145,
    "ral_code": "2100",
    "name": "Noir",
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-2100-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.982581+00:00"
  },
  {
    "id": 146,
    "ral_code": "2200",
    "name": "Noir",
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-2200-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:51.03489+00:00"
  },
  {
    "id": 147,
    "ral_code": "2300",
    "name": "Noir",
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-2300-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:51.089023+00:00"
  },
  {
    "id": 150,
    "ral_code": "2525",
    "name": "Yazd",
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-2525-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:51.299794+00:00"
  },
  {
    "id": 152,
    "ral_code": "2525",
    "name": "Mars",
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-2525-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:51.299794+00:00"
  },
  {
    "id": 153,
    "ral_code": "2650",
    "name": "Brun",
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-2650-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:51.355145+00:00"
  },
  {
    "id": 151,
    "ral_code": "2800",
    "name": "Gris",
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-2800-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:51.249064+00:00"
  },
  {
    "id": 148,
    "ral_code": "2900",
    "name": "Gris",
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-2900-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:51.147313+00:00"
  },
  {
    "id": 133,
    "ral_code": "3004",
    "name": null,
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-3004-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.350521+00:00"
  },
  {
    "id": 137,
    "ral_code": "5003",
    "name": null,
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-5003-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.557625+00:00"
  },
  {
    "id": 141,
    "ral_code": "5010",
    "name": null,
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-5010-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.76881+00:00"
  },
  {
    "id": 130,
    "ral_code": "6005",
    "name": null,
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-6005-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.188296+00:00"
  },
  {
    "id": 134,
    "ral_code": "7016",
    "name": null,
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-7016-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.399375+00:00"
  },
  {
    "id": 138,
    "ral_code": "7022",
    "name": null,
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-7022-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.61198+00:00"
  },
  {
    "id": 142,
    "ral_code": "7035",
    "name": null,
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-7035-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.825114+00:00"
  },
  {
    "id": 131,
    "ral_code": "7037",
    "name": null,
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-7037-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.241791+00:00"
  },
  {
    "id": 135,
    "ral_code": "7042",
    "name": null,
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-7042-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.453217+00:00"
  },
  {
    "id": 139,
    "ral_code": "8007",
    "name": null,
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-8007-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.663334+00:00"
  },
  {
    "id": 143,
    "ral_code": "8014",
    "name": null,
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-8014-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.876063+00:00"
  },
  {
    "id": 132,
    "ral_code": "8019",
    "name": null,
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-8019-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.291442+00:00"
  },
  {
    "id": 136,
    "ral_code": "9005",
    "name": null,
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-9005-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.507874+00:00"
  },
  {
    "id": 140,
    "ral_code": "9010",
    "name": null,
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-9010-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.718093+00:00"
  },
  {
    "id": 144,
    "ral_code": "9016",
    "name": null,
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/ral-9016-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T19:00:50.929519+00:00"
  },
  {
    "id": 149,
    "ral_code": null,
    "name": "Brisbane",
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/brisbane-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T20:23:00.165575+00:00"
  },
  {
    "id": 154,
    "ral_code": null,
    "name": "Tijuka",
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/tijuka-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T20:23:09.61085+00:00"
  },
  {
    "id": 156,
    "ral_code": null,
    "name": "Djibouti",
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/djibouti-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T20:23:09.788925+00:00"
  },
  {
    "id": 155,
    "ral_code": null,
    "name": "Sequoia",
    "finish": "sablé",
    "image_url": "/images/matest/pdf-thumbs/page-3/sequoia-sable.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-02T20:23:09.696813+00:00"
  },
  {
    "id": 164,
    "ral_code": "",
    "name": "Galet",
    "finish": "spéciale",
    "image_url": "/images/matest/pdf-thumbs/page-1/galet-spéciale.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-09T18:38:12.360076+00:00"
  },
  {
    "id": 167,
    "ral_code": "",
    "name": "Gold Pearl",
    "finish": "spéciale",
    "image_url": "/images/matest/pdf-thumbs/page-1/gold-pearl-spéciale.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-09T18:38:41.581655+00:00"
  },
  {
    "id": 165,
    "ral_code": "",
    "name": "Bronze",
    "finish": "spéciale",
    "image_url": "/images/matest/pdf-thumbs/page-1/bronze-spéciale.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-09T18:38:22.010037+00:00"
  },
  {
    "id": 163,
    "ral_code": "9006",
    "name": "Silver",
    "finish": "spéciale",
    "image_url": "/images/matest/pdf-thumbs/page-1/9006-spéciale.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-09T18:37:54.05061+00:00"
  },
  {
    "id": 166,
    "ral_code": "9007",
    "name": "Pyrite",
    "finish": "spéciale",
    "image_url": "/images/matest/pdf-thumbs/page-1/9007-spéciale.png",
    "created_at": "2026-02-02T18:41:35.780745+00:00",
    "updated_at": "2026-02-09T18:38:32.217603+00:00"
  }
];

// ============================================
// COULEURS STANDARDS (Incluses sans supplément)
// ============================================

export const STANDARD_COLORS = MATEST_COLORS.filter(c => c.is_standard);

// ============================================
// HELPERS
// ============================================

/**
 * Récupère un type de finition par son nom
 */
export function getFinishTypeByName(name: string): MatestFinishType | undefined {
  return MATEST_FINISH_TYPES.find(f => f.name === name);
}

/**
 * Récupère un type de finition par son ID
 */
export function getFinishTypeById(id: number): MatestFinishType | undefined {
  return MATEST_FINISH_TYPES.find(f => f.id === id);
}

/**
 * Récupère les couleurs d'un type de finition
 */
export function getColorsByFinish(finishName: string): MatestColor[] {
  return MATEST_COLORS.filter(c => c.finish === finishName);
}

/**
 * Récupère les couleurs par catégorie
 */
export function getColorsByCategory(category: string): MatestColor[] {
  return MATEST_COLORS.filter(c => c.category === category);
}

/**
 * Récupère une couleur par son code RAL
 */
export function getColorByRAL(ralCode: string): MatestColor | undefined {
  return MATEST_COLORS.find(c => c.ral_code === ralCode);
}

/**
 * Récupère uniquement les couleurs standards (sans supplément)
 */
export function getStandardColors(): MatestColor[] {
  return STANDARD_COLORS;
}

/**
 * Calcule le prix total TTC d'une couleur + finition
 */
export function calculateColorPriceTTC(ralCode: string, tva: number = 1.20): number {
  const color = getColorByRAL(ralCode);
  if (!color) return 0;
  
  const finishType = getFinishTypeByName(color.finish);
  const finishPrice = finishType?.price_ht || 0;
  
  const totalHT = color.price_ht + finishPrice;
  return totalHT * tva;
}

/**
 * Récupère les couleurs compatibles avec un produit
 */
export function getCompatibleColors(productSlug: string): MatestColor[] {
  // Trouver les finitions compatibles avec ce produit
  const compatibleFinishes = MATEST_FINISH_TYPES
    .filter(f => f.product_slugs?.includes(productSlug))
    .map(f => f.name);
  
  // Retourner les couleurs de ces finitions
  return MATEST_COLORS.filter(c => compatibleFinishes.includes(c.finish));
}

/**
 * Vérifie si une couleur est disponible pour un produit en promo
 * (Les promos sont souvent limitées aux 3 couleurs standards)
 */
export function isColorAvailableForPromo(ralCode: string): boolean {
  const standardRals = ['9016', '1015', '7016']; // Blanc, Beige, Gris Anthracite
  return standardRals.includes(ralCode);
}

/**
 * Récupère le prix d'une finition
 */
export function getFinishPrice(finishName: string): number {
  const finish = getFinishTypeByName(finishName);
  return finish?.price_ht || 0;
}
