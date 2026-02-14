# 🔄 Proposition : Fusion du Showroom avec la colonne centrale

## 📊 Situation actuelle

**Structure :**
```
┌────────────────────────────────────┬─────────────────────┬─────────────────┐
│   Chat (25%)                       │   Visuel (45%)      │  Prix (30%)     │
│                                    │                     │                 │
│   [ChatAssistant Component]        │   Image produit     │  Offres         │
│   ├─ Chat (messages)               │   Fiche tech        │  Actions        │
│   └─ Showroom (50% interne)        │   Options           │                 │
│                                    │   Détail prix       │                 │
└────────────────────────────────────┴─────────────────────┴─────────────────┘
```

**Problème identifié :**
- ❌ Le showroom est caché dans ChatAssistant (50% de la colonne chat)
- ❌ Duplication : showroom dans chat + visuel dans colonne centrale
- ❌ Espace gaspillé : chat + showroom = 25% de l'écran total
- ❌ Le showroom n'est pas visible sur petits écrans (hidden lg:flex)

## ✨ Solution proposée

### Architecture cible :

```
┌────────────┬─────────────────────────────────┬─────────────────┐
│   Chat     │   Showroom Interactif (45%)     │  Prix (30%)     │
│   (25%)    │                                 │                 │
│            │   🎨 Sélecteurs visuels         │  Offres         │
│   Messages │   - Modèles (si tool actif)     │  Actions        │
│   Input    │   - Couleurs (si tool actif)    │                 │
│            │   - Toiles (si tool actif)      │                 │
│            │   - Offres (si tool actif)      │                 │
│            │                                 │                 │
│            │   📋 Fiche technique            │                 │
│            │   - Dimensions                  │                 │
│            │   - Options                     │                 │
│            │   - Détail prix                 │                 │
└────────────┴─────────────────────────────────┴─────────────────┘
```

## 🔌 Maintien des connexions Chat ↔ Showroom

### States partagés nécessaires :

```typescript
// États à remonter depuis ChatAssistant vers page.tsx
interface SharedChatState {
  // Tool actif
  activeTool: CustomToolCall | null;
  
  // Sélections actuelles
  selectedColorId: string | null;
  selectedFabricId: string | null;
  selectedModelId: string | null;
  
  // Dimensions proposées
  proposedStoreWidth?: number;
  proposedStoreHeight?: number;
  
  // Offres calculées
  ecoCalc?: any;
  standardCalc?: any;
  premiumCalc?: any;
  avec_pose?: boolean;
  
  // Statut conversation
  hasStartedConversation: boolean;
  showVideoHint?: boolean;
  
  // Callbacks pour les actions
  onSelectColor: (colorId: string, colorName: string) => void;
  onSelectFabric: (fabricId: string, fabricName: string) => void;
  onSelectModel: (modelId: string, modelName: string) => void;
  onSelectEco: (priceHT: number) => void;
  onSelectStandard: (priceHT: number) => void;
  onSelectPremium: (priceHT: number) => void;
  onTerraceChange: (dims: TerraceState) => void;
}
```

## 🛠️ Plan d'implémentation

### Étape 1 : Refactorisation de ChatAssistant

**But :** Exposer les états nécessaires sans casser le fonctionnement

**Fichier :** `src/components/ChatAssistant.tsx`

```typescript
// ❌ AVANT (showroom intégré)
export default function ChatAssistant({ modelToConfig, cart, setCart }) {
  // ... states internes
  
  return (
    <div className="flex h-full">
      <div className="flex-1">{/* Chat */}</div>
      <div className="w-1/2"><VisualShowroom {...props} /></div>
    </div>
  );
}

// ✅ APRÈS (showroom externe)
export default function ChatAssistant({ 
  modelToConfig, 
  cart, 
  setCart,
  onShowroomStateChange // Nouveau callback pour exposer les états
}) {
  // ... states internes
  
  // Exposer les états via callback
  useEffect(() => {
    if (onShowroomStateChange) {
      onShowroomStateChange({
        activeTool,
        selectedColorId,
        selectedFabricId,
        selectedModelId,
        proposedStoreWidth,
        proposedStoreHeight,
        ecoCalc,
        standardCalc,
        premiumCalc,
        avec_pose,
        hasStartedConversation,
        showVideoHint,
        // Callbacks
        onSelectColor: handleSelectColor,
        onSelectFabric: handleSelectFabric,
        onSelectModel: handleSelectModel,
        onSelectEco: handleSelectEco,
        onSelectStandard: handleSelectStandard,
        onSelectPremium: handleSelectPremium,
        onTerraceChange: handleTerraceChange,
      });
    }
  }, [activeTool, selectedColorId, /* ... autres deps */]);
  
  return (
    <div className="flex-1 flex flex-col">
      {/* Seulement le chat, sans le showroom */}
    </div>
  );
}
```

### Étape 2 : Modification de page.tsx

**Fichier :** `src/app/page.tsx`

```typescript
export default function HomePage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [showroomState, setShowroomState] = useState<SharedChatState | null>(null);

  return (
    <div className="flex h-screen">
      {/* COLONNE 1 : Chat (25%) */}
      <div className="w-1/4">
        <ChatAssistant
          cart={cart}
          setCart={setCart}
          onShowroomStateChange={setShowroomState}
        />
      </div>

      {/* COLONNE 2 : Showroom + Détails (45%) */}
      <div className="w-[45%]">
        {showroomState && (
          <VisualShowroom
            activeTool={showroomState.activeTool}
            onSelectColor={showroomState.onSelectColor}
            onSelectFabric={showroomState.onSelectFabric}
            onSelectModel={showroomState.onSelectModel}
            onSelectEco={showroomState.onSelectEco}
            onSelectStandard={showroomState.onSelectStandard}
            onSelectPremium={showroomState.onSelectPremium}
            onTerraceChange={showroomState.onTerraceChange}
            selectedColorId={showroomState.selectedColorId}
            selectedFabricId={showroomState.selectedFabricId}
            selectedModelId={showroomState.selectedModelId}
            proposedStoreWidth={showroomState.proposedStoreWidth}
            proposedStoreHeight={showroomState.proposedStoreHeight}
            ecoCalc={showroomState.ecoCalc}
            standardCalc={showroomState.standardCalc}
            premiumCalc={showroomState.premiumCalc}
            avec_pose={showroomState.avec_pose}
            hasStartedConversation={showroomState.hasStartedConversation}
            showVideoHint={showroomState.showVideoHint}
          />
        )}
        
        {/* Fiche technique, options, détail prix */}
      </div>

      {/* COLONNE 3 : Prix & Actions (30%) */}
      <div className="w-[30%]">
        {/* Offres et boutons */}
      </div>
    </div>
  );
}
```

## ✅ Avantages de cette approche

1. **Connexions préservées** : Tous les callbacks et états restent connectés
2. **Séparation claire** : Chat dans sa colonne, showroom dans la sienne
3. **Pas de duplication** : Un seul VisualShowroom
4. **Plus d'espace** : Showroom passe de ~12.5% (25% * 50%) à 45%
5. **Responsive** : Plus facile à adapter sur mobile
6. **Maintenable** : Logic du chat reste dans ChatAssistant

## ⚠️ Alternative : Context API

Si le prop drilling devient trop complexe, on peut utiliser un Context :

```typescript
// src/contexts/ShowroomContext.tsx
const ShowroomContext = createContext<SharedChatState | null>(null);

export function ShowroomProvider({ children }) {
  const [state, setState] = useState<SharedChatState | null>(null);
  
  return (
    <ShowroomContext.Provider value={{ state, setState }}>
      {children}
    </ShowroomContext.Provider>
  );
}

// Dans ChatAssistant
const { setState } = useContext(ShowroomContext);
useEffect(() => {
  setState({ activeTool, selectedColorId, ... });
}, [...deps]);

// Dans page.tsx
const { state } = useContext(ShowroomContext);
```

## 🚀 Prochaines étapes

**Option A - Implémentation complète :**
```bash
1. ✅ Je crée ChatAssistant-refactored.tsx (nouvelle version)
2. ✅ Je crée page-with-showroom.tsx (nouvelle version)
3. ✅ Vous testez en échangeant les fichiers
4. ✅ On valide et on remplace
```

**Option B - Implémentation progressive :**
```bash
1. ✅ Je crée ShowroomContext pour simplifier
2. ✅ Je modifie ChatAssistant pour utiliser le context
3. ✅ Je modifie page.tsx pour afficher le showroom
4. ✅ Tests progressifs
```

**Quelle approche préférez-vous ?**
- Option A = Tout en une fois, fichiers de test séparés ✅ SÛRE
- Option B = Progressive, modifications in-place ⚠️ Plus risqué
