/**
 * Configuration des zones d'intervention pour la pose
 * Mise à jour : Février 2026
 */

export interface ZoneIntervention {
  nom: string;
  delai: string;
  disponible: boolean;
  frais_deplacement: number; // Frais de déplacement en € HT
  prix_pose_base: number; // Prix de base pose jusqu'à 6m en € HT
  prix_pose_supplement_metre: number; // Prix par mètre supplémentaire au-delà de 6m en € HT
}

export const ZONES_INTERVENTION: Record<string, ZoneIntervention> = {
  // Île-de-France - Proche (Paris + petite couronne)
  "75": { nom: "Paris", delai: "5-7 jours", disponible: true, frais_deplacement: 0, prix_pose_base: 500, prix_pose_supplement_metre: 100 },
  "92": { nom: "Hauts-de-Seine", delai: "5-7 jours", disponible: true, frais_deplacement: 0, prix_pose_base: 500, prix_pose_supplement_metre: 100 },
  "93": { nom: "Seine-Saint-Denis", delai: "5-7 jours", disponible: true, frais_deplacement: 0, prix_pose_base: 500, prix_pose_supplement_metre: 100 },
  "94": { nom: "Val-de-Marne", delai: "5-7 jours", disponible: true, frais_deplacement: 0, prix_pose_base: 500, prix_pose_supplement_metre: 100 },

  // Île-de-France - Grande couronne
  "77": { nom: "Seine-et-Marne", delai: "5-7 jours", disponible: true, frais_deplacement: 50, prix_pose_base: 500, prix_pose_supplement_metre: 100 },
  "78": { nom: "Yvelines", delai: "5-7 jours", disponible: true, frais_deplacement: 50, prix_pose_base: 500, prix_pose_supplement_metre: 100 },
  "91": { nom: "Essonne", delai: "5-7 jours", disponible: true, frais_deplacement: 50, prix_pose_base: 500, prix_pose_supplement_metre: 100 },
  "95": { nom: "Val-d'Oise", delai: "5-7 jours", disponible: true, frais_deplacement: 50, prix_pose_base: 500, prix_pose_supplement_metre: 100 },

  // Centre-Val de Loire
  "18": { nom: "Cher", delai: "3-5 jours", disponible: true, frais_deplacement: 100, prix_pose_base: 500, prix_pose_supplement_metre: 100 },
  "28": { nom: "Eure-et-Loir", delai: "3-5 jours", disponible: true, frais_deplacement: 100, prix_pose_base: 500, prix_pose_supplement_metre: 100 },
  "36": { nom: "Indre", delai: "3-5 jours", disponible: true, frais_deplacement: 100, prix_pose_base: 500, prix_pose_supplement_metre: 100 },
  "37": { nom: "Indre-et-Loire", delai: "3-5 jours", disponible: true, frais_deplacement: 100, prix_pose_base: 500, prix_pose_supplement_metre: 100 },
  "41": { nom: "Loir-et-Cher", delai: "3-5 jours", disponible: true, frais_deplacement: 100, prix_pose_base: 500, prix_pose_supplement_metre: 100 },
  "45": { nom: "Loiret", delai: "3-5 jours", disponible: true, frais_deplacement: 100, prix_pose_base: 500, prix_pose_supplement_metre: 100 },

  // Départements limitrophes
  "72": { nom: "Sarthe", delai: "5-7 jours", disponible: true, frais_deplacement: 150, prix_pose_base: 500, prix_pose_supplement_metre: 100 },
  "89": { nom: "Yonne", delai: "5-7 jours", disponible: true, frais_deplacement: 150, prix_pose_base: 500, prix_pose_supplement_metre: 100 },
  "58": { nom: "Nièvre", delai: "5-7 jours", disponible: true, frais_deplacement: 150, prix_pose_base: 500, prix_pose_supplement_metre: 100 },
  "10": { nom: "Aube", delai: "5-7 jours", disponible: true, frais_deplacement: 150, prix_pose_base: 500, prix_pose_supplement_metre: 100 },
  "03": { nom: "Allier", delai: "7-10 jours", disponible: true, frais_deplacement: 200, prix_pose_base: 500, prix_pose_supplement_metre: 100 },
};

/**
 * Vérifie si un code postal est dans une zone d'intervention
 */
export function checkZoneIntervention(codePostal: string): {
  disponible: boolean;
  zone?: ZoneIntervention;
  departement?: string;
  message: string;
} {
  // Validation format code postal français
  if (!/^\d{5}$/.test(codePostal)) {
    return {
      disponible: false,
      message: "Code postal invalide. Format attendu : 5 chiffres.",
    };
  }

  // Extraction du département (2 premiers chiffres)
  const departement = codePostal.substring(0, 2);
  const zone = ZONES_INTERVENTION[departement];

  if (zone && zone.disponible) {
    return {
      disponible: true,
      zone,
      departement,
      message: `✓ Pose disponible en ${zone.nom} (${departement}) - Délai d'intervention : ${zone.delai}`,
    };
  }

  return {
    disponible: false,
    departement,
    message: `Zone non couverte actuellement. Nous intervenons en Île-de-France, Centre-Val de Loire et départements limitrophes. Contactez-nous pour plus d'informations.`,
  };
}

/**
 * Liste des départements couverts
 */
export function getAvailableDepartments(): string[] {
  return Object.keys(ZONES_INTERVENTION).sort();
}

/**
 * Calcule le coût de la pose en fonction de la largeur et du code postal
 * @param widthCm - Largeur du store en centimètres
 * @param codePostal - Code postal du client
 * @returns Coût total de la pose en € HT (inclut frais de déplacement)
 */
export function calculateInstallationCostWithZone(
  widthCm: number,
  codePostal: string
): {
  poseBase: number;
  fraisDeplacement: number;
  total: number;
  departement?: string;
  zone?: ZoneIntervention;
} {
  // Extraction du département
  const departement = codePostal.substring(0, 2);
  const zone = ZONES_INTERVENTION[departement];

  // Si zone non trouvée, utiliser les tarifs par défaut
  const prixBase = zone?.prix_pose_base ?? 500;
  const prixSupplement = zone?.prix_pose_supplement_metre ?? 100;
  const fraisDeplacement = zone?.frais_deplacement ?? 0;

  // Calcul du coût de pose selon la largeur
  let poseBase: number;
  if (widthCm <= 6000) {
    poseBase = prixBase;
  } else {
    const surpassCm = widthCm - 6000;
    const surpassMeters = surpassCm / 1000;
    poseBase = prixBase + Math.ceil(surpassMeters) * prixSupplement;
  }

  return {
    poseBase,
    fraisDeplacement,
    total: poseBase + fraisDeplacement,
    departement,
    zone,
  };
}

/**
 * Liste des régions couvertes
 */
export const REGIONS_COUVERTES = [
  {
    nom: "Île-de-France",
    departements: ["75", "77", "78", "91", "92", "93", "94", "95"],
    delai: "5-7 jours",
  },
  {
    nom: "Centre-Val de Loire",
    departements: ["18", "28", "36", "37", "41", "45"],
    delai: "3-5 jours",
  },
  {
    nom: "Départements limitrophes",
    departements: ["03", "10", "58", "72", "89"],
    delai: "5-10 jours",
  },
];
