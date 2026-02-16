/**
 * Catalogue des toiles - Version compacte - Généré automatiquement depuis Supabase
 * Date de génération: 2026-02-16T01:46:22.576Z
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
  compatible_store_ids: any | null;
  compatible_categories: string[];
  default_width: number | null;
  composition: string | null;
  weight_range: string | null;
  description: string | null;
  features: any | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  // Liste des références disponibles (ex: ["U095", "6088", "7124", ...])
  available_refs: string[];
  ref_count: number;
  // Quelques exemples pour la documentation (avec URLs d'images)
  examples: Array<{ref: string, name: string, family: string, image_url: string | null}>;
}

// ============================================
// MAPPING IMAGES (ref → image_url)
// ============================================

/**
 * Mapping des références vers les URLs d'images
 * Permet de récupérer rapidement l'image d'une toile par sa référence
 */
export const TOILE_IMAGES: Record<string, string> = {
  "3914": "/images/Toiles/DICKSON/ORCHESTRA_MAX/3914 120.png",
  "6020": "/images/Toiles/DICKSON/ORCHESTRA_MAX/6020 120.png",
  "6022": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6022.png",
  "6028": "/images/Toiles/DICKSON/ORCHESTRA_MAX/6028 120.png",
  "6088": "/images/Toiles/DICKSON/ORCHESTRA_MAX/6088 120.png",
  "6171": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/6171.png",
  "6172": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/6172.png",
  "6196": "/images/Toiles/DICKSON/ORCHESTRA_MAX/6196 120.png",
  "6228": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/6228.png",
  "6272": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/6272.png",
  "6273": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/6273.png",
  "6275": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/6275.png",
  "6292": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/6292.png",
  "6316": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6316.png",
  "6318": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6318.png",
  "6610": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6610.png",
  "6687": "/images/Toiles/DICKSON/ORCHESTRA_MAX/6687 120.png",
  "6688": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6688.png",
  "6720": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6720.png",
  "7109": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/7109.png",
  "7120": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/7120.png",
  "7124": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/7124.png",
  "7130": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/7130.png",
  "7132": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7132.png",
  "7133": "/images/Toiles/DICKSON/ORCHESTRA_MAX/7133 120.png",
  "7244": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7244.png",
  "7264": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7264.png",
  "7297": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7297.png",
  "7330": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7330.png",
  "7351": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/7351.png",
  "7466": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/7466.png",
  "7467": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/7467.png",
  "7485": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/7485.png",
  "7548": "/images/Toiles/DICKSON/ORCHESTRA_MAX/7548 120.png",
  "7552": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7552.png",
  "7554": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7554.png",
  "7559": "/images/Toiles/DICKSON/ORCHESTRA_MAX/7559 120.png",
  "7560": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7560.png",
  "7972": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7972.png",
  "8200": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8200.png",
  "8201": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8201.png",
  "8203": "/images/Toiles/DICKSON/ORCHESTRA_MAX/8203 120.png",
  "8204": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8204.png",
  "8205": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8205.png",
  "8206": "/images/Toiles/DICKSON/ORCHESTRA_MAX/8206 120.png",
  "8207": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8207.png",
  "8211": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8211.png",
  "8224": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8224.png",
  "8230": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8230.png",
  "8396": "/images/Toiles/DICKSON/ORCHESTRA_MAX/8396 120.png",
  "8402": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8402.png",
  "8544": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8544.png",
  "8552": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8552.png",
  "8553": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8553.png",
  "8556": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8556.png",
  "8557": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8557.png",
  "8612": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8612.png",
  "8614": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8614.png",
  "8615": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8615.png",
  "8776": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8776.png",
  "8777": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8777.png",
  "8778": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8778.png",
  "8779": "/images/Toiles/DICKSON/ORCHESTRA_MAX/8779 120.png",
  "8891": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8891.png",
  "8901": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8901.png",
  "8902": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8902.png",
  "8906": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8906.png",
  "8907": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8907.png",
  "8910": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8910.png",
  "8919": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8919.png",
  "8921": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8921.png",
  "8922": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8922.png",
  "8931": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8931.png",
  "8935": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8935.png",
  "314001": "/images/Toiles/SATLER/314001.png",
  "314007": "/images/Toiles/SATLER/314007.png",
  "314010": "/images/Toiles/SATLER/314010.png",
  "314020": "/images/Toiles/SATLER/314020.png",
  "314022": "/images/Toiles/SATLER/314022.png",
  "314028": "/images/Toiles/SATLER/314028.png",
  "314030": "/images/Toiles/SATLER/314030.png",
  "314070": "/images/Toiles/SATLER/314070.png",
  "314081": "/images/Toiles/SATLER/314081.png",
  "314083": "/images/Toiles/SATLER/314083.png",
  "314085": "/images/Toiles/SATLER/314085.png",
  "314154": "/images/Toiles/SATLER/314154.png",
  "314182": "/images/Toiles/SATLER/314182.png",
  "314325": "/images/Toiles/SATLER/314325.png",
  "314362": "/images/Toiles/SATLER/314362.png",
  "314364": "/images/Toiles/SATLER/314364.png",
  "314398": "/images/Toiles/SATLER/314398.png",
  "314402": "/images/Toiles/SATLER/314402.png",
  "314414": "/images/Toiles/SATLER/314414.png",
  "314546": "/images/Toiles/SATLER/314546.png",
  "314550": "/images/Toiles/SATLER/314550.png",
  "314638": "/images/Toiles/SATLER/314638.png",
  "314660": "/images/Toiles/SATLER/314660.png",
  "314718": "/images/Toiles/SATLER/314718.png",
  "314763": "/images/Toiles/SATLER/314763.png",
  "314780": "/images/Toiles/SATLER/314780.png",
  "314818": "/images/Toiles/SATLER/314818.png",
  "314819": "/images/Toiles/SATLER/314819.png",
  "314828": "/images/Toiles/SATLER/314828.png",
  "314838": "/images/Toiles/SATLER/314838.png",
  "314840": "/images/Toiles/SATLER/314840.png",
  "314851": "/images/Toiles/SATLER/314851.png",
  "314858": "/images/Toiles/SATLER/314858.png",
  "314880": "/images/Toiles/SATLER/314880.png",
  "314888": "/images/Toiles/SATLER/314888.png",
  "314941": "/images/Toiles/SATLER/314941.png",
  "320180": "/images/Toiles/SATLER/320180.png",
  "320190": "/images/Toiles/SATLER/320190.png",
  "320212": "/images/Toiles/SATLER/320212.png",
  "320235": "/images/Toiles/SATLER/320235.png",
  "320253": "/images/Toiles/SATLER/320253.png",
  "320309": "/images/Toiles/SATLER/320309.png",
  "320408": "/images/Toiles/SATLER/320408.png",
  "320434": "/images/Toiles/SATLER/320434.png",
  "320452": "/images/Toiles/SATLER/320452.png",
  "320679": "/images/Toiles/SATLER/320679.png",
  "320692": "/images/Toiles/SATLER/320692.png",
  "320833": "/images/Toiles/SATLER/320833.png",
  "320923": "/images/Toiles/SATLER/320923.png",
  "320925": "/images/Toiles/SATLER/320925.png",
  "320928": "/images/Toiles/SATLER/320928.png",
  "320937": "/images/Toiles/SATLER/320937.png",
  "320954": "/images/Toiles/SATLER/320954.png",
  "320956": "/images/Toiles/SATLER/320956.png",
  "320992": "/images/Toiles/SATLER/320992.png",
  "320994": "/images/Toiles/SATLER/320994.png",
  "364053": "/images/Toiles/SATLER/364053.png",
  "364598": "/images/Toiles/SATLER/364598.png",
  "0001": "/images/Toiles/DICKSON/ORCHESTRA_MAX/0001.png",
  "0003": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/0003.png",
  "0017": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/0017.png",
  "0018": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/0018.png",
  "0020": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/0020.png",
  "0034": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/0034.png",
  "0613": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/0613.png",
  "0681": "/images/Toiles/DICKSON/ORCHESTRA_MAX/0681 120.png",
  "0744": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/0744.png",
  "0745": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/0745.png",
  "0842": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/0842.png",
  "0867": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/0867.png",
  "6028 ": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6028 .png",
  "6687 ": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6687 .png",
  "8238 bleu nuit": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8238 bleu nuit.png",
  "8904 Lin chiné": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8904.png",
  "D100": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D100.png",
  "D103": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D103.png",
  "D104": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D104.png",
  "D107": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D107.png",
  "D108": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D108.png",
  "D113": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D113.png",
  "D302": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D302.png",
  "D303": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D303.png",
  "D304": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D304.png",
  "D305": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D305.png",
  "D306": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D306.png",
  "D307": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D307.png",
  "D308": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D308.png",
  "D309": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D309.png",
  "D310": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D310.png",
  "D311": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D311.png",
  "D312": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D312.png",
  "D314": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D314.png",
  "D317": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D317.png",
  "D318": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D318.png",
  "D319": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D319.png",
  "D321": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D321.png",
  "D323": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D323.png",
  "D330": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D330.png",
  "D332": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D332.png",
  "D335": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D335.png",
  "D338": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D338.png",
  "D339": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D339.png",
  "D532": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D532.png",
  "D533": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D533.png",
  "D534": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D534.png",
  "D535": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D535.png",
  "D536": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D536.png",
  "D537": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D537.png",
  "D538": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D538.png",
  "D539": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D539.png",
  "D540": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D540.png",
  "D541": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D541.png",
  "D542": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D542.png",
  "D543": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D543.png",
  "D544": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D544.png",
  "D545": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D545.png",
  "D548": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D548.png",
  "D549": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D549.png",
  "D550": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D550.png",
  "D551": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D551.png",
  "D552": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D552.png",
  "D554": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D554.png",
  "D555": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D555.png",
  "D556": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D556.png",
  "U095 gris basalte": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U095.png",
  "U104": "/images/Toiles/DICKSON/ORCHESTRA_MAX/U104 120.png",
  "U105": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U105.png",
  "U137": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U137.png",
  "U140": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U140.png",
  "U170": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U170.png",
  "U171": "/images/Toiles/DICKSON/ORCHESTRA_MAX/U171 120.png",
  "U190": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U190.png",
  "U224": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U224.png",
  "U235": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U235.png",
  "U321": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U321.png",
  "U335": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U335.png",
  "U337": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U337.png",
  "U343": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U343.png",
  "U370": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U370.png",
  "U371": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U371.png",
  "U373": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U373.png",
  "U387": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U387.png",
  "U388": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U388.png",
  "U402": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U402.png",
  "U404": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U404.png",
  "U406": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U406.png",
  "U407": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U407.png",
  "U408": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U408.png",
  "U409": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U409.png",
  "U410": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U410.png",
  "U411": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U411.png",
  "U413": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U413.png",
  "U415": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U415.png",
  "U416": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U416.png",
  "U767": "/images/Toiles/DICKSON/ORCHESTRA_MAX/U767 120.png",
  "U768": "/images/Toiles/DICKSON/ORCHESTRA_MAX/Réf. U768 120.png",
  "U784": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U784.png",
  "U785": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U785.png",
  "U786": "/images/Toiles/DICKSON/ORCHESTRA_MAX/U786 120.png",
  "U787": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U787.png",
  "U788": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U788.png",
  "U789": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U789.png",
  "U791": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U791.png",
  "U792": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U792.png",
  "U793": "/images/Toiles/DICKSON/ORCHESTRA_MAX/U793 120.png",
  "U794": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U794.png",
  "U795": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U795.png",
  "U796": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U796.png",
  "U797": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U797.png",
  "U798": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U798.png",
  "U799": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U799.png",
  "U800": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U800.png",
  "U801": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U801.png",
  "U802": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U802.png",
  "U803": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U803.png",
  "U804": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U804.png",
  "U805": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U805.png",
  "U806": "/images/Toiles/DICKSON/ORCHESTRA_MAX/U806 120.png",
  "U807": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U807.png",
  "U808": "/images/Toiles/DICKSON/ORCHESTRA_MAX/U808 120.png",
  "U809": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U809.png",
  "U810": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U810.png",
  "U811": "/images/Toiles/DICKSON/ORCHESTRA_MAX/U811 120.png",
  "U812": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U812.png",
  "U813": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U813.png",
  "U814": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U814.png",
  "30A734": "/images/Toiles/SATLER/30A734.png",
  "314E67": "/images/Toiles/SATLER/314E67.png"
};

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
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/0001.png"
      },
      {
        "ref": "0003",
        "name": "Orchestra 0003",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/0003.png"
      },
      {
        "ref": "0017",
        "name": "Orchestra 0017",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/0017.png"
      },
      {
        "ref": "0018",
        "name": "Orchestra 0018",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/0018.png"
      },
      {
        "ref": "0020",
        "name": "Orchestra 0020",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/0020.png"
      },
      {
        "ref": "0034",
        "name": "Orchestra 0034",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/0034.png"
      },
      {
        "ref": "0613",
        "name": "Orchestra 0613",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/0613.png"
      },
      {
        "ref": "0681",
        "name": "Orchestra 0681",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/0681.png"
      },
      {
        "ref": "0744",
        "name": "Orchestra Décor 0744",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/0744.png"
      },
      {
        "ref": "0745",
        "name": "Orchestra Décor 0745",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/0745.png"
      },
      {
        "ref": "0842",
        "name": "Orchestra Décor 0842",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/0842.png"
      },
      {
        "ref": "0867",
        "name": "Orchestra 0867",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/0867.png"
      },
      {
        "ref": "3914",
        "name": "Orchestra 3914",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/3914.png"
      },
      {
        "ref": "6020",
        "name": "Orchestra 6020",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6020.png"
      },
      {
        "ref": "6022",
        "name": "Orchestra 6022",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6022.png"
      },
      {
        "ref": "6028 ",
        "name": "Orchestra 6028 ",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6028 .png"
      },
      {
        "ref": "6088",
        "name": "Orchestra 6088",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6088.png"
      },
      {
        "ref": "6171",
        "name": "Orchestra Décor 6171",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/6171.png"
      },
      {
        "ref": "6172",
        "name": "Orchestra Décor 6172",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/6172.png"
      },
      {
        "ref": "6196",
        "name": "Orchestra 6196",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6196.png"
      },
      {
        "ref": "6228",
        "name": "Orchestra Décor 6228",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/6228.png"
      },
      {
        "ref": "6272",
        "name": "Orchestra Décor 6272",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/6272.png"
      },
      {
        "ref": "6273",
        "name": "Orchestra Décor 6273",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/6273.png"
      },
      {
        "ref": "6275",
        "name": "Orchestra Décor 6275",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/6275.png"
      },
      {
        "ref": "6292",
        "name": "Orchestra Décor 6292",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/6292.png"
      },
      {
        "ref": "6316",
        "name": "Orchestra 6316",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6316.png"
      },
      {
        "ref": "6318",
        "name": "Orchestra 6318",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6318.png"
      },
      {
        "ref": "6610",
        "name": "Orchestra 6610",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6610.png"
      },
      {
        "ref": "6687 ",
        "name": "Orchestra 6687 ",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6687 .png"
      },
      {
        "ref": "6688",
        "name": "Orchestra 6688",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6688.png"
      },
      {
        "ref": "6720",
        "name": "Orchestra 6720",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/6720.png"
      },
      {
        "ref": "7109",
        "name": "Orchestra Décor 7109",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/7109.png"
      },
      {
        "ref": "7120",
        "name": "Orchestra Décor 7120",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/7120.png"
      },
      {
        "ref": "7124",
        "name": "Orchestra Décor 7124",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/7124.png"
      },
      {
        "ref": "7130",
        "name": "Orchestra Décor 7130",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/7130.png"
      },
      {
        "ref": "7132",
        "name": "Orchestra 7132",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7132.png"
      },
      {
        "ref": "7133",
        "name": "Orchestra 7133",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7133.png"
      },
      {
        "ref": "7244",
        "name": "Orchestra 7244",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7244.png"
      },
      {
        "ref": "7264",
        "name": "Orchestra 7264",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7264.png"
      },
      {
        "ref": "7297",
        "name": "Orchestra 7297",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7297.png"
      },
      {
        "ref": "7330",
        "name": "Orchestra 7330",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7330.png"
      },
      {
        "ref": "7351",
        "name": "Orchestra Décor 7351",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/7351.png"
      },
      {
        "ref": "7466",
        "name": "Orchestra Décor 7466",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/7466.png"
      },
      {
        "ref": "7467",
        "name": "Orchestra Décor 7467",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/7467.png"
      },
      {
        "ref": "7485",
        "name": "Orchestra Décor 7485",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/7485.png"
      },
      {
        "ref": "7548",
        "name": "Orchestra 7548",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7548.png"
      },
      {
        "ref": "7552",
        "name": "Orchestra 7552",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7552.png"
      },
      {
        "ref": "7554",
        "name": "Orchestra 7554",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7554.png"
      },
      {
        "ref": "7559",
        "name": "Orchestra 7559",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7559.png"
      },
      {
        "ref": "7560",
        "name": "Orchestra 7560",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7560.png"
      },
      {
        "ref": "7972",
        "name": "Orchestra 7972",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/7972.png"
      },
      {
        "ref": "8200",
        "name": "Orchestra 8200",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8200.png"
      },
      {
        "ref": "8201",
        "name": "Orchestra 8201",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8201.png"
      },
      {
        "ref": "8203",
        "name": "Orchestra 8203",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8203.png"
      },
      {
        "ref": "8204",
        "name": "Orchestra 8204",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8204.png"
      },
      {
        "ref": "8205",
        "name": "Orchestra 8205",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8205.png"
      },
      {
        "ref": "8206",
        "name": "Orchestra 8206",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8206.png"
      },
      {
        "ref": "8207",
        "name": "Orchestra 8207",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8207.png"
      },
      {
        "ref": "8211",
        "name": "Orchestra Décor 8211",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8211.png"
      },
      {
        "ref": "8224",
        "name": "Orchestra Décor 8224",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8224.png"
      },
      {
        "ref": "8230",
        "name": "Orchestra Décor 8230",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8230.png"
      },
      {
        "ref": "8238 bleu nuit",
        "name": "Orchestra 8238 bleu nuit",
        "family": "Bleu",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8238 bleu nuit.png"
      },
      {
        "ref": "8396",
        "name": "Orchestra 8396",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8396.png"
      },
      {
        "ref": "8402",
        "name": "Orchestra Décor 8402",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8402.png"
      },
      {
        "ref": "8544",
        "name": "Orchestra Décor 8544",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8544.png"
      },
      {
        "ref": "8552",
        "name": "Orchestra Décor 8552",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8552.png"
      },
      {
        "ref": "8553",
        "name": "Orchestra Décor 8553",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8553.png"
      },
      {
        "ref": "8556",
        "name": "Orchestra Décor 8556",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8556.png"
      },
      {
        "ref": "8557",
        "name": "Orchestra Décor 8557",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8557.png"
      },
      {
        "ref": "8612",
        "name": "Orchestra Décor 8612",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8612.png"
      },
      {
        "ref": "8614",
        "name": "Orchestra Décor 8614",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8614.png"
      },
      {
        "ref": "8615",
        "name": "Orchestra Décor 8615",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8615.png"
      },
      {
        "ref": "8776",
        "name": "Orchestra 8776",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8776.png"
      },
      {
        "ref": "8777",
        "name": "Orchestra 8777",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8777.png"
      },
      {
        "ref": "8778",
        "name": "Orchestra 8778",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8778.png"
      },
      {
        "ref": "8779",
        "name": "Orchestra 8779",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8779.png"
      },
      {
        "ref": "8891",
        "name": "Orchestra 8891",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8891.png"
      },
      {
        "ref": "8901",
        "name": "Orchestra 8901",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8901.png"
      },
      {
        "ref": "8902",
        "name": "Orchestra 8902",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8902.png"
      },
      {
        "ref": "8904 Lin chiné",
        "name": "Orchestra 8904 Lin chiné",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/8904.png"
      },
      {
        "ref": "8906",
        "name": "Orchestra Décor 8906",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8906.png"
      },
      {
        "ref": "8907",
        "name": "Orchestra Décor 8907",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8907.png"
      },
      {
        "ref": "8910",
        "name": "Orchestra Décor 8910",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8910.png"
      },
      {
        "ref": "8919",
        "name": "Orchestra Décor 8919",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8919.png"
      },
      {
        "ref": "8921",
        "name": "Orchestra Décor 8921",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8921.png"
      },
      {
        "ref": "8922",
        "name": "Orchestra Décor 8922",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8922.png"
      },
      {
        "ref": "8931",
        "name": "Orchestra Décor 8931",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8931.png"
      },
      {
        "ref": "8935",
        "name": "Orchestra Décor 8935",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/8935.png"
      },
      {
        "ref": "D100",
        "name": "Orchestra Décor D100",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D100.png"
      },
      {
        "ref": "D103",
        "name": "Orchestra Décor D103",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D103.png"
      },
      {
        "ref": "D104",
        "name": "Orchestra Décor D104",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D104.png"
      },
      {
        "ref": "D107",
        "name": "Orchestra Décor D107",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D107.png"
      },
      {
        "ref": "D108",
        "name": "Orchestra Décor D108",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D108.png"
      },
      {
        "ref": "D113",
        "name": "Orchestra Décor D113",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D113.png"
      },
      {
        "ref": "D302",
        "name": "Orchestra Décor D302",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D302.png"
      },
      {
        "ref": "D303",
        "name": "Orchestra Décor D303",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D303.png"
      },
      {
        "ref": "D304",
        "name": "Orchestra Décor D304",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D304.png"
      },
      {
        "ref": "D305",
        "name": "Orchestra Décor D305",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D305.png"
      },
      {
        "ref": "D306",
        "name": "Orchestra Décor D306",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D306.png"
      },
      {
        "ref": "D307",
        "name": "Orchestra Décor D307",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D307.png"
      },
      {
        "ref": "D308",
        "name": "Orchestra Décor D308",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D308.png"
      },
      {
        "ref": "D309",
        "name": "Orchestra Décor D309",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D309.png"
      },
      {
        "ref": "D310",
        "name": "Orchestra Décor D310",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D310.png"
      },
      {
        "ref": "D311",
        "name": "Orchestra Décor D311",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D311.png"
      },
      {
        "ref": "D312",
        "name": "Orchestra Décor D312",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D312.png"
      },
      {
        "ref": "D314",
        "name": "Orchestra Décor D314",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D314.png"
      },
      {
        "ref": "D317",
        "name": "Orchestra Décor D317",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D317.png"
      },
      {
        "ref": "D318",
        "name": "Orchestra Décor D318",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D318.png"
      },
      {
        "ref": "D319",
        "name": "Orchestra Décor D319",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D319.png"
      },
      {
        "ref": "D321",
        "name": "Orchestra Décor D321",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D321.png"
      },
      {
        "ref": "D323",
        "name": "Orchestra Décor D323",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D323.png"
      },
      {
        "ref": "D330",
        "name": "Orchestra Décor D330",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D330.png"
      },
      {
        "ref": "D332",
        "name": "Orchestra Décor D332",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D332.png"
      },
      {
        "ref": "D335",
        "name": "Orchestra Décor D335",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D335.png"
      },
      {
        "ref": "D338",
        "name": "Orchestra Décor D338",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D338.png"
      },
      {
        "ref": "D339",
        "name": "Orchestra Décor D339",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D339.png"
      },
      {
        "ref": "D532",
        "name": "Orchestra Décor D532",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D532.png"
      },
      {
        "ref": "D533",
        "name": "Orchestra Décor D533",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D533.png"
      },
      {
        "ref": "D534",
        "name": "Orchestra Décor D534",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D534.png"
      },
      {
        "ref": "D535",
        "name": "Orchestra Décor D535",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D535.png"
      },
      {
        "ref": "D536",
        "name": "Orchestra Décor D536",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D536.png"
      },
      {
        "ref": "D537",
        "name": "Orchestra Décor D537",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D537.png"
      },
      {
        "ref": "D538",
        "name": "Orchestra Décor D538",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D538.png"
      },
      {
        "ref": "D539",
        "name": "Orchestra Décor D539",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D539.png"
      },
      {
        "ref": "D540",
        "name": "Orchestra Décor D540",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D540.png"
      },
      {
        "ref": "D541",
        "name": "Orchestra Décor D541",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D541.png"
      },
      {
        "ref": "D542",
        "name": "Orchestra Décor D542",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D542.png"
      },
      {
        "ref": "D543",
        "name": "Orchestra Décor D543",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D543.png"
      },
      {
        "ref": "D544",
        "name": "Orchestra Décor D544",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D544.png"
      },
      {
        "ref": "D545",
        "name": "Orchestra Décor D545",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D545.png"
      },
      {
        "ref": "D548",
        "name": "Orchestra Décor D548",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D548.png"
      },
      {
        "ref": "D549",
        "name": "Orchestra Décor D549",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D549.png"
      },
      {
        "ref": "D550",
        "name": "Orchestra Décor D550",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D550.png"
      },
      {
        "ref": "D551",
        "name": "Orchestra Décor D551",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D551.png"
      },
      {
        "ref": "D552",
        "name": "Orchestra Décor D552",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D552.png"
      },
      {
        "ref": "D554",
        "name": "Orchestra Décor D554",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D554.png"
      },
      {
        "ref": "D555",
        "name": "Orchestra Décor D555",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D555.png"
      },
      {
        "ref": "D556",
        "name": "Orchestra Décor D556",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_DECORS/D556.png"
      },
      {
        "ref": "U095 gris basalte",
        "name": "Orchestra U095 gris basalte",
        "family": "Gris",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U095.png"
      },
      {
        "ref": "U104",
        "name": "Orchestra U104",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U104.png"
      },
      {
        "ref": "U105",
        "name": "Orchestra U105",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U105.png"
      },
      {
        "ref": "U137",
        "name": "Orchestra U137",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U137.png"
      },
      {
        "ref": "U140",
        "name": "Orchestra U140",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U140.png"
      },
      {
        "ref": "U170",
        "name": "Orchestra U170",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U170.png"
      },
      {
        "ref": "U171",
        "name": "Orchestra U171",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U171.png"
      },
      {
        "ref": "U190",
        "name": "Orchestra U190",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U190.png"
      },
      {
        "ref": "U224",
        "name": "Orchestra U224",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U224.png"
      },
      {
        "ref": "U235",
        "name": "Orchestra U235",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U235.png"
      },
      {
        "ref": "U321",
        "name": "Orchestra U321",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U321.png"
      },
      {
        "ref": "U335",
        "name": "Orchestra U335",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U335.png"
      },
      {
        "ref": "U337",
        "name": "Orchestra U337",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U337.png"
      },
      {
        "ref": "U343",
        "name": "Orchestra U343",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U343.png"
      },
      {
        "ref": "U370",
        "name": "Orchestra U370",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U370.png"
      },
      {
        "ref": "U371",
        "name": "Orchestra U371",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U371.png"
      },
      {
        "ref": "U373",
        "name": "Orchestra U373",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U373.png"
      },
      {
        "ref": "U387",
        "name": "Orchestra U387",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U387.png"
      },
      {
        "ref": "U388",
        "name": "Orchestra U388",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U388.png"
      },
      {
        "ref": "U402",
        "name": "Orchestra U402",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U402.png"
      },
      {
        "ref": "U404",
        "name": "Orchestra U404",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U404.png"
      },
      {
        "ref": "U406",
        "name": "Orchestra U406",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U406.png"
      },
      {
        "ref": "U407",
        "name": "Orchestra U407",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U407.png"
      },
      {
        "ref": "U408",
        "name": "Orchestra U408",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U408.png"
      },
      {
        "ref": "U409",
        "name": "Orchestra U409",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U409.png"
      },
      {
        "ref": "U410",
        "name": "Orchestra U410",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U410.png"
      },
      {
        "ref": "U411",
        "name": "Orchestra U411",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U411.png"
      },
      {
        "ref": "U413",
        "name": "Orchestra U413",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U413.png"
      },
      {
        "ref": "U415",
        "name": "Orchestra U415",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U415.png"
      },
      {
        "ref": "U416",
        "name": "Orchestra U416",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U416.png"
      },
      {
        "ref": "U767",
        "name": "Orchestra U767",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U767.png"
      },
      {
        "ref": "U768",
        "name": "Orchestra U768",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U768.png"
      },
      {
        "ref": "U784",
        "name": "Orchestra U784",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U784.png"
      },
      {
        "ref": "U785",
        "name": "Orchestra U785",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U785.png"
      },
      {
        "ref": "U786",
        "name": "Orchestra U786",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U786.png"
      },
      {
        "ref": "U787",
        "name": "Orchestra U787",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U787.png"
      },
      {
        "ref": "U788",
        "name": "Orchestra U788",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U788.png"
      },
      {
        "ref": "U789",
        "name": "Orchestra U789",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U789.png"
      },
      {
        "ref": "U791",
        "name": "Orchestra U791",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U791.png"
      },
      {
        "ref": "U792",
        "name": "Orchestra U792",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U792.png"
      },
      {
        "ref": "U793",
        "name": "Orchestra U793",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U793.png"
      },
      {
        "ref": "U794",
        "name": "Orchestra U794",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U794.png"
      },
      {
        "ref": "U795",
        "name": "Orchestra U795",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U795.png"
      },
      {
        "ref": "U796",
        "name": "Orchestra U796",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U796.png"
      },
      {
        "ref": "U797",
        "name": "Orchestra U797",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U797.png"
      },
      {
        "ref": "U798",
        "name": "Orchestra U798",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U798.png"
      },
      {
        "ref": "U799",
        "name": "Orchestra U799",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U799.png"
      },
      {
        "ref": "U800",
        "name": "Orchestra U800",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U800.png"
      },
      {
        "ref": "U801",
        "name": "Orchestra U801",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U801.png"
      },
      {
        "ref": "U802",
        "name": "Orchestra U802",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U802.png"
      },
      {
        "ref": "U803",
        "name": "Orchestra U803",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U803.png"
      },
      {
        "ref": "U804",
        "name": "Orchestra U804",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U804.png"
      },
      {
        "ref": "U805",
        "name": "Orchestra U805",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U805.png"
      },
      {
        "ref": "U806",
        "name": "Orchestra U806",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U806.png"
      },
      {
        "ref": "U807",
        "name": "Orchestra U807",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U807.png"
      },
      {
        "ref": "U808",
        "name": "Orchestra U808",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U808.png"
      },
      {
        "ref": "U809",
        "name": "Orchestra U809",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U809.png"
      },
      {
        "ref": "U810",
        "name": "Orchestra U810",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U810.png"
      },
      {
        "ref": "U811",
        "name": "Orchestra U811",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U811.png"
      },
      {
        "ref": "U812",
        "name": "Orchestra U812",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U812.png"
      },
      {
        "ref": "U813",
        "name": "Orchestra U813",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U813.png"
      },
      {
        "ref": "U814",
        "name": "Orchestra U814",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/DICKSON_ORCHESTREA_UNI/U814.png"
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
        "family": "Blanc",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/0001.png"
      },
      {
        "ref": "0681",
        "name": "Orchestra Max 0681",
        "family": "Blanc",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/0681 120.png"
      },
      {
        "ref": "3914",
        "name": "Orchestra Max 3914",
        "family": "Beige",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/3914 120.png"
      },
      {
        "ref": "6020",
        "name": "Orchestra Max 6020",
        "family": "Gris",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/6020 120.png"
      },
      {
        "ref": "6028",
        "name": "Orchestra Max 6028",
        "family": "Gris",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/6028 120.png"
      },
      {
        "ref": "6088",
        "name": "Orchestra Max 6088",
        "family": "Gris",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/6088 120.png"
      },
      {
        "ref": "6196",
        "name": "Orchestra Max 6196",
        "family": "Gris",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/6196 120.png"
      },
      {
        "ref": "6687",
        "name": "Orchestra Max 6687",
        "family": "Bleu",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/6687 120.png"
      },
      {
        "ref": "7133",
        "name": "Orchestra Max 7133",
        "family": "Bleu",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/7133 120.png"
      },
      {
        "ref": "7548",
        "name": "Orchestra Max 7548",
        "family": "Bleu",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/7548 120.png"
      },
      {
        "ref": "7559",
        "name": "Orchestra Max 7559",
        "family": "Bleu",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/7559 120.png"
      },
      {
        "ref": "8203",
        "name": "Orchestra Max 8203",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/8203 120.png"
      },
      {
        "ref": "8206",
        "name": "Orchestra Max 8206",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/8206 120.png"
      },
      {
        "ref": "8396",
        "name": "Orchestra Max 8396",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/8396 120.png"
      },
      {
        "ref": "8779",
        "name": "Orchestra Max 8779",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/8779 120.png"
      },
      {
        "ref": "U104",
        "name": "Orchestra Max U104",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/U104 120.png"
      },
      {
        "ref": "U171",
        "name": "Orchestra Max U171",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/U171 120.png"
      },
      {
        "ref": "U767",
        "name": "Orchestra Max U767",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/U767 120.png"
      },
      {
        "ref": "U768",
        "name": "Orchestra Max U768",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/Réf. U768 120.png"
      },
      {
        "ref": "U786",
        "name": "Orchestra Max U786",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/U786 120.png"
      },
      {
        "ref": "U793",
        "name": "Orchestra Max U793",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/U793 120.png"
      },
      {
        "ref": "U806",
        "name": "Orchestra Max U806",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/U806 120.png"
      },
      {
        "ref": "U808",
        "name": "Orchestra Max U808",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/U808 120.png"
      },
      {
        "ref": "U811",
        "name": "Orchestra Max U811",
        "family": "Neutre",
        "image_url": "/images/Toiles/DICKSON/ORCHESTRA_MAX/U811 120.png"
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
        "family": "Neutre",
        "image_url": "/images/Toiles/SATLER/30A734.png"
      },
      {
        "ref": "314001",
        "name": "Sattler 314001",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314001.png"
      },
      {
        "ref": "314007",
        "name": "Sattler 314007",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314007.png"
      },
      {
        "ref": "314010",
        "name": "Sattler 314010",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314010.png"
      },
      {
        "ref": "314020",
        "name": "Sattler 314020",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314020.png"
      },
      {
        "ref": "314022",
        "name": "Sattler 314022",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314022.png"
      },
      {
        "ref": "314028",
        "name": "Sattler 314028",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314028.png"
      },
      {
        "ref": "314030",
        "name": "Sattler 314030",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314030.png"
      },
      {
        "ref": "314070",
        "name": "Sattler 314070",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314070.png"
      },
      {
        "ref": "314081",
        "name": "Sattler 314081",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314081.png"
      },
      {
        "ref": "314083",
        "name": "Sattler 314083",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314083.png"
      },
      {
        "ref": "314085",
        "name": "Sattler 314085",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314085.png"
      },
      {
        "ref": "314154",
        "name": "Sattler 314154",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314154.png"
      },
      {
        "ref": "314182",
        "name": "Sattler 314182",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314182.png"
      },
      {
        "ref": "314325",
        "name": "Sattler 314325",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314325.png"
      },
      {
        "ref": "314362",
        "name": "Sattler 314362",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314362.png"
      },
      {
        "ref": "314364",
        "name": "Sattler 314364",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314364.png"
      },
      {
        "ref": "314398",
        "name": "Sattler 314398",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314398.png"
      },
      {
        "ref": "314402",
        "name": "Sattler 314402",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314402.png"
      },
      {
        "ref": "314414",
        "name": "Sattler 314414",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314414.png"
      },
      {
        "ref": "314546",
        "name": "Sattler 314546",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314546.png"
      },
      {
        "ref": "314550",
        "name": "Sattler 314550",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314550.png"
      },
      {
        "ref": "314638",
        "name": "Sattler 314638",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314638.png"
      },
      {
        "ref": "314660",
        "name": "Sattler 314660",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314660.png"
      },
      {
        "ref": "314718",
        "name": "Sattler 314718",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314718.png"
      },
      {
        "ref": "314763",
        "name": "Sattler 314763",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314763.png"
      },
      {
        "ref": "314780",
        "name": "Sattler 314780",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314780.png"
      },
      {
        "ref": "314818",
        "name": "Sattler 314818",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314818.png"
      },
      {
        "ref": "314819",
        "name": "Sattler 314819",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314819.png"
      },
      {
        "ref": "314828",
        "name": "Sattler 314828",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314828.png"
      },
      {
        "ref": "314838",
        "name": "Sattler 314838",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314838.png"
      },
      {
        "ref": "314840",
        "name": "Sattler 314840",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314840.png"
      },
      {
        "ref": "314851",
        "name": "Sattler 314851",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314851.png"
      },
      {
        "ref": "314858",
        "name": "Sattler 314858",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314858.png"
      },
      {
        "ref": "314880",
        "name": "Sattler 314880",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314880.png"
      },
      {
        "ref": "314888",
        "name": "Sattler 314888",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314888.png"
      },
      {
        "ref": "314941",
        "name": "Sattler 314941",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314941.png"
      },
      {
        "ref": "314E67",
        "name": "Sattler 314E67",
        "family": "Beige",
        "image_url": "/images/Toiles/SATLER/314E67.png"
      },
      {
        "ref": "320180",
        "name": "Sattler 320180",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320180.png"
      },
      {
        "ref": "320190",
        "name": "Sattler 320190",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320190.png"
      },
      {
        "ref": "320212",
        "name": "Sattler 320212",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320212.png"
      },
      {
        "ref": "320235",
        "name": "Sattler 320235",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320235.png"
      },
      {
        "ref": "320253",
        "name": "Sattler 320253",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320253.png"
      },
      {
        "ref": "320309",
        "name": "Sattler 320309",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320309.png"
      },
      {
        "ref": "320408",
        "name": "Sattler 320408",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320408.png"
      },
      {
        "ref": "320434",
        "name": "Sattler 320434",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320434.png"
      },
      {
        "ref": "320452",
        "name": "Sattler 320452",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320452.png"
      },
      {
        "ref": "320679",
        "name": "Sattler 320679",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320679.png"
      },
      {
        "ref": "320692",
        "name": "Sattler 320692",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320692.png"
      },
      {
        "ref": "320833",
        "name": "Sattler 320833",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320833.png"
      },
      {
        "ref": "320923",
        "name": "Sattler 320923",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320923.png"
      },
      {
        "ref": "320925",
        "name": "Sattler 320925",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320925.png"
      },
      {
        "ref": "320928",
        "name": "Sattler 320928",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320928.png"
      },
      {
        "ref": "320937",
        "name": "Sattler 320937",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320937.png"
      },
      {
        "ref": "320954",
        "name": "Sattler 320954",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320954.png"
      },
      {
        "ref": "320956",
        "name": "Sattler 320956",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320956.png"
      },
      {
        "ref": "320992",
        "name": "Sattler 320992",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320992.png"
      },
      {
        "ref": "320994",
        "name": "Sattler 320994",
        "family": "Gris",
        "image_url": "/images/Toiles/SATLER/320994.png"
      },
      {
        "ref": "364053",
        "name": "Sattler 364053",
        "family": "Bleu",
        "image_url": "/images/Toiles/SATLER/364053.png"
      },
      {
        "ref": "364598",
        "name": "Sattler 364598",
        "family": "Bleu",
        "image_url": "/images/Toiles/SATLER/364598.png"
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

/**
 * Récupère l'URL de l'image d'une toile par sa référence
 */
export function getToileImageUrl(ref: string): string | null {
  return TOILE_IMAGES[ref] || null;
}
