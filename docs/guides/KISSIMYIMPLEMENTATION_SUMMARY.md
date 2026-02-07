# 📋 Implémentation KISSIMY - Store Banne Coffre

## ✅ Étape 1: Système de Tarification Complété

### Fichiers créés:

#### 1. **`src/lib/pricingConfig.ts`** (65 lignes)
- Configuration centralisée des coefficients de tarification
- Constante `VAT_RATE = 0.20` (TVA 20%)
- Coefficients par défaut par produit:
  - `store_banne_kissimy: 2.0` (100% marge)
  - `store_banne_kitanguy: 2.0`
  - `porte_blindee: 2.2`
  - `store_antichaleur: 2.5`
- 4 fonctions utilitaires:
  - `calculatePriceTTC()`: Applique coefficient + TVA à un prix HT
  - `calculatePriceHT()`: Applique coefficient avant TVA
  - `extractVAT()`: Extrait le montant de TVA
  - `getDefaultCoefficient()`: Récupère coefficient par produit

#### 2. **`src/lib/pricingRules.ts`** (NOUVEAU - 120 lignes)
- Gestion des règles de prix dynamiques depuis Supabase
- Fonctions principales:
  - `getPricingCoefficient()`: Récupère le coefficient (DB > défaut)
  - `calculateFinalPrice()`: Calcule prix TTC avec coefficient dynamique
  - `getActivePricingRules()`: Liste règles actives
  - `setPricingRule()`: Crée/met à jour règles (admin only)
- Support des promotions temporelles (valid_from/valid_until)

#### 3. **`prisma/migrations/pricing_rules.sql`** (52 lignes)
- Table Supabase pour la gestion dynamique des coefficients
- Colonnes:
  - `id` (UUID primary key)
  - `product_id` (FK -> products)
  - `coefficient` (DECIMAL 5,2 - positif)
  - `reason` (e.g., "PROMO_JANUARY")
  - `valid_from` / `valid_until` (plages de validité)
  - `is_active` (flag activation)
  - Audit fields: `created_at`, `updated_at`, `created_by`
- Constraints:
  - `coefficient_positive`: coefficient > 0
  - `valid_date_range`: valid_until > valid_from
- RLS policies:
  - Lecture publique des règles actives
  - Écriture admin-only
- Indexes sur `product_id` et `active status`

---

## ✅ Étape 2: Types TypeScript pour KISSIMY

### Fichier modifié: **`src/types/products.ts`**

#### Ajouts:

##### 1. `StoreBanneKissimyConfig` Interface
```typescript
{
  avancee: number;        // 1500, 2000, 2500, 3000 mm
  largeur: number;        // 1800-4830 mm (par plage)
  
  manivelleDeSecours?: 'non' | 'somfy_iohomme_rts' | 'somfy_iohomme_io';
  telecommande?: 'standard' | 'remote_5_canaux' | 'remote_7_canaux';
  
  poseSousPlafond?: boolean;
  tubeAluminium?: 'non' | '28mm' | '40mm' | '50mm';
  auvent?: boolean;
  capteurVent?: boolean;
  tahoma?: boolean;
  cablage10m?: boolean;
  
  couleurSpeciale?: boolean;
  biColor?: boolean;
  
  couleurCadre: 'blanc' | 'gris' | 'noir' | 'bronze' | 'inox';
}
```

##### 2. `KissimyOption` Interface
- Décrit chaque option disponible
- Champs: `id`, `name`, `description`, `priceHT`, `category`, `mandatory`, `values`

##### 3. `StoreBanneKissimyProduct` Interface
- Étend `BaseProduct` avec propriétés spécifiques à KISSIMY
- Contient: `model: 'kissimy'`, `pricingGrid`, `framColors`, `availableOptions`

---

## ✅ Étape 3: Pricing Grid et Calculs KISSIMY

### Fichier créé: **`src/lib/kissimyPricing.ts`** (240 lignes)

#### Grille de Tarification (12 variantes):
```
Avancée  | Largeur Min | Largeur Max | Prix HT
---------|-------------|-------------|--------
1500     | 1800        | 2470        | 1010€
1500     | 2470        | 3650        | 1039€
1500     | 3650        | 4830        | 1068€
2000     | 1800        | 2470        | 1095€
2000     | 2470        | 3650        | 1125€
2000     | 3650        | 4830        | 1154€
2500     | 1800        | 2470        | 1181€
2500     | 2470        | 3650        | 1210€
2500     | 3650        | 4830        | 1239€
3000     | 1800        | 2470        | 1268€
3000     | 2470        | 3650        | 1296€
3000     | 3650        | 4830        | 1295€
```

#### Prix Options (HT):
- **Motorisation**: Manivelle RTS (+108€), Manivelle IO (+132€)
- **Télécommande**: 5 canaux (+14€), 7 canaux (+25€)
- **Accessoires**: 
  - Pose plafond (+39€)
  - Tube alu: 28mm (+26€), 40mm (+39€), 50mm (+52€)
  - Auvent (+125€)
  - Capteur vent (+90€)
  - TAHOMA (+117€)
  - Câblage 10m (+48€)
- **Couleur**: Spéciale (+92€), Bi-Color (+46€)

#### Fonctions principales:
- `getKissimyBasePriceHT()`: Lookup grille (avancée × largeur → prix)
- `calculateKissimyPriceTTC()`: Calcul complet avec options + coefficient
- `calculateKissimyOptionsPrice()`: Somme des options
- `getKissimyAvailableOptions()`: Liste formatée des options
- `validateKissimyConfig()`: Validation des données d'entrée

---

## ✅ Étape 4: Composant Configurateur KISSIMY

### Fichier créé: **`src/components/StoreBanneKissimyConfigurator.tsx`** (340 lignes)

#### Fonctionnalités:
- ✅ Sélection avancée: 4 boutons (1500, 2000, 2500, 3000 mm)
- ✅ Slider largeur: 1800-4830 mm en temps réel
- ✅ Sélection couleur cadre: 5 options (grille 2x2 + 1)
- ✅ Options motorisation: 3 choix (aucun, RTS, IO)
- ✅ Options télécommande: 3 choix (aucun, 5ch, 7ch)
- ✅ Checkboxes accessoires: pose plafond, auvent, capteurs, TAHOMA, câblage
- ✅ Select tube alu: 4 options (aucun, 28/40/50 mm)
- ✅ Checkboxes couleur: couleur spéciale, bi-color
- ✅ Input quantité: 1-100 articles
- ✅ Affichage prix TTC en temps réel
- ✅ Détails du calcul (prix HT, coefficient, TVA)
- ✅ Validation des données avant ajout au panier
- ✅ Messages d'erreur détaillés

#### Styles:
- Tailwind CSS responsive (mobile-first)
- Section groupées par catégorie (dimensions, cadre, motorisation, etc.)
- Bg gris clair (bg-gray-50) pour les sections
- Boutons actifs en bleu (bg-blue-600)
- Détails prix avec `<details>` collapsible

---

## ✅ Étape 5: Insertion du Produit en Base

### Script créé: **`scripts/seed-kissimyProduct.mjs`** (180 lignes)

#### Fonctionnalités:
- ✅ Charge variables d'env depuis `.env.local`
- ✅ Vérification structure table `products`
- ✅ Suppression automatique ancien produit si existe
- ✅ Insertion produit KISSIMY avec:
  - Nom: "Store Banne Coffre KISSIMY"
  - Type: "store_banne"
  - Prix HT min: 1010€
  - Catégorie: "stores"
  - Specifications: grille complète + options
- ✅ Tentative création règle prix (graceful fail si table n'existe pas)
- ✅ Affichage récapitulatif détaillé

#### Exécution:
```bash
node scripts/seed-kissimyProduct.mjs
```

#### Résultat ✅
```
✅ Produit KISSIMY créé (ID: 3bc4619a-15d7-4cbc-8f01-6c72a828cfb9)
📊 Récapitulatif du produit KISSIMY:
  Produit ID: 3bc4619a-15d7-4cbc-8f01-6c72a828cfb9
  Nom: Store Banne Coffre KISSIMY
  Type: store_banne
  Catégorie: stores
📐 Dimensions:
  • Avancée: 1500, 2000, 2500, 3000 mm
  • Largeur: 1800 - 4830 mm
  • Variantes de grille: 12
💰 Tarification:
  • Prix min (HT): 1010€
  • Prix max (HT): 1296€
  • Coefficient appliqué: 2.0 (100% marge)
  • TVA: 20%
🎨 Options disponibles: 14
  - Motorisation: 2 options
  - Télécommande: 2 options
  - Accessoires: 8 options
  - Couleur/Toile: 2 options
✨ Seeding terminé avec succès!
```

---

## ✅ Étape 6: Page Produit KISSIMY

### Fichier créé: **`src/app/products/kissimy/page.tsx`** (370 lignes)

#### Contenu:
- ✅ Header avec bouton retour
- ✅ Page responsive 2 colonnes (gauche: description, droite: configurateur)
- ✅ Description produit
- ✅ Badges: Store Banne, Motorisation, Configuration
- ✅ Caractéristiques principales
- ✅ Bloc tarification
- ✅ Section options détaillées (grille 2x3)
- ✅ Gestion erreur si produit non trouvé
- ✅ Chargement asynchrone depuis Supabase
- ✅ Intégration composant StoreBanneKissimyConfigurator

#### URL: `/products/kissimy`

---

## 📊 Résumé Technique

### Formule de Tarification:
```
Prix TTC = (Prix HT Base + Prix HT Options) × Coefficient × (1 + TVA)
```

### Exemple:
```
Avancée: 2000mm
Largeur: 2470-3650mm → Prix HT: 1125€
+ Manivelle IO: 132€
+ Télécommande 7ch: 25€
+ Auvent: 125€
+ Capteur vent: 90€
= Total HT: 1497€

Coefficient: 2.0 (marge 100%)
TTC = 1497€ × 2.0 × 1.20 = 3,593€ TTC
```

### Base de Données:
```
Supabase PostgreSQL
├── products
│   ├── id (UUID)
│   ├── name: "Store Banne Coffre KISSIMY"
│   ├── type: "store_banne"
│   ├── base_price: 1010
│   ├── category: "stores"
│   ├── specifications: {
│   │   model: 'kissimy',
│   │   avanceeOptions: [1500, 2000, 2500, 3000],
│   │   largeurMin: 1800,
│   │   largeurMax: 4830,
│   │   pricingGrid: [...],
│   │   framColors: ['blanc', 'gris', ...],
│   │   availableOptions: [...]
│   │ }
│   └── created_at, updated_at
│
└── pricing_rules (à créer via SQL Editor Supabase)
    ├── id (UUID)
    ├── product_id (FK)
    ├── coefficient: 2.0
    ├── reason: "DEFAULT_COEFFICIENT_KISSIMY"
    ├── valid_from, valid_until
    ├── is_active: true
    └── created_by
```

---

## 🚀 Prochaines Étapes

### Phase 2: Test et Optimisation
- [ ] Tester configurateur sur navigateur
- [ ] Vérifier calculs de prix dans console
- [ ] Ajouter produit KISSIMY au cart
- [ ] Vérifier produit apparaît en homepage

### Phase 3: Intégration Complète
- [ ] Créer page `/stores` (landing page)
- [ ] Ajouter catégories de stores (Coffre, Semi-coffre, Ouvert)
- [ ] Lister KISSIMY et autres modèles par catégorie
- [ ] Ajouter autres modèles (KITANGUY, etc.)

### Phase 4: Administration
- [ ] Tableau admin pour gérer coefficients dynamiques
- [ ] Interface pour promotions temporelles
- [ ] Export devis/commandes

---

## 📌 Notes Importantes

### Activation de pricing_rules table
Vous devez créer manuellement dans **Supabase SQL Editor**:

```sql
CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  coefficient DECIMAL(5, 2) NOT NULL,
  reason TEXT,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by TEXT,
  
  CONSTRAINT coefficient_positive CHECK (coefficient > 0),
  CONSTRAINT valid_date_range CHECK (valid_until IS NULL OR valid_until > valid_from)
);

CREATE INDEX idx_pricing_rules_product_id ON public.pricing_rules(product_id);
CREATE INDEX idx_pricing_rules_active ON public.pricing_rules(is_active, valid_from, valid_until);

ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read pricing rules" ON public.pricing_rules
  FOR SELECT
  USING (is_active = true AND valid_from <= NOW() AND (valid_until IS NULL OR valid_until > NOW()));
```

### Configuration Coefficient par défaut
Le coefficient 2.0 est défini dans:
1. `src/lib/pricingConfig.ts` → `PRICING_CONFIG.store_banne_kissimy = 2.0`
2. `src/components/StoreBanneKissimyConfigurator.tsx` → `coefficient={2.0}` (prop)
3. `prisma/migrations/pricing_rules.sql` → `coefficient: 2.0` (DB override)

---

## ✨ Fichiers Créés (RESUME)

| Fichier | Type | Lignes | Description |
|---------|------|--------|-------------|
| `src/lib/pricingConfig.ts` | TS | 65 | Config tarification centralisée |
| `src/lib/pricingRules.ts` | TS | 120 | Gestion règles dynamiques |
| `src/lib/kissimyPricing.ts` | TS | 240 | Grille + calculs KISSIMY |
| `src/types/products.ts` | TS | +60 | Types TypeScript KISSIMY |
| `src/components/StoreBanneKissimyConfigurator.tsx` | TSX | 340 | Configurateur UI |
| `src/app/products/kissimy/page.tsx` | TSX | 370 | Page produit KISSIMY |
| `prisma/migrations/pricing_rules.sql` | SQL | 52 | Migration table pricing |
| `scripts/seed-kissimyProduct.mjs` | MJS | 180 | Script insertion produit |
| `scripts/create-pricing-rules-table.mjs` | MJS | 60 | SQL pour créer table |
| `scripts/seed-kissimyProduct.ts` | TS | 70 | Version TypeScript (optionnel) |

**Total: 1,557 lignes de code**

---

## ✅ État Actuel

- ✅ Système de tarification complète (coefficients + TVA)
- ✅ Grille de prix KISSIMY (12 variantes)
- ✅ Options tarifées (14 options disponibles)
- ✅ Composant configurateur interactif
- ✅ Produit KISSIMY inséré en Supabase
- ✅ Page produit `/products/kissimy`
- ✅ Types TypeScript
- ✅ Validation des données
- ✅ Gestion des erreurs

## ⏳ Étapes Futures

- Créer page `/stores` avec catégories
- Implémenter autres modèles (KITANGUY, etc.)
- Interface admin pour promotions
- Optimisation perf (caching coefficients)
- Tests E2E configurateur
