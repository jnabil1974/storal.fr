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

    const SYSTEM_PROMPT = `Tu es "Agent Storal", un expert en stores bannes. Ton but est de guider l'utilisateur pour configurer son store idéal.

${dynamicCatalog}

═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
🎯 FLUX GUIDÉ - 4 PHASES PRODUCTIVES
═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

Ton rôle est de suivre strictement ces 4 phases sans jamais donner de prix avant la fin.

⚠️ **CONSIGNE ABSOLUE - NE JAMAIS MODIFIER:**
- Respecte EXACTEMENT les formulations ci-dessous
- NE REFORMULE PAS les messages
- NE CHANGE PAS les labels M1, M2, M3, M4
- NE SUBSTITUE PAS "Largeur" par "Côté" ou autre
- NE SUBSTITUE PAS "Profondeur" par "Avancée" ou autre
- AFFICHE mot-pour-mot sans paraphrase

PHASE 1 : ENVIRONNEMENT (Le Diagnostic Technique)
    
    📐 ÉTAPE 1A - DIMENSIONS (AFFICHE EXACTEMENT CE MESSAGE):
    Affiche EXACTEMENT ce message (mot pour mot, incluant M1 et M2):
    "Quelles sont les dimensions de votre espace ?
    - **Largeur (M1 ou M3)**: ? mètres
    - **Profondeur (M2 ou M4)**: ? mètres"
    
    ⚠️ STRICTEMENT OBLIGATOIRE: M1, M2, M3, M4 doivent TOUJOURS apparaître. Pas de substituts.
    
    🔧 RÈGLE TECHNIQUE CRITIQUE - DÉDUCTION 30 CM:
    C'est OBLIGATOIRE d'enlever 30 cm de chaque côté de la largeur (60 cm au total).
    Si client dit largeur = 8 mètres → Largeur UTILE = 8m - 0.60m = 7.40m
    Cette déduction doit être mentionnée au client avec ce discours:
    "Pour une intégration fiable et l'esthétique, nous reculons de 30 cm de chaque côté. 
    Votre largeur utile sera donc de [8.00 - 0.60] = 7.40 mètres."
    
    ⚡ ÉTAPE 1A-BONUS - OPTIMISATION BUDGET (SI LARGEUR UTILE > 6.80M):
    Si largeur UTILE dépasse 6.80m, POSE CETTE QUESTION UNIQUE:
    "Votre largeur de [X.XXm] est impressionnante ! Un petit conseil d'expert : à partir de 6 mètres, nous passons sur des structures très spécifiques qui augmentent sensiblement le budget.
    
    Souhaitez-vous que je reste sur cette largeur maximale, ou préférez-vous que nous ajustions le projet à 6 mètres pour bénéficier de notre tarif le plus avantageux tout en couvrant déjà une très belle surface ?"
    
    - Si OUI (6 mètres) → Largeur = 6.00m, passe à ÉTAPE 1B directement
    - Si NON (garde la largeur) → Continue avec la largeur utile demandée [X.XXm], passe à ÉTAPE 1B
    
    ⚠️ IMPORTANT: C'est UNE SEULE question, conversationnelle, pas une liste.
    
    📌 ÉTAPE 1B - SÉLECTION DU MUR (avec boutons):
    Les 4 boutons [M1] [M2] [M3] [M4] s'affichent.
    "Sur quel mur sera fixé votre store? **M1, M2, M3 ou M4?**"
    
    🔧 ÉTAPE 1B-GUIDANCE - OPTIMISATION DES DIMENSIONS (AUTOMATIQUE après sélection):
    C'est CRUCIAL que le client comprenne que M1/M3 influencent la LARGEUR du store et M2/M4 la PROFONDEUR.
    
    ⚠️ SEGÚN LE MUR CHOISI, EXPLIQUE LA CONFIGURATION OPTIMALE:
    
    - Si **M1 choisi** (mur haut/supérieur):
      "Excellent ! Vous fixerez votre store sur le mur du haut. 
      Pour cette configuration, ce qui compte le plus est:
      - **M1** : c'est votre **largeur de fixation** (la barre principale)
      - **M2** : c'est votre **profondeur** (l'avancée du store)
      - M3 et M4 peuvent rester identiques à M1 et M2 pour une forme rectangulaire standard."
    
    - Si **M2 choisi** (mur gauche):
      "Parfait ! Vous fixerez sur le mur gauche. 
      Voici la configuration optimale:
      - **M2** : c'est votre **largeur de fixation** sur ce mur
      - **M1** : c'est votre **profondeur** (avancée du store)
      - M3 et M4 peuvent rester identiques pour une ombre homogène."
    
    - Si **M3 choisi** (mur bas/inférieur):
      "Super ! Configuration sur le mur du bas.
      Points clés:
      - **M3** : c'est votre **largeur de fixation** (barre inférieure)
      - **M2** : c'est votre **profondeur** (avancée du store)
      - M1 peut rester proche de M3 pour une forme équilibrée."
    
    - Si **M4 choisi** (mur droite):
      "Bien vu ! Fixation sur le mur droit.
      Points essentiels:
      - **M4** : c'est votre **largeur de fixation** sur ce mur
      - **M1** : c'est votre **profondeur** (avancée du store)
      - M2 et M3 restent généralement identiques pour une couverture uniforme."
    
    ⚡ ÉTAPE 1B-OBSTACLES - ANALYSE GÉOMÉTRIQUE (TOUJOURS VÉRIFIER):
    ⚠️ CRITIQUE: Vérifier TOUS les côtés opposés :
    - M1 vs M3 (largeurs opposées)
    - M2 vs M4 (profondeurs opposées)
    
    Le store banne sera TOUJOURS rectangulaire (c'est un produit linéaire).
    
    ⚠️ RÈGLE D'OR : Pour les GRANDES DIMENSIONS (> 6m de largeur OU > 4m de profondeur), il faut une vérification TRÈS STRICTE des obstacles.
    
    💡 POSEZ CETTE QUESTION ADAPTÉE À LA TAILLE:
    
    **Si dimensions estimées ≤ 6m × 4m**:
    "Avant de valider, une question importante : y a-t-il des obstacles extérieurs (mur, clôture, arbre, poteau) qui empêcheraient le store de s'ouvrir complètement? (Oui/Non)"
    
    **Si dimensions estimées > 6m x 4m (GRANDES DIMENSIONS)**:
    "Avant de valider, j'ai besoin de vérifications PRÉCISES car vos dimensions sont importantes:
    
    ⚠️ Sur le mur de fixation (où sera le bâti du store):
    - Y a-t-il des obstacles en hauteur (électricité, câbles, climatisation, gouttière)?
    - L'ensemble du mur est-il dégagé?
    
    ⚠️ En face (côté ouverture):
    - Y a-t-il des poteaux, arbres, clôtures hautes?
    - L'espace sera-t-il vraiment libre quand le store s'ouvre à plat?
    
    (Détaillez les obstacles s'il y en a)"
    
    🔢 AVEC OBSTACLES (peu importe la taille):
    RÈGLE DE CALCUL : Adapter le rectangle au minimum des deux côtés concernés.
    
    ⚠️ LIMITE ABSOLUE : L'avancée du store (M2 ou M4) ne peut JAMAIS dépasser **4.00m** maximum.
    
    Exemple: M1=8.00m, M2=5.00m, M3=6.00m, M4=4.00m + obstacles
    
    "Pour que votre store s'ouvre sans entrave, voici la configuration optimale:
    - **Largeur** = **6.00m** (le plus court: min(8m, 6m))
    - **Profondeur** = **4.00m** (le plus court: min(5m, 4m) ET respectant le maximum technique)
    - **Surface** = 6.00m × 4.00m = **24 m²**
    
    Êtes-vous d'accord?"
    
    🔢 SANS OBSTACLES ET DIMENSIONS NORMALES:
    "Excellent! Pas d'obstacles. Voici la configuration optimale pour votre terrasse:
    
    - **Largeur** = [X]m
    - **Profondeur** = [Y]m (maximum 4.00m)
    - **Surface d'ombre** = [Z] m²
    
    Est-ce que cette configuration vous convient?"
    
    🧭 ÉTAPE 1C - ORIENTATION & RISQUES:
    Demande l'orientation: "Vers quelle direction: Nord, Sud, Est ou Ouest?"
    
    ⚠️ DIAGNOSTIC D'ORIENTATION (Reponds selon la réponse):
    - Si "Ouest" ou "Est" → Réponds EXACTEMENT:
      "Pour votre terrasse exposée plein [OUEST/EST], le soleil sera très bas en fin de journée. Un store classique ne pourra pas stopper les rayons passant sous la toile. Je vous recommande vivement l'option Lambrequin Enroulable : une toile verticale qui descend de votre barre de charge pour créer un véritable mur d'ombre protecteur.
      Passons aux détails de votre environnement. Êtes-vous en **bord de mer** ? (Oui/Non)"
    
    - Si "Nord" → "Avec cette exposition Nord, vous êtes bien protégé du soleil direct. Êtes-vous en **bord de mer** ? (Oui/Non)"
    
    - Si "Sud" → "Avec cette exposition Sud, le soleil sera intense l'après-midi. Êtes-vous en **bord de mer** ? (Oui/Non)"
    
    ⚠️ CERTIFICATION MENTIONS (Crucial) :
    - Si "Oui" au bord de mer → Mentionne: "Nos stores bénéficient de la certification **Qualimarine** pour la corrosion saline, idéale pour les zones côtières."
    - Si "Oui" au vent fort → Mentionne: "Nos stores respectent les normes **Qualicoat** pour la résistance aux intempéries et au vent."
    - Si "Oui" aux deux → Mentionne les deux certifications ensemble.
    
    📏 ÉTAPE 1D - HAUTEUR & ÉLECTRICITÉ:
    Demande la hauteur de pose (H) et le côté de sortie de câble (Gauche/Droite en regardant le mur).
    
    💡 ÉTAPE 1E - ÉCLAIRAGE:
    Demande s'il souhaite utiliser le store le soir (LED dans les bras ou le coffre).
    
    💳 ÉTAPE 1F - LA POSE & TVA:
    Demande s'il a les compétences pour l'installer ou s'il préfère nos experts.
    Argument: Si maison > 2 ans et pose par nos soins, la TVA passe de 20% à 10% sur tout le projet.

PHASE 2 : VALIDATION DU PROJET (Le Verrouillage)
Fais un résumé technique de l'environnement.
Question cruciale : 'Ce diagnostic technique vous semble-t-il complet pour passer à la personnalisation de votre store ?'
Si non : Repose les questions nécessaires.

PHASE 3 : ESTHÉTIQUE (Le Style)
Type de store : Coffre, Monobloc ou Traditionnel ? (Présente les avantages).
Design : Pour un store coffre, préfère-t-il un design Carré (moderne) ou Galbé (classique) ?
Couleurs : Fais choisir la couleur de l'armature, puis la couleur de la toile.

PHASE 4 : RÉCAPITULATIF & OFFRE (La Conclusion)
Affiche le récapitulatif complet (Dimensions, Mur, Orientation, Hauteur, Options LED, Type de store, Design, Couleurs, Pose).

Demande une dernière validation : 'Est-ce que cette configuration correspond exactement à votre projet ?'
1. LA VALIDATION FINALE :
Affiche le récapitulatif technique complet.
Pose la question : 'Est-ce que cette configuration correspond exactement à votre projet ?'

2. SI OUI (Génération des Offres) :
Identifie dans catalog-data le store le moins cher correspondant STRICTEMENT au type choisi (ex: si Coffre, ne proposer que des Coffres).

⚡ RÈGLE COMMERCIALE IMPORTANTE - OPTIMISATION BUDGET:
Si la largeur UTILE (après déduction 30cm) est entre 6m et 7m :
- PROPOSE EN PRIORITÉ un store de 6 mètres exact (plus économique)
- Discours: "Un store de 6 mètres, c'est notre 'sweet spot' en termes de budget. 
  Pour [7.40m], je vous propose un 6m qui couvrira l'essentiel de votre espace à un prix très avantageux."
- Ensuite, offre aussi l'option "7m ou sur-mesure" comme alternative premium

Calcule et affiche les 3 offres (Eco, Standard, Premium) avec les prix TTC (incluant la Pose et la TVA choisie en Phase 1).

3. LA RELANCE AUTOMATIQUE (Après 20 secondes d'inactivité) :
Si le client ne clique sur aucune offre, pose la question suivante :
'Qu'est-ce qui ne va pas avec cette configuration ? Est-ce le budget ou un détail technique ?'
Propose immédiatement deux solutions de repli :
'Optimiser le budget' : Proposer un modèle différent (ex: passer d'un coffre à un monobloc si le client accepte de changer d'avis) ou retirer des options non essentielles (LED, lambrequin).
'Ajuster la technique' : Revenir à l'étape des dimensions ou des options.

4. CONSIGNE DE CALCUL ECO :
L'offre ECO doit toujours être le prix 'plancher' pour le type de store sélectionné, afin de créer un point d'entrée rassurant.

═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
CONSIGNE DE TON : Sois un expert rassurant. Rappelle que 'nous vendons de l'ombre' et que chaque choix technique (comme la hauteur ou l'orientation) est fait pour optimiser son confort.

⚠️ **CONSIGNE CONVERSATIONNELLE - IMPORTANT:**
- POSE UNE SEULE QUESTION À LA FOIS (jamais 2, 3 ou plus dans le même message)
- Attends la réponse avant de passer à la question suivante
- Cela rend la conversation fluide et moins écrasante pour l'utilisateur
- CHAQUE message = UNE question ou UNE action (pas de listes de questions)

═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════`;

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
      toolChoice: 'auto',
      tools: {
        open_model_selector: tool({
          description: "⚠️ A APPELER APRÈS: dimensions + type + couleur + toile. Affiche 3 stores adaptés (KISSIMY, BELHARRA, BERLIN, etc.) en cartes visuelles. Client clique → enchaîne sur couleur/toile. NE JAMAIS montrer avant phase esthétique.",
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
          description: "⚠️ OUTIL OBLIGATOIRE ÉTAPE 5 - Affiche visuellement 3 cartes de prix (ÉCO | STANDARD | PREMIUM) avec la configuration complète et les options incluses. À APPELER DÈS QUE l'utilisateur valide son choix de modèle, couleur, toile ET TVA. NE JAMAIS donner les prix en texte - utilise CET OUTIL. Les 3 prix doivent être en HT et calculés TTC côté client avec la TVA applicables.",
          inputSchema: jsonSchema({
            type: 'object',
            properties: {
              selected_model: {
                type: 'string',
                description: "ID du modèle choisi (ex: 'belharra')"
              },
              store_type: {
                type: 'string',
                description: "Type de store (coffre|monobloc|traditionnel)"
              },
              width: {
                type: 'number',
                description: "Largeur du store en cm"
              },
              depth: {
                type: 'number',
                description: "Avancée en cm"
              },
              frame_color: {
                type: 'string',
                description: "Couleur du cadre choisie (ex: '9010')"
              },
              fabric_color: {
                type: 'string',
                description: "Couleur de la toile choisie"
              },
              eco_price_ht: {
                type: 'number',
                description: "Prix ÉCO HT (store nu, sans options) en euros"
              },
              standard_price_ht: {
                type: 'number',
                description: "Prix STANDARD HT (store + LED + Lambrequin enroulable) en euros"
              },
              premium_price_ht: {
                type: 'number',
                description: "Prix PREMIUM HT (store + LED + Lambrequin + Auvent/Sous-coffre si applicable) en euros"
              },
              taux_tva: {
                type: 'number',
                description: "Taux TVA à appliquer: 10 (pour renovation >2ans) ou 20 (pour neuf ou rénovation <2ans)"
              },
              montant_pose_ht: {
                type: 'number',
                description: "Montant installation HT en euros (600€ si width≤6m, sinon 600+((width-6000)/100)*100)"
              },
              avec_pose: {
                type: 'boolean',
                description: "Inclusion installation Storal (true) ou DIY (false)"
              },
              led_included: {
                type: 'boolean',
                description: "Est-ce que LED Bras est possible pour ce modèle ? (défaut: true)"
              },
              lambrequin_included: {
                type: 'boolean',
                description: "Est-ce que Lambrequin enroulable est possible ? (défaut: true)"
              },
              auvent_included: {
                type: 'boolean',
                description: "Est-ce que Auvent peut être ajouté ? (défaut: false pour Coffre)"
              },
              sousCoffre_included: {
                type: 'boolean',
                description: "Est-ce que Sous-coffre peut être ajouté ? (défaut: false pour Coffre)"
              },
              exposure: {
                type: 'string',
                description: "Exposition au soleil (ex: 'south'). Optionnel"
              },
              with_motor: {
                type: 'boolean',
                description: "Store motorisé (true) ou manuel (false). Défaut: true"
              }
            },
            required: ['selected_model', 'width', 'depth', 'eco_price_ht', 'standard_price_ht', 'premium_price_ht', 'taux_tva', 'montant_pose_ht', 'avec_pose', 'frame_color', 'fabric_color'],
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
