import { google } from '@ai-sdk/google';
import { jsonSchema, streamText, tool } from 'ai';
import { STORE_MODELS, FRAME_COLORS, FABRICS } from '@/lib/catalog-data';
import { getSafeModelsToDisplay, filterCompatibleModels, generateDynamicCatalog } from '@/lib/model-safety-check';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages || [];

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), { status: 400 });
    }

    // 🔄 GÉNÉRATION DYNAMIQUE du catalogue depuis catalog-data.ts
    const dynamicCatalog = generateDynamicCatalog();

    const SYSTEM_PROMPT = `Tu es "Agent Storal", un expert en stores bannes. Ton but est de guider l'utilisateur pour configurer son store idéal, lui présenter des options de prix, puis de l'inviter à valider sa commande.

${dynamicCatalog}

═══════════════════════════════════════════════════════════════
🎯 MÉTHODE DE VENTE SÉQUENTIELLE
═══════════════════════════════════════════════════════════════

**⚠️ GARDE-FOU CRITIQUE - VÉRIFICATION DE CONFORMITÉ**
- AVANT de proposer UN SEUL modèle, tu DOIS vérifier que ses limites le permettent.
- SI la largeur demandée dépasse le max_width d'un modèle → TU NE LE PROPOSES PAS.
- SI la profondeur demandée dépasse le max_projection d'un modèle → TU NE LE PROPOSES PAS.
- **FORMULATION OBLIGATOIRE si dimension hors limite:** "Nos fiches techniques indiquent une limite de [X cm] pour ce modèle, je ne peux donc pas vous le proposer pour votre sécurité."
- SI tous les modèles sont exclus, propose les plus proches et explique l'limitation.

**🔍 PROCESSUS DE VÉRIFICATION DÉTAILLÉ:**
1. L'utilisateur donne une largeur (ex: 7000cm = 7m)
2. Tu compares contre CHAQUE modèle du catalogue ci-dessus:
   - Pour chaque modèle: Largeur_demandée > max_width? → EXCLURE ✗ ou → VALIDE ✅
   - Pour chaque modèle: Avancée_demandée > max_projection? → EXCLURE ✗ ou → VALIDE ✅
3. Si AUCUN modèle ne passe → Répondre: "Nos modèles proposent une largeur maximale de [X mètres]. Je ne peux donc pas vous proposer un store de [Y mètres] pour votre sécurité. Accepteriez-vous une dimension inférieure?"
4. Si CERTAINS modèles passent → Proposer UNIQUEMENT ceux qui passent

**⚠️ FORCEUR D'OUTILS - APPELS OBLIGATOIRES**
- Dès que l'utilisateur mentionne ou qu'on passe à la personnalisation (couleur coffre, toile, moteurs), tu DOIS appeler l'outil correspondant DANS LE MÊME TOUR.
- Les appels d'outils ne sont PAS optionnels - ils sont OBLIGATOIRES.
- Si tu parles des couleurs, tu DOIS appeler \`open_color_selector\` immédiatement.
- Si tu parles de la toile, tu DOIS appeler \`open_fabric_selector\` immédiatement.

1️⃣ **ÉTAPE 1 : Configuration de Base**
   - Pose les questions une par une pour connaître le besoin, les dimensions, l'exposition et le type de store (coffre ou classique).
   - Note bien toutes ces informations (LARGEUR en particulier) car tu devras les transmettre aux outils pour filtrer les modèles compatibles.

2️⃣ **ÉTAPE 2 : Triple Offre Visuelle - ⚠️ APPEL D'OUTIL OBLIGATOIRE**
   - Dès que tu connais : dimensions + type de coffre (ou monobloc/traditionnel)
   - **AVANT d'appeler l'outil**, demande rapidement la préférence de couleur de cadre (blanc RAL9010 par défaut si non précisé)
   - Tu DOIS IMMÉDIATEMENT appeler l'outil \`open_model_selector\` avec TOUS les paramètres collectés
   - **NE DÉCRIS PAS les modèles en texte** - utilise UNIQUEMENT l'outil pour afficher les cartes visuelles
   - Exemple d'appel : open_model_selector({ 
       models_to_display: ["belharra", "Kissimy],
       width: 600,
       depth: 300, 
       frame_color: "white",
       exposure: "south"
     })

3️⃣ **ÉTAPE 3 : Présentation des Prix - ⚠️ APPEL D'OUTIL OBLIGATOIRE**
   - Dès que l'utilisateur a choisi son modèle (ou dit "oui", "d'accord", "je suis intéressé")
   - Tu DOIS IMMÉDIATEMENT appeler l'outil \`display_triple_offer\` avec **TOUS LES PARAMÈTRES COLLECTÉS**
   - **NE DONNE PAS les prix en texte** - utilise UNIQUEMENT l'outil pour afficher les 3 cartes de prix
   - Transmet TOUJOURS : width, depth, selected_model, frame_color, fabric_color, exposure, with_motor et les 3 prix

5️⃣ **ÉTAPE 5 : Sélection de la Couleur d'Armature - ⚠️ APPEL D'OUTIL OBLIGATOIRE**
   - Dès que l'utilisateur a choisi un modèle et vu les prix
   - Formule : "Excellent choix ! Pour l'armature, préférez-vous le Blanc RAL 9010 classique ou notre Anthracite Granité très moderne ? Je vous ouvre la palette des coloris de coffre."
   - Tu DOIS IMMÉDIATEMENT appeler l'outil \`open_color_selector\` pour afficher les pastilles de couleur
   - Transmet le modèle sélectionné (modelId ex: 'belharra') et dimensions pour contexte

6️⃣ **ÉTAPE 6 : Sélection de la Toile - ⚠️ APPEL D'OUTIL OBLIGATOIRE**
   - Dès que l'utilisateur a choisi sa couleur de coffre
   - Formule : "C'est noté pour l'[Couleur]. Pour la toile, voulez-vous rester sur un ton uni ou partir sur des motifs avec rayures ?"
   - Tu DOIS IMMÉDIATEMENT appeler l'outil \`open_fabric_selector\` pour afficher les options de toile
   - NE change pas de sujet - fais directement les appels d'outils

**RÈGLES ABSOLUES** : 
- Les mots "Devis", "numéro de téléphone" ou "PDF" sont interdits. Tu aides à configurer un produit dans un panier.
- Tu DOIS utiliser les outils - ne remplace JAMAIS un appel d'outil par du texte descriptif.
- Les appels d'outils sont obligatoires à chaque étape, pas optionnels.
- Respecte TOUJOURS les limites techniques des modèles. La sécurité produit est prioritaire.
`;

    // --- Robust Message Normalization Loop ---
    const normalizedMessages: any[] = [];
    for (const msg of messages) {
      // Filter out system and tool roles
      if (msg.role === 'system' || msg.role === 'tool') continue;

      let extractedContent = '';

      // Check for content property (can be string or array of parts)
      if (msg.content) {
          if (typeof msg.content === 'string') {
              extractedContent = msg.content;
          } else if (Array.isArray(msg.content)) {
              // If content is an array of parts, extract text
              extractedContent = msg.content
                  .filter((part: any) => part.type === 'text' && part.text)
                  .map((part: any) => part.text)
                  .join(' '); // Join with space for readability
          }
      } else if (msg.parts && Array.isArray(msg.parts)) {
          // If message has a 'parts' array (older AI SDK versions or specific formats)
          extractedContent = msg.parts
              .filter((part: any) => part.type === 'text' && part.text)
              .map((part: any) => part.text)
              .join(' ');
      }

      if (extractedContent) {
        // Keep 'user' or convert to 'assistant' (SDK handles conversion to 'model' for Gemini)
        const role = msg.role === 'user' ? 'user' : 'assistant';
        // Content must be an array for the SDK
        normalizedMessages.push({ 
          role: role, 
          content: [{ type: 'text', text: extractedContent }]
        });
      }
    }

    const result = await streamText({
      model: google('gemini-2.5-pro'),
      system: SYSTEM_PROMPT,
      messages: normalizedMessages as any,
      toolChoice: 'auto', // L'IA décide quand utiliser les outils
      tools: {
        open_model_selector: tool({
          description: "⚠️ OUTIL OBLIGATOIRE - Affiche visuellement 3 modèles de stores bannes sous forme de cartes avec leur configuration. À APPELER DÈS QUE tu connais les dimensions et le type de coffre souhaité. Transmet TOUTES les informations collectées. NE JAMAIS décrire les modèles en texte - utilise CET OUTIL.",
          inputSchema: jsonSchema({ 
            type: 'object', 
            properties: { 
              models_to_display: { 
                type: 'array', 
                items: { type: 'string' },
                description: "Array de 3 IDs de modèles compatibles (ex: ['belharra', 'kissimy'])"
              },
              width: {
                type: 'number',
                description: "Largeur du store en cm (ex: 500 pour 5m)"
              },
              depth: {
                type: 'number',
                description: "Avancée/profondeur du store en cm (ex: 300 pour 3m)"
              },
              frame_color: {
                type: 'string',
                description: "Couleur du cadre/structure (ex: 'white', 'anthracite', 'beige'). Défaut: 'white' si non précisé"
              },
              fabric_color: {
                type: 'string',
                description: "Couleur de la toile si mentionnée (ex: 'beige', 'grey', 'blue'). Optionnel"
              },
              exposure: {
                type: 'string',
                description: "Exposition au soleil (ex: 'south', 'north', 'east', 'west'). Optionnel"
              },
              with_motor: {
                type: 'boolean',
                description: "Store motorisé ou manuel. Défaut: true (motorisé)"
              }
            }, 
            required: ['models_to_display', 'width', 'depth'],
          }),
        }),
        display_triple_offer: tool({
          description: "⚠️ OUTIL OBLIGATOIRE - Affiche visuellement 3 cartes de prix (Standard/Confort/Premium) avec la configuration complète. À APPELER DÈS QUE l'utilisateur valide son choix de modèle. NE JAMAIS donner les prix en texte - utilise CET OUTIL.",
          inputSchema: jsonSchema({
            type: 'object',
            properties: {
              selected_model: {
                type: 'string',
                description: "ID du modèle choisi (ex: 'belharra')"
              },
              width: {
                type: 'number',
                description: "Largeur du store en cm"
              },
              depth: {
                type: 'number',
                description: "Avancée en cm"
              },
              standard: { type: 'number', description: 'Prix de base en euros (ex: 2500)' },
              confort: { type: 'number', description: 'Prix avec options de confort en euros (ex: 3200)' },
              premium: { type: 'number', description: 'Prix toutes options en euros (ex: 3900)' },
              frame_color: { type: 'string', description: "Couleur du cadre choisie" },
              fabric_color: { type: 'string', description: "Couleur de la toile si choisie" },
              exposure: { type: 'string', description: "Exposition au soleil (ex: 'south')" },
              with_motor: { type: 'boolean', description: "Store motorisé (true) ou manuel (false)" }
            },
            required: ['selected_model', 'width', 'depth', 'standard', 'confort', 'premium'],
          }),
        }),
        open_color_selector: tool({
          description: "⚠️ OUTIL OBLIGATOIRE - Affiche visuellement les pastilles de couleurs d'armature (RAL) disponibles. À APPELER DÈS QUE le modèle est choisi et qu'on passe aux personnalisations. NE JAMAIS décrire les couleurs en texte - utilise CET OUTIL.",
          inputSchema: jsonSchema({
            type: 'object',
            properties: {
              selected_model: { type: 'string', description: "ID du modèle sélectionné (ex: 'belharra')" },
              width: { type: 'number', description: "Largeur en cm" },
              depth: { type: 'number', description: "Avancée en cm" }
            },
            required: ['selected_model'],
          }),
        }),
        open_fabric_selector: tool({
          description: "⚠️ OUTIL OBLIGATOIRE - Affiche visuellement les options de toiles disponibles (uni, rayé, goldies). À APPELER DÈS QUE la couleur d'armature est choisie. NE JAMAIS décrire les toiles en texte - utilise CET OUTIL.",
          inputSchema: jsonSchema({
            type: 'object',
            properties: {
              selected_model: { type: 'string', description: "ID du modèle sélectionné" },
              frame_color: { type: 'string', description: "Couleur d'armature choisie (ex: '9010')" },
              width: { type: 'number', description: "Largeur en cm" },
              depth: { type: 'number', description: "Avancée en cm" }
            },
            required: ['selected_model'],
          }),
        }),
      },
    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error('❌ Erreur dans /api/chat:', error);
    return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
