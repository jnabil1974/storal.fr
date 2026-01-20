/**
 * Catalogue des toiles Dickson Orchestra disponibles
 * Données récupérées depuis dickson-constant.com
 * Prix: 28,87 € HT/ml (base commune Orchestra)
 * 
 * NOTE: Ces données sont maintenant gérées via l'interface admin
 * Utilisez getToilesFromAPI() pour charger les données en production
 */
export interface DicksonToile {
  ref: string; // Référence unique ex: 'U796', 'D544'
  name: string; // Nom commercial complet
  collection: string; // Collection (Orchestra)
  colorFamily: string; // Famille de couleur
  imageUrl: string; // URL de l'image (placeholder ou réelle)
  priceHT: number; // Surcoût HT (0 = inclus)
}

// Fonction pour charger les toiles depuis l'API admin
export async function getToilesFromAPI(): Promise<DicksonToile[]> {
  if (typeof window === 'undefined') {
    // Côté serveur, charger depuis le fichier JSON ou données par défaut
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const dataPath = path.join(process.cwd(), 'data', 'toiles.json');
      const data = await fs.readFile(dataPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return DICKSON_TOILES; // Fallback sur les données par défaut
    }
  } else {
    // Côté client, charger via l'API
    try {
      const response = await fetch('/api/admin/toiles');
      return await response.json();
    } catch {
      return DICKSON_TOILES; // Fallback
    }
  }
}

export const DICKSON_TOILES: DicksonToile[] = [
  // === Série U (Unis et Texturés) ===
  {
    ref: 'U095',
    name: 'Orchestra Basalte Chiné',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/u095_basalte-chine.webp',
    priceHT: 0,
  },
  {
    ref: 'U171',
    name: 'Orchestra Carbone',
    collection: 'Orchestra',
    colorFamily: 'Noir',
    imageUrl: '/images/toiles/dickson/u171_carbone.webp',
    priceHT: 0,
  },
  {
    ref: 'U224',
    name: 'Orchestra Brownie',
    collection: 'Orchestra',
    colorFamily: 'Marron',
    imageUrl: '/images/toiles/dickson/u224_brownie.webp',
    priceHT: 0,
  },
  {
    ref: 'U235',
    name: 'Orchestra Chaume Piqué',
    collection: 'Orchestra',
    colorFamily: 'Beige',
    imageUrl: '/images/toiles/dickson/u235_chaume-pique.webp',
    priceHT: 0,
  },
  {
    ref: 'U371',
    name: 'Orchestra Chamois Tweed',
    collection: 'Orchestra',
    colorFamily: 'Beige',
    imageUrl: '/images/toiles/dickson/u371_chamois-tweed.webp',
    priceHT: 0,
  },
  {
    ref: 'U387',
    name: 'Orchestra Argile',
    collection: 'Orchestra',
    colorFamily: 'Beige',
    imageUrl: '/images/toiles/dickson/u387_argile.webp',
    priceHT: 0,
  },
  {
    ref: 'U388',
    name: 'Orchestra Azur',
    collection: 'Orchestra',
    colorFamily: 'Bleu',
    imageUrl: '/images/toiles/dickson/u388_azur.webp',
    priceHT: 0,
  },
  {
    ref: 'U406',
    name: 'Orchestra Acier Piqué',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/u406_acier-pique.webp',
    priceHT: 0,
  },
  {
    ref: 'U411',
    name: 'Orchestra Carmin Piqué',
    collection: 'Orchestra',
    colorFamily: 'Rouge',
    imageUrl: '/images/toiles/dickson/u411_carmin-pique.webp',
    priceHT: 0,
  },
  {
    ref: 'U768',
    name: 'Orchestra Ebène Piqué',
    collection: 'Orchestra',
    colorFamily: 'Noir',
    imageUrl: '/images/toiles/dickson/u768_ebene-pique.webp',
    priceHT: 0,
  },
  {
    ref: 'U767',
    name: 'Orchestra Tangerine',
    collection: 'Orchestra',
    colorFamily: 'Orange',
    imageUrl: '/images/toiles/dickson/u767_tangerine.webp',
    priceHT: 0,
  },
  {
    ref: 'U784',
    name: 'Orchestra Tempête Tweed',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/u784_tempete-tweed.webp',
    priceHT: 0,
  },
  {
    ref: 'U785',
    name: 'Orchestra Cèpe Link',
    collection: 'Orchestra',
    colorFamily: 'Beige',
    imageUrl: '/images/toiles/dickson/u785_cepe-link.webp',
    priceHT: 0,
  },
  {
    ref: 'U786',
    name: 'Orchestra Etain Link',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/u786_etain-link.webp',
    priceHT: 0,
  },
  {
    ref: 'U787',
    name: 'Orchestra Jais Link',
    collection: 'Orchestra',
    colorFamily: 'Noir',
    imageUrl: '/images/toiles/dickson/u787_jais-link.webp',
    priceHT: 0,
  },
  {
    ref: 'U788',
    name: 'Orchestra Jungle Link',
    collection: 'Orchestra',
    colorFamily: 'Vert',
    imageUrl: '/images/toiles/dickson/u788_jungle-link.webp',
    priceHT: 0,
  },
  {
    ref: 'U789',
    name: 'Orchestra Pin Link',
    collection: 'Orchestra',
    colorFamily: 'Vert',
    imageUrl: '/images/toiles/dickson/u789_pin-link.webp',
    priceHT: 0,
  },
  {
    ref: 'U791',
    name: 'Orchestra Cèdre Piqué',
    collection: 'Orchestra',
    colorFamily: 'Marron',
    imageUrl: '/images/toiles/dickson/u791_cedre-pique.webp',
    priceHT: 0,
  },
  {
    ref: 'U792',
    name: 'Orchestra Muralis Chiné',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/u792_muralis-chine.webp',
    priceHT: 0,
  },
  {
    ref: 'U793',
    name: 'Orchestra Aloé Link',
    collection: 'Orchestra',
    colorFamily: 'Vert',
    imageUrl: '/images/toiles/dickson/u793_aloe-link.webp',
    priceHT: 0,
  },
  {
    ref: 'U794',
    name: 'Orchestra Céladon Piqué',
    collection: 'Orchestra',
    colorFamily: 'Vert',
    imageUrl: '/images/toiles/dickson/u794_celadon-pique.webp',
    priceHT: 0,
  },
  {
    ref: 'U795',
    name: 'Orchestra Céleste Link',
    collection: 'Orchestra',
    colorFamily: 'Bleu',
    imageUrl: '/images/toiles/dickson/u795_celeste-link.webp',
    priceHT: 0,
  },
  {
    ref: 'U796',
    name: 'Orchestra Indigo Chiné',
    collection: 'Orchestra',
    colorFamily: 'Bleu',
    imageUrl: '/images/toiles/dickson/u796_indigo-chine.webp',
    priceHT: 0,
  },
  {
    ref: 'U797',
    name: 'Orchestra Orage Tweed',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/u797_orage-tweed.webp',
    priceHT: 0,
  },
  {
    ref: 'U798',
    name: 'Orchestra Atoll Piqué',
    collection: 'Orchestra',
    colorFamily: 'Bleu',
    imageUrl: '/images/toiles/dickson/u798_atoll-pique.webp',
    priceHT: 0,
  },
  {
    ref: 'U799',
    name: 'Orchestra Okoumé Link',
    collection: 'Orchestra',
    colorFamily: 'Marron',
    imageUrl: '/images/toiles/dickson/u799_okoume-link.webp',
    priceHT: 0,
  },
  {
    ref: 'U800',
    name: 'Orchestra Figue Tweed',
    collection: 'Orchestra',
    colorFamily: 'Violet',
    imageUrl: '/images/toiles/dickson/u800_figue-tweed.webp',
    priceHT: 0,
  },
  {
    ref: 'U801',
    name: 'Orchestra Goyave Tweed',
    collection: 'Orchestra',
    colorFamily: 'Rose',
    imageUrl: '/images/toiles/dickson/u801_goyave-tweed.webp',
    priceHT: 0,
  },
  {
    ref: 'U802',
    name: 'Orchestra Aurore Link',
    collection: 'Orchestra',
    colorFamily: 'Rose',
    imageUrl: '/images/toiles/dickson/u802_aurore-link.webp',
    priceHT: 0,
  },
  {
    ref: 'U803',
    name: 'Orchestra Garance Link',
    collection: 'Orchestra',
    colorFamily: 'Rouge',
    imageUrl: '/images/toiles/dickson/u803_garance-link.webp',
    priceHT: 0,
  },
  {
    ref: 'U804',
    name: 'Orchestra Grenat',
    collection: 'Orchestra',
    colorFamily: 'Rouge',
    imageUrl: '/images/toiles/dickson/u804_grenat.webp',
    priceHT: 0,
  },
  {
    ref: 'U805',
    name: 'Orchestra Maté Piqué',
    collection: 'Orchestra',
    colorFamily: 'Vert',
    imageUrl: '/images/toiles/dickson/u805_mate-pique.webp',
    priceHT: 0,
  },
  {
    ref: 'U806',
    name: 'Orchestra Orgeat Link',
    collection: 'Orchestra',
    colorFamily: 'Beige',
    imageUrl: '/images/toiles/dickson/u806_orgeat-link.webp',
    priceHT: 0,
  },
  {
    ref: 'U807',
    name: 'Orchestra Pollen Link',
    collection: 'Orchestra',
    colorFamily: 'Jaune',
    imageUrl: '/images/toiles/dickson/u807_pollen-link.webp',
    priceHT: 0,
  },
  {
    ref: 'U808',
    name: 'Orchestra Magma Link',
    collection: 'Orchestra',
    colorFamily: 'Rouge',
    imageUrl: '/images/toiles/dickson/u808_magma-link.webp',
    priceHT: 0,
  },
  {
    ref: 'U809',
    name: 'Orchestra Fauve Piqué',
    collection: 'Orchestra',
    colorFamily: 'Orange',
    imageUrl: '/images/toiles/dickson/u809_fauve-pique.webp',
    priceHT: 0,
  },
  {
    ref: 'U810',
    name: 'Orchestra Craie Link',
    collection: 'Orchestra',
    colorFamily: 'Blanc',
    imageUrl: '/images/toiles/dickson/u810_craie-link.webp',
    priceHT: 0,
  },
  {
    ref: 'U811',
    name: 'Orchestra Hêtre Link',
    collection: 'Orchestra',
    colorFamily: 'Beige',
    imageUrl: '/images/toiles/dickson/u811_hetre-link.webp',
    priceHT: 0,
  },
  {
    ref: 'U812',
    name: 'Orchestra Fumé Link',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/u812_fume-link.webp',
    priceHT: 0,
  },
  {
    ref: 'U813',
    name: 'Orchestra Cuir Link',
    collection: 'Orchestra',
    colorFamily: 'Marron',
    imageUrl: '/images/toiles/dickson/u813_cuir-link.webp',
    priceHT: 0,
  },

  // === Série D (Designs et Jacquard) ===
  {
    ref: 'D310',
    name: 'Orchestra Chicago Green',
    collection: 'Orchestra',
    colorFamily: 'Vert',
    imageUrl: '/images/toiles/dickson/d310_chicago-green.webp',
    priceHT: 0,
  },
  {
    ref: 'D330',
    name: 'Orchestra Color Bloc Black',
    collection: 'Orchestra',
    colorFamily: 'Noir',
    imageUrl: '/images/toiles/dickson/d330_color-bloc-noir.webp',
    priceHT: 0,
  },
  {
    ref: 'D332',
    name: 'Orchestra Color Bloc Orange',
    collection: 'Orchestra',
    colorFamily: 'Orange',
    imageUrl: '/images/toiles/dickson/d332_color-bloc-orange.webp',
    priceHT: 0,
  },
  {
    ref: 'D335',
    name: 'Orchestra Color Bloc Red',
    collection: 'Orchestra',
    colorFamily: 'Rouge',
    imageUrl: '/images/toiles/dickson/d335_color-bloc-rouge.webp',
    priceHT: 0,
  },
  {
    ref: 'D532',
    name: 'Orchestra Littoral Argent',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/d532_littoral-argent.webp',
    priceHT: 0,
  },
  {
    ref: 'D533',
    name: 'Orchestra Fjord Argent',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/d533_fjord-argent.webp',
    priceHT: 0,
  },
  {
    ref: 'D534',
    name: 'Orchestra Harmonie Gris',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/d534_harmonie-gris.webp',
    priceHT: 0,
  },
  {
    ref: 'D535',
    name: 'Orchestra Harmonie Ardoise',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/d535_harmonie-ardoise.webp',
    priceHT: 0,
  },
  {
    ref: 'D536',
    name: 'Orchestra Solstice Carbone',
    collection: 'Orchestra',
    colorFamily: 'Noir',
    imageUrl: '/images/toiles/dickson/d536_solstice-carbone.webp',
    priceHT: 0,
  },
  {
    ref: 'D537',
    name: 'Orchestra Halo Noir',
    collection: 'Orchestra',
    colorFamily: 'Noir',
    imageUrl: '/images/toiles/dickson/d537_halo-noir.webp',
    priceHT: 0,
  },
  {
    ref: 'D538',
    name: 'Orchestra Club Noir',
    collection: 'Orchestra',
    colorFamily: 'Noir',
    imageUrl: '/images/toiles/dickson/d538_club-noir.webp',
    priceHT: 0,
  },
  {
    ref: 'D539',
    name: 'Orchestra Horizon Vert',
    collection: 'Orchestra',
    colorFamily: 'Vert',
    imageUrl: '/images/toiles/dickson/d539_horizon-vert.webp',
    priceHT: 0,
  },
  {
    ref: 'D540',
    name: 'Orchestra Fjord Fougère',
    collection: 'Orchestra',
    colorFamily: 'Vert',
    imageUrl: '/images/toiles/dickson/d540_fjord-fougere.webp',
    priceHT: 0,
  },
  {
    ref: 'D541',
    name: 'Orchestra Halo Olive',
    collection: 'Orchestra',
    colorFamily: 'Vert',
    imageUrl: '/images/toiles/dickson/d541_halo-olive.webp',
    priceHT: 0,
  },
  {
    ref: 'D542',
    name: 'Orchestra Archipel Saphir',
    collection: 'Orchestra',
    colorFamily: 'Bleu',
    imageUrl: '/images/toiles/dickson/d542_archipel-saphir.webp',
    priceHT: 0,
  },
  {
    ref: 'D543',
    name: 'Orchestra Horizon Indigo',
    collection: 'Orchestra',
    colorFamily: 'Bleu',
    imageUrl: '/images/toiles/dickson/d543_horizon-indigo.webp',
    priceHT: 0,
  },
  {
    ref: 'D544',
    name: 'Orchestra Abysses Marine',
    collection: 'Orchestra',
    colorFamily: 'Bleu',
    imageUrl: '/images/toiles/dickson/d544_abysses-marine.webp',
    priceHT: 0,
  },
  {
    ref: 'D545',
    name: 'Orchestra Halo Outremer',
    collection: 'Orchestra',
    colorFamily: 'Bleu',
    imageUrl: '/images/toiles/dickson/d545_halo-outremer.webp',
    priceHT: 0,
  },
  {
    ref: 'D546',
    name: 'Orchestra Harmonie Rouge',
    collection: 'Orchestra',
    colorFamily: 'Rouge',
    imageUrl: '/images/toiles/dickson/d546_harmonie-rouge.webp',
    priceHT: 0,
  },
  {
    ref: 'D547',
    name: 'Orchestra Nomade Terracotta',
    collection: 'Orchestra',
    colorFamily: 'Orange',
    imageUrl: '/images/toiles/dickson/d547_nomade-terracotta.webp',
    priceHT: 0,
  },
  {
    ref: 'D548',
    name: 'Orchestra Solstice Rouge',
    collection: 'Orchestra',
    colorFamily: 'Rouge',
    imageUrl: '/images/toiles/dickson/d548_solstice-rouge.webp',
    priceHT: 0,
  },
  {
    ref: 'D549',
    name: 'Orchestra Halo Bordeaux',
    collection: 'Orchestra',
    colorFamily: 'Rouge',
    imageUrl: '/images/toiles/dickson/d549_halo-bordeaux.webp',
    priceHT: 0,
  },
  {
    ref: 'D550',
    name: 'Orchestra Littoral Or',
    collection: 'Orchestra',
    colorFamily: 'Jaune',
    imageUrl: '/images/toiles/dickson/d550_littoral-or.webp',
    priceHT: 0,
  },
  {
    ref: 'D551',
    name: 'Orchestra Solstice Jaune',
    collection: 'Orchestra',
    colorFamily: 'Jaune',
    imageUrl: '/images/toiles/dickson/d551_solstice-jaune.webp',
    priceHT: 0,
  },
  {
    ref: 'D552',
    name: 'Orchestra Archipel Or',
    collection: 'Orchestra',
    colorFamily: 'Jaune',
    imageUrl: '/images/toiles/dickson/d552_archipel-or.webp',
    priceHT: 0,
  },
  {
    ref: 'D553',
    name: 'Orchestra Horizon Blé',
    collection: 'Orchestra',
    colorFamily: 'Beige',
    imageUrl: '/images/toiles/dickson/d553_horizon-ble.webp',
    priceHT: 0,
  },
  {
    ref: 'D554',
    name: 'Orchestra Fjord Sable',
    collection: 'Orchestra',
    colorFamily: 'Beige',
    imageUrl: '/images/toiles/dickson/d554_fjord-sable.webp',
    priceHT: 0,
  },
  {
    ref: 'D555',
    name: 'Orchestra Harmonie Brun',
    collection: 'Orchestra',
    colorFamily: 'Marron',
    imageUrl: '/images/toiles/dickson/d555_harmonie-brun.webp',
    priceHT: 0,
  },
  {
    ref: 'D556',
    name: 'Orchestra Solstice Ebène',
    collection: 'Orchestra',
    colorFamily: 'Noir',
    imageUrl: '/images/toiles/dickson/d556_solstice-ebene.webp',
    priceHT: 0,
  },

  // === Série 6000-8000 (Classiques et Rayures) ===
  {
    ref: '0017',
    name: 'Orchestra Bleu',
    collection: 'Orchestra',
    colorFamily: 'Bleu',
    imageUrl: '/images/toiles/dickson/0017_bleu.webp',
    priceHT: 0,
  },
  {
    ref: '6318',
    name: 'Orchestra Blé',
    collection: 'Orchestra',
    colorFamily: 'Beige',
    imageUrl: '/images/toiles/dickson/6318_ble.webp',
    priceHT: 0,
  },
  {
    ref: '7100',
    name: 'Orchestra Cyprès',
    collection: 'Orchestra',
    colorFamily: 'Vert',
    imageUrl: '/images/toiles/dickson/7100_cypres.webp',
    priceHT: 0,
  },
  {
    ref: '7244',
    name: 'Orchestra Amande',
    collection: 'Orchestra',
    colorFamily: 'Beige',
    imageUrl: '/images/toiles/dickson/7244_amande.webp',
    priceHT: 0,
  },
  {
    ref: '7330',
    name: 'Orchestra Charcoal Tweed',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/7330_charcoal-tweed.webp',
    priceHT: 0,
  },
  {
    ref: '7466',
    name: 'Orchestra Chicago Bleu',
    collection: 'Orchestra',
    colorFamily: 'Bleu',
    imageUrl: '/images/toiles/dickson/7466_chicago-bleu.webp',
    priceHT: 0,
  },
  {
    ref: '7467',
    name: 'Orchestra Chicago Jaune',
    collection: 'Orchestra',
    colorFamily: 'Jaune',
    imageUrl: '/images/toiles/dickson/7467_chicago-jaune.webp',
    priceHT: 0,
  },
  {
    ref: '7552',
    name: 'Orchestra Argent',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/7552_argent.webp',
    priceHT: 0,
  },
  {
    ref: '7554',
    name: 'Orchestra Cassis',
    collection: 'Orchestra',
    colorFamily: 'Violet',
    imageUrl: '/images/toiles/dickson/7554_cassis.webp',
    priceHT: 0,
  },
  {
    ref: '8200',
    name: 'Orchestra Chanvre',
    collection: 'Orchestra',
    colorFamily: 'Beige',
    imageUrl: '/images/toiles/dickson/8200_chanvre.webp',
    priceHT: 0,
  },
  {
    ref: '8203',
    name: 'Orchestra Ardoise',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/8203_ardoise.webp',
    priceHT: 0,
  },
  {
    ref: '8204',
    name: 'Orchestra Bleuet',
    collection: 'Orchestra',
    colorFamily: 'Bleu',
    imageUrl: '/images/toiles/dickson/8204_bleuet.webp',
    priceHT: 0,
  },
  {
    ref: '8206',
    name: 'Orchestra Bordeaux',
    collection: 'Orchestra',
    colorFamily: 'Rouge',
    imageUrl: '/images/toiles/dickson/8206_bordeaux.webp',
    priceHT: 0,
  },
  {
    ref: '8207',
    name: 'Orchestra Châtaigne',
    collection: 'Orchestra',
    colorFamily: 'Marron',
    imageUrl: '/images/toiles/dickson/8207_chataigne.webp',
    priceHT: 0,
  },
  {
    ref: '8238',
    name: 'Orchestra Bleu Nuit',
    collection: 'Orchestra',
    colorFamily: 'Bleu',
    imageUrl: '/images/toiles/dickson/8238_bleu-nuit.webp',
    priceHT: 0,
  },
  {
    ref: '8553',
    name: 'Orchestra Blanc/Jaune',
    collection: 'Orchestra',
    colorFamily: 'Jaune',
    imageUrl: '/images/toiles/dickson/8553_blanc-jaune.webp',
    priceHT: 0,
  },
  {
    ref: '8776',
    name: 'Orchestra Cacao',
    collection: 'Orchestra',
    colorFamily: 'Marron',
    imageUrl: '/images/toiles/dickson/8776_cacao.webp',
    priceHT: 0,
  },
  {
    ref: '8778',
    name: 'Orchestra Chardon',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/8778_chardon.webp',
    priceHT: 0,
  },
  {
    ref: '8779',
    name: 'Orchestra Bruyère',
    collection: 'Orchestra',
    colorFamily: 'Violet',
    imageUrl: '/images/toiles/dickson/8779_bruyere.webp',
    priceHT: 0,
  },
  {
    ref: '8902',
    name: 'Orchestra Beige',
    collection: 'Orchestra',
    colorFamily: 'Beige',
    imageUrl: '/images/toiles/dickson/8902_beige.webp',
    priceHT: 0,
  },
  {
    ref: '8907',
    name: 'Orchestra Blanc/Gris',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/8907_blanc-gris.webp',
    priceHT: 0,
  },
  {
    ref: '8910',
    name: 'Orchestra Blanc/Bleu',
    collection: 'Orchestra',
    colorFamily: 'Bleu',
    imageUrl: '/images/toiles/dickson/8910_blanc-bleu.webp',
    priceHT: 0,
  },
  {
    ref: '8922',
    name: 'Orchestra Crème/Ardoise',
    collection: 'Orchestra',
    colorFamily: 'Gris',
    imageUrl: '/images/toiles/dickson/8922_naturel-ardoise.webp',
    priceHT: 0,
  },
];

/**
 * Retourne une toile par sa référence
 */
export function getToileByRef(ref: string): DicksonToile | undefined {
  return DICKSON_TOILES.find((t) => t.ref === ref);
}

/**
 * Retourne toutes les toiles groupées par famille de couleur
 */
export function getToilesByColorFamily() {
  const families: Record<string, DicksonToile[]> = {};
  
  DICKSON_TOILES.forEach((toile) => {
    if (!families[toile.colorFamily]) {
      families[toile.colorFamily] = [];
    }
    families[toile.colorFamily].push(toile);
  });
  
  return families;
}

/**
 * Recherche de toiles par nom ou référence
 */
export function searchToiles(query: string): DicksonToile[] {
  const lowerQuery = query.toLowerCase();
  return DICKSON_TOILES.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.ref.toLowerCase().includes(lowerQuery) ||
      t.colorFamily.toLowerCase().includes(lowerQuery)
  );
}
