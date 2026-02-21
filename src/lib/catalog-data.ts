/**
 * ⚠️  FICHIER GÉNÉRÉ AUTOMATIQUEMENT - NE PAS ÉDITER MANUELLEMENT
 * 
 * Ce fichier est généré par: npm run pricing:generate
 * Source: Base de données SQLite (prisma/dev.db)
 * Date: 2026-02-21T13:10:48.049Z
 * 
 * Pour modifier les prix:
 * 1. Utilisez l'interface admin: http://localhost:3000/admin/pricing
 * 2. Ou modifiez directement la base SQLite (Prisma Studio: npx prisma studio)
 * 3. Régénérez ce fichier: npm run pricing:generate
 */

export interface PriceEntry {
  maxW: number;  // Largeur maximum en mm
  priceHT: number; // Prix d'achat HT fournisseur en €
}

export interface StoreModel {
  id: string;
  name: string;
  slug: string;
  salesCoefficient: number; // Coefficient de marge (ex: 1.8 = +80%)
  buyPrices: Record<number, PriceEntry[]>; // Organisé par projection (avancée)
  optionsCoefficients: Record<string, number>; // Coefficients par type d'option
}

export const STORE_MODELS: Record<string, StoreModel> = {
  "antibes": {
    id: "antibes",
    name: "STORAL CLASSIQUE",
    slug: "store-banne-coffre-traditionnel-antibes",
    salesCoefficient: 1,
    buyPrices:     {
          "1500": [
                {
                      "maxW": 2390,
                      "priceHT": 1019
                },
                {
                      "maxW": 3570,
                      "priceHT": 1253
                },
                {
                      "maxW": 4750,
                      "priceHT": 1122
                },
                {
                      "maxW": 5610,
                      "priceHT": 1409
                },
                {
                      "maxW": 6000,
                      "priceHT": 1529
                },
                {
                      "maxW": 7110,
                      "priceHT": 1989
                },
                {
                      "maxW": 8280,
                      "priceHT": 2140
                },
                {
                      "maxW": 9450,
                      "priceHT": 2333
                },
                {
                      "maxW": 10790,
                      "priceHT": 2501
                },
                {
                      "maxW": 11220,
                      "priceHT": 2663
                },
                {
                      "maxW": 12000,
                      "priceHT": 2777
                }
          ],
          "1750": [
                {
                      "maxW": 2390,
                      "priceHT": 1027
                },
                {
                      "maxW": 3570,
                      "priceHT": 1131
                },
                {
                      "maxW": 4750,
                      "priceHT": 1260
                },
                {
                      "maxW": 5610,
                      "priceHT": 1416
                },
                {
                      "maxW": 6000,
                      "priceHT": 1540
                },
                {
                      "maxW": 7110,
                      "priceHT": 1992
                },
                {
                      "maxW": 8280,
                      "priceHT": 2146
                },
                {
                      "maxW": 9450,
                      "priceHT": 2341
                },
                {
                      "maxW": 10790,
                      "priceHT": 2507
                },
                {
                      "maxW": 11220,
                      "priceHT": 2670
                },
                {
                      "maxW": 12000,
                      "priceHT": 2784
                }
          ],
          "2000": [
                {
                      "maxW": 2390,
                      "priceHT": 1032
                },
                {
                      "maxW": 3570,
                      "priceHT": 1137
                },
                {
                      "maxW": 4750,
                      "priceHT": 1268
                },
                {
                      "maxW": 5610,
                      "priceHT": 1421
                },
                {
                      "maxW": 6000,
                      "priceHT": 1546
                },
                {
                      "maxW": 7110,
                      "priceHT": 2007
                },
                {
                      "maxW": 8280,
                      "priceHT": 2160
                },
                {
                      "maxW": 9450,
                      "priceHT": 2355
                },
                {
                      "maxW": 10790,
                      "priceHT": 2517
                },
                {
                      "maxW": 11220,
                      "priceHT": 2681
                },
                {
                      "maxW": 12000,
                      "priceHT": 2800
                }
          ],
          "2500": [
                {
                      "maxW": 3570,
                      "priceHT": 1144
                },
                {
                      "maxW": 4750,
                      "priceHT": 1272
                },
                {
                      "maxW": 5610,
                      "priceHT": 1426
                },
                {
                      "maxW": 6000,
                      "priceHT": 1554
                },
                {
                      "maxW": 7110,
                      "priceHT": 2035
                },
                {
                      "maxW": 8280,
                      "priceHT": 2186
                },
                {
                      "maxW": 9450,
                      "priceHT": 2376
                },
                {
                      "maxW": 10790,
                      "priceHT": 2543
                },
                {
                      "maxW": 11220,
                      "priceHT": 2705
                },
                {
                      "maxW": 12000,
                      "priceHT": 2826
                }
          ],
          "3000": [
                {
                      "maxW": 4750,
                      "priceHT": 1293
                },
                {
                      "maxW": 5610,
                      "priceHT": 1447
                },
                {
                      "maxW": 6000,
                      "priceHT": 1572
                },
                {
                      "maxW": 7110,
                      "priceHT": 2072
                },
                {
                      "maxW": 8280,
                      "priceHT": 2416
                },
                {
                      "maxW": 9450,
                      "priceHT": 2226
                },
                {
                      "maxW": 10790,
                      "priceHT": 2585
                },
                {
                      "maxW": 11220,
                      "priceHT": 2748
                },
                {
                      "maxW": 12000,
                      "priceHT": 2872
                }
          ]
    },
    optionsCoefficients:     {
          "AUVENT": 1,
          "CEILING_MOUNT": 1,
          "FABRIC": 1,
          "FRAME_COLOR_CUSTOM": 1,
          "INSTALLATION": 1,
          "LAMBREQUIN_ENROULABLE": 1,
          "LAMBREQUIN_FIXE": 1,
          "LED_ARMS": 1,
          "LED_CASSETTE": 1
    }
  },
  "belharra": {
    id: "belharra",
    name: "STORAL ARMOR +",
    slug: "store-banne-coffre-armor-design",
    salesCoefficient: 1,
    buyPrices:     {
          "1500": [
                {
                      "maxW": 4760,
                      "priceHT": 1868
                },
                {
                      "maxW": 5610,
                      "priceHT": 1985
                },
                {
                      "maxW": 6000,
                      "priceHT": 2037
                },
                {
                      "maxW": 7110,
                      "priceHT": 3073
                },
                {
                      "maxW": 8280,
                      "priceHT": 3588
                },
                {
                      "maxW": 9450,
                      "priceHT": 3678
                },
                {
                      "maxW": 10620,
                      "priceHT": 4008
                },
                {
                      "maxW": 11220,
                      "priceHT": 4197
                },
                {
                      "maxW": 12000,
                      "priceHT": 4433
                }
          ],
          "2000": [
                {
                      "maxW": 4760,
                      "priceHT": 1937
                },
                {
                      "maxW": 5610,
                      "priceHT": 2067
                },
                {
                      "maxW": 6000,
                      "priceHT": 2133
                },
                {
                      "maxW": 7110,
                      "priceHT": 3183
                },
                {
                      "maxW": 8280,
                      "priceHT": 3714
                },
                {
                      "maxW": 9450,
                      "priceHT": 3817
                },
                {
                      "maxW": 10620,
                      "priceHT": 4163
                },
                {
                      "maxW": 11220,
                      "priceHT": 4365
                },
                {
                      "maxW": 12000,
                      "priceHT": 4621
                }
          ],
          "2500": [
                {
                      "maxW": 4760,
                      "priceHT": 2028
                },
                {
                      "maxW": 5610,
                      "priceHT": 2171
                },
                {
                      "maxW": 6000,
                      "priceHT": 2251
                },
                {
                      "maxW": 7110,
                      "priceHT": 3331
                },
                {
                      "maxW": 8280,
                      "priceHT": 3877
                },
                {
                      "maxW": 9450,
                      "priceHT": 3994
                },
                {
                      "maxW": 10620,
                      "priceHT": 4353
                },
                {
                      "maxW": 11220,
                      "priceHT": 4572
                },
                {
                      "maxW": 12000,
                      "priceHT": 4847
                }
          ],
          "2750": [
                {
                      "maxW": 4760,
                      "priceHT": 2055
                },
                {
                      "maxW": 5610,
                      "priceHT": 2203
                },
                {
                      "maxW": 6000,
                      "priceHT": 2292
                },
                {
                      "maxW": 7110,
                      "priceHT": 3373
                },
                {
                      "maxW": 8280,
                      "priceHT": 3924
                },
                {
                      "maxW": 9450,
                      "priceHT": 4050
                },
                {
                      "maxW": 10620,
                      "priceHT": 4418
                },
                {
                      "maxW": 11220,
                      "priceHT": 4643
                },
                {
                      "maxW": 12000,
                      "priceHT": 4924
                }
          ],
          "3000": [
                {
                      "maxW": 4760,
                      "priceHT": 2101
                },
                {
                      "maxW": 5610,
                      "priceHT": 2258
                },
                {
                      "maxW": 6000,
                      "priceHT": 2362
                },
                {
                      "maxW": 7110,
                      "priceHT": 3456
                },
                {
                      "maxW": 8280,
                      "priceHT": 4017
                },
                {
                      "maxW": 9450,
                      "priceHT": 4151
                },
                {
                      "maxW": 10620,
                      "priceHT": 4523
                },
                {
                      "maxW": 11220,
                      "priceHT": 4756
                },
                {
                      "maxW": 12000,
                      "priceHT": 5056
                }
          ],
          "3250": [
                {
                      "maxW": 4760,
                      "priceHT": 2239
                },
                {
                      "maxW": 5610,
                      "priceHT": 2474
                },
                {
                      "maxW": 6000,
                      "priceHT": 2592
                },
                {
                      "maxW": 7110,
                      "priceHT": 3740
                },
                {
                      "maxW": 8280,
                      "priceHT": 4220
                },
                {
                      "maxW": 9450,
                      "priceHT": 4389
                },
                {
                      "maxW": 10620,
                      "priceHT": 4787
                },
                {
                      "maxW": 11220,
                      "priceHT": 5015
                },
                {
                      "maxW": 12000,
                      "priceHT": 5318
                }
          ],
          "3500": [
                {
                      "maxW": 4760,
                      "priceHT": 2282
                },
                {
                      "maxW": 5610,
                      "priceHT": 2526
                },
                {
                      "maxW": 6000,
                      "priceHT": 2652
                },
                {
                      "maxW": 7110,
                      "priceHT": 3769
                },
                {
                      "maxW": 8280,
                      "priceHT": 4259
                },
                {
                      "maxW": 9450,
                      "priceHT": 4467
                },
                {
                      "maxW": 10620,
                      "priceHT": 4875
                },
                {
                      "maxW": 11220,
                      "priceHT": 5109
                },
                {
                      "maxW": 12000,
                      "priceHT": 5422
                }
          ],
          "4000": [
                {
                      "maxW": 4760,
                      "priceHT": 2396
                },
                {
                      "maxW": 5610,
                      "priceHT": 2651
                },
                {
                      "maxW": 6000,
                      "priceHT": 2792
                },
                {
                      "maxW": 7110,
                      "priceHT": 3866
                },
                {
                      "maxW": 8280,
                      "priceHT": 4330
                },
                {
                      "maxW": 9450,
                      "priceHT": 4670
                },
                {
                      "maxW": 10620,
                      "priceHT": 5090
                },
                {
                      "maxW": 11220,
                      "priceHT": 5343
                },
                {
                      "maxW": 12000,
                      "priceHT": 5668
                }
          ]
    },
    optionsCoefficients:     {
          "AUVENT": 1,
          "CEILING_MOUNT": 1,
          "FABRIC": 1,
          "FRAME_COLOR_CUSTOM": 1,
          "INSTALLATION": 1,
          "LAMBREQUIN_ENROULABLE": 1,
          "LAMBREQUIN_FIXE": 1,
          "LED_ARMS": 1,
          "LED_CASSETTE": 1
    }
  },
  "belharra_2": {
    id: "belharra_2",
    name: "STORAL EXCELLENCE +",
    slug: "store-banne-excellence-grandes-dimensions",
    salesCoefficient: 1,
    buyPrices:     {
          "1500": [
                {
                      "maxW": 2400,
                      "priceHT": 1666
                },
                {
                      "maxW": 3580,
                      "priceHT": 1932
                },
                {
                      "maxW": 4760,
                      "priceHT": 2269
                },
                {
                      "maxW": 5610,
                      "priceHT": 2507
                },
                {
                      "maxW": 6000,
                      "priceHT": 2673
                },
                {
                      "maxW": 7110,
                      "priceHT": 3371
                },
                {
                      "maxW": 8280,
                      "priceHT": 3936
                },
                {
                      "maxW": 9450,
                      "priceHT": 4035
                },
                {
                      "maxW": 10620,
                      "priceHT": 4397
                },
                {
                      "maxW": 11220,
                      "priceHT": 4605
                },
                {
                      "maxW": 12000,
                      "priceHT": 4863
                }
          ],
          "2000": [
                {
                      "maxW": 3580,
                      "priceHT": 1992
                },
                {
                      "maxW": 4760,
                      "priceHT": 2344
                },
                {
                      "maxW": 5610,
                      "priceHT": 2597
                },
                {
                      "maxW": 6000,
                      "priceHT": 2779
                },
                {
                      "maxW": 7110,
                      "priceHT": 3492
                },
                {
                      "maxW": 8280,
                      "priceHT": 4075
                },
                {
                      "maxW": 9450,
                      "priceHT": 4188
                },
                {
                      "maxW": 10620,
                      "priceHT": 4567
                },
                {
                      "maxW": 11220,
                      "priceHT": 4789
                },
                {
                      "maxW": 12000,
                      "priceHT": 5069
                }
          ],
          "2500": [
                {
                      "maxW": 3580,
                      "priceHT": 2073
                },
                {
                      "maxW": 4760,
                      "priceHT": 2445
                },
                {
                      "maxW": 5610,
                      "priceHT": 2711
                },
                {
                      "maxW": 6000,
                      "priceHT": 2908
                },
                {
                      "maxW": 7110,
                      "priceHT": 3655
                },
                {
                      "maxW": 8280,
                      "priceHT": 4254
                },
                {
                      "maxW": 9450,
                      "priceHT": 4382
                },
                {
                      "maxW": 10620,
                      "priceHT": 4775
                },
                {
                      "maxW": 11220,
                      "priceHT": 5016
                },
                {
                      "maxW": 12000,
                      "priceHT": 5318
                }
          ],
          "2750": [
                {
                      "maxW": 3580,
                      "priceHT": 2098
                },
                {
                      "maxW": 4760,
                      "priceHT": 2474
                },
                {
                      "maxW": 5610,
                      "priceHT": 2746
                },
                {
                      "maxW": 6000,
                      "priceHT": 2954
                },
                {
                      "maxW": 7110,
                      "priceHT": 3700
                },
                {
                      "maxW": 8280,
                      "priceHT": 4305
                },
                {
                      "maxW": 9450,
                      "priceHT": 4443
                },
                {
                      "maxW": 10620,
                      "priceHT": 4847
                },
                {
                      "maxW": 11220,
                      "priceHT": 5094
                },
                {
                      "maxW": 12000,
                      "priceHT": 5402
                }
          ],
          "3000": [
                {
                      "maxW": 4760,
                      "priceHT": 2524
                },
                {
                      "maxW": 5610,
                      "priceHT": 2806
                },
                {
                      "maxW": 6000,
                      "priceHT": 3030
                },
                {
                      "maxW": 7110,
                      "priceHT": 3791
                },
                {
                      "maxW": 8280,
                      "priceHT": 4407
                },
                {
                      "maxW": 9450,
                      "priceHT": 4554
                },
                {
                      "maxW": 10620,
                      "priceHT": 4962
                },
                {
                      "maxW": 11220,
                      "priceHT": 5217
                },
                {
                      "maxW": 12000,
                      "priceHT": 5547
                }
          ],
          "3250": [
                {
                      "maxW": 4760,
                      "priceHT": 2675
                },
                {
                      "maxW": 5610,
                      "priceHT": 3043
                },
                {
                      "maxW": 6000,
                      "priceHT": 3283
                },
                {
                      "maxW": 7110,
                      "priceHT": 4103
                },
                {
                      "maxW": 8280,
                      "priceHT": 4630
                },
                {
                      "maxW": 9450,
                      "priceHT": 4815
                },
                {
                      "maxW": 10620,
                      "priceHT": 5252
                },
                {
                      "maxW": 11220,
                      "priceHT": 5502
                },
                {
                      "maxW": 12000,
                      "priceHT": 5834
                }
          ],
          "3500": [
                {
                      "maxW": 4760,
                      "priceHT": 2723
                },
                {
                      "maxW": 5610,
                      "priceHT": 3101
                },
                {
                      "maxW": 6000,
                      "priceHT": 3348
                },
                {
                      "maxW": 7110,
                      "priceHT": 4135
                },
                {
                      "maxW": 8280,
                      "priceHT": 4673
                },
                {
                      "maxW": 9450,
                      "priceHT": 4901
                },
                {
                      "maxW": 10620,
                      "priceHT": 5349
                },
                {
                      "maxW": 11220,
                      "priceHT": 5606
                },
                {
                      "maxW": 12000,
                      "priceHT": 5948
                }
          ],
          "4000": [
                {
                      "maxW": 4760,
                      "priceHT": 2848
                },
                {
                      "maxW": 5610,
                      "priceHT": 3237
                },
                {
                      "maxW": 6000,
                      "priceHT": 3502
                },
                {
                      "maxW": 7110,
                      "priceHT": 4241
                },
                {
                      "maxW": 8280,
                      "priceHT": 4751
                },
                {
                      "maxW": 9450,
                      "priceHT": 5123
                },
                {
                      "maxW": 10620,
                      "priceHT": 5584
                },
                {
                      "maxW": 11220,
                      "priceHT": 5862
                },
                {
                      "maxW": 12000,
                      "priceHT": 6218
                }
          ]
    },
    optionsCoefficients:     {
          "AUVENT": 1,
          "CEILING_MOUNT": 1,
          "FABRIC": 1,
          "FRAME_COLOR_CUSTOM": 1,
          "INSTALLATION": 1,
          "LAMBREQUIN_ENROULABLE": 1,
          "LAMBREQUIN_FIXE": 1,
          "LED_ARMS": 1,
          "LED_CASSETTE": 1
    }
  },
  "bras_croises": {
    id: "bras_croises",
    name: "STORAL BRAS CROISÉS",
    slug: "store-banne-balcon-etroit-bras-croises",
    salesCoefficient: 1,
    buyPrices:     {
          "1500": [
                {
                      "maxW": 2390,
                      "priceHT": 1144
                }
          ],
          "2000": [
                {
                      "maxW": 2390,
                      "priceHT": 1162
                }
          ],
          "2500": [
                {
                      "maxW": 2390,
                      "priceHT": 1196
                },
                {
                      "maxW": 3570,
                      "priceHT": 1304
                }
          ],
          "2750": [
                {
                      "maxW": 2390,
                      "priceHT": 1206
                },
                {
                      "maxW": 3570,
                      "priceHT": 1315
                }
          ],
          "3000": [
                {
                      "maxW": 2390,
                      "priceHT": 1218
                },
                {
                      "maxW": 3570,
                      "priceHT": 1322
                }
          ],
          "3250": [
                {
                      "maxW": 2390,
                      "priceHT": 1233
                },
                {
                      "maxW": 3570,
                      "priceHT": 1341
                },
                {
                      "maxW": 3835,
                      "priceHT": 1473
                }
          ],
          "3500": [
                {
                      "maxW": 2390,
                      "priceHT": 1244
                },
                {
                      "maxW": 3570,
                      "priceHT": 1350
                },
                {
                      "maxW": 3835,
                      "priceHT": 1492
                }
          ]
    },
    optionsCoefficients:     {
          "AUVENT": 1,
          "CEILING_MOUNT": 1,
          "FRAME_COLOR_CUSTOM": 1,
          "LAMBREQUIN_ENROULABLE": 1,
          "LAMBREQUIN_FIXE": 1,
          "LED_ARMS": 1,
          "LED_CASSETTE": 1
    }
  },
  "dynasta": {
    id: "dynasta",
    name: "STORAL ARMOR",
    slug: "store-banne-grande-largeur-armor",
    salesCoefficient: 1,
    buyPrices:     {
          "1500": [
                {
                      "maxW": 4760,
                      "priceHT": 1650
                },
                {
                      "maxW": 5610,
                      "priceHT": 1741
                },
                {
                      "maxW": 6000,
                      "priceHT": 1775
                },
                {
                      "maxW": 7110,
                      "priceHT": 2744
                },
                {
                      "maxW": 8280,
                      "priceHT": 3204
                },
                {
                      "maxW": 9450,
                      "priceHT": 3284
                },
                {
                      "maxW": 10620,
                      "priceHT": 3577
                },
                {
                      "maxW": 11220,
                      "priceHT": 3747
                },
                {
                      "maxW": 12000,
                      "priceHT": 3961
                }
          ],
          "2000": [
                {
                      "maxW": 4760,
                      "priceHT": 19710
                },
                {
                      "maxW": 5610,
                      "priceHT": 1814
                },
                {
                      "maxW": 6000,
                      "priceHT": 1865
                },
                {
                      "maxW": 7110,
                      "priceHT": 2841
                },
                {
                      "maxW": 8280,
                      "priceHT": 3317
                },
                {
                      "maxW": 9450,
                      "priceHT": 3409
                },
                {
                      "maxW": 10620,
                      "priceHT": 3717
                },
                {
                      "maxW": 11220,
                      "priceHT": 3898
                },
                {
                      "maxW": 12000,
                      "priceHT": 4126
                }
          ],
          "2500": [
                {
                      "maxW": 4760,
                      "priceHT": 1789
                },
                {
                      "maxW": 5610,
                      "priceHT": 1907
                },
                {
                      "maxW": 6000,
                      "priceHT": 1966
                },
                {
                      "maxW": 7110,
                      "priceHT": 2975
                },
                {
                      "maxW": 8280,
                      "priceHT": 3460
                },
                {
                      "maxW": 9450,
                      "priceHT": 3569
                },
                {
                      "maxW": 10620,
                      "priceHT": 3886
                },
                {
                      "maxW": 11220,
                      "priceHT": 4083
                },
                {
                      "maxW": 12000,
                      "priceHT": 4326
                }
          ],
          "2750": [
                {
                      "maxW": 4760,
                      "priceHT": 1812
                },
                {
                      "maxW": 5610,
                      "priceHT": 1934
                },
                {
                      "maxW": 6000,
                      "priceHT": 2005
                },
                {
                      "maxW": 7110,
                      "priceHT": 3012
                },
                {
                      "maxW": 8280,
                      "priceHT": 3506
                },
                {
                      "maxW": 9450,
                      "priceHT": 3617
                },
                {
                      "maxW": 10620,
                      "priceHT": 3944
                },
                {
                      "maxW": 11220,
                      "priceHT": 4145
                },
                {
                      "maxW": 12000,
                      "priceHT": 4396
                }
          ],
          "3000": [
                {
                      "maxW": 4760,
                      "priceHT": 1855
                },
                {
                      "maxW": 5610,
                      "priceHT": 1983
                },
                {
                      "maxW": 6000,
                      "priceHT": 2068
                },
                {
                      "maxW": 7110,
                      "priceHT": 3087
                },
                {
                      "maxW": 8280,
                      "priceHT": 3587
                },
                {
                      "maxW": 9450,
                      "priceHT": 3703
                },
                {
                      "maxW": 10620,
                      "priceHT": 4038
                },
                {
                      "maxW": 11220,
                      "priceHT": 4248
                },
                {
                      "maxW": 12000,
                      "priceHT": 4515
                }
          ],
          "3250": [
                {
                      "maxW": 4760,
                      "priceHT": 1977
                },
                {
                      "maxW": 5610,
                      "priceHT": 2111
                },
                {
                      "maxW": 6000,
                      "priceHT": 2202
                },
                {
                      "maxW": 7110,
                      "priceHT": 3336
                },
                {
                      "maxW": 8280,
                      "priceHT": 3769
                },
                {
                      "maxW": 9450,
                      "priceHT": 3917
                },
                {
                      "maxW": 10620,
                      "priceHT": 4274
                },
                {
                      "maxW": 11220,
                      "priceHT": 4478
                },
                {
                      "maxW": 12000,
                      "priceHT": 4746
                }
          ],
          "3500": [
                {
                      "maxW": 4760,
                      "priceHT": 2017
                },
                {
                      "maxW": 5610,
                      "priceHT": 2156
                },
                {
                      "maxW": 6000,
                      "priceHT": 2253
                },
                {
                      "maxW": 7110,
                      "priceHT": 3362
                },
                {
                      "maxW": 8280,
                      "priceHT": 3809
                },
                {
                      "maxW": 9450,
                      "priceHT": 3990
                },
                {
                      "maxW": 10620,
                      "priceHT": 4350
                },
                {
                      "maxW": 11220,
                      "priceHT": 4562
                },
                {
                      "maxW": 12000,
                      "priceHT": 4839
                }
          ],
          "4000": [
                {
                      "maxW": 4760,
                      "priceHT": 2115
                },
                {
                      "maxW": 5610,
                      "priceHT": 2268
                },
                {
                      "maxW": 6000,
                      "priceHT": 2277
                },
                {
                      "maxW": 7110,
                      "priceHT": 3451
                },
                {
                      "maxW": 8280,
                      "priceHT": 3896
                },
                {
                      "maxW": 9450,
                      "priceHT": 4169
                },
                {
                      "maxW": 10620,
                      "priceHT": 4545
                },
                {
                      "maxW": 11220,
                      "priceHT": 4767
                },
                {
                      "maxW": 12000,
                      "priceHT": 5057
                }
          ]
    },
    optionsCoefficients:     {
          "AUVENT": 1,
          "CEILING_MOUNT": 1,
          "FABRIC": 1,
          "FRAME_COLOR_CUSTOM": 1,
          "INSTALLATION": 1,
          "LAMBREQUIN_ENROULABLE": 1,
          "LAMBREQUIN_FIXE": 1,
          "LED_ARMS": 1,
          "LED_CASSETTE": 1
    }
  },
  "genes": {
    id: "genes",
    name: "STORAL TRADITION",
    slug: "store-banne-loggia-sans-coffre",
    salesCoefficient: 1,
    buyPrices:     {
          "1500": [
                {
                      "maxW": 2390,
                      "priceHT": 672
                },
                {
                      "maxW": 3570,
                      "priceHT": 751
                },
                {
                      "maxW": 4750,
                      "priceHT": 854
                },
                {
                      "maxW": 5550,
                      "priceHT": 953
                }
          ],
          "1750": [
                {
                      "maxW": 2390,
                      "priceHT": 677
                },
                {
                      "maxW": 3570,
                      "priceHT": 758
                },
                {
                      "maxW": 4750,
                      "priceHT": 859
                },
                {
                      "maxW": 5550,
                      "priceHT": 958
                }
          ],
          "2000": [
                {
                      "maxW": 2390,
                      "priceHT": 682
                },
                {
                      "maxW": 3570,
                      "priceHT": 767
                },
                {
                      "maxW": 4750,
                      "priceHT": 867
                },
                {
                      "maxW": 5550,
                      "priceHT": 967
                }
          ],
          "2500": [
                {
                      "maxW": 2750,
                      "priceHT": 776
                },
                {
                      "maxW": 4750,
                      "priceHT": 875
                }
          ]
    },
    optionsCoefficients:     {
          "AUVENT": 1,
          "CEILING_MOUNT": 1,
          "FABRIC": 1,
          "FRAME_COLOR_CUSTOM": 1,
          "INSTALLATION": 1,
          "LAMBREQUIN_ENROULABLE": 1,
          "LAMBREQUIN_FIXE": 1,
          "LED_ARMS": 1,
          "LED_CASSETTE": 1
    }
  },
  "heliom": {
    id: "heliom",
    name: "STORAL KUBE",
    slug: "store-banne-coffre-rectangulaire-kube",
    salesCoefficient: 1,
    buyPrices:     {
          "1500": [
                {
                      "maxW": 2400,
                      "priceHT": 1950
                },
                {
                      "maxW": 3580,
                      "priceHT": 2019
                },
                {
                      "maxW": 4200,
                      "priceHT": 2124
                },
                {
                      "maxW": 5290,
                      "priceHT": 2301
                },
                {
                      "maxW": 6000,
                      "priceHT": 2362
                }
          ],
          "2000": [
                {
                      "maxW": 3580,
                      "priceHT": 2058
                },
                {
                      "maxW": 4200,
                      "priceHT": 2166
                },
                {
                      "maxW": 5290,
                      "priceHT": 2353
                },
                {
                      "maxW": 6000,
                      "priceHT": 2421
                }
          ],
          "2500": [
                {
                      "maxW": 3580,
                      "priceHT": 2111
                },
                {
                      "maxW": 4200,
                      "priceHT": 2222
                },
                {
                      "maxW": 5290,
                      "priceHT": 2421
                },
                {
                      "maxW": 6000,
                      "priceHT": 2496
                }
          ],
          "2750": [
                {
                      "maxW": 4200,
                      "priceHT": 2265
                },
                {
                      "maxW": 5290,
                      "priceHT": 2456
                },
                {
                      "maxW": 6000,
                      "priceHT": 2544
                }
          ],
          "3000": [
                {
                      "maxW": 4200,
                      "priceHT": 2291
                },
                {
                      "maxW": 5290,
                      "priceHT": 2485
                },
                {
                      "maxW": 6000,
                      "priceHT": 2577
                }
          ],
          "3250": [
                {
                      "maxW": 4200,
                      "priceHT": 2316
                },
                {
                      "maxW": 5290,
                      "priceHT": 2512
                },
                {
                      "maxW": 6000,
                      "priceHT": 2609
                }
          ],
          "3500": [
                {
                      "maxW": 5290,
                      "priceHT": 2541
                },
                {
                      "maxW": 6000,
                      "priceHT": 2641
                }
          ]
    },
    optionsCoefficients:     {
          "AUVENT": 1,
          "CEILING_MOUNT": 1,
          "FABRIC": 1,
          "FRAME_COLOR_CUSTOM": 1,
          "INSTALLATION": 1,
          "LAMBREQUIN_ENROULABLE": 1,
          "LAMBREQUIN_FIXE": 1,
          "LED_ARMS": 1,
          "LED_CASSETTE": 1
    }
  },
  "heliom_plus": {
    id: "heliom_plus",
    name: "STORAL KUBE +",
    slug: "store-banne-design-architecte-kube",
    salesCoefficient: 1,
    buyPrices:     {
          "2500": [
                {
                      "maxW": 3580,
                      "priceHT": 2185
                },
                {
                      "maxW": 4200,
                      "priceHT": 2308
                },
                {
                      "maxW": 5290,
                      "priceHT": 2496
                },
                {
                      "maxW": 6000,
                      "priceHT": 2570
                }
          ],
          "2750": [
                {
                      "maxW": 4200,
                      "priceHT": 2332
                },
                {
                      "maxW": 5290,
                      "priceHT": 2526
                },
                {
                      "maxW": 6000,
                      "priceHT": 2603
                }
          ],
          "3000": [
                {
                      "maxW": 4200,
                      "priceHT": 2356
                },
                {
                      "maxW": 5290,
                      "priceHT": 2556
                },
                {
                      "maxW": 6000,
                      "priceHT": 2638
                }
          ],
          "3250": [
                {
                      "maxW": 4200,
                      "priceHT": 2402
                },
                {
                      "maxW": 5290,
                      "priceHT": 2614
                },
                {
                      "maxW": 6000,
                      "priceHT": 2703
                }
          ],
          "3500": [
                {
                      "maxW": 5290,
                      "priceHT": 2651
                },
                {
                      "maxW": 6000,
                      "priceHT": 2745
                }
          ],
          "4000": [
                {
                      "maxW": 5290,
                      "priceHT": 2838
                },
                {
                      "maxW": 6000,
                      "priceHT": 2938
                }
          ]
    },
    optionsCoefficients:     {
          "AUVENT": 1,
          "CEILING_MOUNT": 1,
          "FABRIC": 1,
          "FRAME_COLOR_CUSTOM": 1,
          "INSTALLATION": 1,
          "LAMBREQUIN_ENROULABLE": 1,
          "LAMBREQUIN_FIXE": 1,
          "LED_ARMS": 1,
          "LED_CASSETTE": 1
    }
  },
  "kalyo": {
    id: "kalyo",
    name: "STORAL K",
    slug: "store-banne-carre-coffre-compact",
    salesCoefficient: 1,
    buyPrices:     {
          "1500": [
                {
                      "maxW": 2400,
                      "priceHT": 1589
                },
                {
                      "maxW": 3580,
                      "priceHT": 1922
                },
                {
                      "maxW": 4760,
                      "priceHT": 2128
                },
                {
                      "maxW": 5610,
                      "priceHT": 2328
                },
                {
                      "maxW": 6000,
                      "priceHT": 2441
                }
          ],
          "2000": [
                {
                      "maxW": 3580,
                      "priceHT": 1964
                },
                {
                      "maxW": 4760,
                      "priceHT": 2181
                },
                {
                      "maxW": 5610,
                      "priceHT": 2391
                },
                {
                      "maxW": 6000,
                      "priceHT": 2517
                }
          ],
          "2500": [
                {
                      "maxW": 3580,
                      "priceHT": 2015
                },
                {
                      "maxW": 4760,
                      "priceHT": 2244
                },
                {
                      "maxW": 5610,
                      "priceHT": 2458
                },
                {
                      "maxW": 6000,
                      "priceHT": 2630
                }
          ],
          "2750": [
                {
                      "maxW": 3580,
                      "priceHT": 2047
                },
                {
                      "maxW": 4760,
                      "priceHT": 2291
                },
                {
                      "maxW": 5610,
                      "priceHT": 2540
                },
                {
                      "maxW": 6000,
                      "priceHT": 2680
                }
          ],
          "3000": [
                {
                      "maxW": 4760,
                      "priceHT": 2335
                },
                {
                      "maxW": 5610,
                      "priceHT": 2577
                },
                {
                      "maxW": 6000,
                      "priceHT": 2743
                }
          ],
          "3250": [
                {
                      "maxW": 4760,
                      "priceHT": 2381
                },
                {
                      "maxW": 5610,
                      "priceHT": 2626
                },
                {
                      "maxW": 6000,
                      "priceHT": 2826
                }
          ],
          "3500": [
                {
                      "maxW": 4760,
                      "priceHT": 2423
                },
                {
                      "maxW": 5610,
                      "priceHT": 2705
                },
                {
                      "maxW": 6000,
                      "priceHT": 2914
                }
          ]
    },
    optionsCoefficients:     {
          "AUVENT": 1,
          "CEILING_MOUNT": 1,
          "FABRIC": 1,
          "FRAME_COLOR_CUSTOM": 1,
          "INSTALLATION": 1,
          "LAMBREQUIN_ENROULABLE": 1,
          "LAMBREQUIN_FIXE": 1,
          "LED_ARMS": 1,
          "LED_CASSETTE": 1
    }
  },
  "kissimy_promo": {
    id: "kissimy_promo",
    name: "STORAL COMPACT (Série Limitée)",
    slug: "store-banne-coffre-compact-sur-mesure",
    salesCoefficient: 1,
    buyPrices:     {
          "1500": [
                {
                      "maxW": 2470,
                      "priceHT": 1010
                },
                {
                      "maxW": 3650,
                      "priceHT": 1047
                },
                {
                      "maxW": 4830,
                      "priceHT": 1081
                }
          ],
          "1750": [
                {
                      "maxW": 2470,
                      "priceHT": 1039
                },
                {
                      "maxW": 3650,
                      "priceHT": 1085
                },
                {
                      "maxW": 4830,
                      "priceHT": 1126
                }
          ],
          "2000": [
                {
                      "maxW": 2470,
                      "priceHT": 1064
                },
                {
                      "maxW": 3650,
                      "priceHT": 1116
                },
                {
                      "maxW": 4830,
                      "priceHT": 1156
                }
          ],
          "2500": [
                {
                      "maxW": 3650,
                      "priceHT": 1165
                },
                {
                      "maxW": 4830,
                      "priceHT": 1225
                }
          ],
          "3000": [
                {
                      "maxW": 3650,
                      "priceHT": 1224
                },
                {
                      "maxW": 4830,
                      "priceHT": 1295
                }
          ]
    },
    optionsCoefficients:     {
          "AUVENT": 1,
          "CEILING_MOUNT": 1,
          "FABRIC": 1,
          "FRAME_COLOR_CUSTOM": 1,
          "INSTALLATION": 1,
          "LAMBREQUIN_ENROULABLE": 1,
          "LAMBREQUIN_FIXE": 1,
          "LED_ARMS": 1,
          "LED_CASSETTE": 1
    }
  },
  "kitanguy": {
    id: "kitanguy",
    name: "STORAL COMPACT +",
    slug: "store-banne-coffre-compact-renforce",
    salesCoefficient: 1,
    buyPrices:     {
          "1500": [
                {
                      "maxW": 2470,
                      "priceHT": 1353
                },
                {
                      "maxW": 3650,
                      "priceHT": 1435
                },
                {
                      "maxW": 4830,
                      "priceHT": 1561
                },
                {
                      "maxW": 5610,
                      "priceHT": 1657
                },
                {
                      "maxW": 5850,
                      "priceHT": 1794
                }
          ],
          "1750": [
                {
                      "maxW": 2470,
                      "priceHT": 1389
                },
                {
                      "maxW": 3650,
                      "priceHT": 1478
                },
                {
                      "maxW": 4830,
                      "priceHT": 1613
                },
                {
                      "maxW": 5610,
                      "priceHT": 1712
                },
                {
                      "maxW": 5850,
                      "priceHT": 1852
                }
          ],
          "2000": [
                {
                      "maxW": 2470,
                      "priceHT": 1428
                },
                {
                      "maxW": 3650,
                      "priceHT": 1516
                },
                {
                      "maxW": 4830,
                      "priceHT": 1660
                },
                {
                      "maxW": 5610,
                      "priceHT": 1765
                },
                {
                      "maxW": 5850,
                      "priceHT": 1904
                }
          ],
          "2500": [
                {
                      "maxW": 3650,
                      "priceHT": 1577
                },
                {
                      "maxW": 4830,
                      "priceHT": 1735
                },
                {
                      "maxW": 5610,
                      "priceHT": 1879
                },
                {
                      "maxW": 5850,
                      "priceHT": 2033
                }
          ],
          "3000": [
                {
                      "maxW": 3650,
                      "priceHT": 1649
                },
                {
                      "maxW": 4830,
                      "priceHT": 1822
                },
                {
                      "maxW": 5610,
                      "priceHT": 2024
                },
                {
                      "maxW": 5850,
                      "priceHT": 2186
                }
          ],
          "3250": [
                {
                      "maxW": 4830,
                      "priceHT": 1735
                },
                {
                      "maxW": 5610,
                      "priceHT": 1917
                },
                {
                      "maxW": 5850,
                      "priceHT": 2148
                }
          ]
    },
    optionsCoefficients:     {
          "AUVENT": 1,
          "CEILING_MOUNT": 1,
          "FABRIC": 1,
          "FRAME_COLOR_CUSTOM": 1,
          "INSTALLATION": 1,
          "LAMBREQUIN_ENROULABLE": 1,
          "LAMBREQUIN_FIXE": 1,
          "LED_ARMS": 1,
          "LED_CASSETTE": 1
    }
  },
  "kitanguy_2": {
    id: "kitanguy_2",
    name: "STORAL EXCELLENCE",
    slug: "store-banne-coffre-excellence-led",
    salesCoefficient: 1,
    buyPrices:     {
          "1500": [
                {
                      "maxW": 2470,
                      "priceHT": 1433
                },
                {
                      "maxW": 3650,
                      "priceHT": 1520
                },
                {
                      "maxW": 4830,
                      "priceHT": 1654
                },
                {
                      "maxW": 5610,
                      "priceHT": 1756
                },
                {
                      "maxW": 5850,
                      "priceHT": 1901
                }
          ],
          "1750": [
                {
                      "maxW": 2470,
                      "priceHT": 1473
                },
                {
                      "maxW": 3650,
                      "priceHT": 1567
                },
                {
                      "maxW": 4830,
                      "priceHT": 1709
                },
                {
                      "maxW": 5610,
                      "priceHT": 1814
                },
                {
                      "maxW": 5850,
                      "priceHT": 1962
                }
          ],
          "2000": [
                {
                      "maxW": 2470,
                      "priceHT": 1514
                },
                {
                      "maxW": 3650,
                      "priceHT": 1607
                },
                {
                      "maxW": 4830,
                      "priceHT": 1760
                },
                {
                      "maxW": 5610,
                      "priceHT": 1870
                },
                {
                      "maxW": 5850,
                      "priceHT": 2018
                }
          ],
          "2500": [
                {
                      "maxW": 3650,
                      "priceHT": 1672
                },
                {
                      "maxW": 4830,
                      "priceHT": 1839
                },
                {
                      "maxW": 5610,
                      "priceHT": 1991
                },
                {
                      "maxW": 5850,
                      "priceHT": 2155
                }
          ],
          "3000": [
                {
                      "maxW": 3650,
                      "priceHT": 1748
                },
                {
                      "maxW": 4830,
                      "priceHT": 1931
                },
                {
                      "maxW": 5610,
                      "priceHT": 2146
                },
                {
                      "maxW": 5850,
                      "priceHT": 2317
                }
          ],
          "3250": [
                {
                      "maxW": 4830,
                      "priceHT": 1839
                },
                {
                      "maxW": 5610,
                      "priceHT": 2032
                },
                {
                      "maxW": 5850,
                      "priceHT": 2277
                }
          ]
    },
    optionsCoefficients:     {
          "AUVENT": 1,
          "CEILING_MOUNT": 1,
          "FABRIC": 1,
          "FRAME_COLOR_CUSTOM": 1,
          "INSTALLATION": 1,
          "LAMBREQUIN_ENROULABLE": 1,
          "LAMBREQUIN_FIXE": 1,
          "LED_ARMS": 1,
          "LED_CASSETTE": 1
    }
  },
  "lisbonne": {
    id: "lisbonne",
    name: "STORAL TRADITION 18M",
    slug: "store-banne-traditionnel-grande-portee-18m",
    salesCoefficient: 1,
    buyPrices:     {
          "1500": [
                {
                      "maxW": 2750,
                      "priceHT": 1044
                },
                {
                      "maxW": 3250,
                      "priceHT": 1107
                },
                {
                      "maxW": 3750,
                      "priceHT": 1169
                },
                {
                      "maxW": 4250,
                      "priceHT": 1232
                },
                {
                      "maxW": 4750,
                      "priceHT": 1294
                },
                {
                      "maxW": 5250,
                      "priceHT": 1357
                },
                {
                      "maxW": 5750,
                      "priceHT": 1419
                },
                {
                      "maxW": 6250,
                      "priceHT": 1482
                },
                {
                      "maxW": 6750,
                      "priceHT": 1544
                },
                {
                      "maxW": 7250,
                      "priceHT": 1607
                },
                {
                      "maxW": 7750,
                      "priceHT": 1669
                },
                {
                      "maxW": 8000,
                      "priceHT": 1700
                }
          ],
          "2000": [
                {
                      "maxW": 3250,
                      "priceHT": 1169
                },
                {
                      "maxW": 3750,
                      "priceHT": 1232
                },
                {
                      "maxW": 4250,
                      "priceHT": 1294
                },
                {
                      "maxW": 4750,
                      "priceHT": 1357
                },
                {
                      "maxW": 5250,
                      "priceHT": 1419
                },
                {
                      "maxW": 5750,
                      "priceHT": 1482
                },
                {
                      "maxW": 6250,
                      "priceHT": 1544
                },
                {
                      "maxW": 6750,
                      "priceHT": 1607
                },
                {
                      "maxW": 7250,
                      "priceHT": 1669
                },
                {
                      "maxW": 7750,
                      "priceHT": 1732
                },
                {
                      "maxW": 8000,
                      "priceHT": 1763
                }
          ],
          "2500": [
                {
                      "maxW": 3750,
                      "priceHT": 1294
                },
                {
                      "maxW": 4250,
                      "priceHT": 1357
                },
                {
                      "maxW": 4750,
                      "priceHT": 1419
                },
                {
                      "maxW": 5250,
                      "priceHT": 1482
                },
                {
                      "maxW": 5750,
                      "priceHT": 1544
                },
                {
                      "maxW": 6250,
                      "priceHT": 1607
                },
                {
                      "maxW": 6750,
                      "priceHT": 1669
                },
                {
                      "maxW": 7250,
                      "priceHT": 1732
                },
                {
                      "maxW": 7750,
                      "priceHT": 1794
                },
                {
                      "maxW": 8000,
                      "priceHT": 1825
                }
          ],
          "3000": [
                {
                      "maxW": 4250,
                      "priceHT": 1419
                },
                {
                      "maxW": 4750,
                      "priceHT": 1482
                },
                {
                      "maxW": 5250,
                      "priceHT": 1544
                },
                {
                      "maxW": 5750,
                      "priceHT": 1607
                },
                {
                      "maxW": 6250,
                      "priceHT": 1669
                },
                {
                      "maxW": 6750,
                      "priceHT": 1732
                },
                {
                      "maxW": 7250,
                      "priceHT": 1794
                },
                {
                      "maxW": 7750,
                      "priceHT": 1857
                },
                {
                      "maxW": 8000,
                      "priceHT": 1888
                }
          ],
          "3500": [
                {
                      "maxW": 4750,
                      "priceHT": 1544
                },
                {
                      "maxW": 5250,
                      "priceHT": 1607
                },
                {
                      "maxW": 5750,
                      "priceHT": 1669
                },
                {
                      "maxW": 6250,
                      "priceHT": 1732
                },
                {
                      "maxW": 6750,
                      "priceHT": 1794
                },
                {
                      "maxW": 7250,
                      "priceHT": 1857
                },
                {
                      "maxW": 7750,
                      "priceHT": 1919
                },
                {
                      "maxW": 8000,
                      "priceHT": 1950
                }
          ],
          "4000": [
                {
                      "maxW": 4750,
                      "priceHT": 1669
                },
                {
                      "maxW": 5250,
                      "priceHT": 1732
                },
                {
                      "maxW": 5700,
                      "priceHT": 1922
                },
                {
                      "maxW": 6000,
                      "priceHT": 2140
                },
                {
                      "maxW": 6500,
                      "priceHT": 2265
                },
                {
                      "maxW": 7000,
                      "priceHT": 2390
                },
                {
                      "maxW": 7500,
                      "priceHT": 2515
                },
                {
                      "maxW": 8000,
                      "priceHT": 2640
                }
          ]
    },
    optionsCoefficients:     {
          "AUVENT": 1,
          "CEILING_MOUNT": 1,
          "FABRIC": 1,
          "FRAME_COLOR_CUSTOM": 1,
          "INSTALLATION": 1,
          "LAMBREQUIN_ENROULABLE": 1,
          "LAMBREQUIN_FIXE": 1,
          "LED_ARMS": 1,
          "LED_CASSETTE": 1
    }
  },
  "madrid": {
    id: "madrid",
    name: "STORAL CLASSIQUE +",
    slug: "store-banne-coffre-robuste-madrid",
    salesCoefficient: 1,
    buyPrices:     {
          "1500": [
                {
                      "maxW": 2390,
                      "priceHT": 1053
                },
                {
                      "maxW": 3570,
                      "priceHT": 1185
                },
                {
                      "maxW": 4750,
                      "priceHT": 1308
                },
                {
                      "maxW": 5610,
                      "priceHT": 1458
                },
                {
                      "maxW": 6000,
                      "priceHT": 1588
                },
                {
                      "maxW": 7110,
                      "priceHT": 2123
                },
                {
                      "maxW": 8280,
                      "priceHT": 2265
                },
                {
                      "maxW": 9450,
                      "priceHT": 2442
                },
                {
                      "maxW": 10790,
                      "priceHT": 2584
                },
                {
                      "maxW": 11220,
                      "priceHT": 2755
                },
                {
                      "maxW": 12000,
                      "priceHT": 2887
                },
                {
                      "maxW": 12970,
                      "priceHT": 3417
                },
                {
                      "maxW": 14140,
                      "priceHT": 3506
                },
                {
                      "maxW": 15310,
                      "priceHT": 3742
                },
                {
                      "maxW": 16480,
                      "priceHT": 3841
                },
                {
                      "maxW": 16830,
                      "priceHT": 3938
                },
                {
                      "maxW": 18000,
                      "priceHT": 4132
                }
          ],
          "2000": [
                {
                      "maxW": 2390,
                      "priceHT": 1094
                },
                {
                      "maxW": 3570,
                      "priceHT": 1241
                },
                {
                      "maxW": 4750,
                      "priceHT": 1383
                },
                {
                      "maxW": 5610,
                      "priceHT": 1548
                },
                {
                      "maxW": 6000,
                      "priceHT": 1691
                },
                {
                      "maxW": 7110,
                      "priceHT": 2263
                },
                {
                      "maxW": 8280,
                      "priceHT": 2419
                },
                {
                      "maxW": 9450,
                      "priceHT": 2612
                },
                {
                      "maxW": 10790,
                      "priceHT": 2776
                },
                {
                      "maxW": 11220,
                      "priceHT": 2962
                },
                {
                      "maxW": 12000,
                      "priceHT": 3097
                },
                {
                      "maxW": 12970,
                      "priceHT": 3651
                },
                {
                      "maxW": 14140,
                      "priceHT": 3766
                },
                {
                      "maxW": 15310,
                      "priceHT": 4017
                },
                {
                      "maxW": 16480,
                      "priceHT": 4132
                },
                {
                      "maxW": 16830,
                      "priceHT": 4246
                },
                {
                      "maxW": 18000,
                      "priceHT": 4444
                }
          ],
          "2500": [
                {
                      "maxW": 3570,
                      "priceHT": 1320
                },
                {
                      "maxW": 4750,
                      "priceHT": 1479
                },
                {
                      "maxW": 5610,
                      "priceHT": 1655
                },
                {
                      "maxW": 6000,
                      "priceHT": 1821
                },
                {
                      "maxW": 7110,
                      "priceHT": 2451
                },
                {
                      "maxW": 8280,
                      "priceHT": 2625
                },
                {
                      "maxW": 9450,
                      "priceHT": 2839
                },
                {
                      "maxW": 10790,
                      "priceHT": 3020
                },
                {
                      "maxW": 11220,
                      "priceHT": 3223
                },
                {
                      "maxW": 12000,
                      "priceHT": 3358
                },
                {
                      "maxW": 12970,
                      "priceHT": 3978
                },
                {
                      "maxW": 14140,
                      "priceHT": 4112
                },
                {
                      "maxW": 15310,
                      "priceHT": 4381
                },
                {
                      "maxW": 16480,
                      "priceHT": 4514
                },
                {
                      "maxW": 16830,
                      "priceHT": 4645
                },
                {
                      "maxW": 18000,
                      "priceHT": 4849
                }
          ],
          "3000": [
                {
                      "maxW": 3570,
                      "priceHT": 1387
                },
                {
                      "maxW": 4750,
                      "priceHT": 1564
                },
                {
                      "maxW": 5610,
                      "priceHT": 1754
                },
                {
                      "maxW": 6000,
                      "priceHT": 1932
                },
                {
                      "maxW": 7110,
                      "priceHT": 2586
                },
                {
                      "maxW": 8280,
                      "priceHT": 2777
                },
                {
                      "maxW": 9450,
                      "priceHT": 3007
                },
                {
                      "maxW": 10790,
                      "priceHT": 3207
                },
                {
                      "maxW": 11220,
                      "priceHT": 3427
                },
                {
                      "maxW": 12000,
                      "priceHT": 3568
                },
                {
                      "maxW": 12970,
                      "priceHT": 4211
                },
                {
                      "maxW": 14140,
                      "priceHT": 4360
                },
                {
                      "maxW": 15310,
                      "priceHT": 4650
                },
                {
                      "maxW": 16480,
                      "priceHT": 4799
                },
                {
                      "maxW": 16830,
                      "priceHT": 4947
                },
                {
                      "maxW": 18000,
                      "priceHT": 5153
                }
          ],
          "3500": [
                {
                      "maxW": 4750,
                      "priceHT": 1676
                },
                {
                      "maxW": 5610,
                      "priceHT": 1882
                },
                {
                      "maxW": 6000,
                      "priceHT": 2078
                },
                {
                      "maxW": 7110,
                      "priceHT": 2681
                },
                {
                      "maxW": 8280,
                      "priceHT": 2979
                },
                {
                      "maxW": 9450,
                      "priceHT": 3253
                },
                {
                      "maxW": 10790,
                      "priceHT": 3469
                },
                {
                      "maxW": 11220,
                      "priceHT": 3705
                },
                {
                      "maxW": 12000,
                      "priceHT": 3853
                },
                {
                      "maxW": 12970,
                      "priceHT": 4554
                },
                {
                      "maxW": 14140,
                      "priceHT": 4719
                },
                {
                      "maxW": 15310,
                      "priceHT": 5029
                },
                {
                      "maxW": 16480,
                      "priceHT": 5197
                },
                {
                      "maxW": 16830,
                      "priceHT": 5364
                },
                {
                      "maxW": 18000,
                      "priceHT": 5581
                }
          ],
          "4000": [
                {
                      "maxW": 4750,
                      "priceHT": 1857
                },
                {
                      "maxW": 5610,
                      "priceHT": 2075
                },
                {
                      "maxW": 6000,
                      "priceHT": 2298
                },
                {
                      "maxW": 7110,
                      "priceHT": 2914
                },
                {
                      "maxW": 8280,
                      "priceHT": 3117
                },
                {
                      "maxW": 9450,
                      "priceHT": 3583
                },
                {
                      "maxW": 10790,
                      "priceHT": 3821
                },
                {
                      "maxW": 11220,
                      "priceHT": 4074
                },
                {
                      "maxW": 12000,
                      "priceHT": 4230
                },
                {
                      "maxW": 12970,
                      "priceHT": 4801
                },
                {
                      "maxW": 14140,
                      "priceHT": 5215
                },
                {
                      "maxW": 15310,
                      "priceHT": 5542
                },
                {
                      "maxW": 16480,
                      "priceHT": 5725
                },
                {
                      "maxW": 16830,
                      "priceHT": 5904
                },
                {
                      "maxW": 18000,
                      "priceHT": 6145
                }
          ]
    },
    optionsCoefficients:     {
          "AUVENT": 1,
          "CEILING_MOUNT": 1,
          "FRAME_COLOR_CUSTOM": 1,
          "LAMBREQUIN_ENROULABLE": 1,
          "LAMBREQUIN_FIXE": 1,
          "LED_ARMS": 1,
          "LED_CASSETTE": 1
    }
  },
  "menton": {
    id: "menton",
    name: "STORAL TRADITION +",
    slug: "store-banne-traditionnel-renforce-menton",
    salesCoefficient: 1,
    buyPrices:     {
          "1500": [
                {
                      "maxW": 2390,
                      "priceHT": 973
                },
                {
                      "maxW": 3570,
                      "priceHT": 1075
                },
                {
                      "maxW": 4750,
                      "priceHT": 1173
                },
                {
                      "maxW": 5700,
                      "priceHT": 1285
                },
                {
                      "maxW": 6000,
                      "priceHT": 1414
                },
                {
                      "maxW": 7110,
                      "priceHT": 1924
                },
                {
                      "maxW": 8280,
                      "priceHT": 2053
                },
                {
                      "maxW": 9450,
                      "priceHT": 2169
                },
                {
                      "maxW": 10750,
                      "priceHT": 2302
                },
                {
                      "maxW": 11400,
                      "priceHT": 2398
                },
                {
                      "maxW": 12000,
                      "priceHT": 2490
                }
          ],
          "1750": [
                {
                      "maxW": 2390,
                      "priceHT": 980
                },
                {
                      "maxW": 3570,
                      "priceHT": 1081
                },
                {
                      "maxW": 4750,
                      "priceHT": 1184
                },
                {
                      "maxW": 5700,
                      "priceHT": 1292
                },
                {
                      "maxW": 6000,
                      "priceHT": 1417
                },
                {
                      "maxW": 7110,
                      "priceHT": 1934
                },
                {
                      "maxW": 8280,
                      "priceHT": 2068
                },
                {
                      "maxW": 9450,
                      "priceHT": 2180
                },
                {
                      "maxW": 10750,
                      "priceHT": 2316
                },
                {
                      "maxW": 11400,
                      "priceHT": 2409
                },
                {
                      "maxW": 12000,
                      "priceHT": 2501
                }
          ],
          "2000": [
                {
                      "maxW": 2390,
                      "priceHT": 984
                },
                {
                      "maxW": 3570,
                      "priceHT": 1087
                },
                {
                      "maxW": 4750,
                      "priceHT": 1189
                },
                {
                      "maxW": 5700,
                      "priceHT": 1296
                },
                {
                      "maxW": 6000,
                      "priceHT": 1424
                },
                {
                      "maxW": 7110,
                      "priceHT": 1947
                },
                {
                      "maxW": 8280,
                      "priceHT": 2077
                },
                {
                      "maxW": 9450,
                      "priceHT": 2191
                },
                {
                      "maxW": 10750,
                      "priceHT": 2329
                },
                {
                      "maxW": 11400,
                      "priceHT": 2422
                },
                {
                      "maxW": 12000,
                      "priceHT": 2514
                }
          ],
          "2500": [
                {
                      "maxW": 3570,
                      "priceHT": 1100
                },
                {
                      "maxW": 4750,
                      "priceHT": 1204
                },
                {
                      "maxW": 5700,
                      "priceHT": 1314
                },
                {
                      "maxW": 6000,
                      "priceHT": 1439
                },
                {
                      "maxW": 7110,
                      "priceHT": 1974
                },
                {
                      "maxW": 8280,
                      "priceHT": 2104
                },
                {
                      "maxW": 9450,
                      "priceHT": 2218
                },
                {
                      "maxW": 10750,
                      "priceHT": 2357
                },
                {
                      "maxW": 11400,
                      "priceHT": 2449
                },
                {
                      "maxW": 12000,
                      "priceHT": 2549
                }
          ],
          "3000": [
                {
                      "maxW": 4750,
                      "priceHT": 1222
                },
                {
                      "maxW": 5700,
                      "priceHT": 1331
                },
                {
                      "maxW": 6000,
                      "priceHT": 1463
                },
                {
                      "maxW": 7110,
                      "priceHT": 2016
                },
                {
                      "maxW": 8280,
                      "priceHT": 2148
                },
                {
                      "maxW": 9450,
                      "priceHT": 2265
                },
                {
                      "maxW": 10750,
                      "priceHT": 2400
                },
                {
                      "maxW": 11400,
                      "priceHT": 2496
                },
                {
                      "maxW": 12000,
                      "priceHT": 2595
                }
          ]
    },
    optionsCoefficients:     {
          "AUVENT": 1,
          "CEILING_MOUNT": 1,
          "FABRIC": 1,
          "FRAME_COLOR_CUSTOM": 1,
          "INSTALLATION": 1,
          "LAMBREQUIN_ENROULABLE": 1,
          "LAMBREQUIN_FIXE": 1,
          "LED_ARMS": 1,
          "LED_CASSETTE": 1
    }
  },
};

/**
 * Calculer le prix de vente TTC à partir du prix d'achat HT
 * 
 * @param priceHT Prix d'achat HT fournisseur
 * @param coefficient Coefficient de marge du produit
 * @param vat Taux de TVA (défaut: 1.10 pour 10%)
 * @returns Prix de vente TTC arrondi
 */
export function calculateSalePrice(
  priceHT: number,
  coefficient: number,
  vat: number = 1.1
): number {
  return Math.round(priceHT * coefficient * vat);
}

/**
 * Obtenir le prix d'achat HT pour des dimensions données
 * 
 * @param modelId ID du modèle de store
 * @param projection Avancée en mm
 * @param width Largeur en mm
 * @returns Prix d'achat HT ou null si non trouvé
 */
export function getBuyPrice(
  modelId: string,
  projection: number,
  width: number
): number | null {
  const model = STORE_MODELS[modelId];
  if (!model || !model.buyPrices[projection]) {
    return null;
  }

  // Trouver le palier de largeur correspondant
  const priceList = model.buyPrices[projection];
  for (const entry of priceList) {
    if (width <= entry.maxW) {
      return entry.priceHT;
    }
  }

  return null;
}

/**
 * Calculer le prix de vente TTC pour un store avec dimensions
 * 
 * @param modelId ID du modèle
 * @param projection Avancée en mm
 * @param width Largeur en mm
 * @returns Prix de vente TTC ou null
 */
export function getStoreSalePrice(
  modelId: string,
  projection: number,
  width: number
): number | null {
  const model = STORE_MODELS[modelId];
  const buyPrice = getBuyPrice(modelId, projection, width);
  
  if (!buyPrice || !model) {
    return null;
  }

  return calculateSalePrice(buyPrice, model.salesCoefficient);
}
