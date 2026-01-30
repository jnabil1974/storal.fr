# Ajout des colonnes Type et Active à la base de données

## Résumé des modifications

Vous avez demandé d'ajouter 2 colonnes à la table `sb_products` et 2 champs correspondants à la page d'administration.

### ✅ Modifications apportées

#### 1. **Migration SQL** ([add-type-active-columns.sql](add-type-active-columns.sql))
   - Colonne `type` : VARCHAR(50) avec validation des valeurs possibles
     - `Store Coffre`
     - `Semi-coffre`
     - `Monobloc` (valeur par défaut)
     - `Traditionnel`
   - Colonne `active` : BOOLEAN (true par défaut)
   - Index créé sur `active` pour optimiser les filtres

#### 2. **Page d'administration** ([src/app/admin/store-banne-products/page.tsx](src/app/admin/store-banne-products/page.tsx))
   - ✅ Interface TypeScript mise à jour avec les 2 nouvelles colonnes
   - ✅ Fonction `startEdit()` : récupère les valeurs de `type` et `active`
   - ✅ Fonction `startCreate()` : initialise les valeurs par défaut
   - ✅ Payload d'envoi : inclut `type` et `active`
   - ✅ Affichage des produits : badges visuels pour Type et Statut

#### 3. **Formulaire d'administration** ([src/components/AdminStoreBanneForm.tsx](src/components/AdminStoreBanneForm.tsx))
   - ✅ Sélect dropdown pour le champ `type` (4 options)
   - ✅ Toggle checkbox pour le champ `active`
   - ✅ Styles intuitifs avec icônes ✅/❌

## 📝 Étapes à suivre

### 1️⃣ Exécuter la migration SQL

Connectez-vous à Supabase SQL Editor et exécutez le contenu du fichier :
```
/Applications/MAMP/htdocs/store_menuiserie/add-type-active-columns.sql
```

**Résultat attendu :**
- 2 colonnes créées
- Index sur `active` créé
- Produits existants mis à jour avec type par défaut
- Tous les produits existants marqués comme actifs

### 2️⃣ Redémarrer l'application Next.js

```bash
npm run dev
```

### 3️⃣ Mettre à jour les API routes

Vous devez modifier les fichiers API pour supporter les nouvelles colonnes :
- `/api/admin/store-banne-products/create`
- `/api/admin/store-banne-products/update`

Ces routes doivent extraire et persister les champs `type` et `active`.

## 🎯 Utilisation dans l'interface

### Sur la page d'administration des produits :

**En mode édition :**
- Sélecteur de type : dropdown avec 4 options
- Toggle d'activation : case à cocher

**En mode consultation :**
- Badge bleu pour le type (ex: "Monobloc")
- Badge coloré pour le statut :
  - 🟢 Vert si actif : "✅ Actif"
  - 🔴 Rouge si inactif : "❌ Inactif"

## 💾 Données persistées

### Stockage :
- `type` : Stocké directement en VARCHAR
- `active` : Stocké en BOOLEAN

### Comportement par défaut :
- Nouveaux produits : `type='Monobloc'`, `active=true`
- Produits existants : Type déterminé automatiquement, tous actifs

## 🔍 Vérification

Après les changements, vérifiez dans Supabase :

```sql
-- Vérifier les colonnes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sb_products' 
AND column_name IN ('type', 'active');

-- Vérifier les données
SELECT id, name, type, active FROM sb_products LIMIT 5;

-- Vérifier les contraintes
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'sb_products';
```

## ⚠️ Notes importantes

1. Les colonnes `type` et `active` ont des valeurs par défaut, donc tous les produits fonctionneront
2. La contrainte CHECK sur `type` valide les 4 valeurs autorisées
3. L'index sur `active` améliore les performances des filtres (afficher uniquement les produits actifs)
4. Les API routes existantes continueront de fonctionner mais ignoreront les nouvelles colonnes jusqu'à leur mise à jour

## 📂 Fichiers modifiés

- ✅ [add-type-active-columns.sql](add-type-active-columns.sql) - Migration SQL **À EXÉCUTER**
- ✅ [src/app/admin/store-banne-products/page.tsx](src/app/admin/store-banne-products/page.tsx) - Page d'admin mise à jour
- ✅ [src/components/AdminStoreBanneForm.tsx](src/components/AdminStoreBanneForm.tsx) - Formulaire mis à jour

## 🚀 Prochaines étapes

Après l'exécution de la migration SQL et le redémarrage :

1. Testez la sélection du type dans le formulaire de création
2. Testez le toggle d'activation
3. Vérifiez que les valeurs sont bien persistées en base de données
4. Testez l'affichage des badges dans la liste des produits
