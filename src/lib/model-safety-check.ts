// Vérification de sécurité pour la conformité des modèles
import { STORE_MODELS } from './catalog-data';

export interface ModelFilterResult {
  allowed: string[];
  excluded: string[];
  warnings: string[];
}

/**
 * Génère dynamiquement le texte du catalogue à partir de STORE_MODELS
 * Cela garantit que le SYSTEM_PROMPT reste toujours à jour
 * @returns String formaté pour le SYSTEM_PROMPT
 */
export function generateDynamicCatalog(): string {
  const categories: Record<string, any[]> = {
    coffre: [],
    monobloc: [],
    traditionnel: [],
    specialite: []
  };

  // 1. Grouper les modèles par catégorie
  for (const [modelId, model] of Object.entries(STORE_MODELS)) {
    if (model.type) {
      categories[model.type]?.push(model);
    }
  }

  // 2. Générer le texte du catalogue
  let catalogText = `═══════════════════════════════════════════════════════════════
📋 CATALOGUES & SPÉCIFICATIONS TECHNIQUES (SOURCE: catalog-data.ts)
═══════════════════════════════════════════════════════════════

`;

  // COFFRES
  if (categories.coffre.length > 0) {
    catalogText += `**STORES COFFRES - LIMITES TECHNIQUES STRICTES:**\n\n`;
    const emojis = ['🔴', '🟣', '🔵', '🟠', '🟢', '🟡', '⚫', '🟤'];
    let emojiIdx = 0;

    for (const model of categories.coffre) {
      const emoji = emojis[emojiIdx++ % emojis.length];
      const maxW = model.compatibility?.max_width || 0;
      const maxP = model.compatibility?.max_projection || 0;
      catalogText += `${emoji} **${model.name}**\n`;
      if (model.description) {
        catalogText += `   ${model.description}\n`;
      }
      catalogText += `   - Largeur MAX: ${maxW}cm (${(maxW / 100).toFixed(2)}m)\n`;
      catalogText += `   - Avancée MAX: ${maxP}cm (${(maxP / 100).toFixed(2)}m)\n\n`;
    }
  }

  // MONOBLOCS
  if (categories.monobloc.length > 0) {
    catalogText += `**STORES MONOBLOCS - LIMITES TECHNIQUES STRICTES:**\n\n`;
    const emojis = ['⚪', '🩶', '⛔'];
    let emojiIdx = 0;

    for (const model of categories.monobloc) {
      const emoji = emojis[emojiIdx++ % emojis.length];
      const maxW = model.compatibility?.max_width || 0;
      const maxP = model.compatibility?.max_projection || 0;
      catalogText += `${emoji} **${model.name}**\n`;
      if (model.description) {
        catalogText += `   ${model.description}\n`;
      }
      catalogText += `   - Largeur MAX: ${maxW}cm (${(maxW / 100).toFixed(2)}m)\n`;
      catalogText += `   - Avancée MAX: ${maxP}cm (${(maxP / 100).toFixed(2)}m)\n\n`;
    }
  }

  // TRADITIONNELS
  if (categories.traditionnel.length > 0) {
    catalogText += `**STORES TRADITIONNELS - LIMITES TECHNIQUES STRICTES:**\n\n`;
    const emojis = ['🟤', '🟥', '🟨'];
    let emojiIdx = 0;

    for (const model of categories.traditionnel) {
      const emoji = emojis[emojiIdx++ % emojis.length];
      const maxW = model.compatibility?.max_width || 0;
      const maxP = model.compatibility?.max_projection || 0;
      catalogText += `${emoji} **${model.name}**\n`;
      if (model.description) {
        catalogText += `   ${model.description}\n`;
      }
      catalogText += `   - Largeur MAX: ${maxW}cm (${(maxW / 100).toFixed(2)}m)\n`;
      catalogText += `   - Avancée MAX: ${maxP}cm (${(maxP / 100).toFixed(2)}m)\n\n`;
    }
  }

  // SPÉCIALITÉS
  if (categories.specialite.length > 0) {
    catalogText += `**STORES SPÉCIALITÉS:**\n\n`;
    const emojis = ['🔶'];
    let emojiIdx = 0;

    for (const model of categories.specialite) {
      const emoji = emojis[emojiIdx++ % emojis.length];
      const maxW = model.compatibility?.max_width || 0;
      const maxP = model.compatibility?.max_projection || 0;
      catalogText += `${emoji} **${model.name}**\n`;
      if (model.description) {
        catalogText += `   ${model.description}\n`;
      }
      catalogText += `   - Largeur MAX: ${maxW}cm (${(maxW / 100).toFixed(2)}m)\n`;
      catalogText += `   - Avancée MAX: ${maxP}cm (${(maxP / 100).toFixed(2)}m)\n`;
      
      // Cas spécial pour BRAS_CROISÉS
      if (model.id.toLowerCase().includes('croise') || model.id.toLowerCase().includes('bras')) {
        catalogText += `   - ⚠️ Configuration unique: avancée peut être > largeur\n`;
      }
      catalogText += `\n`;
    }
  }

  // Ajouter les versions PROMO
  const promoModels = Object.entries(STORE_MODELS)
    .filter(([id, m]) => m.is_promo)
    .map(([id, m]) => m);

  if (promoModels.length > 0) {
    catalogText += `**VERSIONS PROMOTIONNELLES (Limites Réduites):**\n`;
    for (const model of promoModels) {
      const maxW = model.compatibility?.max_width || 0;
      const maxP = model.compatibility?.max_projection || 0;
      catalogText += `- ${model.name}: ${maxW}cm × ${maxP}cm\n`;
    }
  }

  catalogText += `\n`;

  return catalogText;
}

/**
 * Filtre les modèles compatibles en fonction des dimensions
 * @param width Largeur en cm
 * @param depth Profondeur/avancée en cm
 * @returns Les modèles autorisés et les modèles exclus avec raison
 */
export function filterCompatibleModels(width: number, depth: number): ModelFilterResult {
  const allowed: string[] = [];
  const excluded: string[] = [];
  const warnings: string[] = [];

  for (const [modelId, modelData] of Object.entries(STORE_MODELS)) {
    const { name, compatibility } = modelData as any;
    const maxWidth = compatibility?.max_width || 6000;
    const maxDepth = compatibility?.max_projection || 3500;

    // Vérifier conformité largeur
    if (width > maxWidth) {
      excluded.push(modelId);
      warnings.push(
        `❌ ${name}: Nos fiches techniques indiquent une limite de ${maxWidth}cm pour la largeur, je ne peux donc pas vous le proposer pour votre sécurité.`
      );
      continue;
    }

    // Vérifier conformité profondeur
    if (depth > maxDepth) {
      excluded.push(modelId);
      warnings.push(
        `❌ ${name}: Nos fiches techniques indiquent une limite de ${maxDepth}cm pour la profondeur, je ne peux donc pas vous le proposer pour votre sécurité.`
      );
      continue;
    }

    // Si conforme, ajouter aux modèles autorisés
    allowed.push(modelId);
    console.log(`✅ ${name} conforme (${width}cm ≤ ${maxWidth}cm largeur, ${depth}cm ≤ ${maxDepth}cm profondeur)`);
  }

  // Logs de sécurité
  if (excluded.length > 0) {
    console.log(`🚨 SÉCURITÉ PRODUIT : ${excluded.length} modèle(s) exclus pour nonconformité`);
    warnings.forEach(w => console.log(w));
  }

  return { allowed, excluded, warnings };
}

/**
 * Valide qu'un modèle peut être proposé pour les dimensions données
 * @param modelId ID du modèle
 * @param width Largeur en cm
 * @param depth Profondeur en cm
 * @returns true si conforme, false sinon
 */
export function isModelConformForDimensions(modelId: string, width: number, depth: number): boolean {
  const modelData = STORE_MODELS[modelId as keyof typeof STORE_MODELS] as any;
  if (!modelData) return false;

  const maxWidth = modelData.compatibility?.max_width || 6000;
  const maxDepth = modelData.compatibility?.max_projection || 3500;

  return width <= maxWidth && depth <= maxDepth;
}

/**
 * Obtient la liste des modèles sûrs à proposer pour l'affichage
 * @param width Largeur en cm
 * @param depth Profondeur en cm
 * @param preferredModels Liste de modèles préférés à proposer (ex: ['belharra', 'etna', 'kissimy'])
 * @returns Liste filtrée des modèles conformes
 */
export function getSafeModelsToDisplay(width: number, depth: number, preferredModels: string[]): string[] {
  const { allowed, warnings } = filterCompatibleModels(width, depth);
  
  // Filtrer les modèles préférés en fonction de ceux qui sont conformes
  const safeModels = preferredModels.filter(modelId => allowed.includes(modelId));

  if (safeModels.length === 0) {
    console.warn(`⚠️ Aucun modèle parmi ${preferredModels.join(', ')} n'est conforme pour ${width}cm × ${depth}cm`);
    // Fallback : retourner tous les modèles conformes
    return allowed;
  }

  return safeModels;
}
