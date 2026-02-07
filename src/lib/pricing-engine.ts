// Fichier : lib/pricing-engine.ts
import { PRODUCT_CATALOG, OPTIONS_PRICING, CATALOG_SETTINGS } from './catalog-data';

interface PriceRequest {
  modelId: string;
  width: number;      // en mm
  projection: number; // en mm
  options?: string[]; // ex: ['sensor_wind', 'pose_plafond']
}

export function calculatePrice(req: PriceRequest) {
  // 1. Récupérer le modèle
  const model = PRODUCT_CATALOG[req.modelId as keyof typeof PRODUCT_CATALOG];
  if (!model) return { error: "Modèle inconnu" };

  // 2. Trouver la colonne largeur (Step)
  const widthIndex = model.widthSteps.findIndex(step => req.width <= step);
  if (widthIndex === -1) return { error: "Largeur hors limites" };

  // 3. Trouver la ligne avancée
  // On récupère les avancées possibles et on trie
  const validProjections = Object.keys(model.prices).map(Number).sort((a,b) => a - b);
  // On cherche l'avancée immédiatement supérieure ou égale
  const targetProj = validProjections.find(p => req.projection <= p);
  
  if (!targetProj) return { error: "Avancée non disponible" };
  
  // 4. Lire le prix de base (Achat HT)
  const pricesArray = model.prices[targetProj as keyof typeof model.prices]; // Ligne
  const basePriceHT = pricesArray[widthIndex]; // Colonne

  if (basePriceHT === null) return { error: "Combinaison impossible (trop large pour cette avancée)" };

  // 5. Calculer les options (Achat HT)
  let optionsTotalHT = 0;
  if (req.options && req.options.length > 0) {
    req.options.forEach(opt => {
      // On caste 'opt' pour vérifier s'il existe dans OPTIONS_PRICING
      const price = OPTIONS_PRICING[opt as keyof typeof OPTIONS_PRICING];
      if (typeof price === 'number') {
        optionsTotalHT += price;
      }
    });
  }

  // 6. Appliquer les Coefficients (C'est ICI que ça change)
  // Prix du store x Coeff Store
  const storePublicPrice = basePriceHT * model.coefficient;
  
  // Prix des options x Coeff Store (généralement on aligne la marge option sur le produit principal)
  const optionsPublicPrice = optionsTotalHT * model.coefficient;

  const totalPublic = storePublicPrice + optionsPublicPrice;

  // 7. Appliquer la Promo
  const finalPrice = totalPublic * (1 - CATALOG_SETTINGS.promoDiscount);

  return {
    baseHT: basePriceHT + optionsTotalHT,
    publicPrice: Math.ceil(totalPublic / 10) * 10, // Arrondi psychologique à la dizaine (ex: 1452 -> 1460)
    finalPrice: Math.ceil(finalPrice),   // Prix à payer
    details: `${model.name} ${targetProj}x${model.widthSteps[widthIndex]}`,
    promoApplied: CATALOG_SETTINGS.promoCode
  };
}