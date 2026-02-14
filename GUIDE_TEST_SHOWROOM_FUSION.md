# 🧪 GUIDE DE TEST - Fusion du Showroom

## 📦 Fichiers créés

### Nouveaux fichiers (ne remplacent rien) :

1. **`src/contexts/ShowroomContext.tsx`** ✅
   - Context React pour partager l'état du showroom
   - Utilisé par ChatAssistant pour exposer ses états
   - Utilisé par page.tsx pour afficher le showroom

2. **`src/app/page-with-showroom-fusion.tsx`** ✅
   - Version test de la page d'accueil
   - Affiche le showroom dans la colonne centrale (45%)
   - Chat compact à gauche (25%)
   - Prix à droite (30%)

## 🔧 Modification nécessaire : ChatAssistant

Pour que cela fonctionne, il faut ajouter UNE SEULE ligne au début de `ChatAssistant` et UN SEUL `useEffect` :

### Étape 1 : Ajouter l'import dans ChatAssistant.tsx

**Fichier:** `src/components/ChatAssistant.tsx`

**Ligne 8** (après les autres imports) :
```typescript
import { useShowroom } from '@/contexts/ShowroomContext';
```

### Étape 2 : Ajouter le hook dans le composant

**Après la ligne 98** (dans `export default function ChatAssistant`) :

```typescript
export default function ChatAssistant({ modelToConfig, cart, setCart }: ChatAssistantProps) {
  const [input, setInput] = useState('');
  const { setShowroomState } = useShowroom(); // ← AJOUTER CETTE LIGNE
  
  // ... le reste du code reste identique
```

### Étape 3 : Ajouter le useEffect pour exposer les états

**Trouver la ligne ~220** (après tous les autres `useEffect`) et ajouter :

```typescript
// 🔌 Exposer les états au ShowroomContext pour affichage externe
useEffect(() => {
  setShowroomState({
    activeTool,
    selectedColorId,
    selectedFabricId,
    selectedModelId,
    proposedStoreWidth,
    proposedStoreHeight,
    hasStartedConversation: messages.length > 0,
    showVideoHint,
    ecoCalc: activeTool?.toolName === 'display_triple_offer' ? calculateEcoOffer(activeTool.input) : undefined,
    standardCalc: activeTool?.toolName === 'display_triple_offer' ? calculateStandardOffer(activeTool.input) : undefined,
    premiumCalc: activeTool?.toolName === 'display_triple_offer' ? calculatePremiumOffer(activeTool.input) : undefined,
    avec_pose: activeTool?.toolName === 'display_triple_offer' ? (activeTool.input as any)?.avec_pose : false,
    // Callbacks
    onSelectColor: (colorId, colorName) => {
      setSelectedColorId(colorId);
      saveToCart({ colorId });
      if (activeTool?.toolName === 'open_color_selector') {
        addToolResult({ toolCallId: activeTool.toolCallId, result: { frame_color_id: colorId, frame_color_name: colorName, validated: true } });
        sendMessage({ text: `J'ai choisi l'armature ${colorName}` });
      }
    },
    onSelectFabric: (fabricId, fabricName) => {
      setSelectedFabricId(fabricId);
      saveToCart({ fabricId });
      if (activeTool?.toolName === 'open_fabric_selector') {
        addToolResult({ toolCallId: activeTool.toolCallId, result: { fabric_id: fabricId, fabric_name: fabricName, validated: true } });
        sendMessage({ text: `J'ai choisi la toile ${fabricName}` });
      }
    },
    onSelectModel: (modelId, modelName) => {
      setSelectedModelId(modelId);
      saveToCart({ modelId, modelName, priceEco: undefined, priceStandard: undefined, pricePremium: undefined, selectedPrice: undefined, priceType: undefined, storeHT: undefined, ledArmsPrice: undefined, ledBoxPrice: undefined, lambrequinPrice: undefined, poseHT: undefined, tvaAmount: undefined });
      if (activeTool?.toolName === 'open_model_selector') {
        addToolResult({ toolCallId: activeTool.toolCallId, result: { model_id: modelId, model_name: modelName, validated: true } });
        sendMessage({ text: `Je veux configurer le ${modelName}` });
      }
    },
    onSelectEco: (priceHT) => {
      saveToCart({ priceEco: priceHT, selectedPrice: priceHT, priceType: 'eco' });
      if (activeTool?.toolName === 'display_triple_offer') {
        addToolResult({ toolCallId: activeTool.toolCallId, result: { offer_selected: 'eco', price_ttc: priceHT, validated: true } });
        sendMessage({ text: `Je sélectionne l'offre Eco à ${priceHT}€ TTC` });
      }
    },
    onSelectStandard: (priceHT) => {
      saveToCart({ priceStandard: priceHT, selectedPrice: priceHT, priceType: 'standard' });
      if (activeTool?.toolName === 'display_triple_offer') {
        addToolResult({ toolCallId: activeTool.toolCallId, result: { offer_selected: 'standard', price_ttc: priceHT, validated: true } });
        sendMessage({ text: `Je sélectionne l'offre Standard à ${priceHT}€ TTC` });
      }
    },
    onSelectPremium: (priceHT) => {
      saveToCart({ pricePremium: priceHT, selectedPrice: priceHT, priceType: 'premium' });
      if (activeTool?.toolName === 'display_triple_offer') {
        addToolResult({ toolCallId: activeTool.toolCallId, result: { offer_selected: 'premium', price_ttc: priceHT, validated: true } });
        sendMessage({ text: `Je sélectionne l'offre Premium à ${priceHT}€ TTC` });
      }
    },
    onTerraceChange: handleTerraceChange,
  });
}, [
  activeTool,
  selectedColorId,
  selectedFabricId,
  selectedModelId,
  proposedStoreWidth,
  proposedStoreHeight,
  messages.length,
  showVideoHint,
]);
```

### Étape 4 : Retirer l'affichage du showroom dans ChatAssistant

**Trouver la ligne ~997** (section de rendu) :

**AVANT :**
```tsx
return (
  <div className="flex h-full w-full">
    {/* Chat */}
    <div className="flex-1 flex flex-col">
      {/* ... messages ... */}
    </div>
    
    {/* 🔴 COLONNE DROITE (50%) - VISUAL SHOWROOM */}
    <div className="hidden lg:flex w-1/2 ...">
      <VisualShowroom ... />
    </div>
  </div>
);
```

**APRÈS :**
```tsx
return (
  <div className="flex-1 flex flex-col h-full">
    {/* ... messages ... */}
    {/* Showroom retiré - sera affiché dans la colonne centrale de page.tsx */}
  </div>
);
```

## 🚀 Comment tester

### Méthode rapide :

```bash
cd /Users/nabiljlaiel/Documents/PROJETS/Storal

# 1. Sauvegarder l'actuel
cp src/app/page.tsx src/app/page-backup.tsx

# 2. Activer la version test
mv src/app/page-with-showroom-fusion.tsx src/app/page.tsx

# 3. Modifier ChatAssistant.tsx (voir étapes ci-dessus)

# 4. Tester sur http://localhost:3000
```

### ✅ Ce que vous devriez voir :

```
┌────────────┬─────────────────────────────────┬─────────────────┐
│   Chat     │   Showroom Interactif           │  Prix & Actions │
│  (25%)     │        (45%)                    │     (30%)       │
│            │                                 │                 │
│ Messages   │ 🎨 Sélecteurs (si tool actif)  │ 💰 Offres      │
│ Input      │ 📋 Fiche technique              │ 🛒 Panier      │
│            │ ⚙️ Options                      │                 │
│            │ 📊 Détail prix                  │                 │
└────────────┴─────────────────────────────────┴─────────────────┘
```

### 🔍 Points de vérification :

- ✅ Le chat fonctionne toujours normalement
- ✅ Quand l'assistant propose des modèles → ils apparaissent dans la colonne centrale
- ✅ Quand l'assistant propose des couleurs → elles apparaissent dans la colonne centrale
- ✅ Quand l'assistant propose des toiles → elles apparaissent dans la colonne centrale
- ✅ Quand vous cliquez sur un choix → le chat reçoit la réponse
- ✅ La fiche technique se remplit au fur et à mesure
- ✅ Les options et le détail du prix sont visibles en bas de la colonne centrale
- ✅ Les 3 offres restent dans la colonne de droite

## 🔙 Revenir en arrière

```bash
# Restaurer l'ancien layout
mv src/app/page.tsx src/app/page-with-showroom-fusion.tsx
mv src/app/page-backup.tsx src/app/page.tsx

# Annuler les modifications dans ChatAssistant.tsx
# (Retirer le useShowroom et le useEffect ajoutés)
```

## 📊 Avantages de cette approche

1. **Minimal invasif** : Seulement 3 lignes ajoutées à ChatAssistant
2. **Pas de duplication** : Un seul VisualShowroom
3. **Connexions préservées** : Tous les callbacks fonctionnent
4. **Facile à tester** : Fichiers séparés, retour en arrière simple
5. **Plus d'espace** : Showroom passe de 12.5% à 45% de l'écran

## 🐛 En cas de problème

### Erreur : "useShowroom must be used within ShowroomProvider"

**Cause :** Le Context n'est pas wrappé correctement

**Solution :** Vérifier que `page.tsx` exporte bien :
```tsx
export default function HomePage() {
  return (
    <ShowroomProvider>
      <HomePageContent />
    </ShowroomProvider>
  );
}
```

### Le showroom n'apparaît pas

**Cause :** Les états ne sont pas partagés

**Solution :** Vérifier que le `useEffect` dans ChatAssistant appelle bien `setShowroomState(...)`.

### Les clics ne fonctionnent pas

**Cause :** Les callbacks ne sont pas correctement transmis

**Solution :** Vérifier que `onSelectColor`, `onSelectFabric`, etc. sont bien définis dans le `useEffect`.

---

**Prêt à tester ? Suivez les étapes ci-dessus !** 🚀
