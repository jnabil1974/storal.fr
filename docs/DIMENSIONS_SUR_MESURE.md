# Gestion des Dimensions Sur-Mesure (Hors Paliers)

## 📋 Résumé des Modifications

### Problème Initial
L'IA refusait les dimensions qui n'étaient pas exactement dans les paliers du catalogue. Par exemple, si un client demandait 3700mm et que le catalogue proposait 3500mm et 4000mm, la commande était rejetée.

### Solution Implémentée
Les stores bannes étant fabriqués sur-mesure, toute dimension intermédiaire est maintenant **acceptée automatiquement**. Le prix est calculé sur le **palier immédiatement supérieur**, et l'armature sera réglée en usine à la dimension exacte demandée.

---

## 🔧 Modifications Techniques

### 1. `/src/lib/catalog-data.ts` - Fonction `calculateFinalPrice`

**Changements:**
- Ajout d'une variable `usedProjection` pour gérer le palier effectivement utilisé
- Si la `projection` demandée n'existe pas dans `buyPrices`, l'algorithme cherche automatiquement le palier supérieur le plus proche
- La variable `usedProjection` est utilisée pour tous les calculs dépendant de la projection (prix de base, options LED, etc.)

**Code ajouté (lignes ~748-766):**
```typescript
// Gestion des dimensions sur-mesure
let usedProjection = config.projection;
let grid = model.buyPrices[config.projection];

if (!grid) {
  // La projection demandée n'existe pas, on cherche le palier supérieur
  const availableProjections = Object.keys(model.buyPrices).map(Number).sort((a, b) => a - b);
  const nextProjection = availableProjections.find(p => p > config.projection);
  
  if (!nextProjection) {
    // Aucun palier supérieur trouvé, projection trop grande
    return null;
  }
  
  usedProjection = nextProjection;
  grid = model.buyPrices[nextProjection];
}
```

**Ligne 784:** Utilisation de `usedProjection` au lieu de `config.projection` pour le calcul LED:
```typescript
const ledGrid = OPTIONS_PRICES.LED_ARMS[usedProjection];
```

---

### 2. `/src/app/api/chat/route.ts` - Prompt Système

**Changements:**
- Suppression de l'ancienne règle qui refusait les dimensions hors paliers
- Ajout d'une nouvelle section `📐 NOUVELLE RÈGLE COMMERCIALE - DIMENSIONS INTERMÉDIAIRES`
- Inclusion du discours commercial rassurant à utiliser par le chatbot

**Instructions ajoutées (lignes ~186-210):**
```
⚡ PROCÉDURE DE VALIDATION D'AVANCÉE (DIMENSIONS SUR-MESURE) :

📐 NOUVELLE RÈGLE COMMERCIALE - DIMENSIONS INTERMÉDIAIRES :
Les stores bannes sont fabriqués sur-mesure. Si le client demande une avancée qui n'est pas dans les paliers standards (ex: 3700mm alors que le catalogue propose 3500mm et 4000mm), C'EST TOUT À FAIT POSSIBLE.

✅ COMMENT GÉRER UNE DIMENSION HORS PALIER :
1. ACCEPTE la dimension demandée sans hésitation
2. Explique avec ce discours commercial rassurant :
   "C'est tout à fait possible. Pour une avancée personnalisée de [dimension exacte] mm, nous utiliserons une armature de [palier supérieur] mm que nous réglerons précisément en usine à votre dimension exacte. Le tarif appliqué sera celui du palier [palier supérieur] mm."
3. Le système calculera automatiquement le prix basé sur le palier immédiatement supérieur

⚠️ SEULES LIMITES À RESPECTER :
- La dimension demandée doit être ≤ max_projection du modèle (limite physique absolue)
- La dimension demandée doit être ≥ projection minimale disponible
- Entre ces deux limites, TOUTE dimension est acceptable
```

---

## ✅ Tests de Validation

### Résultats des Tests Unitaires

Tous les tests passent avec succès:

```
✅ TEST 1: Dimension exacte 3000mm
   → Prix: 4473€ HT (fonctionne normalement)

✅ TEST 2: Dimension intermédiaire 2800mm (→ palier 3000mm)
   → Prix: 4473€ HT (identique au palier 3000mm)

✅ TEST 3: Dimension intermédiaire 3100mm (→ palier 3250mm)
   → Prix: 4522€ HT (identique au palier 3250mm)

✅ TEST 4: Dimension trop grande 5000mm
   → Prix: NULL (correct, aucun palier supérieur disponible)

✅ TEST 5: Dimension 2800mm + LED Bras
   → Prix: 5494€ HT (identique au palier 3000mm + LED)
   → Les options sont calculées avec le bon palier
```

---

## 📝 Exemples d'Utilisation

### Scénario 1: Client demande 2800mm
- **Avant:** "Cette dimension n'est pas disponible. Choisissez 2500mm ou 3000mm."
- **Après:** "C'est tout à fait possible. Pour une avancée personnalisée de 2800 mm, nous utiliserons une armature de 3000 mm que nous réglerons précisément en usine à votre dimension exacte. Le tarif appliqué sera celui du palier 3000 mm."

### Scénario 2: Client demande 3700mm (pour Dynasta qui va jusqu'à 4000mm)
- **Avant:** Refus
- **Après:** "Parfait ! Pour 3700mm, nous utiliserons une armature 4000mm ajustée précisément. Prix basé sur le palier 4000mm."

### Scénario 3: Client demande 2150mm
- **Avant:** Refus
- **Après:** "Aucun problème ! Pour 2150mm, armature 2500mm réglée sur mesure. Prix du palier 2500mm."

---

## 🎯 Avantages Commerciaux

1. **Expérience client améliorée**: Plus de frustration liée aux dimensions standards
2. **Flexibilité maximale**: Acceptation de toute dimension dans les limites physiques du modèle
3. **Discours rassurant**: Le client comprend qu'il aura sa dimension exacte
4. **Tarification transparente**: Le client sait que le prix est basé sur le palier supérieur
5. **Cohérence technique**: L'armature utilisée correspond effectivement au palier supérieur

---

## 🔍 Fichiers de Test

- **`test-pricing-logic.ts`**: Tests unitaires automatisés
- **`test-dimension-intermediaires.mjs`**: Guide de test pour validation manuelle dans le chatbot

### Exécuter les tests:
```bash
npx tsx test-pricing-logic.ts
```

---

## 📅 Date de Mise en Production
**10 février 2026**

## 👤 Modification par
Expert technique Storal (via GitHub Copilot)
