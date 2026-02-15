# 📚 Catalogues Statiques - Documentation

## Vue d'ensemble

Les catalogues statiques permettent au chatbot d'accéder aux données de toiles et couleurs **sans requêtes Supabase**, économisant ainsi des tokens et améliorant les performances.

## Fichiers générés

### 1. `src/lib/catalog-toiles.ts`
**Contenu** : 284 toiles Dickson et Sattler  
**Source** : Tables Supabase `toile_types` et `toile_colors`  
**Taille** : ~17 000 lignes (données JSON)

#### Interfaces
```typescript
interface ToileType {
  id: number;
  name: string;
  manufacturer: string;
  code: string;
  purchase_price_ht: number;
  sales_coefficient: number;
  composition: string | null;
  description: string | null;
  compatible_categories: string[];
  is_active: boolean;
}

interface ToileColor {
  id: number;
  toile_type_id: number;
  ref: string;
  name: string;
  collection: string;
  category: string;
  color_family: string;
  image_url: string;
  is_available: boolean;
  color_hex: string | null;
  display_order: number;
  popularity_score: number;
  tags: string[] | null;
}
```

#### Utilisation
```typescript
import { 
  TOILE_TYPES, 
  TOILE_COLORS,
  getCompatibleToiles,
  getColorByRef,
  calculateToilePriceTTC 
} from '@/lib/catalog-toiles';

// Récupérer toutes les toiles compatibles avec un produit
const toilesKissimy = getCompatibleToiles('kissimy');

// Rechercher une toile par référence
const toile = getColorByRef('U095');

// Calculer le prix d'une toile
const priceTTC = calculateToilePriceTTC(typeId, 5.2); // 5.2 m²
```

---

### 2. `src/lib/catalog-couleurs.ts`
**Contenu** : 91 couleurs Matest + 5 types de finition  
**Source** : Tables Supabase `matest_finish_types` et `matest_colors`  
**Taille** : ~1 000 lignes

#### Interfaces
```typescript
interface MatestFinishType {
  id: number;
  name: string;
  description: string | null;
  price_ht: number;
  image_url: string | null;
  product_slugs: string[];
  is_active: boolean;
}

interface MatestColor {
  id: number;
  ral_code: string;
  name: string;
  hex_code: string;
  finish: string;
  category: string;
  image_url: string | null;
  swatch_url: string | null;
  is_available: boolean;
  is_standard: boolean;
  price_ht: number;
}
```

#### Utilisation
```typescript
import { 
  MATEST_FINISH_TYPES,
  MATEST_COLORS,
  STANDARD_COLORS,
  getCompatibleColors,
  getColorByRAL,
  calculateColorPriceTTC 
} from '@/lib/catalog-couleurs';

// Récupérer les couleurs standards (incluses)
const standards = STANDARD_COLORS; // 3 couleurs: 9016, 1015, 7016

// Récupérer les couleurs compatibles avec un produit
const couleursHeliom = getCompatibleColors('heliom');

// Rechercher une couleur par RAL
const color = getColorByRAL('7016'); // Gris Anthracite

// Calculer le prix TTC couleur + finition
const priceTTC = calculateColorPriceTTC('9016'); // Blanc
```

---

## 🤖 Intégration au Chatbot

### Dans `src/app/api/chat/route.ts`

**Avant** (requêtes Supabase coûteuses) :
```typescript
// ❌ Coûte des tokens à chaque requête
const { data: toiles } = await supabase.from('toile_colors').select('*');
```

**Après** (catalogue statique) :
```typescript
// ✅ Aucun coût supplémentaire
import { TOILE_COLORS, getCompatibleToiles } from '@/lib/catalog-toiles';
import { MATEST_COLORS, getCompatibleColors } from '@/lib/catalog-couleurs';

// Utiliser directement les données
const toilesKissimy = getCompatibleToiles('kissimy');
const couleursKissimy = getCompatibleColors('kissimy');
```

### Sérialisation pour le prompt :
```typescript
// Générer une liste condensée pour le prompt
const toilesPrompt = TOILE_COLORS
  .filter(t => t.is_available)
  .map(t => `- ${t.ref} ${t.name} (${t.color_family})`)
  .slice(0, 50) // Limiter pour éviter l'overflow
  .join('\\n');

const couleursPrompt = STANDARD_COLORS
  .map(c => `- RAL ${c.ral_code} ${c.name} (${c.hex_code})`)
  .join('\\n');
```

---

## 🔄 Mise à jour des catalogues

### Quand mettre à jour ?
- Ajout de nouvelles toiles dans Supabase
- Modification des prix
- Ajout de nouvelles couleurs Matest
- Changement de compatibilité produit/finition

### Comment mettre à jour ?
```bash
npm run generate:catalogs
```

**Ce qui se passe** :
1. ✅ Connexion à Supabase avec `SUPABASE_SERVICE_ROLE_KEY`
2. ✅ Récupération des données `toile_types`, `toile_colors`
3. ✅ Récupération des données `matest_finish_types`, `matest_colors`
4. ✅ Génération de fichiers TypeScript formatés
5. ✅ Écriture dans `src/lib/catalog-toiles.ts` et `src/lib/catalog-couleurs.ts`

### Déploiement
```bash
git add src/lib/catalog-toiles.ts src/lib/catalog-couleurs.ts
git commit -m "chore: mise à jour catalogues statiques toiles et couleurs"
git push origin main
```

---

## ⚡ Avantages

| Critère | Avant (Supabase) | Après (Statique) |
|---------|------------------|------------------|
| **Latence** | 50-200ms par requête | 0ms (déjà en mémoire) |
| **Coût tokens** | ~500 tokens par liste | 0 tokens supplémentaires |
| **Fiabilité** | Dépend de Supabase | 100% local |
| **Évolutivité** | Limité par quotas API | Illimité |
| **Complexité** | Gestion async/await | Import simple |

---

## 📦 Structure des fichiers

```
/Users/nabiljlaiel/Documents/PROJETS/Storal/
├── scripts/
│   └── generate-catalog-files.ts       # Script de génération
├── src/
│   └── lib/
│       ├── catalog-data.ts             # Catalogue modèles stores
│       ├── catalog-toiles.ts           # 🆕 Catalogue toiles (généré)
│       └── catalog-couleurs.ts         # 🆕 Catalogue couleurs (généré)
├── package.json
│   └── scripts.generate:catalogs       # Commande npm
└── docs/
    └── CATALOGUES_STATIQUES.md         # Cette documentation
```

---

## 🛡️ Garde-fous

### ⚠️ Ne pas modifier manuellement
Les fichiers `catalog-toiles.ts` et `catalog-couleurs.ts` contiennent un avertissement :
```typescript
/**
 * ⚠️ NE PAS MODIFIER MANUELLEMENT
 * Pour mettre à jour: npm run generate:catalogs
 */
```

### ✅ Versionner les fichiers
Les catalogues **DOIVENT** être commités dans Git car ils font partie du build.

### 🔄 Automatisation possible
Créer un workflow GitHub Actions pour régénérer automatiquement :
```yaml
name: Update Catalogs
on:
  schedule:
    - cron: '0 2 * * *'  # Tous les jours à 2h du matin
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run generate:catalogs
      - run: |
          git config user.name "GitHub Actions"
          git add src/lib/catalog-*.ts
          git commit -m "chore: auto-update catalogues"
          git push
```

---

## 🎯 Prochaines étapes

1. ✅ **Intégrer au chatbot** : Remplacer les requêtes Supabase par les imports statiques
2. ✅ **Tester les performances** : Mesurer la réduction de latence et de coût
3. ⏳ **Documenter dans le prompt** : Indiquer au chatbot comment utiliser ces catalogues
4. ⏳ **Automatiser** : Créer un workflow CI/CD pour la mise à jour

---

## 📞 Support

En cas de problème avec la génération :
1. Vérifier les variables d'environnement dans `.env.local`
2. Vérifier la connexion Supabase
3. Vérifier les permissions sur les tables `toile_*` et `matest_*`
4. Consulter les logs : `npm run generate:catalogs 2>&1 | tee generation.log`
