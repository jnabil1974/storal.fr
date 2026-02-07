# Intégration des Toiles dans le Configurateur

## ✅ Ce qui a été fait

### 1. Nouvelles APIs REST

**`/src/app/api/toiles/route.ts`**
- Récupère les types de toiles compatibles avec un produit
- Paramètre: `productSlug` (ex: "belharra", "kalyo")
- Filtre automatiquement par `compatible_categories`
- Retourne: id, name, manufacturer, purchasePriceHT, salesCoefficient, salePriceHT

**`/src/app/api/toiles/colors/route.ts`**
- Récupère les couleurs de toile disponibles pour un type
- Paramètres: `toileTypeId` (requis), `colorFamily` (optionnel), `search` (optionnel)
- JOIN avec toile_types pour données enrichies
- Retourne: ref, name, collection, colorFamily, imageUrl, colorHex, stockStatus

### 2. Nouveau Composant ToileSelector

**`/src/components/ToileSelector.tsx`**

Composant React réutilisable avec:
- **Sélection de type**: Boutons avec prix au m²
- **Filtres avancés**: 
  - Barre de recherche (ref ou nom)
  - 13 familles de couleurs (Blanc, Noir, Gris, Bleu, etc.)
- **Grille visuelle**: Affichage des toiles avec images
- **États visuels**: 
  - Sélection avec checkmark
  - Hover avec infos détaillées
  - Badge de stock (rupture, sur commande)
- **Calcul automatique**: Prix toile = prix/m² × surface
- **Résumé de sélection**: Aperçu de la toile choisie

### 3. Intégration dans StoreBanneConfigurator

**`/src/components/StoreBanneConfigurator.tsx`**

Modifications:
- Import du composant `ToileSelector`
- Suppression de l'ancien système (toileId, toileColors, selectedToileColorId)
- Nouveaux états:
  - `toileTypeId`: ID du type de toile sélectionné
  - `toileColorId`: ID de la couleur sélectionnée
  - `toilePriceHT`: Prix calculé de la toile
- Variable `surfaceM2`: (avancee × largeur) / 1000000
- Callback `onToileSelect`: Met à jour les états quand sélection change
- Calcul prix total: prixBase + toilePriceHT
- Mise à jour du résumé sidebar avec prix toile séparé

## 📊 Flux de données

```
1. User ouvre configurateur
   └─> ToileSelector charge types via /api/toiles?productSlug=belharra

2. User sélectionne type "Dickson Orchestra"
   └─> ToileSelector charge couleurs via /api/toiles/colors?toileTypeId=1

3. User filtre par "Bleu"
   └─> ToileSelector recharge via /api/toiles/colors?toileTypeId=1&colorFamily=Bleu

4. User clique sur couleur
   └─> ToileSelector calcule prix: 51.30€/m² × 5.7m² = 292.41€
   └─> Callback onToileSelect(1, 42, 292.41)
   └─> StoreBanneConfigurator met à jour: toileTypeId=1, toileColorId=42, toilePriceHT=292.41

5. User modifie dimensions
   └─> surfaceM2 recalculé automatiquement
   └─> ToileSelector recalcule prix
   └─> Callback onToileSelect mis à jour

6. Calcul prix final
   └─> API /api/calcul-prix retourne prixBase
   └─> StoreBanneConfigurator: prixTotal = prixBase + toilePriceHT
```

## 🎯 Utilisation

### Exemple simple

```tsx
import ToileSelector from '@/components/ToileSelector';

function MyConfigurator() {
  const [toileTypeId, setToileTypeId] = useState<number | null>(null);
  const [toileColorId, setToileColorId] = useState<number | null>(null);
  const [toilePriceHT, setToilePriceHT] = useState<number>(0);
  
  const surfaceM2 = (largeur * avancee) / 1000000;

  return (
    <ToileSelector
      productSlug="belharra"
      surfaceM2={surfaceM2}
      onToileSelect={(typeId, colorId, priceHT) => {
        setToileTypeId(typeId);
        setToileColorId(colorId);
        setToilePriceHT(priceHT);
      }}
      selectedToileTypeId={toileTypeId}
      selectedToileColorId={toileColorId}
    />
  );
}
```

### Props du composant

| Prop | Type | Description |
|------|------|-------------|
| `productSlug` | string | Slug du produit (ex: "belharra") |
| `surfaceM2` | number | Surface en m² pour calcul prix |
| `onToileSelect` | function | Callback (typeId, colorId, priceHT) => void |
| `selectedToileTypeId` | number\|null | ID type sélectionné (optionnel) |
| `selectedToileColorId` | number\|null | ID couleur sélectionnée (optionnel) |

## 🔍 Filtres disponibles

### Famille de couleur
- Toutes
- Blanc, Noir, Gris
- Bleu, Vert, Rouge, Rose
- Orange, Jaune, Violet
- Marron, Beige, Neutre

### Recherche
- Par référence (ex: "0001", "D549")
- Par nom (ex: "Bleu ciel", "Orchestra")

## 💾 Structure des données

### ToileType (retourné par /api/toiles)
```typescript
{
  id: number;
  name: string;              // "Dickson Orchestra"
  manufacturer: string;      // "DICKSON"
  code: string;              // "ORCH"
  purchasePriceHT: number;   // 28.50
  salesCoefficient: number;  // 1.80
  salePriceHT: string;       // "51.30" (28.50 × 1.80)
  composition?: string;      // "100% acrylique teint masse"
  description?: string;
  defaultWidth?: number;     // 1200
}
```

### ToileColor (retourné par /api/toiles/colors)
```typescript
{
  id: number;
  ref: string;               // "0001"
  name: string;              // "Blanc ivoire"
  collection?: string;       // "Orchestra Uni"
  category?: string;         // "Uni"
  colorFamily?: string;      // "Blanc"
  imageUrl?: string;         // "/images/toiles/DICKSON/..."
  thumbnailUrl?: string;
  colorHex?: string;         // "#F5F5DC"
  colorRgb?: {r, g, b};
  stockStatus?: string;      // "in_stock" | "out_of_stock" | "on_order"
  tags?: string[];
  description?: string;
  toileType: {
    id: number;
    name: string;
    manufacturer: string;
    code: string;
  };
}
```

## 🚀 Comment tester

1. **Démarrer le serveur**
   ```bash
   cd /Applications/MAMP/htdocs/store_menuiserie
   npm run dev
   ```

2. **Ouvrir un configurateur**
   - BELHARRA: http://localhost:3000/products/store-banne/belharra
   - KALYO: http://localhost:3000/products/store-banne/kalyo
   - DYNASTA: http://localhost:3000/products/store-banne/dynasta
   - HELIOM: http://localhost:3000/products/store-banne/heliom

3. **Tester les fonctionnalités**
   - ✅ Types de toiles s'affichent (max 3)
   - ✅ Couleurs chargées au clic sur type
   - ✅ Filtres par famille fonctionnent
   - ✅ Recherche fonctionne
   - ✅ Sélection visuelle avec checkmark
   - ✅ Prix calculé automatiquement
   - ✅ Résumé affiché en bas
   - ✅ Prix total inclut la toile

## 🐛 Dépannage

### Erreur: "Impossible de charger les toiles"
- Vérifier que le serveur Next.js tourne
- Vérifier les variables d'environnement:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Vérifier que les tables existent dans Supabase:
  - `toile_types`
  - `toile_colors`

### Aucune toile ne s'affiche
- Vérifier le slug du produit (BELHARRA, KALYO, etc.)
- Vérifier la colonne `compatible_categories` dans `toile_types`:
  ```sql
  SELECT name, compatible_categories 
  FROM toile_types 
  WHERE is_active = true;
  ```
- Vérifier qu'il y a au moins un type compatible:
  ```sql
  SELECT * 
  FROM toile_types 
  WHERE 'BELHARRA' = ANY(compatible_categories);
  ```

### Aucune couleur ne s'affiche
- Vérifier qu'il y a des couleurs pour ce type:
  ```sql
  SELECT COUNT(*) 
  FROM toile_colors 
  WHERE toile_type_id = 1 AND is_available = true;
  ```
- Vérifier les données importées:
  ```sql
  SELECT toile_type_id, COUNT(*) as count 
  FROM toile_colors 
  GROUP BY toile_type_id;
  ```

### Images ne se chargent pas
- Vérifier que les images existent dans `/public/images/toiles/`
- Vérifier les chemins dans `image_url`:
  ```sql
  SELECT ref, name, image_url 
  FROM toile_colors 
  WHERE image_url IS NOT NULL 
  LIMIT 5;
  ```
- Les chemins doivent être relatifs: `/images/toiles/DICKSON/...`

## 📝 Prochaines étapes

### Court terme
1. ✅ Intégration dans le configurateur (FAIT)
2. ⏳ Tester sur tous les produits (BELHARRA, KALYO, DYNASTA, HELIOM)
3. ⏳ Résoudre les 89 références dupliquées
4. ⏳ Re-importer les toiles manquantes

### Moyen terme
1. Générer des thumbnails optimisés (200×200px)
2. Ajouter pagination si > 100 couleurs
3. Ajouter favoris/récents
4. Intégration avec système de commande

### Long terme
1. Gestion de stock en temps réel
2. Suggestions basées sur tendances
3. Comparateur de toiles
4. Visualisation 3D avec toile appliquée

## 🎨 Personnalisation

### Modifier les familles de couleurs
Éditer `ToileSelector.tsx`:
```typescript
const COLOR_FAMILIES = [
  'all',
  'Blanc', 'Noir', 'Gris',
  // Ajouter vos familles ici
];
```

### Modifier le nombre de colonnes
Éditer `ToileSelector.tsx`:
```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
  {/* Changer lg:grid-cols-6 pour plus/moins de colonnes */}
</div>
```

### Modifier le style de sélection
Éditer `ToileSelector.tsx`:
```tsx
className={`... ${
  selectedColor === color.id
    ? 'border-blue-600 ring-2 ring-blue-300'  // Personnaliser ici
    : 'border-gray-200 hover:border-blue-400'
}`}
```

## 📚 Références

- **Documentation tables**: `TOILES_IMPLEMENTATION_GUIDE.md`
- **Script import**: `scripts/import-toiles.py`
- **SQL schema**: `supabase-create-toile-tables.sql`
- **API types**: `/src/app/api/toiles/route.ts`
- **API colors**: `/src/app/api/toiles/colors/route.ts`
- **Composant**: `/src/components/ToileSelector.tsx`
- **Configurateur**: `/src/components/StoreBanneConfigurator.tsx`
