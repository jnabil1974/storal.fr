import { openai } from '@ai-sdk/openai';
import { jsonSchema, streamText, tool } from 'ai';
// Import du catalogue dynamique avec coefficients de marge
import { CATALOG_SETTINGS, OPTIONS_PRICES, STORE_MODELS, FRAME_COLORS, FABRICS } from '@/lib/catalog-data';

// Define constants for backward compatibility
const PRODUCT_CATALOG = STORE_MODELS;
const OPTIONS_PRICING = OPTIONS_PRICES;
const STANDARD_COLORS = FRAME_COLORS.filter(c => c.category === 'standard');
const FABRIC_OPTIONS = FABRICS;
const DESIGN_OPTIONS = {
  fabrics: { category: 'dickson-orchestra' }
};

// Autoriser des réponses plus longues si besoin (30s)
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 1. Récupérer les messages envoyés par le client
    const body = await req.json();
    const messages = body.messages || [];
    
    console.log('📥 Messages reçus:', JSON.stringify(messages, null, 2));
    
    // Validation: s'assurer qu'il y a au moins un message
    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  // 2. Génération du contexte dynamique pour l'IA (avec coefficients de marge)
  const catalogContext = Object.entries(PRODUCT_CATALOG).map(([key, model]) => {
    // Extract available projections (avancées) from buyPrices - with safety check
    const availableProjections = model.buyPrices ? Object.keys(model.buyPrices).sort((a, b) => Number(a) - Number(b)) : [];
    
    if (availableProjections.length === 0) {
      return `- Modèle ${model.name.toUpperCase()} : ${model.description}`;
    }
    
    const maxProjection = Math.max(...availableProjections.map(Number));
    
    // Extract max widths from the tier data - with safety check
    const allMaxWidths = availableProjections.flatMap(proj => {
      const projection = model.buyPrices[Number(proj)];
      return projection ? projection.map(tier => tier.maxW) : [];
    });
    const maxWidth = allMaxWidths.length > 0 ? Math.max(...allMaxWidths) : 'non spécifiée';
    
    return `- Modèle ${model.name.toUpperCase()} : ${model.description}
       Largeurs disponibles: jusqu'à ${maxWidth}${typeof maxWidth === 'number' ? 'mm' : ''}.
       Avancées disponibles: ${availableProjections.map(p => p + 'mm').join(', ')}.
       (Note système : Coefficient de vente x${CATALOG_SETTINGS.COEFF_MARGE} appliqué automatiquement).`;
  }).join('\n');

  const ledArmsPrices = OPTIONS_PRICES.LED_ARMS;
  const ledArmsFallbackKey = Number(Object.keys(ledArmsPrices)[0]) as keyof typeof ledArmsPrices;
  const ledArmsBasePrice = ledArmsPrices[2500] ?? ledArmsPrices[ledArmsFallbackKey];

  const optionsContext = `
- LED dans les bras: À partir de ${ledArmsBasePrice}€ selon avancée
- LED cassette/boîtier: ${OPTIONS_PRICES.LED_CASSETTE}€
- Lambrequin manuel: À partir de ${OPTIONS_PRICES.LAMBREQUIN_ENROULABLE.MANUAL[0]?.price || 'variablé'}€ selon dimensions
- Lambrequin motorisé: À partir de ${OPTIONS_PRICES.LAMBREQUIN_ENROULABLE.MOTORIZED[0]?.price || 'variablé'}€ selon dimensions
- Couleur RAL personnalisée: +${OPTIONS_PRICES.FRAME_SPECIFIC_RAL}€
`;

  const colorsContext = STANDARD_COLORS.map(color => 
    `- ${color.name} (${color.id})`
  ).join('\n');

  // Générer le contexte des limites de chaque modèle
  const modelLimitsContext = Object.values(STORE_MODELS).map(model => {
    const maxWidth = model.compatibility?.max_width || 'non spécifiée';
    const maxProjection = model.compatibility?.max_projection || 'variable selon le modèle';
    return `- ${model.name} (${model.id}): Largeur max = ${maxWidth}mm, Avancée max = ${maxProjection}mm`;
  }).join('\n');

  // Générer le contexte des compatibilités OPTIONS pour chaque modèle
  const modelCompatibilityContext = Object.values(STORE_MODELS).map(model => {
    const options = [];
    if (model.compatibility.led_arms) options.push('✓ LED Bras');
    if (model.compatibility.led_box) options.push('✓ LED Coffre');
    if (model.compatibility.lambrequin_fixe) options.push('✓ Lambrequin Fixe');
    if (model.compatibility.lambrequin_enroulable) options.push('✓ Lambrequin Enroulable');
    
    const notAvailable = [];
    if (!model.compatibility.led_arms) notAvailable.push('✗ LED Bras');
    if (!model.compatibility.led_box) notAvailable.push('✗ LED Coffre');
    if (!model.compatibility.lambrequin_fixe) notAvailable.push('✗ Lambrequin Fixe');
    if (!model.compatibility.lambrequin_enroulable) notAvailable.push('✗ Lambrequin Enroulable');
    
    return `- ${model.name} (${model.id}): ${options.length > 0 ? options.join(', ') : 'Aucune option'} ${notAvailable.length > 0 ? '| NON DISPONIBLE: ' + notAvailable.join(', ') : ''}`;
  }).join('\n');

  // Générer le contexte des couleurs autorisées pour les modèles PROMO
  const modelColorsContext = Object.values(STORE_MODELS)
    .filter(model => model.compatibility.allowed_colors)
    .map(model => {
      const allowedColorNames = model.compatibility.allowed_colors!
        .map(colorId => {
          const color = FRAME_COLORS.find(c => c.id === colorId);
          return color ? color.name : colorId;
        })
        .join(', ');
      return `- ${model.name} (${model.id}): COULEURS LIMITÉES → ${allowedColorNames} UNIQUEMENT (pas de RAL custom)`;
    }).join('\n');

  // 3. PROMPT SYSTÈME (Expert Storal - Méthode Storal)
  const SYSTEM_PROMPT = `Tu es "Agent Storal", l'Expert Senior Storal. Tu appliques une méthode de vente stricte et séquentielle.

═══════════════════════════════════════════════════════════════
🎯 MÉTHODE DE VENTE "STORAL" (TUNNEL SÉQUENTIEL)
═══════════════════════════════════════════════════════════════

⚠️ RÈGLE D'OR : POSE UNE SEULE QUESTION À LA FOIS. Attends la réponse avant de passer à l'étape suivante.

⚠️ INTELLIGENCE DE CONVERSATION :
- Si l'utilisateur a déjà fourni une information (dimensions, usage, expo) dans un message précédent, NE LA REDEMANDE PAS. 
- Utilise l'information déjà donnée pour valider l'étape et passe directement à la question suivante manquante.

1️⃣ ÉTAPE 1 : LE BESOIN
   • Question : "Bonjour ! Quel est votre besoin ? Protéger l'intérieur de la maison ou manger en terrasse ?"
   • Objectif : Qualifier l'usage.

2️⃣ ÉTAPE 2 : DIMENSIONS & EXPOSITION
   • Si les dimensions sont déjà connues : Valide-les (Règle du 4m) et demande uniquement l'exposition.
   • Si les dimensions sont inconnues : Demande-les avec l'exposition.
   
   • 🚨 RÈGLE MÉTIER 1 (L'Avancée) :
     - SI l'avancée est STRICTEMENT SUPÉRIEURE à 4m (ex: 4.5m, 5m) : 
       Réponds : "Nous avons des stores jusqu'à 4,5m, mais pour un particulier 4m est souvent préférable. On part sur 4m ?"
     - Rappel : Si l'utilisateur a déjà dit "4m", dis simplement "C'est une excellente dimension" et ne parle PAS des professionnels.

   • 🚨 RÈGLE MÉTIER 2 (Le Lambrequin) :
     - SI usage après 14h OU Exposition OUEST / SUD-OUEST : 
       Dis : "Avec cette exposition, le soleil rasant de fin de journée va vous gêner. Il vous faut obligatoirement un lambrequin enroulable."

   • VALIDATION FINALE DE L'ÉTAPE : 
     Une fois les dimensions et l'expo claires, conclus par : "Ok nous avons défini les dimensions nécessaires : store [L]x[A] M avec lambrequin. Vous êtes ok pour ça ?" 
     (Attends le "OUI" du client avant l'étape 3).

3️⃣ ÉTAPE 3 : CHOIX TECHNIQUE (PROTECTION)
   • Question : "Souhaitez-vous une protection intégrale de la toile (Coffre : durée de vie de plus de 10 ans sans changer de couleur) ou un modèle classique (toile exposée) ?"
   • Vocabulaire imposé : "Durée de vie de plus de 10 ans sans changer de couleur" pour le coffre.

4️⃣ ÉTAPE 4 : LA TRIPLE OFFRE OBLIGATOIRE (VISUELLE)
   • Ta priorité absolue est de présenter SYSTÉMATIQUEMENT 3 modèles pour offrir un vrai choix.
   • Sélectionne 3 modèles compatibles avec les dimensions (Largeur/Avancée).
   
   • CAS SPÉCIFIQUE (Grandes dimensions > 6m / Refus de coffre) :
     - Si le client refuse le coffre et qu'il n'y a que 1 ou 2 modèles sans coffre compatibles (Monoblocs) :
       TU DOIS compléter ta sélection avec le modèle Coffre Premium le plus adapté (ex: Belharra ou Dynasta).
     - JUSTIFICATION EXPERTE : Explique : "Pour une largeur de [Largeur]m, le choix sans coffre est techniquement limité. Je vous ai sélectionné les meilleurs monoblocs, mais j'ai ajouté notre modèle Coffre Premium pour que vous puissiez comparer la protection et la durabilité."

   • DÉCLENCHE IMMÉDIATEMENT l'outil \`open_model_selector\` avec :
     - \`models_to_display\`: La liste des 3 IDs des modèles choisis.
     - \`min_width\`: La largeur validée.
     - (Si mix types, n'utilise PAS \`filter_type\`).
   • Dis : "Voici les 3 modèles que je vous recommande pour votre configuration. Cliquez sur celui qui vous plaît."

5️⃣ ÉTAPE 5 : OPTIONS & FINITIONS (Fin de tunnel)
   • INTERDICTION FORMELLE de parler des couleurs ou options TANT QUE le client n'a pas validé son choix parmi les 3 modèles de l'étape 4.
   • Une fois le modèle choisi (retour outil), dis : "Excellent choix. Maintenant que nous avons le modèle, passons aux finitions (couleurs et options)."
   • Ensuite, valide les options UNE PAR UNE :
     1. COULEUR COFFRE :
        - Si inconnue : Demande la couleur et OUVRE \`open_color_selector\`.
        - Si connue (ex: "Je veux du 7016") : Valide la couleur et PASSE DIRECTEMENT à la toile (N'OUVRE PAS \`open_color_selector\`).
     2. TOILE :
        - Une fois la couleur coffre validée, demande la préférence toile et OUVRE \`open_fabric_selector\`.
     3. LED & Motorisation.

═══════════════════════════════════════════════════════════════
🛠️ GESTION DES OUTILS (DÉCLENCHEMENT DIFFÉRÉ)
═══════════════════════════════════════════════════════════════

⛔ NE DÉCLENCHE PAS \`open_model_selector\` AVANT L'ÉTAPE 4.
   - Le dialogue doit rester purement textuel jusqu'à la présentation de la triple offre.

✅ DÉCLENCHE \`open_model_selector\` SYSTÉMATIQUEMENT à l'ÉTAPE 4.
   - Ne liste pas les modèles par texte. Ouvre la fenêtre de sélection.
   - Passe \`models_to_display\` avec les IDs des 3 modèles choisis.
   - Passe \`min_width\` et \`min_projection\` pour filtrer techniquement.
   - Si tu mixes les types (Coffre + Monobloc), n'utilise pas \`filter_type\`.

⛔ NE DÉCLENCHE PAS \`open_color_selector\` (ou toiles) AVANT LE CHOIX DU MODÈLE (Fin Étape 4).
   - Les couleurs et toiles se choisissent uniquement sur un modèle validé.

⛔ NE DÉCLENCHE JAMAIS \`open_color_selector\` et \`open_fabric_selector\` EN MÊME TEMPS.
   - Une seule modale à la fois.

═══════════════════════════════════════════════════════════════
🗣️ TON ET VOCABULAIRE
═══════════════════════════════════════════════════════════════

• Sois l'Expert qui valide : "Ok, nous avons défini les dimensions : [L]x[A] m avec lambrequin. Vous êtes ok ?"
• Directif et rassurant.
• Pas de blabla inutile.

═══════════════════════════════════════════════════════════════
📊 CATALOGUE & RÈGLES TECHNIQUES
═══════════════════════════════════════════════════════════════

⚠️ RAPPEL TECHNIQUE 8 MÈTRES :
- Si Largeur > 6m : Modèles ÉCO (Kissimy, etc.) sont INCOMPATIBLES. Propose uniquement des modèles "Grande Largeur" (Dynasta, Belharra, Madrid, etc.).

${modelLimitsContext}
${modelCompatibilityContext}

RAPPEL :
- Largeur > Avancée = Standard.
- Largeur < Avancée = Bras Croisés (Solution technique spécifique).
`;

  // 4. Lancer la génération de réponse
  console.log('🔄 Préparation des messages pour OpenAI...');
  console.log('Messages reçus:', JSON.stringify(messages, null, 2));

  // Enrichir les tool results avec les données complètes des modèles/toiles
  const enrichedMessages = Array.isArray(messages)
    ? messages.map((msg: any) => {
        if (msg.role === 'assistant' && Array.isArray(msg.parts)) {
          const enrichedParts = msg.parts.map((part: any) => {
            // Enrichir open_model_selector results
            if (part.type === 'tool-open_model_selector' && part.output && typeof part.output === 'object') {
              if (part.output.id && !part.output.name) {
                const model = Object.values(STORE_MODELS).find((m) => m.id === part.output.id);
                if (model) {
                  console.log('🔄 Enriching model result:', part.output.id, '→', model.name);
                  return {
                    ...part,
                    output: {
                      id: model.id,
                      name: model.name,
                      type: model.type,
                      shape: model.shape,
                      description: model.description,
                    }
                  };
                }
              }
            }
            // Enrichir open_fabric_selector results
            if (part.type === 'tool-open_fabric_selector' && part.output && typeof part.output === 'object') {
              if (part.output.fabric_id) {
                const fabric = FABRIC_OPTIONS.find((f: any) => f.id === part.output.fabric_id);
                if (fabric) {
                  console.log('🔄 Enriching fabric result:', part.output.fabric_id, '→', fabric.name);
                  return {
                    ...part,
                    output: {
                      fabric_id: fabric.id,
                      name: fabric.name,
                      ref: fabric.ref,
                    }
                  };
                }
              }
            }
            return part;
          });
          return { ...msg, parts: enrichedParts };
        }
        return msg;
      })
    : messages;

  const normalizedMessages = Array.isArray(enrichedMessages)
    ? enrichedMessages.map((msg: any) => {
        if (typeof msg?.content === 'string') {
          return { role: msg.role, content: msg.content };
        }
        if (Array.isArray(msg?.content)) {
          const text = msg.content
            .filter((part: any) => part.type === 'text')
            .map((part: any) => part.text)
            .join('');
          return { role: msg.role, content: text };
        }
        if (Array.isArray(msg?.parts)) {
          const text = msg.parts
            .filter((part: any) => part.type === 'text')
            .map((part: any) => part.text)
            .join('');
          return { role: msg.role, content: text };
        }
        return { role: msg?.role ?? 'user', content: '' };
      })
    : [];

  console.log('✅ Messages normalisés:', JSON.stringify(normalizedMessages, null, 2));

  console.log('🤖 Appel OpenAI avec gpt-4o...');
  
  const result = streamText({
    model: openai('gpt-4o'),
    system: SYSTEM_PROMPT,
    messages: normalizedMessages,
    temperature: 0.7,
    maxTokens: 2000,
    toolChoice: 'auto', // Laisse l'IA décider selon le prompt strict
    tools: {
      open_color_selector: tool({
        description: "APPELLE CET OUTIL UNIQUEMENT à l'ÉTAPE 5 (Fin de tunnel) une fois que le modèle est choisi et validé. Ne l'appelle PAS avant.",
        inputSchema: jsonSchema({
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: "Catégorie de couleurs à afficher (ex: standard, all, reds).",
            },
          },
          required: [],
        }),
      }),
      open_model_selector: tool({
        description: "Ouvre le sélecteur de modèles. APPELLE CET OUTIL OBLIGATOIREMENT à l'ÉTAPE 4 pour afficher la triple offre.",
        inputSchema: jsonSchema({
          type: 'object',
          properties: {
            filter_type: {
              type: 'string',
              enum: ['coffre', 'monobloc', 'traditionnel', 'specialite'],
              description: "Profil commercial : 'coffre' pour design+protection, 'monobloc' pour robustesse+compacité, 'traditionnel' pour budget, 'specialite' pour configurations spéciales (bras croisés).",
            },
            min_width: {
              type: 'number',
              description: "Largeur minimale requise en mm (ex: 8000 pour 8m). Permet de masquer les modèles trop petits.",
            },
            min_projection: {
              type: 'number',
              description: "Avancée minimale requise en mm (ex: 4000 pour 4m).",
            },
            models_to_display: {
              type: 'array',
              items: { type: 'string' },
              description: "Liste des IDs des 3 modèles choisis à afficher (ex: ['kissimy', 'heliom', 'belharra']).",
            },
          },
          required: ['min_width'],
        }),
      }),
      open_fabric_selector: tool({
        description: "Ouvre le sélecteur de toiles. APPELLE CET OUTIL UNIQUEMENT à l'ÉTAPE 5 (Fin de tunnel) après le choix du modèle.",
        inputSchema: jsonSchema({
          type: 'object',
          properties: {
            usage: {
              type: 'string',
              enum: ['main_canvas', 'valance'],
              description: "Type de toile : 'main_canvas' pour la toile principale du store, 'valance' pour le lambrequin enroulable uniquement.",
            },
            recommendation: {
              type: 'string',
              enum: ['standard', 'max', 'soltis'],
              description: "Recommandation de gamme : 'standard' pour Orchestra (par défaut), 'max' pour imperméabilité/autonettoyant, 'soltis' pour lambrequin technique.",
            },
            pattern: {
              type: 'string',
              enum: ['uni', 'raye'],
              description: "Motif préféré : 'uni' pour couleur unie, 'raye' pour rayures.",
            },
          },
          required: ['usage'],
        }),
      }),
      open_lambrequin_fabric_selector: tool({
        description: "Ouvre le sélecteur de toiles techniques Soltis pour lambrequin. APPELLE CET OUTIL UNIQUEMENT à l'ÉTAPE 5 si un lambrequin enroulable est validé.",
        inputSchema: jsonSchema({
          type: 'object',
          properties: {
            context: {
              type: 'string',
              description: "Contexte optionnel : 'transparency' si le client veut garder la vue, 'thermal' s'il cherche la performance thermique.",
            },
          },
          required: [],
        }),
      }),
    },
  });

  // 5. Retourner le stream UI attendu par DefaultChatTransport
  console.log('📤 Envoi de la réponse streaming...');
  return result.toUIMessageStreamResponse({
    originalMessages: messages,
  });
  } catch (error) {
    console.error('❌ Erreur dans /api/chat:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}