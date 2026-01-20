const fs = require('fs');
const path = require('path');

// Lire le fichier dicksonToiles.ts
const filePath = path.join(__dirname, '../src/lib/dicksonToiles.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fonction pour convertir un nom en slug (comme dans le script de téléchargement)
function nameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/é|è|ê/g, 'e')
    .replace(/à|â/g, 'a')
    .replace(/ô/g, 'o')
    .replace(/î/g, 'i')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Remplacer tous les .jpg par .webp
content = content.replace(/\.jpg/g, '.webp');

// Remplacement spécifique pour les fichiers dont le nom ne correspond pas exactement
const replacements = [
  // Série U
  ['u095_basalte_chine.webp', 'u095_basalte-chine.webp'],
  ['u235_chaume_pique.webp', 'u235_chaume-pique.webp'],
  ['u371_chamois_tweed.webp', 'u371_chamois-tweed.webp'],
  ['u406_acier_pique.webp', 'u406_acier-pique.webp'],
  ['u411_carmin_pique.webp', 'u411_carmin-pique.webp'],
  ['u768_ebene_pique.webp', 'u768_ebene-pique.webp'],
  ['u784_tempete_tweed.webp', 'u784_tempete-tweed.webp'],
  ['u785_cepe_link.webp', 'u785_cepe-link.webp'],
  ['u786_etain_link.webp', 'u786_etain-link.webp'],
  ['u787_jais_link.webp', 'u787_jais-link.webp'],
  ['u788_jungle_link.webp', 'u788_jungle-link.webp'],
  ['u789_pin_link.webp', 'u789_pin-link.webp'],
  ['u791_cedre_pique.webp', 'u791_cedre-pique.webp'],
  ['u792_muralis_chine.webp', 'u792_muralis-chine.webp'],
  ['u793_aloe_link.webp', 'u793_aloe-link.webp'],
  ['u794_celadon_pique.webp', 'u794_celadon-pique.webp'],
  ['u795_celeste_link.webp', 'u795_celeste-link.webp'],
  ['u796_indigo_chine.webp', 'u796_indigo-chine.webp'],
  ['u797_orage_tweed.webp', 'u797_orage-tweed.webp'],
  ['u798_atoll_pique.webp', 'u798_atoll-pique.webp'],
  ['u799_okoume_link.webp', 'u799_okoume-link.webp'],
  ['u800_figue_tweed.webp', 'u800_figue-tweed.webp'],
  ['u801_goyave_tweed.webp', 'u801_goyave-tweed.webp'],
  ['u802_aurore_link.webp', 'u802_aurore-link.webp'],
  ['u803_garance_link.webp', 'u803_garance-link.webp'],
  ['u805_mate_pique.webp', 'u805_mate-pique.webp'],
  ['u806_orgeat_link.webp', 'u806_orgeat-link.webp'],
  ['u807_pollen_link.webp', 'u807_pollen-link.webp'],
  ['u808_magma_link.webp', 'u808_magma-link.webp'],
  ['u809_fauve_pique.webp', 'u809_fauve-pique.webp'],
  ['u810_craie_link.webp', 'u810_craie-link.webp'],
  ['u811_hetre_link.webp', 'u811_hetre-link.webp'],
  ['u812_fume_link.webp', 'u812_fume-link.webp'],
  ['u813_cuir_link.webp', 'u813_cuir-link.webp'],
  
  // Série D
  ['d310_chicago_green.webp', 'd310_chicago-green.webp'],
  ['d330_color_bloc_black.webp', 'd330_color-bloc-noir.webp'],
  ['d332_color_bloc_orange.webp', 'd332_color-bloc-orange.webp'],
  ['d335_color_bloc_red.webp', 'd335_color-bloc-rouge.webp'],
  ['d532_littoral_argent.webp', 'd532_littoral-argent.webp'],
  ['d533_fjord_argent.webp', 'd533_fjord-argent.webp'],
  ['d534_harmonie_gris.webp', 'd534_harmonie-gris.webp'],
  ['d535_harmonie_ardoise.webp', 'd535_harmonie-ardoise.webp'],
  ['d536_solstice_carbone.webp', 'd536_solstice-carbone.webp'],
  ['d537_halo_noir.webp', 'd537_halo-noir.webp'],
  ['d538_club_noir.webp', 'd538_club-noir.webp'],
  ['d539_horizon_vert.webp', 'd539_horizon-vert.webp'],
  ['d540_fjord_fougere.webp', 'd540_fjord-fougere.webp'],
  ['d541_halo_olive.webp', 'd541_halo-olive.webp'],
  ['d542_archipel_saphir.webp', 'd542_archipel-saphir.webp'],
  ['d543_horizon_indigo.webp', 'd543_horizon-indigo.webp'],
  ['d544_abysses_marine.webp', 'd544_abysses-marine.webp'],
  ['d545_halo_outremer.webp', 'd545_halo-outremer.webp'],
  ['d546_harmonie_rouge.webp', 'd546_harmonie-rouge.webp'],
  ['d547_nomade_terracotta.webp', 'd547_nomade-terracotta.webp'],
  ['d548_solstice_rouge.webp', 'd548_solstice-rouge.webp'],
  ['d549_halo_bordeaux.webp', 'd549_halo-bordeaux.webp'],
  ['d550_littoral_or.webp', 'd550_littoral-or.webp'],
  ['d551_solstice_jaune.webp', 'd551_solstice-jaune.webp'],
  ['d552_archipel_or.webp', 'd552_archipel-or.webp'],
  ['d553_horizon_ble.webp', 'd553_horizon-ble.webp'],
  ['d554_fjord_sable.webp', 'd554_fjord-sable.webp'],
  ['d555_harmonie_brun.webp', 'd555_harmonie-brun.webp'],
  ['d556_solstice_ebene.webp', 'd556_solstice-ebene.webp'],
  
  // Série Classiques
  ['7330_charcoal_tweed.webp', '7330_charcoal-tweed.webp'],
  ['7466_chicago_bleu.webp', '7466_chicago-bleu.webp'],
  ['7467_chicago_jaune.webp', '7467_chicago-jaune.webp'],
  ['8238_bleu_nuit.webp', '8238_bleu-nuit.webp'],
  ['8553_blanc_jaune.webp', '8553_blanc-jaune.webp'],
  ['8907_blanc_gris.webp', '8907_blanc-gris.webp'],
  ['8910_blanc_bleu.webp', '8910_blanc-bleu.webp'],
  ['8922_creme_ardoise.webp', '8922_naturel-ardoise.webp'],
];

// Appliquer tous les remplacements
replacements.forEach(([old, newName]) => {
  content = content.replace(old, newName);
});

// Écrire le fichier modifié
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Tous les chemins d\'images ont été mis à jour vers .webp');
console.log(`📝 Fichier modifié: ${filePath}`);
