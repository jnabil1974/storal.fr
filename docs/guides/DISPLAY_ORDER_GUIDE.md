# Guide - Ordre d'affichage des stores bannes

## Vue d'ensemble

Un système de tri par ordre croissant a été ajouté pour contrôler l'ordre d'affichage des stores bannes dans le configurateur et les listes de produits.

## Structure de la base de données

### Colonne ajoutée à `sb_products`

```sql
display_order INTEGER DEFAULT 0
```

- **Type**: INTEGER
- **Valeur par défaut**: 0
- **Index**: Créé pour optimiser les performances de tri
- **Description**: Détermine l'ordre d'affichage des produits (ordre croissant)

### Migration SQL

Le script de migration est disponible dans : [`scripts/add-display-order-to-sb-products.sql`](scripts/add-display-order-to-sb-products.sql)

**Exécution:**
```sql
-- 1. Ajouter la colonne
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 2. Initialiser l'ordre pour les produits existants (par ordre alphabétique)
WITH ordered_products AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) as row_num
  FROM sb_products
)
UPDATE sb_products
SET display_order = ordered_products.row_num
FROM ordered_products
WHERE sb_products.id = ordered_products.id;

-- 3. Créer un index pour les performances
CREATE INDEX IF NOT EXISTS idx_sb_products_display_order ON sb_products(display_order);
```

## Interface d'administration

### Modification des produits

Dans la page admin [`/admin/store-banne-products`](/admin/store-banne-products), chaque produit peut maintenant être configuré avec un ordre d'affichage :

**Champ ajouté:**
- **Label**: "Ordre d'affichage (tri croissant)"
- **Type**: Input numérique
- **Valeur par défaut**: 0
- **Description**: Plus le nombre est petit, plus le produit apparaît en premier

**Affichage:**
- L'ordre d'affichage est visible dans la carte de chaque produit
- Les produits sont automatiquement triés selon cet ordre dans la liste admin

### Exemple d'utilisation

Pour ordonner vos stores bannes :

1. **HELiOM** (produit premium) → `display_order = 1`
2. **Kissimy** (second modèle) → `display_order = 2`
3. **Belharra** → `display_order = 3`
4. **Kalyo** → `display_order = 4`
5. etc.

## APIs mises à jour

Les APIs suivantes utilisent maintenant `display_order` pour le tri :

### 1. `/api/admin/products`

```typescript
.order('display_order', { ascending: true })
```

**Avant**: Tri par `name` (alphabétique)  
**Après**: Tri par `display_order` (ordre personnalisé)

### 2. `/api/admin/products-list`

```typescript
.order('display_order', { ascending: true })
```

Utilisé pour les listes de sélection (toiles, couleurs Matest, etc.)

## Composants mis à jour

### `/src/app/admin/store-banne-products/page.tsx`

**Modifications:**
1. Interface `StoreBanneProduct` étendue avec `display_order?: number`
2. Tri des produits par `display_order` au lieu de `id`
3. Affichage de l'ordre dans la carte du produit
4. Gestion de `display_order` dans le formulaire d'édition

### `/src/components/AdminStoreBanneForm.tsx`

**Modifications:**
1. Nouveau champ "Ordre d'affichage" dans la section Classification
2. Input numérique avec valeur par défaut à 0
3. Label explicite avec indication "(tri croissant)"

## Gestion de l'ordre

### Stratégies de numérotation

**Option 1: Séquentiel (1, 2, 3, 4...)**
- Simple et clair
- Nécessite de renuméroter lors d'insertions

**Option 2: Espacé (10, 20, 30, 40...)**
- Permet d'insérer facilement entre deux produits
- Plus flexible pour les ajouts futurs
- **RECOMMANDÉ**

**Option 3: Par catégorie (100-199: Premium, 200-299: Standard...)**
- Organise par gamme de produits
- Utile pour grandes listes

### Bonnes pratiques

1. **Espacer les valeurs** : Utiliser des multiples de 10 (10, 20, 30...) pour faciliter les insertions
2. **Renuméroter régulièrement** : Si nécessaire, réorganiser les valeurs pour maintenir la cohérence
3. **Documenter** : Noter la logique d'ordre si elle suit une règle spécifique (par gamme, par prix, etc.)
4. **Tester** : Vérifier l'ordre dans le configurateur après modifications

## Requête pour renuméroter

Si vous voulez réinitialiser l'ordre alphabétique :

```sql
WITH ordered_products AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) * 10 as new_order
  FROM sb_products
)
UPDATE sb_products
SET display_order = ordered_products.new_order
FROM ordered_products
WHERE sb_products.id = ordered_products.id;
```

Si vous voulez réordonner manuellement plusieurs produits :

```sql
UPDATE sb_products SET display_order = 10 WHERE slug = 'store-banne-heliom';
UPDATE sb_products SET display_order = 20 WHERE slug = 'store-banne-kissimy';
UPDATE sb_products SET display_order = 30 WHERE slug = 'store-banne-belharra';
-- etc.
```

## Vérification

Pour vérifier l'ordre actuel :

```sql
SELECT id, name, slug, display_order 
FROM sb_products 
ORDER BY display_order ASC;
```

## Impact sur l'affichage

### Configurateur

Les stores bannes apparaîtront dans l'ordre défini par `display_order` dans :
- Les sélecteurs de produits
- Les listes déroulantes
- Les comparaisons de produits

### Admin

L'interface admin affiche les produits triés par `display_order` pour une gestion cohérente.

## Notes techniques

- La colonne `display_order` est **nullable** mais a une valeur par défaut de `0`
- Les produits avec `display_order = 0` apparaîtront en premier (avant ceux avec valeurs positives)
- Un **index** a été créé pour optimiser les requêtes de tri
- Le tri est **ascendant** (ordre croissant) : 1, 2, 3, 10, 20, 30...

## Troubleshooting

**Problème**: Les produits ne s'affichent pas dans le bon ordre

**Solutions**:
1. Vérifier que `display_order` est bien défini pour tous les produits
2. Confirmer que l'API utilise bien `.order('display_order', { ascending: true })`
3. Vider le cache si nécessaire
4. Vérifier les valeurs dans la base de données

**Vérification SQL**:
```sql
-- Afficher tous les produits avec leur ordre
SELECT name, display_order FROM sb_products ORDER BY display_order;

-- Trouver les produits sans ordre défini
SELECT name FROM sb_products WHERE display_order IS NULL OR display_order = 0;
```

---

**Date de création**: 3 février 2026  
**Dernière mise à jour**: 3 février 2026
